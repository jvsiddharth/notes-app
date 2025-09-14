// src/app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    
    const note = await prisma.note.findFirst({
      where: { 
        id: params.id,
        tenantId: user.tenantId // Ensure tenant isolation
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
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    
    return NextResponse.json({ note })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    const { title, content } = await request.json()
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }
    
    // Check if note exists and belongs to user's tenant
    const existingNote = await prisma.note.findFirst({
      where: { 
        id: params.id,
        tenantId: user.tenantId
      }
    })
    
    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    
    const note = await prisma.note.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date()
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
    
    return NextResponse.json({ note })
  } catch (error) {
    console.error('Update note error:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    
    // Check if note exists and belongs to user's tenant
    const existingNote = await prisma.note.findFirst({
      where: { 
        id: params.id,
        tenantId: user.tenantId
      }
    })
    
    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    
    await prisma.note.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Delete note error:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
