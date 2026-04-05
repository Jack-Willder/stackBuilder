'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  ArrowLeft,
  Download,
  Eye,
  Plus,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings,
  Maximize2,
  Lock,
} from 'lucide-react'
import Link from 'next/link'
import { useCanvasStore } from '@/lib/store'
import { CanvasComponent, ComponentType } from '@/lib/types'
import PropertyPanel from '@/components/canvas/PropertyPanel'
import ComponentPalette from '@/components/canvas/ComponentPalette'
import LogicEditorModal from '@/components/canvas/LogicEditorModal'
import CanvasPreview from '@/components/canvas/CanvasPreview'
import FreeElement from '@/components/canvas/FreeElement'

type ToastType = { message: string; type: 'success' | 'error' | 'info' }

function Toast({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        padding: '0.75rem 1.25rem',
        borderRadius: 10,
        background:
          toast.type === 'success'
            ? 'rgba(16,185,129,0.15)'
            : toast.type === 'error'
            ? 'rgba(239,68,68,0.15)'
            : 'rgba(99,102,241,0.15)',
        border: `1px solid ${
          toast.type === 'success'
            ? 'rgba(16,185,129,0.3)'
            : toast.type === 'error'
            ? 'rgba(239,68,68,0.3)'
            : 'rgba(99,102,241,0.3)'
        }`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        color: toast.type === 'success' ? '#34d399' : toast.type === 'error' ? '#f87171' : '#818cf8',
        minWidth: 250,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: 1000,
      }}
    >
      {toast.type === 'success' ? (
        <CheckCircle2 size={16} />
      ) : toast.type === 'error' ? (
        <AlertCircle size={16} />
      ) : (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      )}
      {toast.message}
    </motion.div>
  )
}

export default function CanvasPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const store = useCanvasStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [toasts, setToasts] = useState<(ToastType & { id: string })[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true)

  const artboardRef = useRef<HTMLDivElement>(null)

  const showToast = useCallback((message: string, type: ToastType['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  // Load project data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`)
        if (!res.ok) {
          router.push('/')
          return
        }
        const project = await res.json()
        store.setProject(project)
        store.setComponents(project.components || [])
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])
  
  // Handle keyboard shortcuts (Moving and Resizing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!store.selectedId) return

      // Skip if an input or textarea is focused
      const activeEl = document.activeElement
      if (
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.hasAttribute('contenteditable')
      ) {
        return
      }

      const component = store.components.find((c) => c.id === store.selectedId)
      if (!component) return

      const step = e.ctrlKey || e.metaKey ? 10 : 1

      const { x = 0, y = 0, width = 100, height = 50 } = component

      let prevented = true
      switch (e.key) {
        case 'ArrowUp':
          if (e.shiftKey) {
            store.updateComponentGeometry(component.id, { height: Math.max(10, height - step) })
          } else {
            store.updateComponentGeometry(component.id, { y: y - step })
          }
          break
        case 'ArrowDown':
          if (e.shiftKey) {
            store.updateComponentGeometry(component.id, { height: height + step })
          } else {
            store.updateComponentGeometry(component.id, { y: y + step })
          }
          break
        case 'ArrowLeft':
          if (e.shiftKey) {
            store.updateComponentGeometry(component.id, { width: Math.max(10, width - step) })
          } else {
            store.updateComponentGeometry(component.id, { x: x - step })
          }
          break
        case 'ArrowRight':
          if (e.shiftKey) {
            store.updateComponentGeometry(component.id, { width: width + step })
          } else {
            store.updateComponentGeometry(component.id, { x: x + step })
          }
          break
        default:
          prevented = false
          break
      }

      if (prevented) {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [store])

  const handleAddComponent = async (type: ComponentType) => {
    const defaultProps: Record<ComponentType, Record<string, string>> = {
      Button: { text: 'Click me', backgroundColor: '#6366f1', color: '#ffffff' },
      Input: { placeholder: 'Enter text here...', borderColor: '#e2e8f0' },
      Card: { text: 'Card Title', backgroundColor: '#ffffff' },
      Navbar: { text: 'My App', backgroundColor: '#1e293b', color: '#f8fafc' },
      Hero: { text: 'Welcome to My App', backgroundColor: '#6366f1', color: '#ffffff' },
      Text: { text: 'Add your text here.', color: '#374151', fontSize: '16px' },
      Image: { src: 'https://picsum.photos/seed/stackbuilder/800/400', alt: 'Image' },
      Form: { backgroundColor: '#ffffff' },
      Footer: { text: 'My App', backgroundColor: '#1e293b', color: '#9ca3af' },
      Badge: { text: 'New Feature', backgroundColor: '#ede9fe', color: '#7c3aed' },
    }

    const defaultGeometry: Record<ComponentType, { width: number; height: number }> = {
      Button: { width: 140, height: 44 },
      Input: { width: 280, height: 44 },
      Card: { width: 340, height: 220 },
      Navbar: { width: 800, height: 70 },
      Hero: { width: 800, height: 400 },
      Text: { width: 400, height: 60 },
      Image: { width: 320, height: 200 },
      Form: { width: 320, height: 360 },
      Footer: { width: 800, height: 100 },
      Badge: { width: 100, height: 28 },
    }

    const geo = defaultGeometry[type] || { width: 200, height: 100 }

    const newComponent = {
      type,
      label: type,
      props: defaultProps[type] || {},
      position: store.components.length,
      x: 50,
      y: 50 + (store.components.length * 40),
      width: geo.width,
      height: geo.height,
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/components`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComponent),
      })

      if (res.ok) {
        const created = await res.json()
        store.addComponent(created)
        store.selectComponent(created.id)
        showToast(`${type} component added`)
      }
    } catch {
      showToast('Failed to add component', 'error')
    }
  }

  const handleDeleteComponent = async (id: string) => {
    try {
      await fetch(`/api/projects/${projectId}/components/${id}`, { method: 'DELETE' })
      store.removeComponent(id)
      showToast('Component deleted')
    } catch {
      showToast('Failed to delete component', 'error')
    }
  }

  const handleSaveComponent = async (id: string) => {
    const component = store.components.find((c) => c.id === id)
    if (!component) return

    setSaving(true)
    try {
      await fetch(`/api/projects/${projectId}/components/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: component.label,
          props: component.props,
          logic: component.logic,
          x: component.x,
          y: component.y,
          width: component.width,
          height: component.height,
        }),
      })
      showToast('Changes saved')
    } catch {
      showToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLogic = async (id: string, logic: string) => {
    store.saveLogic(id, logic)
    try {
      await fetch(`/api/projects/${projectId}/components/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logic }),
      })
      showToast('Logic saved')
    } catch {
      showToast('Failed to save logic', 'error')
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    showToast('Generating your project...', 'info')

    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, { method: 'POST' })
      if (!res.ok) throw new Error('Generation failed')

      const data = await res.json()
      const JSZipModule = await import('jszip')
      const JSZip = JSZipModule.default || (JSZipModule as any)
      const zip = new JSZip()
      const folderName = data.projectName.replace(/\s+/g, '-').toLowerCase()
      const folder = zip.folder(folderName)!

      for (const file of data.files) {
        const parts = file.path.split('/')
        let current = folder
        for (let i = 0; i < parts.length - 1; i++) {
          current = current.folder(parts[i])!
        }
        current.file(parts[parts.length - 1], file.content)
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${folderName}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Delay revocation to ensure browser captures it
      setTimeout(() => URL.revokeObjectURL(url), 200)

      showToast(`✅ ${data.projectName}.zip downloaded!`)
    } catch (err) {
      console.error('Generation error:', err)
      showToast('Failed to generate code', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const selectedComponent = store.components.find((c) => c.id === store.selectedId)

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={32} style={{ color: 'var(--color-accent)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)', overflow: 'hidden' }}>
      {/* Top toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem', borderBottom: '1px solid var(--color-border)', background: 'rgba(10,10,15,0.95)', flexShrink: 0, gap: '0.75rem', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'var(--color-text-muted)', flexShrink: 0 }}>
            <ArrowLeft size={15} />
          </Link>
          <div style={{ width: 1, height: 20, background: 'var(--color-border)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Layers size={16} color="var(--color-accent)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              Stack<span style={{ color: 'var(--color-accent)' }}>Builder</span>
            </span>
          </div>
          {store.project && (
            <>
              <span style={{ color: 'var(--color-border)', flexShrink: 0 }}>/</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
                {store.project.name}
              </span>
            </>
          )}
        </div>

        {/* Center Toolbar: Simplified */}
        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button onClick={() => setPreviewMode(!previewMode)} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
            <Eye size={14} />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          {store.selectedId && (
            <button onClick={() => handleSaveComponent(store.selectedId!)} disabled={saving} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
              Save
            </button>
          )}
          <button onClick={handleGenerate} disabled={generating} className="btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
            {generating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={14} />}
            Generate
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Component Palette */}
        <div style={{ width: 220, borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', flexShrink: 0 }}>
          <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={14} style={{ color: 'var(--color-accent)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Palette</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ComponentPalette onAdd={handleAddComponent} />
          </div>
        </div>

        {/* Center: White Canvas Artboard */}
        <div
          style={{ flex: 1, background: '#0a0a0f', overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '60px' }}
          onClick={() => store.selectComponent(null)}
        >
          <div
            ref={artboardRef}
            style={{
              width: 800,
              height: store.canvasHeight,
              background: '#fff',
              position: 'relative',
              boxShadow: '0 12px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              borderRadius: 2,
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {store.components.map((c) => (
              <FreeElement
                key={c.id}
                component={c}
                isSelected={store.selectedId === c.id}
                onSelect={() => store.selectComponent(c.id)}
                onDelete={() => handleDeleteComponent(c.id)}
                onLogic={() => store.openLogicEditor(c.id)}
                canvasWidth={800}
                canvasHeight={store.canvasHeight}
                onGeometryChange={(id, geo) => store.updateComponentGeometry(id, geo)}
                aspectRatioLocked={aspectRatioLocked}
              />
            ))}

            {store.components.length === 0 && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', opacity: 0.5 }}>
                <Plus size={48} style={{ marginBottom: '1rem' }} />
                <p style={{ fontWeight: 600 }}>Empty Artboard</p>
                <p style={{ fontSize: '0.875rem' }}>Pick a component from the left to start</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Properties Panel */}
        <div style={{ width: 280, borderLeft: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', flexShrink: 0 }}>
          <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={14} style={{ color: 'var(--color-accent)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Properties</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <PropertyPanel
              component={selectedComponent || null}
              onSave={() => selectedComponent && handleSaveComponent(selectedComponent.id)}
              aspectRatioLocked={aspectRatioLocked}
              onToggleRatioLock={() => setAspectRatioLocked(!aspectRatioLocked)}
            />
          </div>
        </div>
      </div>

      {store.logicEditorOpen && (
        <LogicEditorModal
          componentId={store.logicEditorTarget!}
          onSave={handleSaveLogic}
          onClose={store.closeLogicEditor}
        />
      )}

      {/* Toast container */}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
          ))}
        </AnimatePresence>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }} .input-field { background: rgba(255,255,255,0.04); border: 1px solid var(--color-border); border-radius: 7px; padding: 0.5rem 0.6rem; color: var(--color-text); font-family: inherit; width: 100%; transition: all 0.2s; } .input-field:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); outline: none; }`}</style>
    </div>
  )
}
