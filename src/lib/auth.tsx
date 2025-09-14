// src/lib/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET!

export interface JWTPayload {
  userId: string
  email: string
  role: string
  tenantId: string
  tenantSlug: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true }
  })

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new Error('Invalid credentials')
  }

  return {
    user,
    token: signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      tenantSlug: user.tenant.slug
    })
  }
}

// Helper function for API routes to get authenticated user
export async function getAuthUser(request: Request | { headers: { get: (name: string) => string | null } }) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized')
  }
  
  const token = authHeader.substring(7)
  return verifyToken(token)
}
