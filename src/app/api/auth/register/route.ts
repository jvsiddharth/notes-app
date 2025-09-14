// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, tenantSlug, role = 'MEMBER' } = await request.json()
    
    // Validate input
    if (!email || !password || !tenantSlug) {
      return NextResponse.json(
        { error: 'Email, password, and tenant are required' }, 
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' }, 
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' }, 
        { status: 409 }
      )
    }

    // Find tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Invalid tenant' }, 
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        tenantId: tenant.id
      },
      include: {
        tenant: true
      }
    })

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      tenantSlug: tenant.slug
    })

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant: {
          id: tenant.id,
          slug: tenant.slug,
          name: tenant.name,
          subscription: tenant.subscription
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' }, 
      { status: 500 }
    )
  }
}

// Enable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
