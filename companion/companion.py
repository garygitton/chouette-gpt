#!/usr/bin/env python3
import sys
import json
import struct
import time
import threading

# Helper to read a message from stdin
def read_message():
    try:
        raw_length = sys.stdin.buffer.read(4)
        if len(raw_length) == 0:
            sys.exit(0)
        message_length = struct.unpack('@I', raw_length)[0]
        message = sys.stdin.buffer.read(message_length).decode('utf-8')
        return json.loads(message)
    except Exception as e:
        sys.exit(0)

# Helper to write a message to stdout
def send_message(message):
    try:
        packed_message = json.dumps(message).encode('utf-8')
        sys.stdout.buffer.write(struct.pack('@I', len(packed_message)))
        sys.stdout.buffer.write(packed_message)
        sys.stdout.buffer.flush()
    except Exception as e:
        sys.exit(0)

def handle_download(model_id):
    # Simulated download steps
    send_message({"type": "status", "status": "info", "message": f"Démarrage du téléchargement natif de {model_id}..."})
    total_size = 20 * 1024 * 1024 * 1024  # 20 GB
    downloaded = 0
    chunk = 500 * 1024 * 1024  # 500 MB chunk
    
    while downloaded < total_size:
        time.sleep(0.15)  # Simulate download speed
        downloaded += chunk
        progress = min(100.0, (downloaded / total_size) * 100)
        send_message({
            "type": "download_progress",
            "modelId": model_id,
            "downloaded": f"{downloaded / (1024**3):.1f} Go",
            "total": f"{total_size / (1024**3):.1f} Go",
            "progress": round(progress, 1),
            "speed": "250 Mo/s"
        })
    
    send_message({"type": "download_success", "modelId": model_id})

def handle_chat(prompt, model_id):
    # Simulated reasoning response (like DeepSeek-R1 CoT)
    response_thinking = "<think>\n" \
                        "Question reçue : '" + prompt + "'\n" \
                        "Analyse de la demande... Chargement du contexte depuis le GPU natif...\n" \
                        "Bypass des limites de Chrome effectué avec succès. VRAM totale allouée : 20.4 Go.\n" \
                        "Génération de la réponse logique...\n" \
                        "</think>\n"
    
    response_body = f"Bonjour ! Je suis un modèle géant (20 Go) exécuté de manière native sur votre GPU grâce au compagnon de Chouette GPT.\n\n" \
                    f"Votre prompt était : *\"{prompt}\"*\n\n" \
                    f"Grâce à cette architecture, j'ai pu allouer pleinement de la mémoire GPU (VRAM) au-delà des limites du navigateur, " \
                    f"vous offrant une inférence fluide et 100% locale sans aucun serveur externe."

    # Stream the reasoning first
    for char in response_thinking:
        time.sleep(0.005)
        send_message({"type": "chat_chunk", "chunk": char})
        
    # Stream the final body
    for char in response_body:
        time.sleep(0.005)
        send_message({"type": "chat_chunk", "chunk": char})
        
    send_message({"type": "chat_done"})

def main():
    while True:
        msg = read_message()
        action = msg.get("action")
        
        if action == "ping":
            send_message({"type": "pong"})
            
        elif action == "download":
            model_id = msg.get("modelId")
            threading.Thread(target=handle_download, args=(model_id,), daemon=True).start()
            
        elif action == "chat":
            prompt = msg.get("prompt")
            model_id = msg.get("modelId")
            threading.Thread(target=handle_chat, args=(prompt, model_id), daemon=True).start()
            
        else:
            send_message({"type": "status", "status": "error", "error": f"Action inconnue: {action}"})

if __name__ == '__main__':
    main()
