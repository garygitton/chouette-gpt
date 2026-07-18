import { downloadFile, listFiles } from '@huggingface/hub';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

const models = [
  'onnx-community/Qwen2.5-0.5B-Instruct',
  'onnx-community/Llama-3.2-1B-Instruct-ONNX',
  'onnx-community/Qwen2.5-1.5B-Instruct',
  'onnx-community/Qwen2.5-Math-1.5B-Instruct',
  'onnx-community/Qwen2.5-Coder-1.5B-Instruct',
  'onnx-community/Llama-3.2-3B-Instruct-ONNX',
  'onnx-community/Phi-3.5-mini-instruct-onnx-web',
  'vmanvs/medgemma-q4f16-chunked',
  'onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX'
];

async function downloadModel(modelId) {
  console.log(`\n========================================`);
  console.log(`Starting download for ${modelId}...`);
  console.log(`========================================`);
  const targetDir = path.join(process.cwd(), 'tests', 'fixtures', 'models', modelId);
  fs.mkdirSync(targetDir, { recursive: true });

  const files = [];
  try {
    for await (const fileInfo of listFiles({ repo: modelId, recursive: true })) {
      files.push(fileInfo.path);
    }
  } catch (e) {
    console.error(`Error listing files for ${modelId}:`, e.message);
    return;
  }

  const allowedExtensions = ['.json', '.txt', '.onnx', '.wasm', '.bin', '.gguf', '.onnx_data'];
  const filesToDownload = files.filter(f => 
    allowedExtensions.some(ext => f.endsWith(ext)) || f.includes('.onnx_data')
  );

  console.log(`Found ${filesToDownload.length} files to download.`);

  for (const file of filesToDownload) {
    const localPath = path.join(targetDir, file);
    if (fs.existsSync(localPath)) {
      console.log(`[SKIP] ${file} already exists`);
      continue;
    }
    
    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    console.log(`[DOWNLOADING] ${file}...`);
    try {
      const response = await downloadFile({ repo: modelId, path: file });
      if (response && response.body) {
        // We use Node's Readable.fromWeb to easily pipe Web Streams to fs.WriteStream
        const { Readable } = await import('stream');
        const readableWebStream = response.body;
        const nodeStream = Readable.fromWeb(readableWebStream);
        const fileStream = fs.createWriteStream(localPath);
        
        await streamPipeline(nodeStream, fileStream);
      }
    } catch (e) {
      console.error(`[ERROR] Failed to download ${file}:`, e.message);
    }
  }
}

async function main() {
  for (const model of models) {
    await downloadModel(model);
  }
  console.log('\nAll models downloaded successfully!');
}

main().catch(console.error);
