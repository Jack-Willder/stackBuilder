'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { X, Save, Code2, Info, Copy, Check, Loader2 } from 'lucide-react'
import { useCanvasStore } from '@/lib/store'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const DEFAULT_TEMPLATES: Record<string, string> = {
  Button: `// Button click handler
// 'event' is the MouseEvent
function onClick(event) {
  console.log('Button clicked!', event);
  
  // Example: fetch data
  // fetch('/api/data').then(res => res.json()).then(console.log);
  
  // Example: navigate
  // window.location.href = '/dashboard';
}`,
  Input: `// Input change handler
// 'event' is the InputEvent
function onChange(event) {
  const value = event.target.value;
  console.log('Input value:', value);
  
  // Example: validate
  // if (value.length < 3) {
  //   event.target.style.borderColor = 'red';
  // } else {
  //   event.target.style.borderColor = 'green';
  // }
}`,
  Form: `// Form submit handler
// 'event' is the SubmitEvent
async function onSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  
  console.log('Form submitted:', data);
  
  // Example: POST to API
  // const res = await fetch('/api/submit', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // const result = await res.json();
}`,
  default: `// Component logic
// Add your custom JavaScript/TypeScript here

function init() {
  console.log('Component initialized');
  
  // Access component: document.getElementById('component-id')
  // Fetch data: fetch('/api/endpoint').then(res => res.json())
  // Update state: setState({ key: 'value' })
}

init();`,
}

type Language = 'javascript' | 'typescript'

export default function LogicEditorModal({
  componentId,
  onSave,
  onClose,
}: {
  componentId: string
  onSave: (id: string, logic: string) => void
  onClose: () => void
}) {
  const store = useCanvasStore()
  const component = store.components.find((c) => c.id === componentId)

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<Language>('javascript')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)

  useEffect(() => {
    if (component) {
      const defaultTemplate =
        DEFAULT_TEMPLATES[component.type] || DEFAULT_TEMPLATES.default
      setCode(component.logic || defaultTemplate)
    }
  }, [component])

  const handleSave = () => {
    onSave(componentId, code)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!component) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          height: '85vh',
          background: '#0d1117',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #1e2533',
            background: '#0d1117',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(99,102,241,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(99,102,241,0.3)',
              }}
            >
              <Code2 size={16} color="var(--color-accent)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0' }}>
                Logic Editor
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {component.type} — {component.label}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Language toggle */}
            <div
              style={{
                display: 'flex',
                borderRadius: 8,
                border: '1px solid #1e2533',
                overflow: 'hidden',
              }}
            >
              {(['javascript', 'typescript'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    border: 'none',
                    background: language === lang ? '#1e2533' : 'transparent',
                    color: language === lang ? '#e2e8f0' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {lang === 'javascript' ? 'JS' : 'TS'}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 8,
                border: '1px solid #1e2533',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s',
              }}
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={handleSave}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: 8,
                border: 'none',
                background: saved ? '#10b981' : '#6366f1',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s',
              }}
            >
              {saved ? <Check size={13} /> : <Save size={13} />}
              {saved ? 'Saved!' : 'Save Logic'}
            </button>

            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #1e2533',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget.style.background = '#1e2533'), (e.currentTarget.style.color = '#e2e8f0'))}
              onMouseLeave={(e) => ((e.currentTarget.style.background = 'transparent'), (e.currentTarget.style.color = '#64748b'))}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(99,102,241,0.08)',
            borderBottom: '1px solid #1e2533',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.72rem',
            color: '#818cf8',
          }}
        >
          <Info size={12} />
          This logic will be injected into the generated {component.type} component. Use Ctrl+S to save.
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1, position: 'relative' }}>
          {!isEditorReady && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0d1117',
                zIndex: 10,
                gap: '0.5rem',
                color: '#64748b',
                fontSize: '0.85rem',
              }}
            >
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Loading editor...
            </div>
          )}
          <MonacoEditor
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={() => setIsEditorReady(true)}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
              fontLigatures: true,
              minimap: { enabled: true, scale: 1 },
              lineNumbers: 'on',
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              bracketPairColorization: { enabled: true },
              renderLineHighlight: 'all',
              suggest: { showKeywords: true },
              quickSuggestions: true,
            }}
          />
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )
}
