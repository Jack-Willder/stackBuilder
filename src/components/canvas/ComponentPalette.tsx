'use client'

import { ComponentType } from '@/lib/types'
import {
  Square,
  Type,
  Image,
  Layout,
  Navigation,
  Star,
  MessageSquare,
  Tag,
  AlignLeft,
  CornerDownRight,
} from 'lucide-react'

type PaletteItem = {
  type: ComponentType
  icon: React.ReactNode
  desc: string
  color: string
  category: string
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Layout
  { type: 'Navbar', icon: <Navigation size={18} />, desc: 'Navigation bar with logo & links', color: '#6366f1', category: 'Layout' },
  { type: 'Hero', icon: <Star size={18} />, desc: 'Full-width hero section with CTA', color: '#8b5cf6', category: 'Layout' },
  { type: 'Card', icon: <Layout size={18} />, desc: 'Content card with shadow', color: '#06b6d4', category: 'Layout' },
  { type: 'Footer', icon: <AlignLeft size={18} />, desc: 'Site footer with copyright', color: '#64748b', category: 'Layout' },
  // UI
  { type: 'Button', icon: <Square size={18} />, desc: 'Action button with click handler', color: '#10b981', category: 'UI' },
  { type: 'Input', icon: <MessageSquare size={18} />, desc: 'Text input field with event', color: '#f59e0b', category: 'UI' },
  { type: 'Badge', icon: <Tag size={18} />, desc: 'Status or label chip', color: '#ec4899', category: 'UI' },
  // Content
  { type: 'Text', icon: <Type size={18} />, desc: 'Paragraph or heading text', color: '#94a3b8', category: 'Content' },
  { type: 'Image', icon: <Image size={18} />, desc: 'Responsive image element', color: '#fb7185', category: 'Content' },
  // Form
  { type: 'Form', icon: <CornerDownRight size={18} />, desc: 'Complete form with inputs & submit', color: '#a78bfa', category: 'Form' },
]

const CATEGORIES = ['Layout', 'UI', 'Content', 'Form']

export default function ComponentPalette({ onAdd }: { onAdd: (type: ComponentType) => void }) {
  return (
    <div style={{ padding: '0.75rem 0.5rem' }}>
      {CATEGORIES.map((category) => {
        const items = PALETTE_ITEMS.filter((i) => i.category === category)
        return (
          <div key={category} style={{ marginBottom: '1.25rem' }}>
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                padding: '0 0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              {category}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => onAdd(item.type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 0.625rem',
                    borderRadius: 8,
                    border: '1px solid transparent',
                    background: 'transparent',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${item.color}15`
                    e.currentTarget.style.borderColor = `${item.color}30`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${item.color}20`,
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{item.type}</div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
