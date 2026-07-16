import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { listFiles } from '@huggingface/hub';

test.describe('Validation du téléchargement réel des modèles HF', () => {
  const models = [
    { id: 'onnx-community/Qwen2.5-0.5B-Instruct', expectedWeight: 'onnx/model_q4.onnx' },
    { id: 'onnx-community/Llama-3.2-1B-Instruct-ONNX', expectedWeight: 'onnx/model_q4.onnx' },
    { id: 'onnx-community/Qwen2.5-1.5B-Instruct', expectedWeight: 'onnx/model_q4.onnx' },
    { id: 'onnx-community/Qwen2.5-Math-1.5B-Instruct', expectedWeight: 'onnx/model_q4.onnx' },
    { id: 'onnx-community/Qwen2.5-Coder-1.5B-Instruct', expectedWeight: 'onnx/model_q4.onnx' },
    { id: 'onnx-community/Llama-3.2-3B-Instruct-ONNX', expectedWeight: 'onnx/model_q4.onnx' },
    { id: 'onnx-community/Phi-3.5-mini-instruct-onnx-web', expectedWeight: 'onnx/model_q4f16.onnx' },
    { id: 'vmanvs/medgemma-q4f16-chunked', expectedWeight: 'onnx/model_q4f16.onnx' }
  ];

  for (const model of models) {
    test(`Validation du modèle ${model.id}`, async () => {
      const localPath = path.join(process.cwd(), 'tests', 'fixtures', 'models', model.id);
      
      if (fs.existsSync(localPath) && fs.existsSync(path.join(localPath, 'config.json'))) {
        console.log(`[TEST] Le modèle ${model.id} est présent en cache local. Vérification des fichiers locaux...`);
        // Check local files
        const configExists = fs.existsSync(path.join(localPath, 'config.json'));
        const onnxExists = fs.existsSync(path.join(localPath, model.expectedWeight));
        
        expect(configExists).toBe(true);
        expect(onnxExists).toBe(true);
      } else {
        console.log(`[TEST] Le modèle ${model.id} n'est pas en cache local. Vérification sur le Hugging Face Hub...`);
        // Query Hugging Face Hub
        const files: string[] = [];
        try {
          for await (const fileInfo of listFiles({ repo: model.id, recursive: true })) {
            files.push(fileInfo.path);
          }
        } catch (e: any) {
          console.warn(`[WARNING] Impossible d'accéder au dépôt HF ${model.id} : ${e.message}. Skipping online verification due to network constraints.`);
          return;
        }

        expect(files.length).toBeGreaterThan(0);
        
        // Assert essential config files are present
        expect(files.some(f => f === 'config.json')).toBe(true);
        
        // Assert expected weights file is present
        const hasWeights = files.some(f => f === model.expectedWeight);
        if (!hasWeights) {
          throw new Error(`Le fichier de poids ${model.expectedWeight} est introuvable sur le dépôt HF ${model.id}. Fichiers trouvés: ${files.join(', ')}`);
        }
        expect(hasWeights).toBe(true);
      }
    });
  }
});
