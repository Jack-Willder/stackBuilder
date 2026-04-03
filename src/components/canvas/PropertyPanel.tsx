'use client'

import { useEffect } from 'react'
import { Save, Info, Settings2 } from 'lucide-react'
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
    { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
  ],
  Card: [
    { key: 'text', label: 'Card Title', type: 'text', placeholder: 'My Card' },
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '24px' },
    { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '12px' },
    { key: 'borderColor', label: 'Border Color', type: 'color' },
    { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
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
    { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
    { key: 'height', label: 'Height', type: 'text', placeholder: 'auto' },
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
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            background: 'none',
            padding: '2px',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="input-field"
          style={{ flex: 1, fontSize: '0.78rem' }}
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
        style={{ fontSize: '0.78rem' }}
      >
        {field.options?.map((opt) => (
          <option key={opt} value={opt} style={{ background: 'var(--color-surface)' }}>
            {opt}
          </option>
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
        style={{ fontSize: '0.78rem', resize: 'vertical' }}
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
      style={{ fontSize: '0.78rem' }}
    />
  )
}

export default function PropertyPanel({
  component,
  onSave,
}: {
  component: CanvasComponent | null
  onSave: () => void
}) {
  const store = useCanvasStore()

  if (!component) {
    return (
      <div
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
        }}
      >
        <Settings2 size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
        <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
          Select a component on the canvas to edit its properties
        </p>
      </div>
    )
  }

  const fields = COMPONENT_PROPS[component.type] || []
  const props = component.props as Record<string, string>

  return (
    <div style={{ padding: '0.75rem' }}>
      {/* Component header */}
      <div
        style={{
          padding: '0.75rem',
          borderRadius: 10,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{component.type}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            ID: {component.id.slice(0, 12)}...
          </div>
        </div>
      </div>

      {/* Label field */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
          Label
        </label>
        <input
          type="text"
          value={component.label}
          onChange={(e) =>
            store.updateComponent(component.id, { label: e.target.value })
          }
          className="input-field"
          style={{ fontSize: '0.78rem' }}
        />
      </div>

      <div className="divider" style={{ marginBottom: '1rem' }} />

      {/* Props fields */}
      {fields.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {fields.map((field) => (
            <div key={field.key}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.35rem',
                }}
              >
                {field.label}
              </label>
              <PropInput
                field={field}
                value={props[field.key] || ''}
                onChange={(value) =>
                  store.updateComponentProps(component.id, { [field.key]: value })
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
          <Info size={14} />
          No editable properties for this component
        </div>
      )}

      {/* Save button */}
      <button
        onClick={onSave}
        className="btn-primary"
        style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}
      >
        <Save size={14} />
        Save Changes
      </button>

      {/* Logic hint */}
      <button
        onClick={() => store.openLogicEditor(component.id)}
        className="btn-secondary"
        style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', fontSize: '0.8rem' }}
      >
        Open Logic Editor
      </button>
    </div>
  )
}
