// src/app/api/subscription/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    
    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: {
        _count: {
          select: {
            notes: true,
            users: true
          }
        }
      }
    })
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const limits = {
      FREE: { notes: 3, users: 10 },
      PRO: { notes: -1, users: -1 } // -1 means unlimited
    }
    
    const currentLimits = limits[tenant.subscription as keyof typeof limits]
    
    return NextResponse.json({
      subscription: tenant.subscription,
      usage: {
        notes: tenant._count.notes,
        users: tenant._count.users
      },
      limits: currentLimits,
      canUpgrade: tenant.subscription === 'FREE',
      isLimitReached: {
        notes: tenant.subscription === 'FREE' && tenant._count.notes >= 3,
        users: tenant.subscription === 'FREE' && tenant._count.users >= 10
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
