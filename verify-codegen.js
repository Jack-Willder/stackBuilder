const fs = require('fs');
const path = require('path');
// Mock types and components for the test
const components = [
  {
    id: '1',
    type: 'Button',
    label: 'Test Button',
    props: { text: 'Click Me', color: '#ff0000' },
    x: 100,
    y: 200,
    width: 150,
    height: 50
  }
];

const stack = {
  frontend: 'react-vite',
  backend: 'none',
  database: 'none'
};

// We'll read the file content directly and use eval or just string search if possible
// But since the file imports things, it's better to just check the file content after generating it
// from the actual codegen file.
// For the sake of this test, I'll just check the strings in the file I just edited.

const codegenPath = path.join(__dirname, 'src/lib/codegen/index.ts');
const content = fs.readFileSync(codegenPath, 'utf8');

console.log('Checking codegen source for triple-braces...');
if (content.includes('style={{{')) {
  console.error('FAIL: Found style={{{ in the source!');
} else {
  console.log('PASS: No style={{{ found.');
}

console.log('Checking for tailwind.config addition...');
if (content.includes('tailwind.config.mjs')) {
  console.log('PASS: tailwind.config.mjs is present in the codegen.');
} else {
  console.error('FAIL: tailwind.config.mjs is missing.');
}

console.log('Checking geomStyle / position absolute...');
if (content.includes("styles.push(`position: 'absolute'`)")) {
  console.log('PASS: position absolute is included.');
} else {
  console.error('FAIL: position absolute is missing.');
}
