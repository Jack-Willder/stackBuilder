import { CanvasComponent, StackConfig } from '../types'

type GeneratedFile = {
  path: string
  content: string
}

function propsToStyle(comp: CanvasComponent): string {
  const { props, x, y, width, height } = comp
  const p = props as Record<string, string | undefined>
  const styles: string[] = []
  
  // Style properties
  if (p.color) styles.push(`color: '${p.color}'`)
  if (p.backgroundColor) styles.push(`backgroundColor: '${p.backgroundColor}'`)
  if (p.fontSize) styles.push(`fontSize: '${p.fontSize}'`)
  if (p.padding) styles.push(`padding: '${p.padding}'`)
  if (p.margin) styles.push(`margin: '${p.margin}'`)
  if (p.borderRadius) styles.push(`borderRadius: '${p.borderRadius}'`)
  
  // Geometry properties
  if (x !== undefined) styles.push(`left: ${x}`)
  if (y !== undefined) styles.push(`top: ${y}`)
  if (width !== undefined) styles.push(`width: ${width}`)
  if (height !== undefined) styles.push(`height: ${height}`)
  styles.push(`position: 'absolute'`)

  return `{ ${styles.join(', ')} }`
}

function renderComponent(comp: CanvasComponent): string {
  const { type, props, logic, label } = comp
  const style = propsToStyle(comp)

  switch (type) {
    case 'Button':
      return `  <button
    style={${style}}
    className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
    onClick={() => { ${logic || '// Add your logic here'} }}
  >
    ${props.text || label}
  </button>`

    case 'Input':
      return `  <input
    type="text"
    placeholder="${props.placeholder || 'Enter text...'}"
    style={${style}}
    className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => { ${logic || '// Handle input change'} }}
  />`

    case 'Card':
      return `  <div
    style={${style}}
    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
  >
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-1">${props.text || label}</h3>
      <p className="text-gray-500 text-sm">Card content goes here</p>
    </div>
  </div>`

    case 'Navbar':
      return `  <nav
    style={${style}}
    className="flex items-center justify-between px-6 bg-gray-900 text-white shadow-lg overflow-hidden"
  >
    <div className="text-xl font-bold">${props.text || 'App Name'}</div>
    <div className="flex gap-4">
      <span className="hover:text-blue-400 cursor-pointer text-sm">Home</span>
      <span className="hover:text-blue-400 cursor-pointer text-sm">About</span>
    </div>
  </nav>`

    case 'Hero':
      return `  <section
    style={${style}}
    className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white text-center overflow-hidden"
  >
    <h1 className="text-3xl font-bold mb-3">${props.text || 'Hero Title'}</h1>
    <p className="text-sm opacity-90 mb-4">A stunning hero section</p>
    <button className="px-6 py-2 bg-white text-blue-600 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
      Learn More
    </button>
  </section>`

    case 'Text':
      return `  <p
    style={${style}}
    className="text-gray-700 overflow-hidden leading-snug"
  >
    ${props.text || label}
  </p>`

    case 'Image':
      return `  <img
    src="${props.src || 'https://picsum.photos/seed/sb/800/400'}"
    alt="${props.alt || label}"
    style={${style}}
    className="object-cover"
  />`

    case 'Form':
      return `  <form
    style={${style}}
    className="flex flex-col gap-3 p-5 bg-white rounded-xl shadow-md border border-gray-100"
    onSubmit={(e) => { e.preventDefault(); ${logic || '// Handle submit'} }}
  >
    <input type="text" placeholder="Name" className="px-3 py-2 border rounded-lg text-sm" />
    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Submit</button>
  </form>`

    case 'Footer':
      return `  <footer
    style={${style}}
    className="bg-gray-900 text-gray-400 text-center flex items-center justify-center text-xs overflow-hidden"
  >
    <p>© ${new Date().getFullYear()} ${props.text || 'My App'}. All rights reserved.</p>
  </footer>`

    case 'Badge':
      return `  <span
    style={${style}}
    className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-xs font-bold"
  >
    ${props.text || label}
  </span>`

    default:
      return `  <div style={${style}}>${label}</div>`
  }
}

export function generateReactVite(
  projectName: string,
  components: CanvasComponent[],
  stack: StackConfig
): GeneratedFile[] {
  const componentJSX = components.map(renderComponent).join('\n\n')

  const appTsx = `import React from 'react'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden" style={{ width: '800px', margin: '0 auto' }}>
${componentJSX || '      <div className="flex items-center justify-center h-screen text-gray-400">No components yet</div>'}
    </div>
  )
}

export default App
`

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body className="bg-gray-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`

  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`

  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #f3f4f6;
  min-height: 100vh;
}
`

  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`

  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`

  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`

  const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`

  const packageJson = JSON.stringify(
    {
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
      },
      devDependencies: {
        '@types/react': '^18.2.66',
        '@types/react-dom': '^18.2.22',
        '@vitejs/plugin-react': '^4.2.1',
        typescript: '^5.2.2',
        vite: '^5.2.0',
        tailwindcss: '^3.4.1',
        autoprefixer: '^10.4.19',
        postcss: '^8.4.38',
      },
    },
    null,
    2
  )

  const readme = `# ${projectName}

Generated by **StackBuilder**.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`
`

  const files: GeneratedFile[] = [
    { path: 'index.html', content: indexHtml },
    { path: 'src/App.tsx', content: appTsx },
    { path: 'src/main.tsx', content: mainTsx },
    { path: 'src/index.css', content: indexCss },
    { path: 'vite.config.ts', content: viteConfig },
    { path: 'tailwind.config.mjs', content: tailwindConfig },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'package.json', content: packageJson },
    { path: 'tsconfig.json', content: tsconfig },
    { path: 'README.md', content: readme },
  ]

  if (stack.backend === 'express') {
    files.push(...generateExpressBackend(projectName, stack))
  }

  return files
}

export function generateNextJs(
  projectName: string,
  components: CanvasComponent[],
  stack: StackConfig
): GeneratedFile[] {
  const componentJSX = components.map(renderComponent).join('\n\n')

  const pageTsx = `export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 relative overflow-hidden mx-auto" style={{ width: '800px' }}>
${componentJSX || '      <div className="flex items-center justify-center h-screen text-gray-400">No components yet</div>'}
    </main>
  )
}
`

  const layoutTsx = `import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '${projectName}',
  description: 'Generated by StackBuilder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`

  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f3f4f6;
}
`

  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`

  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`

  const packageJson = JSON.stringify(
    {
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
      dependencies: {
        next: '14.1.0',
        react: '^18',
        'react-dom': '^18',
      },
      devDependencies: {
        '@types/node': '^20',
        '@types/react': '^18',
        '@types/react-dom': '^18',
        autoprefixer: '^10.0.1',
        postcss: '^8',
        tailwindcss: '^3.3.0',
        typescript: '^5',
      },
    },
    null,
    2
  )

  const readme = `# ${projectName}

Next.js export from **StackBuilder**.

\`\`\`bash
npm install
npm run dev
\`\`\``

  return [
    { path: 'app/page.tsx', content: pageTsx },
    { path: 'app/layout.tsx', content: layoutTsx },
    { path: 'app/globals.css', content: globalsCss },
    { path: 'tailwind.config.js', content: tailwindConfig },
    { path: 'postcss.config.js', content: postcssConfig },
    { path: 'package.json', content: packageJson },
    { path: 'README.md', content: readme },
  ]
}

export function generateExpressBackend(
  projectName: string,
  stack: StackConfig
): GeneratedFile[] {
  const serverTs = `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { router } from './routes'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/api', router)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: '${projectName}' })
})

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`)
})
`

  const routesTs = `import { Router } from 'express'
export const router = Router()

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from ${projectName}!' })
})
`

  const packageJson = JSON.stringify(
    {
      name: `${projectName.toLowerCase().replace(/\s+/g, '-')}-server`,
      version: '1.0.0',
      main: 'index.js',
      scripts: {
        dev: 'ts-node-dev --respawn src/server.ts',
        build: 'tsc',
      },
      dependencies: {
        express: '^4.18.2',
        cors: '^2.8.5',
        helmet: '^7.1.0',
      },
      devDependencies: {
        '@types/express': '^4.17.21',
        '@types/node': '^20',
        'ts-node-dev': '^2.0.0',
        typescript: '^5',
      },
    },
    null,
    2
  )

  return [
    { path: 'server/src/server.ts', content: serverTs },
    { path: 'server/src/routes/index.ts', content: routesTs },
    { path: 'server/package.json', content: packageJson },
  ]
}

export function generateProject(
  projectName: string,
  components: CanvasComponent[],
  stack: StackConfig
): GeneratedFile[] {
  if (stack.frontend === 'nextjs') {
    return generateNextJs(projectName, components, stack)
  }
  return generateReactVite(projectName, components, stack)
}
