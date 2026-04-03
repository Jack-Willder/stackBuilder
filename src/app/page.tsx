'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Zap,
  Code2,
  Database,
  Download,
  Plus,
  Trash2,
  Clock,
  Package,
  Server,
  Globe,
  ChevronRight,
  Sparkles,
  Box,
  GitBranch,
} from 'lucide-react'
import { Project } from '@/lib/types'

const STACK_LABELS: Record<string, string> = {
  'react-vite': 'React + Vite',
  nextjs: 'Next.js',
  'vue-vite': 'Vue + Vite',
  express: 'Express',
  'nextjs-api': 'Next.js API',
  none: 'None',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
  mongodb: 'MongoDB',
}

const STACK_COLORS: Record<string, string> = {
  'react-vite': 'badge-cyan',
  nextjs: 'badge-indigo',
  'vue-vite': 'badge-green',
  express: 'badge-orange',
  'nextjs-api': 'badge-purple',
  postgresql: 'badge-indigo',
  mysql: 'badge-orange',
  sqlite: 'badge-green',
  mongodb: 'badge-green',
  none: 'badge-indigo',
}

const FEATURES = [
  {
    icon: Layers,
    title: 'Foundation Wizard',
    desc: 'Pick your stack in seconds — React, Next.js, Vue, Express. Zero config boilerplate ready instantly.',
    color: '#6366f1',
  },
  {
    icon: Box,
    title: 'Visual Canvas',
    desc: 'Drag components onto a live-preview grid canvas. Everything you see is exactly what gets generated.',
    color: '#8b5cf6',
  },
  {
    icon: Code2,
    title: 'Logic Editor',
    desc: 'Inject custom JavaScript or TypeScript directly into components with an embedded Monaco editor.',
    color: '#06b6d4',
  },
  {
    icon: Database,
    title: 'Database Config',
    desc: 'Choose PostgreSQL, MySQL, SQLite or MongoDB. Get instantly connected boilerplate and schemas.',
    color: '#10b981',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    desc: 'One click. Get a production-ready ZIP with correct folder structure, types, and configs.',
    color: '#f59e0b',
  },
  {
    icon: GitBranch,
    title: 'Project History',
    desc: 'All your projects, stacks, and components are persisted and instantly accessible.',
    color: '#ec4899',
  },
]

export default function Home() {
  const [projects, setProjects] = useState<(Project & { _count?: { components: number } })[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this project?')) return
    setDeleting(id)
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Nav */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
            }}
          >
            <Layers size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Stack<span style={{ color: 'var(--color-accent)' }}>Builder</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              padding: '0.25rem 0.75rem',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 999,
              border: '1px solid var(--color-border)',
            }}
          >
            v1.0.0 — Prototype
          </span>
          <Link href="/projects/new" className="btn-primary">
            <Plus size={16} />
            New Project
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: 'center',
          padding: '5rem 2rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: 999,
              border: '1px solid rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.08)',
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              color: '#818cf8',
              fontWeight: 600,
            }}
          >
            <Sparkles size={12} />
            Visual Full-Stack Development Environment
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Build full-stack apps{' '}
            <span className="gradient-text">visually.</span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              maxWidth: 600,
              margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}
          >
            Design your UI on a professional canvas, configure your stack, inject custom logic,
            and download production-ready boilerplate in seconds.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/projects/new" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
              <Zap size={18} />
              Start Building Free
            </Link>
            <a href="#projects" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
              View Projects
              <ChevronRight size={16} />
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            marginTop: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Stack Options', value: '6+' },
            { label: 'Components', value: '9+' },
            { label: 'Code Templates', value: '3' },
            { label: 'Your Projects', value: loading ? '...' : projects.length.toString() },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '2rem 2rem 4rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>Three Pillars</p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Everything you need to ship fast
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card"
              style={{ padding: '1.5rem' }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${feature.color}20`,
                  marginBottom: '1rem',
                  border: `1px solid ${feature.color}30`,
                }}
              >
                <feature.icon size={20} color={feature.color} />
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects section */}
      <section id="projects" style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: '0.25rem' }}>Your Workspace</p>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Recent Projects</h2>
          </div>
          <Link href="/projects/new" className="btn-primary">
            <Plus size={15} />
            New Project
          </Link>
        </div>

        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card"
                style={{
                  height: 180,
                  background:
                    'linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface-2) 50%, var(--color-surface) 100%)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 1.5s linear infinite',
                }}
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              border: '2px dashed var(--color-border)',
              borderRadius: 16,
            }}
          >
            <Package size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No projects yet</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Create your first project to get started
            </p>
            <Link href="/projects/new" className="btn-primary">
              <Plus size={16} />
              Create First Project
            </Link>
          </motion.div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            <AnimatePresence>
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/projects/${project.id}/canvas`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="card"
                      style={{
                        padding: '1.5rem',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Top accent bar */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '1rem',
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(99,102,241,0.2)',
                          }}
                        >
                          <Globe size={18} color="#818cf8" />
                        </div>

                        <button
                          onClick={(e) => handleDelete(e, project.id)}
                          disabled={deleting === project.id}
                          style={{
                            padding: '0.375rem',
                            borderRadius: 7,
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex',
                          }}
                          onMouseEnter={(e) => ((e.currentTarget.style.color = '#f87171'), (e.currentTarget.style.background = 'rgba(239,68,68,0.1)'))}
                          onMouseLeave={(e) => ((e.currentTarget.style.color = 'var(--color-text-muted)'), (e.currentTarget.style.background = 'transparent'))}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h3
                        style={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          marginBottom: '0.25rem',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {project.name}
                      </h3>
                      {project.description && (
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '1rem',
                            lineHeight: 1.5,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {project.description}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.375rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <span className={`badge ${STACK_COLORS[project.stack.frontend]}`}>
                          <Globe size={10} style={{ marginRight: 3 }} />
                          {STACK_LABELS[project.stack.frontend]}
                        </span>
                        {project.stack.backend !== 'none' && (
                          <span className={`badge ${STACK_COLORS[project.stack.backend]}`}>
                            <Server size={10} style={{ marginRight: 3 }} />
                            {STACK_LABELS[project.stack.backend]}
                          </span>
                        )}
                        {project.stack.database !== 'none' && (
                          <span className={`badge ${STACK_COLORS[project.stack.database]}`}>
                            <Database size={10} style={{ marginRight: 3 }} />
                            {STACK_LABELS[project.stack.database]}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Box size={12} />
                          {(project as { _count?: { components: number } })._count?.components ?? 0} components
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={12} />
                          {formatDate(project.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.8rem',
          marginTop: '3rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Layers size={14} color="var(--color-accent)" />
          <span>StackBuilder</span>
        </div>
        <p>Built with Next.js 15, Prisma, Monaco Editor, and dnd-kit</p>
      </footer>
    </div>
  )
}
