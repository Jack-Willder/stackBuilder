'use client'

import { CanvasComponent } from '@/lib/types'

export default function CanvasPreview({ component }: { component: CanvasComponent }) {
  const { type, props, label } = component
  const p = props as Record<string, string>

  const style: React.CSSProperties = {
    color: p.color || undefined,
    backgroundColor: p.backgroundColor || undefined,
    fontSize: p.fontSize || undefined,
    fontWeight: p.fontWeight ? (p.fontWeight as React.CSSProperties['fontWeight']) : undefined,
    padding: p.padding || undefined,
    margin: p.margin || undefined,
    width: p.width || '100%',
    height: p.height || undefined,
    borderRadius: p.borderRadius || undefined,
    borderColor: p.borderColor || undefined,
    textAlign: (p.align as React.CSSProperties['textAlign']) || undefined,
  }

  switch (type) {
    case 'Button':
      return (
        <button
          style={{
            padding: '10px 20px',
            background: p.backgroundColor || '#6366f1',
            color: p.color || '#fff',
            border: 'none',
            borderRadius: p.borderRadius || '8px',
            fontSize: p.fontSize || '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            ...style,
          }}
        >
          {p.text || label}
        </button>
      )

    case 'Input':
      return (
        <input
          type="text"
          placeholder={p.placeholder || 'Enter text...'}
          readOnly
          style={{
            padding: p.padding || '10px 12px',
            border: `1px solid ${p.borderColor || '#d1d5db'}`,
            borderRadius: p.borderRadius || '8px',
            fontSize: p.fontSize || '14px',
            backgroundColor: p.backgroundColor || '#fff',
            color: p.color || '#374151',
            width: p.width || '100%',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      )

    case 'Card':
      return (
        <div
          style={{
            padding: p.padding || '24px',
            backgroundColor: p.backgroundColor || '#fff',
            borderRadius: p.borderRadius || '12px',
            border: `1px solid ${p.borderColor || '#e5e7eb'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            width: '100%',
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: p.color || '#111827' }}>
            {p.text || label}
          </h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Card content goes here</p>
        </div>
      )

    case 'Navbar':
      return (
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: p.padding || '12px 32px',
            backgroundColor: p.backgroundColor || '#1e293b',
            color: p.color || '#f8fafc',
            width: '100%',
            borderRadius: '8px',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '18px' }}>{p.text || 'My App'}</span>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Home</span>
            <span style={{ opacity: 0.8, cursor: 'pointer' }}>About</span>
            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Contact</span>
          </div>
        </nav>
      )

    case 'Hero':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: p.padding || '60px 32px',
            backgroundColor: p.backgroundColor || '#6366f1',
            background: p.backgroundColor || 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: p.color || '#fff',
            textAlign: 'center',
            borderRadius: '8px',
            width: '100%',
          }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {p.text || label}
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.85, margin: '0 0 20px' }}>
            Build something amazing today
          </p>
          <button
            style={{
              padding: '12px 28px',
              background: '#fff',
              color: p.backgroundColor || '#6366f1',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '15px',
              fontFamily: 'inherit',
            }}
          >
            Get Started
          </button>
        </div>
      )

    case 'Text':
      return (
        <p
          style={{
            margin: 0,
            padding: p.padding || '0',
            color: p.color || '#374151',
            fontSize: p.fontSize || '16px',
            fontWeight: p.fontWeight || '400',
            lineHeight: 1.7,
            textAlign: (p.align as React.CSSProperties['textAlign']) || 'left',
            width: '100%',
          }}
        >
          {p.text || label}
        </p>
      )

    case 'Image':
      return (
        <img
          src={p.src || 'https://picsum.photos/seed/sb/800/300'}
          alt={p.alt || label}
          style={{
            width: p.width || '100%',
            height: p.height || 'auto',
            borderRadius: p.borderRadius || '8px',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            el.src = 'https://picsum.photos/800/300?grayscale'
          }}
        />
      )

    case 'Form':
      return (
        <div
          style={{
            padding: p.padding || '24px',
            backgroundColor: p.backgroundColor || '#fff',
            borderRadius: p.borderRadius || '12px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>Contact Form</h3>
          <input type="text" placeholder="Your name" readOnly style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
          <input type="email" placeholder="Email address" readOnly style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
          <textarea placeholder="Your message" readOnly rows={3} style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }} />
          <button style={{ padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Submit
          </button>
        </div>
      )

    case 'Footer':
      return (
        <footer
          style={{
            padding: p.padding || '24px',
            backgroundColor: p.backgroundColor || '#1e293b',
            color: p.color || '#9ca3af',
            textAlign: 'center',
            fontSize: '14px',
            borderRadius: '8px',
            width: '100%',
          }}
        >
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} {p.text || label}. All rights reserved.</p>
        </footer>
      )

    case 'Badge':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: p.padding || '4px 12px',
            backgroundColor: p.backgroundColor || '#ede9fe',
            color: p.color || '#7c3aed',
            borderRadius: p.borderRadius || '999px',
            fontSize: p.fontSize || '12px',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          {p.text || label}
        </span>
      )

    default:
      return (
        <div
          style={{
            padding: '16px',
            background: '#f1f5f9',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#64748b',
          }}
        >
          {label}
        </div>
      )
  }
}
