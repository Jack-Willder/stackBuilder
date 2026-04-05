import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Params = { params: Promise<{ id: string; componentId: string }> }

// PATCH /api/projects/[id]/components/[componentId] - update component
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { componentId } = await params
    const body = await request.json()
    const { label, props, logic, position, x, y, width, height } = body

    const component = await prisma.component.update({
      where: { id: componentId },
      data: {
        ...(label && { label }),
        ...(props !== undefined && { props: JSON.stringify(props) }),
        ...(logic !== undefined && { logic }),
        ...(position !== undefined && { position }),
        ...(x !== undefined && { x }),
        ...(y !== undefined && { y }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
      },
    })

    return NextResponse.json({ ...component, props: JSON.parse(component.props) })
  } catch (error) {
    console.error('PATCH component error:', error)
    return NextResponse.json({ error: 'Failed to update component' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/components/[componentId] - delete component
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { componentId } = await params
    await prisma.component.delete({ where: { id: componentId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE component error:', error)
    return NextResponse.json({ error: 'Failed to delete component' }, { status: 500 })
  }
}
