// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized')
  }
  
  const token = authHeader.substring(7)
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const tokenPayload = await getAuthUser(request)
    
    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
      include: { tenant: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant.id,
          slug: user.tenant.slug,
          name: user.tenant.name,
          subscription: user.tenant.subscription
        }
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

// Enable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
