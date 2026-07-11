import os
import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    from huggingface_hub import snapshot_download
except ImportError:
    install('huggingface_hub')
    from huggingface_hub import snapshot_download

models = [
    "HuggingFaceTB/SmolLM-135M-Instruct",
    "Xenova/Qwen1.5-0.5B-Chat"
]

print("Starting download of test models to public/models/...")
for model in models:
    print(f"Downloading {model}...")
    snapshot_download(
        repo_id=model,
        local_dir=os.path.join("data", "models", model),
        allow_patterns=["*.json", "*.txt", "*.onnx", "*.wasm", "*.bin", "*.gguf"],
        max_workers=4
    )
print("All models downloaded successfully!")
