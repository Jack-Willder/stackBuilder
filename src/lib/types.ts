export type StackConfig = {
  frontend: 'react-vite' | 'nextjs' | 'vue-vite'
  backend: 'express' | 'nextjs-api' | 'none'
  database: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | 'none'
}

export type ComponentType =
  | 'Button'
  | 'Input'
  | 'Card'
  | 'Navbar'
  | 'Hero'
  | 'Text'
  | 'Image'
  | 'Form'
  | 'Footer'
  | 'Badge'

export type ComponentProps = {
  text?: string
  placeholder?: string
  color?: string
  backgroundColor?: string
  fontSize?: string
  fontWeight?: string
  padding?: string
  margin?: string
  width?: string
  height?: string
  borderRadius?: string
  borderColor?: string
  borderWidth?: string
  borderStyle?: string
  opacity?: string
  boxShadow?: string
  backdropBlur?: string
  href?: string
  src?: string
  alt?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  align?: 'left' | 'center' | 'right'
  [key: string]: string | undefined
}

export type CanvasComponent = {
  id: string
  projectId: string
  type: ComponentType
  label: string
  props: ComponentProps
  logic?: string
  position: number
  // Free-placement canvas geometry
  x?: number
  y?: number
  width?: number
  height?: number
  createdAt: string
  updatedAt: string
}

export type Project = {
  id: string
  name: string
  description?: string
  stack: StackConfig
  createdAt: string
  updatedAt: string
  canvasHeight?: number
  canvasBackground?: string
  components?: CanvasComponent[]
}

export type WizardState = {
  step: 1 | 2 | 3
  name: string
  description: string
  stack: StackConfig
}
