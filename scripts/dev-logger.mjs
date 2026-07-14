import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.resolve(__dirname, '../data/logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'dev.log');
const out = fs.openSync(logFile, 'w');
const err = fs.openSync(logFile, 'a');

console.log(`Starting nuxt dev... Logs are being written to ${logFile}`);

const child = spawn('npx', ['nuxt', 'dev'], {
  stdio: ['ignore', out, err],
  shell: true
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});
