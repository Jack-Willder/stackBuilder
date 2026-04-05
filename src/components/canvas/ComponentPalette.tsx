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
  color: string
  category: string
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Layout
  { type: 'Navbar', icon: <Navigation size={15} />, color: '#6366f1', category: 'Layout' },
  { type: 'Hero', icon: <Star size={15} />, color: '#8b5cf6', category: 'Layout' },
  { type: 'Card', icon: <Layout size={15} />, color: '#06b6d4', category: 'Layout' },
  { type: 'Footer', icon: <AlignLeft size={15} />, color: '#64748b', category: 'Layout' },
  // UI
  { type: 'Button', icon: <Square size={15} />, color: '#10b981', category: 'UI' },
  { type: 'Input', icon: <MessageSquare size={15} />, color: '#f59e0b', category: 'UI' },
  { type: 'Badge', icon: <Tag size={15} />, color: '#ec4899', category: 'UI' },
  // Content
  { type: 'Text', icon: <Type size={15} />, color: '#94a3b8', category: 'Content' },
  { type: 'Image', icon: <Image size={15} />, color: '#fb7185', category: 'Content' },
  // Form
  { type: 'Form', icon: <CornerDownRight size={15} />, color: '#a78bfa', category: 'Form' },
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
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                padding: '0 0.4rem',
                marginBottom: '0.4rem',
              }}
            >
              {category}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => onAdd(item.type)}
                  title={`Add ${item.type}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.45rem 0.5rem',
                    borderRadius: 7,
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
                      width: 28,
                      height: 28,
                      borderRadius: 7,
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
                  <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>{item.type}</span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
