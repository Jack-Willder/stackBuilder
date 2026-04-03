import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

// GET /api/projects/[id]/components - list components
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params
    const components = await prisma.component.findMany({
      where: { projectId: id },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json(
      components.map((c) => ({ ...c, props: JSON.parse(c.props) }))
    )
  } catch (error) {
    console.error('GET components error:', error)
    return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 })
  }
}

// POST /api/projects/[id]/components - add component
export async function POST(request: Request, { params }: Params) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    const { type, label, props, logic, position } = body

    const component = await prisma.component.create({
      data: {
        projectId,
        type,
        label,
        props: JSON.stringify(props || {}),
        logic: logic || null,
        position: position ?? 0,
      },
    })

    // Update project updatedAt
    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ ...component, props: JSON.parse(component.props) })
  } catch (error) {
    console.error('POST component error:', error)
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 })
  }
}

// PUT /api/projects/[id]/components - bulk update (reorder)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    const { components } = body

    // Update each component's position
    await Promise.all(
      components.map((c: { id: string; position: number }) =>
        prisma.component.update({
          where: { id: c.id },
          data: { position: c.position },
        })
      )
    )

    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT components (reorder) error:', error)
    return NextResponse.json({ error: 'Failed to reorder components' }, { status: 500 })
  }
}
