from huggingface_hub import snapshot_download

def download_model_files(model_id):
    return snapshot_download(repo_id=model_id)

if __name__ == "__main__":
    download_model_files("iradukunda-dev/law-finetuned-DeepSeek-R1-Distill-Qwen-7B")
