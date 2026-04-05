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

  if (!component) {
    return (
      <div style={{ padding: '0.75rem', overflowY: 'auto', height: '100%' }}>
        {/* Canvas Header */}
        <div
          style={{
            padding: '0.6rem 0.75rem',
            borderRadius: 9,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Settings2 size={15} style={{ color: 'var(--color-accent)' }} />
          <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>Canvas Properties</div>
        </div>

        {/* Project Info */}
        {store.project && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={LABEL_STYLE}>Project Name</label>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              {store.project.name}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={LABEL_STYLE}>Artboard Height</label>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{store.canvasHeight}px</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="range"
              min="400"
              max="5000"
              step="50"
              value={store.canvasHeight}
              onChange={(e) => store.setCanvasHeight(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--color-accent)', cursor: 'pointer' }}
            />
            <input
              type="number"
              value={store.canvasHeight}
              onChange={(e) => store.setCanvasHeight(Number(e.target.value))}
              style={{ ...NUM_INPUT_STYLE, width: 75, textAlign: 'center' }}
            />
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            Adjust the vertical scroll area of your design.
          </p>
        </div>

        <div className="divider" style={{ marginBottom: '1.5rem' }} />

        <div style={{ padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 10, textAlign: 'center' }}>
          <Plus size={20} style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', opacity: 0.5 }} />
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Select an element on the canvas to configure its specific styles and logic.
          </p>
        </div>
      </div>
    )
  }

  const fields = COMPONENT_PROPS[component.type] || []
  const props = component.props as Record<string, string>
  const x = component.x ?? 40
  const y = component.y ?? 40
  const width = component.width ?? 320
  const height = component.height ?? 120
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

  return (
    <div style={{ padding: '0.75rem', overflowY: 'auto', height: '100%' }}>
      {/* Component type header */}
      <div
        style={{
          padding: '0.6rem 0.75rem',
          borderRadius: 9,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{component.type}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {component.id.slice(0, 14)}…
          </div>
        </div>
      </div>

      {/* ── Layout / Geometry ── */}
      <p style={LABEL_STYLE}>Layout</p>

      {/* X / Y row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div>
          <label style={LABEL_STYLE}>X</label>
          <input
            type="number"
            value={Math.round(x)}
            onChange={(e) => handleGeom('x', Number(e.target.value))}
            style={NUM_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={LABEL_STYLE}>Y</label>
          <input
            type="number"
            value={Math.round(y)}
            onChange={(e) => handleGeom('y', Number(e.target.value))}
            style={NUM_INPUT_STYLE}
          />
        </div>
      </div>

      {/* W / H row with ratio lock */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={LABEL_STYLE}>W</label>
          <input
            type="number"
            value={Math.round(width)}
            onChange={(e) => handleGeom('width', Number(e.target.value))}
            style={NUM_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={{ ...LABEL_STYLE, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            H
            <button
              onClick={onToggleRatioLock}
              title={aspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16,
                border: 'none',
                borderRadius: 3,
                background: aspectRatioLocked ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)',
                color: aspectRatioLocked ? 'var(--color-accent)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {aspectRatioLocked ? <Lock size={9} /> : <Unlock size={9} />}
            </button>
          </label>
          <input
            type="number"
            value={Math.round(height)}
            onChange={(e) => handleGeom('height', Number(e.target.value))}
            style={NUM_INPUT_STYLE}
          />
        </div>
      </div>

      {/* Label */}
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={LABEL_STYLE}>Label</label>
        <input
          type="text"
          value={component.label}
          onChange={(e) => store.updateComponent(component.id, { label: e.target.value })}
          className="input-field"
          style={{ fontSize: '0.75rem' }}
        />
      </div>

      <div className="divider" style={{ marginBottom: '1rem' }} />

      {/* Appearance props */}
      {fields.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {fields.map((field) => (
            <div key={field.key}>
              <label style={LABEL_STYLE}>{field.label}</label>
              <PropInput
                field={field}
                value={props[field.key] || ''}
                onChange={(value) => store.updateComponentProps(component.id, { [field.key]: value })}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
          <Info size={13} />
          No extra properties
        </div>
      )}

      {/* Actions */}
      <button
        onClick={onSave}
        className="btn-primary"
        style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
      >
        <Save size={13} />
        Save Changes
      </button>

      <button
        onClick={() => store.openLogicEditor(component.id)}
        className="btn-secondary"
        style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', fontSize: '0.8rem' }}
      >
        <Code2 size={13} />
        Logic Editor
      </button>
    </div>
  )
}
