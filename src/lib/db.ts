// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database health check function
export async function checkDatabaseHealth(): Promise<{ status: string; database: string }> {
  try {
    // Simple query to test database connection
    await prisma.$queryRaw`SELECT 1`
    return {
      status: 'healthy',
      database: 'connected'
    }
  } catch (error) {
    console.error('Database health check failed:', error)
    return {
      status: 'unhealthy',
      database: 'disconnected'
    }
  }
}
