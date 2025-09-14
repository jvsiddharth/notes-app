// src/app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    
    const notes = await prisma.note.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true
      }
    })
    
    return NextResponse.json({ notes })
  } catch (_error) {
    console.error('Get notes error:', _error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    const { title, content } = await request.json()
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }
    
    // Check subscription limits
    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: { _count: { select: { notes: true } } }
    })
    
    if (tenant?.subscription === 'FREE' && tenant._count.notes >= 3) {
      return NextResponse.json({ 
        error: 'Note limit reached. Upgrade to Pro for unlimited notes.',
        code: 'LIMIT_REACHED'
      }, { status: 403 })
    }
    
    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        tenantId: user.tenantId,
        userId: user.userId
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true
      }
    })
    
    return NextResponse.json({ note }, { status: 201 })
  } catch (_error) {
    console.error('Create note error:', _error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
