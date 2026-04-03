'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Box,
  Server,
  Database,
  Globe,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { StackConfig, WizardState } from '@/lib/types'

const FRONTEND_OPTIONS = [
  {
    id: 'react-vite',
    name: 'React + Vite',
    desc: 'Lightning fast HMR, TypeScript, modern tooling',
    icon: '⚛️',
    color: '#06b6d4',
    badge: 'Most Popular',
  },
  {
    id: 'nextjs',
    name: 'Next.js 14',
    desc: 'SSR, SSG, App Router, API routes — all-in-one',
    icon: '▲',
    color: '#fff',
    badge: 'Full-Stack',
  },
  {
    id: 'vue-vite',
    name: 'Vue + Vite',
    desc: 'Progressive framework with Composition API',
    icon: '💚',
    color: '#42b883',
    badge: null,
  },
]

const BACKEND_OPTIONS = [
  {
    id: 'express',
    name: 'Express.js',
    desc: 'Minimal, flexible Node.js REST API framework',
    icon: '🚂',
    color: '#ffffff',
    badge: null,
  },
  {
    id: 'nextjs-api',
    name: 'Next.js API Routes',
    desc: 'Built-in server endpoints with the frontend',
    icon: '▲',
    color: '#fff',
    badge: 'Recommended',
  },
  {
    id: 'none',
    name: 'No Backend',
    desc: 'Frontend only, static site or JAMstack',
    icon: '🌐',
    color: '#64748b',
    badge: null,
  },
]

const DATABASE_OPTIONS = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    desc: 'Open-source, enterprise-grade relational DB',
    icon: '🐘',
    color: '#336791',
    badge: 'Recommended',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    desc: 'World\'s most popular open-source database',
    icon: '🐬',
    color: '#4479a1',
    badge: null,
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    desc: 'Serverless, self-contained, file-based DB',
    icon: '📁',
    color: '#64748b',
    badge: 'Zero Config',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    desc: 'NoSQL document database for flexible schemas',
    icon: '🍃',
    color: '#13aa52',
    badge: null,
  },
  {
    id: 'none',
    name: 'No Database',
    desc: 'Static data, external APIs or mock data',
    icon: '✨',
    color: '#64748b',
    badge: null,
  },
]

const STEPS = ['Project Info', 'Frontend Stack', 'Backend & Database']

type OptionCardProps = {
  option: { id: string; name: string; desc: string; icon: string; color: string; badge: string | null }
  selected: boolean
  onClick: () => void
}

function OptionCard({ option, selected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '1rem 1.25rem',
        borderRadius: 12,
        border: `2px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'}`,
        background: selected
          ? 'rgba(99,102,241,0.08)'
          : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
          e.currentTarget.style.background = 'rgba(99,102,241,0.04)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        }
      }}
    >
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check size={11} color="white" />
        </div>
      )}
      <span style={{ fontSize: '1.75rem' }}>{option.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{option.name}</span>
          {option.badge && (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: 999,
                background: 'rgba(99,102,241,0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
          {option.desc}
        </p>
      </div>
    </button>
  )
}

export default function NewProjectPage() {
  const router = useRouter()
  const [state, setState] = useState<WizardState>({
    step: 1,
    name: '',
    description: '',
    stack: {
      frontend: 'react-vite',
      backend: 'nextjs-api',
      database: 'postgresql',
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateStack = (key: keyof StackConfig, value: string) => {
    setState((prev) => ({
      ...prev,
      stack: { ...prev.stack, [key]: value },
    }))
  }

  const canGoNext = () => {
    if (state.step === 1) return state.name.trim().length >= 2
    return true
  }

  const handleNext = () => {
    if (state.step < 3) {
      setState((prev) => ({ ...prev, step: (prev.step + 1) as 1 | 2 | 3 }))
    } else {
      handleCreate()
    }
  }

  const handleBack = () => {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: (prev.step - 1) as 1 | 2 | 3 }))
    }
  }

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          description: state.description,
          stack: state.stack,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create project')
      }

      const project = await res.json()
      router.push(`/projects/${project.id}/canvas`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} />
          <span style={{ fontSize: '0.85rem' }}>Back</span>
        </Link>
        <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={16} color="var(--color-accent)" />
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Foundation Wizard</span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: 600 }}>
          {/* Steps indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2.5rem',
              gap: '0',
            }}
          >
            {STEPS.map((step, i) => (
              <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      transition: 'all 0.3s',
                      border: `2px solid ${
                        state.step > i + 1
                          ? 'var(--color-success)'
                          : state.step === i + 1
                          ? 'var(--color-accent)'
                          : 'var(--color-border)'
                      }`,
                      background:
                        state.step > i + 1
                          ? 'var(--color-success)'
                          : state.step === i + 1
                          ? 'var(--color-accent)'
                          : 'transparent',
                      color:
                        state.step >= i + 1 ? 'white' : 'var(--color-text-muted)',
                    }}
                  >
                    {state.step > i + 1 ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      marginTop: '0.4rem',
                      color:
                        state.step === i + 1
                          ? 'var(--color-text)'
                          : 'var(--color-text-muted)',
                      fontWeight: state.step === i + 1 ? 600 : 400,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background:
                        state.step > i + 1
                          ? 'var(--color-success)'
                          : 'var(--color-border)',
                      transition: 'background 0.3s',
                      marginBottom: '1.2rem',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div
            className="glass-card"
            style={{ padding: '2rem', overflow: 'hidden' }}
          >
            <AnimatePresence mode="wait">
              {state.step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: 'rgba(99,102,241,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(99,102,241,0.25)',
                      }}
                    >
                      <Sparkles size={18} color="var(--color-accent)" />
                    </div>
                    <div>
                      <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Name your project</h2>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                        Give it a meaningful name and description
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                        Project Name *
                      </label>
                      <input
                        className="input-field"
                        placeholder="e.g. My Awesome App"
                        value={state.name}
                        onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter' && canGoNext()) handleNext() }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                        Description (optional)
                      </label>
                      <textarea
                        className="input-field"
                        placeholder="What does this project do?"
                        value={state.description}
                        onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {state.step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: 'rgba(6,182,212,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(6,182,212,0.25)',
                      }}
                    >
                      <Globe size={18} color="var(--color-accent-3)" />
                    </div>
                    <div>
                      <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Choose Frontend</h2>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                        Pick your UI framework and build tool
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {FRONTEND_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={state.stack.frontend === opt.id}
                        onClick={() => updateStack('frontend', opt.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {state.step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: 'rgba(16,185,129,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(16,185,129,0.25)',
                      }}
                    >
                      <Server size={18} color="var(--color-success)" />
                    </div>
                    <div>
                      <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Backend & Database</h2>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                        Configure your server and data layer
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <p className="section-label" style={{ marginBottom: '0.75rem' }}>
                      Backend Framework
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {BACKEND_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.id}
                          option={opt}
                          selected={state.stack.backend === opt.id}
                          onClick={() => updateStack('backend', opt.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="divider" style={{ marginBottom: '1.25rem' }} />

                  <p className="section-label" style={{ marginBottom: '0.75rem' }}>
                    Database
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '0.6rem',
                    }}
                  >
                    {DATABASE_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={state.stack.database === opt.id}
                        onClick={() => updateStack('database', opt.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                onClick={handleBack}
                disabled={state.step === 1}
                className="btn-secondary"
                style={{ opacity: state.step === 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canGoNext() || loading}
                className="btn-primary"
                style={{ opacity: !canGoNext() || loading ? 0.5 : 1 }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    Creating...
                  </>
                ) : state.step === 3 ? (
                  <>
                    <Zap size={16} />
                    Create Project
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary preview (step 3) */}
          {state.step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <p className="section-label" style={{ marginBottom: '0.25rem' }}>Project</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{state.name}</p>
              </div>
              <div>
                <p className="section-label" style={{ marginBottom: '0.25rem' }}>Frontend</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {FRONTEND_OPTIONS.find((o) => o.id === state.stack.frontend)?.name}
                </p>
              </div>
              <div>
                <p className="section-label" style={{ marginBottom: '0.25rem' }}>Backend</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {BACKEND_OPTIONS.find((o) => o.id === state.stack.backend)?.name}
                </p>
              </div>
              <div>
                <p className="section-label" style={{ marginBottom: '0.25rem' }}>Database</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {DATABASE_OPTIONS.find((o) => o.id === state.stack.database)?.name}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
