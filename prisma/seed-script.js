const { spawn } = require('child_process');

// Run ts-node with proper compiler options
const seedProcess = spawn('ts-node', [
  '--compiler-options', 
  '{"module":"CommonJS"}', 
  'prisma/seed-data.ts'
], { 
  stdio: 'inherit',
  shell: true
});

seedProcess.on('close', (code) => {
  process.exit(code);
}); 