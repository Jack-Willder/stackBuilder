import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/projects - list all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { components: true } },
      },
    })

    const result = projects.map((p) => ({
      ...p,
      stack: JSON.parse(p.stack),
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, stack } = body

    if (!name || !stack) {
      return NextResponse.json({ error: 'Name and stack are required' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        stack: JSON.stringify(stack),
      },
    })

    return NextResponse.json({
      ...project,
      stack: JSON.parse(project.stack),
    })
  } catch (error) {
    console.error('POST /api/projects error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
