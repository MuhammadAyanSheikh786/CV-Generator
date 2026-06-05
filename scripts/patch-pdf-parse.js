const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'node_modules', 'pdf-parse', 'index.js');

if (!fs.existsSync(filePath)) {
  console.log('pdf-parse not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(filePath, 'utf8');
const original = content;

content = content.replace(/\n\/\/for testing purpose[\s\S]*$/, '');

if (content === original) {
  console.log('pdf-parse already patched');
  process.exit(0);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('patched pdf-parse (removed test code from index.js)');
