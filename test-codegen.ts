import { generateProject } from './src/lib/codegen/index';
import { CanvasComponent, StackConfig } from './src/lib/types';
import fs from 'fs';
import path from 'path';

const components: CanvasComponent[] = [
  {
    id: '1',
    projectId: 'test',
    type: 'Button',
    label: 'My Button',
    position: 0,
    x: 100,
    y: 150,
    width: 200,
    height: 60,
    props: { 
      text: 'Click Me', 
      color: '#ffffff',
      backgroundColor: '#6366f1',
      opacity: '80',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      backdropBlur: '10'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const stack: StackConfig = {
  frontend: 'react-vite',
  backend: 'none',
  database: 'none'
};

const files = generateProject('Test Project', components, stack);

const outDir = path.join(process.cwd(), 'tmp-gen-test');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

files.forEach(file => {
  const filePath = path.join(outDir, file.path);
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(filePath, file.content);
});

console.log(`Generated ${files.length} files in ${outDir}`);
