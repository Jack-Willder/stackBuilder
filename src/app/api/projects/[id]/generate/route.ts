import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateProject } from '@/lib/codegen'
import { CanvasComponent, StackConfig } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

// POST /api/projects/[id]/generate - generate and return zip
export async function POST(_req: Request, { params }: Params) {
  try {
    const { id } = await params

    // Fetch project with all components
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        components: { orderBy: { position: 'asc' } },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const stack: StackConfig = JSON.parse(project.stack)
    const components: CanvasComponent[] = project.components.map((c) => ({
      id: c.id,
      projectId: c.projectId,
      type: c.type as CanvasComponent['type'],
      label: c.label,
      props: JSON.parse(c.props),
      logic: c.logic ?? undefined,
      position: c.position,
      x: c.x ?? undefined,
      y: c.y ?? undefined,
      width: c.width ?? undefined,
      height: c.height ?? undefined,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }))

    // Generate files
    const files = generateProject(project.name, components, stack)

    // Return as JSON (client will use JSZip to create the zip)
    return NextResponse.json({
      projectName: project.name,
      stack,
      files,
    })
  } catch (error) {
    console.error('POST /api/generate error:', error)
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 })
  }
}
