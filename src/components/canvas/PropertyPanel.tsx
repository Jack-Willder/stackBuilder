'use client'

import { useState, useCallback } from 'react'
import { Save, Info, Settings2, Lock, Unlock, Code2, Plus } from 'lucide-react'
import { useCanvasStore } from '@/lib/store'
import { CanvasComponent, ComponentProps } from '@/lib/types'

type PropField = {
  key: keyof ComponentProps
  label: string
  type: 'text' | 'color' | 'select' | 'textarea'
  options?: string[]
  placeholder?: string
}

const COMPONENT_PROPS: Record<string, PropField[]> = {
  Button: [
    { key: 'text', label: 'Button Text', type: 'text', placeholder: 'Click me' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '10px 20px' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '8px' },
    { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '14px' },
  ],
  Input: [
    { key: 'placeholder', label: 'Placeholder', type: 'text', placeholder: 'Enter text...' },
    { key: 'borderColor', label: 'Border Color', type: 'color' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '10px 12px' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '8px' },
  ],
  Card: [
    { key: 'text', label: 'Card Title', type: 'text', placeholder: 'My Card' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '24px' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '12px' },
    { key: 'borderColor', label: 'Border Color', type: 'color' },
  ],
  Navbar: [
    { key: 'text', label: 'Brand Name', type: 'text', placeholder: 'My App' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '12px 32px' },
  ],
  Hero: [
    { key: 'text', label: 'Headline', type: 'text', placeholder: 'Welcome to My App' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '80px 32px' },
  ],
  Text: [
    { key: 'text', label: 'Content', type: 'textarea', placeholder: 'Your text here...' },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '16px' },
    { key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['300', '400', '500', '600', '700', '800'] },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '0px' },
  ],
  Image: [
    { key: 'src', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Image description' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '8px' },
  ],
  Form: [
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '24px' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '12px' },
  ],
  Footer: [
    { key: 'text', label: 'Brand Name', type: 'text', placeholder: 'My App' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '24px' },
  ],
  Badge: [
    { key: 'text', label: 'Badge Text', type: 'text', placeholder: 'New' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '999px' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '4px 12px' },
    { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '12px' },
  ],
}

function PropInput({
  field,
  value,
  onChange,
}: {
  field: PropField
  value: string
  onChange: (value: string) => void
}) {
  if (field.type === 'color') {
    return (
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 28, height: 28,
            border: '1px solid var(--color-border)',
            borderRadius: 5,
            background: 'none', padding: '2px',
            cursor: 'pointer', flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="input-field"
          style={{ flex: 1, fontSize: '0.75rem' }}
        />
      </div>
    )
  }
  if (field.type === 'select') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        style={{ fontSize: '0.75rem' }}
      >
        {field.options?.map((opt) => (
          <option key={opt} value={opt} style={{ background: 'var(--color-surface)' }}>{opt}</option>
        ))}
      </select>
    )
  }
  if (field.type === 'textarea') {
    return (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="input-field"
        rows={3}
        style={{ fontSize: '0.75rem', resize: 'vertical' }}
      />
    )
  }
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="input-field"
      style={{ fontSize: '0.75rem' }}
    />
  )
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  marginBottom: '0.3rem',
}

const NUM_INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.45rem 0.5rem',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 7,
  fontSize: '0.78rem',
  fontFamily: 'inherit',
  outline: 'none',
}

function ColorRow({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 28, height: 28, borderRadius: 6, border: '1px solid var(--color-border)', overflow: 'hidden', background: value || 'transparent' }}>
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: 'absolute', top: -5, left: -5, width: 40, height: 40, cursor: 'pointer', opacity: 0 }}
          />
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="input-field"
          style={{ flex: 1, fontSize: '0.72rem', height: 28, padding: '0 8px' }}
        />
      </div>
    </div>
  )
}

function Section({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem', marginBottom: '0.75rem' }}>
        {Icon && <Icon size={12} style={{ color: 'var(--color-accent)', opacity: 0.8 }} />}
        <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text)' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export default function PropertyPanel({
  component,
  onSave,
  aspectRatioLocked,
  onToggleRatioLock,
}: {
  component: CanvasComponent | null
  onSave: () => void
  aspectRatioLocked: boolean
  onToggleRatioLock: () => void
}) {
  const store = useCanvasStore()
  const [savingProject, setSavingProject] = useState(false)

  const handleSaveProject = async () => {
    if (!store.project) return
    setSavingProject(true)
    try {
      await fetch(`/api/projects/${store.project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvasHeight: store.canvasHeight,
          canvasBackground: store.canvasBackground,
        }),
      })
      // Success toast is handled via component save usually, 
      // but here we just toggle the state.
    } catch (error) {
      console.error('Failed to save project:', error)
    } finally {
      setSavingProject(false)
    }
  }

  if (!component) {
    const bgParts = (store.canvasBackground || 'solid:#ffffff').split(':', 2)
    const bgType = bgParts[0] as 'solid' | 'gradient'
    const bgValue = bgParts[1]

    // Handle background changes
    const updateBg = (type: 'solid' | 'gradient', value: string) => {
      store.setCanvasBackground(`${type}:${value}`)
    }

    return (
      <div style={{ padding: '0.75rem', overflowY: 'auto', height: '100%' }}>
        {/* Canvas Header */}
        <div style={{ padding: '0.6rem 0.75rem', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings2 size={15} style={{ color: 'var(--color-accent)' }} />
          <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>Canvas Properties</div>
        </div>

        {/* Global Save */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={handleSaveProject} 
            disabled={savingProject} 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
          >
            {savingProject ? <Save size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
            Save Project Settings
          </button>
        </div>

        <Section title="Project Info">
          {store.project && (
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={LABEL_STYLE}>Project Name</label>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', padding: '0.4rem 0' }}>
                {store.project.name}
              </div>
            </div>
          )}
        </Section>

        <Section title="Artboard Background">
          <div style={{ marginBottom: '1rem' }}>
            <label style={LABEL_STYLE}>Background Type</label>
            <select
              value={bgType}
              onChange={(e) => {
                const newType = e.target.value as 'solid' | 'gradient'
                const defaultValue = newType === 'solid' ? '#ffffff' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                updateBg(newType, defaultValue)
              }}
              className="input-field"
              style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}
            >
              <option value="solid" style={{ background: 'var(--color-surface)' }}>Solid Color</option>
              <option value="gradient" style={{ background: 'var(--color-surface)' }}>Linear Gradient</option>
            </select>

            {bgType === 'solid' ? (
              <ColorRow
                label="Pick Color"
                value={bgValue}
                onChange={(v) => updateBg('solid', v)}
              />
            ) : (
              <div>
                <label style={LABEL_STYLE}>Gradient CSS</label>
                <textarea
                  value={bgValue}
                  onChange={(e) => updateBg('gradient', e.target.value)}
                  placeholder="linear-gradient(...)"
                  className="input-field"
                  rows={3}
                  style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                   <button 
                    onClick={() => updateBg('gradient', 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)')}
                    style={{ fontSize: '0.65rem', padding: '0.3rem 0.5rem', borderRadius: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                   >
                     Indigo
                   </button>
                   <button 
                    onClick={() => updateBg('gradient', 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)')}
                    style={{ fontSize: '0.65rem', padding: '0.3rem 0.5rem', borderRadius: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                   >
                     Sunset
                   </button>
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section title="Artboard Size">
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={LABEL_STYLE}>Height</label>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{store.canvasHeight}px</span>
            </div>
            <input
              type="range"
              min="400"
              max="5000"
              step="50"
              value={store.canvasHeight}
              onChange={(e) => store.setCanvasHeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer', marginBottom: '0.5rem' }}
            />
            <input
              type="number"
              value={store.canvasHeight}
              onChange={(e) => store.setCanvasHeight(Number(e.target.value))}
              style={{ ...NUM_INPUT_STYLE, textAlign: 'center' }}
            />
          </div>
        </Section>

        <div style={{ padding: '1.25rem', border: '1px dashed var(--color-border)', borderRadius: 10, textAlign: 'center', marginTop: '1rem' }}>
          <Plus size={18} style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', opacity: 0.4 }} />
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Select an element to edit its styles
          </p>
        </div>
      </div>
    )
  }

  const fields = COMPONENT_PROPS[component.type] || []
  const props = component.props as Record<string, string>
  
  // Layout helpers
  const x = Math.round(component.x ?? 40)
  const y = Math.round(component.y ?? 40)
  const width = Math.round(component.width ?? 320)
  const height = Math.round(component.height ?? 120)
  const ratio = width / height

  const handleGeom = (field: 'x' | 'y' | 'width' | 'height', val: number) => {
    if (isNaN(val)) return
    if (field === 'width' && aspectRatioLocked) {
      store.updateComponentGeometry(component.id, { width: val, height: Math.round(val / ratio) })
    } else if (field === 'height' && aspectRatioLocked) {
      store.updateComponentGeometry(component.id, { height: val, width: Math.round(val * ratio) })
    } else {
      store.updateComponentGeometry(component.id, { [field]: val })
    }
  }

  // Filter content props (e.g., text, src) from style props
  const contentProps = fields.filter(f => ['text', 'src', 'alt', 'placeholder'].includes(f.key as string))
  const otherProps = fields.filter(f => !['text', 'src', 'alt', 'placeholder', 'backgroundColor', 'borderColor', 'borderRadius', 'color', 'fontSize', 'fontWeight', 'padding', 'margin'].includes(f.key as string))

  return (
    <div style={{ padding: '0.75rem', overflowY: 'auto', height: '100%', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ padding: '0.6rem 0.75rem', borderRadius: 9, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)' }} />
        <span style={{ fontWeight: 700, fontSize: '0.83rem' }}>{component.type}</span>
      </div>

      {/* Actions (Primary at top) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={onSave} className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '0.45rem' }}>
          <Save size={12} />
          Save
        </button>
        <button onClick={() => store.openLogicEditor(component.id)} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '0.45rem' }}>
          <Code2 size={12} />
          Logic
        </button>
      </div>

      {/* ── Layout ── */}
      <Section title="Layout">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={LABEL_STYLE}>X</label>
            <input type="number" value={x} onChange={(e) => handleGeom('x', Number(e.target.value))} style={NUM_INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Y</label>
            <input type="number" value={y} onChange={(e) => handleGeom('y', Number(e.target.value))} style={NUM_INPUT_STYLE} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={LABEL_STYLE}>W</label>
            <input type="number" value={width} onChange={(e) => handleGeom('width', Number(e.target.value))} style={NUM_INPUT_STYLE} />
          </div>
          <div>
            <label style={{ ...LABEL_STYLE, display: 'flex', alignItems: 'center' }}>
              H
              <button onClick={onToggleRatioLock} style={{ marginLeft: 'auto', padding: 0.5, background: 'none', border: 'none', cursor: 'pointer', color: aspectRatioLocked ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                {aspectRatioLocked ? <Lock size={10} /> : <Unlock size={10} />}
              </button>
            </label>
            <input type="number" value={height} onChange={(e) => handleGeom('height', Number(e.target.value))} style={NUM_INPUT_STYLE} />
          </div>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label style={LABEL_STYLE}>Corner Radius</label>
          <input
            type="text"
            value={props.borderRadius || ''}
            onChange={(e) => store.updateComponentProps(component.id, { borderRadius: e.target.value })}
            placeholder="0px"
            className="input-field"
            style={{ fontSize: '0.72rem' }}
          />
        </div>
      </Section>

      {/* ── Content ── */}
      {contentProps.length > 0 && (
        <Section title="Content">
          {contentProps.map(f => (
            <div key={f.key} style={{ marginBottom: '0.75rem' }}>
              <label style={LABEL_STYLE}>{f.label}</label>
              <PropInput field={f} value={props[f.key] || ''} onChange={(v) => store.updateComponentProps(component.id, { [f.key]: v })} />
            </div>
          ))}
        </Section>
      )}

      {/* ── Fill ── */}
      <Section title="Fill">
        <ColorRow
          label="Background"
          value={props.backgroundColor || ''}
          onChange={(v) => store.updateComponentProps(component.id, { backgroundColor: v })}
        />
        <div style={{ marginTop: '0.5rem' }}>
          <label style={{ ...LABEL_STYLE, display: 'flex', justifyContent: 'space-between' }}>
            Opacity <span>{props.opacity || '100'}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={props.opacity || '100'}
            onChange={(e) => store.updateComponentProps(component.id, { opacity: e.target.value })}
            style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
          />
        </div>
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <ColorRow
          label="Text Color"
          value={props.color || ''}
          onChange={(v) => store.updateComponentProps(component.id, { color: v })}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div>
            <label style={LABEL_STYLE}>Size</label>
            <input
              type="text"
              value={props.fontSize || ''}
              onChange={(e) => store.updateComponentProps(component.id, { fontSize: e.target.value })}
              placeholder="14px"
              className="input-field"
              style={{ fontSize: '0.72rem' }}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Weight</label>
            <select
              value={props.fontWeight || '400'}
              onChange={(e) => store.updateComponentProps(component.id, { fontWeight: e.target.value })}
              className="input-field"
              style={{ fontSize: '0.72rem' }}
            >
              {['300', '400', '500', '600', '700', '800'].map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* ── Stroke ── */}
      <Section title="Stroke">
        <ColorRow
          label="Border Color"
          value={props.borderColor || ''}
          onChange={(v) => store.updateComponentProps(component.id, { borderColor: v })}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div>
            <label style={LABEL_STYLE}>Weight</label>
            <input
              type="text"
              value={props.borderWidth || ''}
              onChange={(e) => store.updateComponentProps(component.id, { borderWidth: e.target.value })}
              placeholder="1px"
              className="input-field"
              style={{ fontSize: '0.72rem' }}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Style</label>
            <select
              value={props.borderStyle || 'solid'}
              onChange={(e) => store.updateComponentProps(component.id, { borderStyle: e.target.value })}
              className="input-field"
              style={{ fontSize: '0.72rem' }}
            >
              {['solid', 'dashed', 'dotted', 'none'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* ── Effects ── */}
      <Section title="Effects">
        <div style={{ marginBottom: '1rem' }}>
          <label style={LABEL_STYLE}>Drop Shadow</label>
          <input
            type="text"
            value={props.boxShadow || ''}
            onChange={(e) => store.updateComponentProps(component.id, { boxShadow: e.target.value })}
            placeholder="0 4px 6px -1px rgb(0 0 0 / 0.1)"
            className="input-field"
            style={{ fontSize: '0.72rem' }}
          />
        </div>
        <div>
          <label style={LABEL_STYLE}>Backdrop Blur (px)</label>
          <input
            type="number"
            value={props.backdropBlur || ''}
            onChange={(e) => store.updateComponentProps(component.id, { backdropBlur: e.target.value })}
            placeholder="0"
            className="input-field"
            style={{ fontSize: '0.72rem' }}
          />
        </div>
      </Section>

      {/* ── Other Props ── */}
      {otherProps.length > 0 && (
        <Section title="Extra Props">
          {otherProps.map(f => (
            <div key={f.key} style={{ marginBottom: '0.75rem' }}>
              <label style={LABEL_STYLE}>{f.label}</label>
              <PropInput field={f} value={props[f.key] || ''} onChange={(v) => store.updateComponentProps(component.id, { [f.key]: v })} />
            </div>
          ))}
        </Section>
      )}

    </div>
  )
}
