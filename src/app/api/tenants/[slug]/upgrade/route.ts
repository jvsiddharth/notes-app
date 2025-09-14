// src/app/api/tenants/[slug]/upgrade/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const user = await getAuthUser(request)
    const { slug } = await context.params
    
    // Only admins can upgrade subscriptions
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    // Verify tenant ownership
    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    })
    
    if (!tenant || tenant.id !== user.tenantId) {
      return NextResponse.json({ error: 'Tenant not found or access denied' }, { status: 404 })
    }
    
    if (tenant.subscription === 'PRO') {
      return NextResponse.json({ error: 'Already on Pro plan' }, { status: 400 })
    }
    
    // Upgrade to PRO
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { subscription: 'PRO' }
    })
    
    return NextResponse.json({
      message: 'Successfully upgraded to Pro plan',
      tenant: {
        id: updatedTenant.id,
        slug: updatedTenant.slug,
        name: updatedTenant.name,
        subscription: updatedTenant.subscription
      }
    })
  } catch (_error) {
    console.error('Upgrade error:', _error)
    return NextResponse.json({ error: 'Failed to upgrade subscription' }, { status: 500 })
  }
}

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
