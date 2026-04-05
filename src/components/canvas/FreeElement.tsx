'use client'

import { useRef, useCallback, useEffect } from 'react'
import { Trash2, Code2, GripVertical } from 'lucide-react'
import { useCanvasStore } from '@/lib/store'
import { CanvasComponent } from '@/lib/types'
import CanvasPreview from './CanvasPreview'

const HANDLE_SIZE = 8
const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const
type Handle = typeof HANDLES[number]

const HANDLE_CURSORS: Record<Handle, string> = {
  nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
  e: 'e-resize', se: 'se-resize', s: 's-resize',
  sw: 'sw-resize', w: 'w-resize',
}

const HANDLE_POS: Record<Handle, { top?: string; bottom?: string; left?: string; right?: string; transform?: string }> = {
  nw: { top: '0', left: '0', transform: 'translate(-50%,-50%)' },
  n:  { top: '0', left: '50%', transform: 'translate(-50%,-50%)' },
  ne: { top: '0', right: '0', transform: 'translate(50%,-50%)' },
  e:  { top: '50%', right: '0', transform: 'translate(50%,-50%)' },
  se: { bottom: '0', right: '0', transform: 'translate(50%,50%)' },
  s:  { bottom: '0', left: '50%', transform: 'translate(-50%,50%)' },
  sw: { bottom: '0', left: '0', transform: 'translate(-50%,50%)' },
  w:  { top: '50%', left: '0', transform: 'translate(-50%,-50%)' },
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

export default function FreeElement({
  component,
  isSelected,
  onSelect,
  onDelete,
  onLogic,
  canvasWidth,
  canvasHeight,
  onGeometryChange,
  aspectRatioLocked,
}: {
  component: CanvasComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onLogic: () => void
  canvasWidth: number
  canvasHeight: number
  onGeometryChange: (id: string, geo: { x?: number; y?: number; width?: number; height?: number }) => void
  aspectRatioLocked: boolean
}) {
  const x = component.x ?? 40
  const y = component.y ?? 40
  const width = component.width ?? 320
  const height = component.height ?? 120

  const dragState = useRef<{
    startX: number; startY: number
    startElemX: number; startElemY: number
  } | null>(null)

  const resizeState = useRef<{
    handle: Handle
    startX: number; startY: number
    startElemX: number; startElemY: number
    startW: number; startH: number
    ratio: number
  } | null>(null)

  // Move drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return
    e.stopPropagation()
    onSelect()
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startElemX: x,
      startElemY: y,
    }

    const onMove = (me: MouseEvent) => {
      if (!dragState.current) return
      const nx = clamp(dragState.current.startElemX + (me.clientX - dragState.current.startX), 0, canvasWidth - width)
      const ny = clamp(dragState.current.startElemY + (me.clientY - dragState.current.startY), 0, canvasHeight - height)
      onGeometryChange(component.id, { x: nx, y: ny })
    }
    const onUp = () => {
      dragState.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [x, y, width, height, canvasWidth, canvasHeight, component.id, onSelect, onGeometryChange])

  // Resize
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: Handle) => {
    e.stopPropagation()
    e.preventDefault()
    resizeState.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startElemX: x,
      startElemY: y,
      startW: width,
      startH: height,
      ratio: width / height,
    }

    const onMove = (me: MouseEvent) => {
      if (!resizeState.current) return
      const { handle: h, startX, startY, startElemX, startElemY, startW, startH, ratio } = resizeState.current
      const dx = me.clientX - startX
      const dy = me.clientY - startY
      let nx = startElemX, ny = startElemY, nw = startW, nh = startH

      if (h.includes('e')) nw = Math.max(80, startW + dx)
      if (h.includes('w')) { nw = Math.max(80, startW - dx); nx = startElemX + (startW - nw) }
      if (h.includes('s')) nh = Math.max(40, startH + dy)
      if (h.includes('n')) { nh = Math.max(40, startH - dy); ny = startElemY + (startH - nh) }

      if (aspectRatioLocked) {
        if (h.includes('e') || h.includes('w')) { nh = nw / ratio; if (h.includes('n')) ny = startElemY + (startH - nh) }
        else if (h.includes('n') || h.includes('s')) { nw = nh * ratio; if (h.includes('w')) nx = startElemX + (startW - nw) }
      }

      nx = clamp(nx, 0, canvasWidth - 40)
      ny = clamp(ny, 0, canvasHeight - 20)
      nw = Math.min(nw, canvasWidth - nx)
      nh = Math.min(nh, canvasHeight - ny)

      onGeometryChange(component.id, { x: nx, y: ny, width: nw, height: nh })
    }
    const onUp = () => {
      resizeState.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [x, y, width, height, canvasWidth, canvasHeight, component.id, aspectRatioLocked, onGeometryChange])

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        boxSizing: 'border-box',
        border: isSelected ? '2px solid #6366f1' : '1px solid transparent',
        borderRadius: 6,
        cursor: 'move',
        userSelect: 'none',
        outline: isSelected ? 'none' : undefined,
        transition: 'border-color 0.15s',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      {/* Top label bar when selected */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -26,
            left: -2,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '0 6px',
            background: '#6366f1',
            borderRadius: '5px 5px 0 0',
            zIndex: 20,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <GripVertical size={11} color="rgba(255,255,255,0.7)" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {component.type}
          </span>
        </div>
      )}

      {/* Action buttons when selected */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -26,
            right: -2,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '0 4px',
            background: '#6366f1',
            borderRadius: '5px 5px 0 0',
            zIndex: 20,
          }}
        >
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onLogic() }}
            style={{
              width: 20, height: 20, border: 'none', borderRadius: 3,
              background: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}
          >
            <Code2 size={11} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            style={{
              width: 20, height: 20, border: 'none', borderRadius: 3,
              background: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}

      {/* Component content */}
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          borderRadius: 4,
        }}
      >
        <CanvasPreview component={component} />
      </div>

      {/* Resize handles */}
      {isSelected && HANDLES.map((handle) => (
        <div
          key={handle}
          data-handle={handle}
          onMouseDown={(e) => handleResizeMouseDown(e, handle)}
          style={{
            position: 'absolute',
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            background: '#fff',
            border: '2px solid #6366f1',
            borderRadius: 2,
            cursor: HANDLE_CURSORS[handle],
            zIndex: 30,
            ...HANDLE_POS[handle],
          }}
        />
      ))}
    </div>
  )
}
