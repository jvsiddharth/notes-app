// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  // In JWT-based auth, logout is mainly client-side
  // Server can optionally maintain a blacklist of tokens
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
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
