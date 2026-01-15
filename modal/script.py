import modal

# Create a Modal app
app = modal.App("law-deepseek-r1")

# Define the image with all necessary dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "fastapi",
        "torch",
        "transformers",
        "peft",
        "accelerate",
        "bitsandbytes",  # For quantization if needed
    )
)

# Create a Volume for caching model weights
cache_vol = modal.Volume.from_name("law-model-cache", create_if_missing=True)

# Create a class to handle model inference
@app.cls(
    image=image,
    gpu="A10G",  # Using string syntax instead of modal.gpu.A10G()
    timeout=600,
    scaledown_window=300,  # Renamed from container_idle_timeout
    min_containers=0,  # Renamed from keep_warm
    max_containers=10,  # Renamed from concurrency_limit
    volumes={"/cache": cache_vol},  # Mount volume for model caching
)
class LawDeepSeekModel:
    @modal.enter()
    def load_model(self):
        """Load the model when the container starts"""
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from peft import PeftModel
        import torch
        import os
        
        # Set cache directory
        os.environ["HF_HOME"] = "/cache"
        os.environ["TRANSFORMERS_CACHE"] = "/cache"
        
        # Load base model
        base_model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
        adapter_model_name = "iradukunda-dev/law-finetuned-DeepSeek-R1-Distill-Qwen-7B"
        
        print("Loading tokenizer...")
        self.tokenizer = AutoTokenizer.from_pretrained(
            base_model_name,
            cache_dir="/cache"
        )
        
        print("Loading base model...")
        self.model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
            cache_dir="/cache"
        )
        
        print("Loading LoRA adapter...")
        self.model = PeftModel.from_pretrained(
            self.model, 
            adapter_model_name,
            cache_dir="/cache"
        )
        
        # Merge adapter for faster inference (optional but recommended)
        print("Merging adapter weights...")
        self.model = self.model.merge_and_unload()
        
        print("Model loaded successfully!")
    
    @modal.method()
    def generate(self, prompt: str, max_new_tokens: int = None, temperature: float = 0.7):
        """Generate text from a prompt"""
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        
        # If max_new_tokens is None, use model's max length
        if max_new_tokens is None:
            max_new_tokens = min(self.model.config.max_position_embeddings - inputs['input_ids'].shape[1], 8192)
        
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            do_sample=True,
            top_p=0.9,
            repetition_penalty=1.1,  # Prevents repetitive text
            pad_token_id=self.tokenizer.eos_token_id,  # Proper padding
            eos_token_id=self.tokenizer.eos_token_id,  # Stop at end-of-sequence
        )
        
        # Only return the generated part (excluding the input prompt)
        generated_tokens = outputs[0][inputs['input_ids'].shape[1]:]
        response = self.tokenizer.decode(generated_tokens, skip_special_tokens=True)
        return response
    
    @modal.method()
    def generate_stream(self, prompt: str, max_new_tokens: int = None, temperature: float = 0.7):
        """Generate text from a prompt with streaming"""
        from transformers import TextIteratorStreamer
        from threading import Thread
        
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        
        # If max_new_tokens is None, use model's max length
        if max_new_tokens is None:
            max_new_tokens = min(self.model.config.max_position_embeddings - inputs['input_ids'].shape[1], 8192)
        
        # Create streamer
        streamer = TextIteratorStreamer(
            self.tokenizer,
            skip_prompt=True,  # Don't include the input prompt in output
            skip_special_tokens=True
        )
        
        # Generation kwargs
        generation_kwargs = dict(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            do_sample=True,
            top_p=0.9,
            repetition_penalty=1.1,
            pad_token_id=self.tokenizer.eos_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
            streamer=streamer,
        )
        
        # Start generation in a separate thread
        thread = Thread(target=self.model.generate, kwargs=generation_kwargs)
        thread.start()
        
        # Yield tokens as they're generated
        for text in streamer:
            yield text
    
    @modal.fastapi_endpoint(method="POST")  # Renamed from web_endpoint
    def web_generate(self, item: dict):
        """Web endpoint for API access"""
        prompt = item.get("prompt", "")
        max_new_tokens = item.get("max_new_tokens", None)  # None = no limit
        temperature = item.get("temperature", 0.7)
        
        if not prompt:
            return {"error": "No prompt provided"}
        
        response = self.generate(prompt, max_new_tokens, temperature)
        return {"response": response}
