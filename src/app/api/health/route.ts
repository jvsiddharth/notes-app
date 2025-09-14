// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db'

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth()
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        status: 'unhealthy',
        database: 'disconnected'
      },
      error: 'Database connection failed'
    }, { status: 500 })
  }
}

// Enable CORS for all HTTP methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
