'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Layers,
  ArrowLeft,
  Download,
  Code2,
  Trash2,
  Move,
  Eye,
  Settings,
  Plus,
  RefreshCw,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GripVertical,
} from 'lucide-react'
import Link from 'next/link'
import { useCanvasStore } from '@/lib/store'
import { CanvasComponent, ComponentType } from '@/lib/types'
import PropertyPanel from '@/components/canvas/PropertyPanel'
import ComponentPalette from '@/components/canvas/ComponentPalette'
import LogicEditorModal from '@/components/canvas/LogicEditorModal'
import CanvasPreview from '@/components/canvas/CanvasPreview'

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

// Sortable component item in canvas
function SortableComponentItem({
  component,
  isSelected,
  onSelect,
  onDelete,
  onLogic,
}: {
  component: CanvasComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onLogic: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={onSelect}
        style={{
          position: 'relative',
          border: `2px solid ${isSelected ? 'var(--color-accent)' : 'transparent'}`,
          borderRadius: 12,
          transition: 'all 0.15s ease',
          cursor: 'pointer',
          background: isSelected ? 'rgba(99,102,241,0.05)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = 'transparent'
          }
        }}
      >
        {/* Component label bar */}
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            display: isSelected ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.2rem 0.5rem',
            background: 'var(--color-accent)',
            borderRadius: '10px 10px 0 0',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', color: 'rgba(255,255,255,0.7)' }}>
              <GripVertical size={12} />
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {component.type}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onLogic() }}
              style={{ padding: '0.15rem', borderRadius: 4, border: 'none', background: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', color: 'white' }}
            >
              <Code2 size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              style={{ padding: '0.15rem', borderRadius: 4, border: 'none', background: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', color: 'white' }}
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        {/* Component preview */}
        <div style={{ padding: '1rem', paddingTop: isSelected ? '1.75rem' : '1rem' }}>
          <CanvasPreview component={component} />
        </div>
      </div>
    </div>
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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sidebarTab, setSidebarTab] = useState<'palette' | 'properties'>('palette')
  const [previewMode, setPreviewMode] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

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

  // Auto-select properties tab when component is selected
  useEffect(() => {
    if (store.selectedId) {
      setSidebarTab('properties')
    }
  }, [store.selectedId])

  const handleAddComponent = async (type: ComponentType) => {
    const defaultProps: Record<ComponentType, Record<string, string>> = {
      Button: { text: 'Click me', backgroundColor: '#6366f1', color: '#ffffff', padding: '10px 20px', borderRadius: '8px' },
      Input: { placeholder: 'Enter text here...', borderColor: '#e2e8f0' },
      Card: { text: 'Card Title', backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px' },
      Navbar: { text: 'My App', backgroundColor: '#1e293b', color: '#f8fafc' },
      Hero: { text: 'Welcome to My App', backgroundColor: '#6366f1', color: '#ffffff' },
      Text: { text: 'Add your text here. Click to edit in the property panel.', color: '#374151', fontSize: '16px' },
      Image: { src: 'https://picsum.photos/seed/stackbuilder/800/400', alt: 'Image', borderRadius: '8px' },
      Form: { backgroundColor: '#ffffff' },
      Footer: { text: 'My App', backgroundColor: '#1e293b', color: '#9ca3af' },
      Badge: { text: 'New Feature', backgroundColor: '#ede9fe', color: '#7c3aed' },
    }

    const newComponent = {
      type,
      label: type,
      props: defaultProps[type] || {},
      position: store.components.length,
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

      // Use JSZip to create downloadable zip
      const JSZip = (await import('jszip')).default
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
      a.click()
      URL.revokeObjectURL(url)

      showToast(`✅ ${data.projectName}.zip downloaded!`)
    } catch {
      showToast('Failed to generate code', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const oldIndex = store.components.findIndex((c) => c.id === active.id)
    const newIndex = store.components.findIndex((c) => c.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newComponents = arrayMove(store.components, oldIndex, newIndex).map((c, i) => ({
      ...c,
      position: i,
    }))

    store.setComponents(newComponents)

    // Persist reorder
    try {
      await fetch(`/api/projects/${projectId}/components`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: newComponents.map((c) => ({ id: c.id, position: c.position })),
        }),
      })
    } catch {
      showToast('Failed to save order', 'error')
    }
  }

  const selectedComponent = store.components.find((c) => c.id === store.selectedId)

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={32} style={{ color: 'var(--color-accent)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading workspace...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
        overflow: 'hidden',
      }}
    >
      {/* Top toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(10,10,15,0.95)',
          flexShrink: 0,
          gap: '0.75rem',
          zIndex: 30,
        }}
      >
        {/* Left: Logo + project name */}
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
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 200,
                }}
              >
                {store.project.name}
              </span>
            </>
          )}
        </div>

        {/* Center: Stack badges */}
        {store.project && (
          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            <span className="badge badge-cyan" style={{ textTransform: 'none' }}>
              {store.project.stack.frontend}
            </span>
            {store.project.stack.backend !== 'none' && (
              <span className="badge badge-purple" style={{ textTransform: 'none' }}>
                {store.project.stack.backend}
              </span>
            )}
            {store.project.stack.database !== 'none' && (
              <span className="badge badge-indigo" style={{ textTransform: 'none' }}>
                {store.project.stack.database}
              </span>
            )}
          </div>
        )}

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Eye size={14} />
            {previewMode ? 'Edit' : 'Preview'}
          </button>

          {store.selectedId && (
            <button
              onClick={() => handleSaveComponent(store.selectedId!)}
              disabled={saving}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
              Save
            </button>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary"
            style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}
          >
            {generating ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Download size={14} />
            )}
            Generate & Download
          </button>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar: Component palette / properties tabs */}
        <div
          style={{
            width: 260,
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-surface)',
            flexShrink: 0,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--color-border)',
              padding: '0.5rem 0.5rem 0',
              gap: '0.25rem',
            }}
          >
            {(['palette', 'properties'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSidebarTab(tab)}
                style={{
                  flex: 1,
                  padding: '0.45rem',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  background: sidebarTab === tab ? 'var(--color-bg)' : 'transparent',
                  color: sidebarTab === tab ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontWeight: sidebarTab === tab ? 600 : 400,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                {tab === 'palette' ? <Plus size={13} /> : <Settings size={13} />}
                {tab === 'palette' ? 'Components' : 'Properties'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {sidebarTab === 'palette' ? (
              <ComponentPalette onAdd={handleAddComponent} />
            ) : (
              <PropertyPanel
                component={selectedComponent || null}
                onSave={() => selectedComponent && handleSaveComponent(selectedComponent.id)}
              />
            )}
          </div>
        </div>

        {/* Canvas center */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) store.selectComponent(null)
          }}
        >
          {previewMode ? (
            // Full preview mode
            <div style={{ flex: 1, background: '#fff', overflow: 'auto' }}>
              {store.components.map((c) => (
                <CanvasPreview key={c.id} component={c} />
              ))}
              {store.components.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
                  No components added yet
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, padding: '1.5rem' }}>
              {/* Canvas header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    CANVAS
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 999,
                      background: 'rgba(99,102,241,0.15)',
                      color: '#818cf8',
                    }}
                  >
                    {store.components.length} components
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                  <Move size={12} />
                  Drag to reorder
                </div>
              </div>

              {/* Canvas area */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: `2px dashed ${store.components.length === 0 ? 'rgba(99,102,241,0.3)' : 'var(--color-border)'}`,
                  borderRadius: 16,
                  minHeight: 500,
                  padding: store.components.length === 0 ? '3rem' : '1rem',
                  transition: 'border-color 0.2s',
                  position: 'relative',
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) store.selectComponent(null)
                }}
              >
                {store.components.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 16,
                        background: 'rgba(99,102,241,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        border: '2px dashed rgba(99,102,241,0.3)',
                      }}
                    >
                      <Plus size={24} color="var(--color-accent)" />
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Empty canvas</p>
                    <p style={{ fontSize: '0.8rem', maxWidth: 300, margin: '0 auto' }}>
                      Click a component in the left panel to add it here
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={store.components.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {store.components.map((component) => (
                          <SortableComponentItem
                            key={component.id}
                            component={component}
                            isSelected={store.selectedId === component.id}
                            onSelect={() => store.selectComponent(component.id)}
                            onDelete={() => handleDeleteComponent(component.id)}
                            onLogic={() => store.openLogicEditor(component.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeId ? (
                        <div
                          style={{
                            border: '2px solid var(--color-accent)',
                            borderRadius: 12,
                            padding: '1rem',
                            background: 'rgba(99,102,241,0.1)',
                            opacity: 0.8,
                          }}
                        >
                          <GripVertical size={20} color="var(--color-accent)" />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </div>

              {/* Keyboard shortcut hint */}
              {store.selectedId && (
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                  Press <kbd style={{ padding: '0.1rem 0.4rem', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: '0.65rem' }}>Del</kbd> to remove selected component
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logic Editor Modal */}
      {store.logicEditorOpen && (
        <LogicEditorModal
          componentId={store.logicEditorTarget!}
          onSave={handleSaveLogic}
          onClose={store.closeLogicEditor}
        />
      )}

      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )
}
