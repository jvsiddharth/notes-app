// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    
    // Only admins can view all users
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    const users = await prisma.user.findMany({
      where: { tenantId: user.tenantId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ users })
  } catch (_error) {
    console.error('Get users error:', _error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    
    // Only admins can invite users
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    const { email, role = 'MEMBER' } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    
    // Check subscription limits
    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: { _count: { select: { users: true } } }
    })
    
    if (tenant?.subscription === 'FREE' && tenant._count.users >= 10) {
      return NextResponse.json({ 
        error: 'User limit reached. Upgrade to Pro for unlimited users.',
        code: 'LIMIT_REACHED'
      }, { status: 403 })
    }
    
    // Generate temporary password (in real app, send email invitation)
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await hashPassword(tempPassword)
    
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        tenantId: user.tenantId
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      message: 'User created successfully',
      user: newUser,
      tempPassword // In real app, this would be sent via email
    }, { status: 201 })
  } catch (_error) {
    console.error('Create user error:', _error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
