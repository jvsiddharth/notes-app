// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create tenants
  const acmeTenant = await prisma.tenant.create({
    data: {
      slug: 'acme',
      name: 'Acme Corporation',
      subscription: 'PRO'
    }
  })

  const globexTenant = await prisma.tenant.create({
    data: {
      slug: 'globex',
      name: 'Globex Corporation', 
      subscription: 'FREE'
    }
  })

  console.log('Created tenants:', { acme: acmeTenant.id, globex: globexTenant.id })

  // Create users with hashed passwords
  const hashedPassword = await bcrypt.hash('password', 12)

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'admin@acme.test',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: acmeTenant.id
      },
      {
        email: 'user@acme.test',
        password: hashedPassword,
        role: 'MEMBER',
        tenantId: acmeTenant.id
      },
      {
        email: 'admin@globex.test',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: globexTenant.id
      },
      {
        email: 'user@globex.test',
        password: hashedPassword,
        role: 'MEMBER',
        tenantId: globexTenant.id
      }
    ]
  })

  console.log('Created users:', users.count)
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
