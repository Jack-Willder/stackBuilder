import { CanvasComponent, StackConfig } from '../types'

type GeneratedFile = {
  path: string
  content: string
}

function propsToStyle(props: Record<string, string | undefined>): string {
  const styles: string[] = []
  if (props.color) styles.push(`color: '${props.color}'`)
  if (props.backgroundColor) styles.push(`backgroundColor: '${props.backgroundColor}'`)
  if (props.fontSize) styles.push(`fontSize: '${props.fontSize}'`)
  if (props.padding) styles.push(`padding: '${props.padding}'`)
  if (props.margin) styles.push(`margin: '${props.margin}'`)
  if (props.width) styles.push(`width: '${props.width}'`)
  if (props.height) styles.push(`height: '${props.height}'`)
  if (props.borderRadius) styles.push(`borderRadius: '${props.borderRadius}'`)
  return styles.length ? `{{ ${styles.join(', ')} }}` : '{{}}'
}

function renderComponent(comp: CanvasComponent): string {
  const { type, props, logic, label } = comp
  const style = propsToStyle(props as Record<string, string | undefined>)

  switch (type) {
    case 'Button':
      return `  <button
    style={${style}}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    onClick={() => { ${logic || '// Add your logic here'} }}
  >
    ${props.text || label}
  </button>`

    case 'Input':
      return `  <input
    type="text"
    placeholder="${props.placeholder || 'Enter text...'}"
    style={${style}}
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => { ${logic || '// Handle input change'} }}
  />`

    case 'Card':
      return `  <div
    style={${style}}
    className="p-6 bg-white rounded-xl shadow-md border border-gray-100"
  >
    <h3 className="text-xl font-semibold mb-2">${props.text || label}</h3>
    <p className="text-gray-600">Card content goes here</p>
  </div>`

    case 'Navbar':
      return `  <nav
    style={${style}}
    className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-lg"
  >
    <div className="text-xl font-bold">${props.text || 'My App'}</div>
    <div className="flex gap-6">
      <a href="#" className="hover:text-blue-400 transition">Home</a>
      <a href="#" className="hover:text-blue-400 transition">About</a>
      <a href="#" className="hover:text-blue-400 transition">Contact</a>
    </div>
  </nav>`

    case 'Hero':
      return `  <section
    style={${style}}
    className="flex flex-col items-center justify-center py-24 px-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white text-center"
  >
    <h1 className="text-5xl font-bold mb-6">${props.text || 'Welcome to My App'}</h1>
    <p className="text-xl mb-8 opacity-90">Build something amazing today</p>
    <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition">
      Get Started
    </button>
  </section>`

    case 'Text':
      return `  <p
    style={${style}}
    className="text-gray-700 leading-relaxed"
  >
    ${props.text || label}
  </p>`

    case 'Image':
      return `  <img
    src="${props.src || 'https://via.placeholder.com/400x300'}"
    alt="${props.alt || label}"
    style={${style}}
    className="rounded-lg object-cover"
  />`

    case 'Form':
      return `  <form
    style={${style}}
    className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md"
    onSubmit={(e) => { e.preventDefault(); ${logic || '// Handle submit'} }}
  >
    <input type="text" placeholder="Name" className="px-4 py-2 border rounded-lg" />
    <input type="email" placeholder="Email" className="px-4 py-2 border rounded-lg" />
    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit</button>
  </form>`

    case 'Footer':
      return `  <footer
    style={${style}}
    className="py-8 px-8 bg-gray-900 text-gray-400 text-center"
  >
    <p>© {new Date().getFullYear()} ${props.text || 'My App'}. All rights reserved.</p>
  </footer>`

    case 'Badge':
      return `  <span
    style={${style}}
    className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
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
    <div className="min-h-screen font-sans">
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
  <body>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
`

  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
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
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
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

  const tsConfig = JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    },
    null,
    2
  )

  const readme = `# ${projectName}

Generated by **StackBuilder** — Visual Full-Stack Builder.

## Stack
- **Frontend**: React + Vite + TypeScript
- **Backend**: ${stack.backend === 'express' ? 'Express.js' : stack.backend === 'nextjs-api' ? 'Next.js API Routes' : 'None'}
- **Database**: ${stack.database === 'none' ? 'None' : stack.database.toUpperCase()}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
`

  const files: GeneratedFile[] = [
    { path: 'index.html', content: indexHtml },
    { path: 'src/App.tsx', content: appTsx },
    { path: 'src/main.tsx', content: mainTsx },
    { path: 'src/index.css', content: indexCss },
    { path: 'vite.config.ts', content: viteConfig },
    { path: 'package.json', content: packageJson },
    { path: 'tsconfig.json', content: tsConfig },
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

  const pageTsx = `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Generated by StackBuilder',
}

export default function Page() {
  return (
    <main className="min-h-screen font-sans">
${componentJSX || '      <div className="flex items-center justify-center h-screen text-gray-400">No components yet</div>'}
    </main>
  )
}
`

  const layoutTsx = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Generated by StackBuilder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

* {
  box-sizing: border-box;
}
`

  const nextConfig = `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
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
        lint: 'next lint',
      },
      dependencies: {
        next: '^14.2.3',
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

  const apiRoute = `import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello from ${projectName} API!', status: 'ok' })
}

export async function POST(request: Request) {
  const body = await request.json()
  // TODO: Process the request body
  return NextResponse.json({ data: body, status: 'received' })
}
`

  const readme = `# ${projectName}

Generated by **StackBuilder** — Visual Full-Stack Builder.

## Stack
- **Frontend**: Next.js 14 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: ${stack.database === 'none' ? 'None' : stack.database.toUpperCase()}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
`

  return [
    { path: 'app/page.tsx', content: pageTsx },
    { path: 'app/layout.tsx', content: layoutTsx },
    { path: 'app/globals.css', content: globalsCss },
    { path: 'app/api/hello/route.ts', content: apiRoute },
    { path: 'next.config.ts', content: nextConfig },
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

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', router)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: '${projectName}' })
})

app.listen(PORT, () => {
  console.log(\`🚀 ${projectName} server running on http://localhost:\${PORT}\`)
})

export default app
`

  const routesTs = `import { Router } from 'express'

export const router = Router()

// Example route
router.get('/items', async (_req, res) => {
  try {
    // TODO: Fetch items from database
    res.json({ items: [], message: 'No items yet' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/items', async (req, res) => {
  try {
    const item = req.body
    // TODO: Save to database
    res.status(201).json({ item, message: 'Created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})
`

  const backendPackageJson = JSON.stringify(
    {
      name: `${projectName.toLowerCase().replace(/\s+/g, '-')}-server`,
      version: '1.0.0',
      description: `${projectName} Express backend`,
      main: 'dist/server.js',
      scripts: {
        dev: 'ts-node-dev --respawn --transpile-only src/server.ts',
        build: 'tsc',
        start: 'node dist/server.js',
      },
      dependencies: {
        express: '^4.18.2',
        cors: '^2.8.5',
        helmet: '^7.1.0',
        dotenv: '^16.3.1',
        ...(stack.database === 'postgresql' ? { pg: '^8.11.3' } : {}),
        ...(stack.database === 'mysql' ? { mysql2: '^3.6.5' } : {}),
        ...(stack.database === 'mongodb' ? { mongoose: '^8.1.1' } : {}),
      },
      devDependencies: {
        '@types/express': '^4.17.21',
        '@types/cors': '^2.8.17',
        '@types/node': '^20.11.5',
        'ts-node-dev': '^2.0.0',
        typescript: '^5.3.3',
      },
    },
    null,
    2
  )

  const dbConfig = stack.database !== 'none' ? `import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const query = (text: string, params?: unknown[]) => pool.query(text, params)

export default pool
` : `// No database configured
// Add your database connection here
`

  return [
    { path: 'server/src/server.ts', content: serverTs },
    { path: 'server/src/routes/index.ts', content: routesTs },
    { path: 'server/package.json', content: backendPackageJson },
    { path: 'server/src/db.ts', content: dbConfig },
  ]
}

export function generateProject(
  projectName: string,
  components: CanvasComponent[],
  stack: StackConfig
): GeneratedFile[] {
  if (stack.frontend === 'react-vite') {
    return generateReactVite(projectName, components, stack)
  } else if (stack.frontend === 'nextjs') {
    return generateNextJs(projectName, components, stack)
  } else {
    // Vue (simplified - same as react-vite for prototype)
    return generateReactVite(projectName, components, stack)
  }
}
