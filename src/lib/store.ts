import { create } from 'zustand'
import { CanvasComponent, ComponentProps, Project, StackConfig } from './types'

type GeometryUpdate = {
  x?: number
  y?: number
  width?: number
  height?: number
}

type CanvasStore = {
  project: Project | null
  components: CanvasComponent[]
  selectedId: string | null
  logicEditorOpen: boolean
  logicEditorTarget: string | null
  canvasHeight: number

  setProject: (project: Project) => void
  setComponents: (components: CanvasComponent[]) => void
  addComponent: (component: CanvasComponent) => void
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void
  updateComponentProps: (id: string, props: Partial<ComponentProps>) => void
  updateComponentGeometry: (id: string, geometry: GeometryUpdate) => void
  removeComponent: (id: string) => void
  reorderComponents: (from: number, to: number) => void
  selectComponent: (id: string | null) => void
  openLogicEditor: (id: string) => void
  closeLogicEditor: () => void
  saveLogic: (id: string, logic: string) => void
  updateProjectStack: (stack: StackConfig) => void
  setCanvasHeight: (height: number) => void
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  project: null,
  components: [],
  selectedId: null,
  logicEditorOpen: false,
  logicEditorTarget: null,
  canvasHeight: 900,

  setProject: (project) => set({ project }),
  setComponents: (components) => set({ components }),

  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),

  updateComponent: (id, updates) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  updateComponentProps: (id, props) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, ...props } } : c
      ),
    })),

  updateComponentGeometry: (id, geometry) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...geometry } : c
      ),
    })),

  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  reorderComponents: (from, to) =>
    set((state) => {
      const newComponents = [...state.components]
      const [removed] = newComponents.splice(from, 1)
      newComponents.splice(to, 0, removed)
      return {
        components: newComponents.map((c, i) => ({ ...c, position: i })),
      }
    }),

  selectComponent: (id) => set({ selectedId: id }),

  openLogicEditor: (id) =>
    set({ logicEditorOpen: true, logicEditorTarget: id }),

  closeLogicEditor: () =>
    set({ logicEditorOpen: false, logicEditorTarget: null }),

  saveLogic: (id, logic) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, logic } : c
      ),
    })),

  updateProjectStack: (stack) =>
    set((state) => ({
      project: state.project ? { ...state.project, stack } : null,
    })),

  setCanvasHeight: (height) => set({ canvasHeight: height }),
}))
