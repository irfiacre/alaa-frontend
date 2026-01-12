import modal

# Create a Modal app
app = modal.App("law-deepseek-r1")

# Define the image with all necessary dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch",
        "transformers",
        "peft",
        "accelerate",
        "bitsandbytes",  # For quantization if needed
    )
)

# Create a class to handle model inference
@app.cls(
    image=image,
    gpu="T4",  # Using T4 GPU (more cost-effective)
    timeout=600,
    container_idle_timeout=300,
)
class LawDeepSeekModel:
    @modal.enter()
    def load_model(self):
        """Load the model when the container starts"""
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from peft import PeftModel
        import torch
        
        # Load base model
        base_model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
        adapter_model_name = "iradukunda-dev/law-finetuned-DeepSeek-R1-Distill-Qwen-7B"
        
        print("Loading tokenizer...")
        self.tokenizer = AutoTokenizer.from_pretrained(base_model_name)
        
        print("Loading base model...")
        self.model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
        )
        
        print("Loading LoRA adapter...")
        self.model = PeftModel.from_pretrained(self.model, adapter_model_name)
        
        print("Model loaded successfully!")
    
    @modal.method()
    def generate(self, prompt: str, max_new_tokens: int = 512, temperature: float = 0.7):
        """Generate text from a prompt"""
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            do_sample=True,
            top_p=0.9,
        )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response
    
    @modal.web_endpoint(method="POST")
    def web_generate(self, item: dict):
        """Web endpoint for API access"""
        prompt = item.get("prompt", "")
        max_new_tokens = item.get("max_new_tokens", 512)
        temperature = item.get("temperature", 0.7)
        
        if not prompt:
            return {"error": "No prompt provided"}
        
        response = self.generate(prompt, max_new_tokens, temperature)
        return {"response": response}


# Local test function
@app.local_entrypoint()
def main():
    """Test the model locally"""
    model = LawDeepSeekModel()
    
    test_prompt = "What are the key elements of a valid contract?"
    print(f"Prompt: {test_prompt}")
    print(f"Response: {model.generate.remote(test_prompt)}")


# You can also create a simple CLI inference function
@app.function(image=image, gpu="T4")
def inference(prompt: str):
    """Simple inference function"""
    model = LawDeepSeekModel()
    return model.generate(prompt)
