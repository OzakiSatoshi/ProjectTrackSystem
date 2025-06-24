// Prisma-based relational business management system
import { spawn } from 'child_process';

console.log('Starting Prisma-based anken management system...');

const server = spawn('node', ['server-new.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});