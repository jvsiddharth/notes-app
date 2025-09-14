// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Use upsert to handle existing tenants
  const acmeTenant = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {
      name: 'Acme Corporation',
      subscription: 'FREE'
    },
    create: {
      slug: 'acme',
      name: 'Acme Corporation',
      subscription: 'FREE'
    }
  })

  const globexTenant = await prisma.tenant.upsert({
    where: { slug: 'globex' },
    update: {
      name: 'Globex Corporation',
      subscription: 'FREE'
    },
    create: {
      slug: 'globex',
      name: 'Globex Corporation',
      subscription: 'FREE'
    }
  })

  console.log('Created/updated tenants:', { acme: acmeTenant.id, globex: globexTenant.id })

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password', 12)

  // Use upsert for users as well
  const acmeAdmin = await prisma.user.upsert({
    where: { email: 'admin@acme.test' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: acmeTenant.id
    },
    create: {
      email: 'admin@acme.test',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: acmeTenant.id
    }
  })

  const acmeUser = await prisma.user.upsert({
    where: { email: 'user@acme.test' },
    update: {
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: acmeTenant.id
    },
    create: {
      email: 'user@acme.test',
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: acmeTenant.id
    }
  })

  const globexAdmin = await prisma.user.upsert({
    where: { email: 'admin@globex.test' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: globexTenant.id
    },
    create: {
      email: 'admin@globex.test',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: globexTenant.id
    }
  })

  const globexUser = await prisma.user.upsert({
    where: { email: 'user@globex.test' },
    update: {
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: globexTenant.id
    },
    create: {
      email: 'user@globex.test',
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: globexTenant.id
    }
  })

  console.log('Created/updated users:', {
    acmeAdmin: acmeAdmin.email,
    acmeUser: acmeUser.email,
    globexAdmin: globexAdmin.email,
    globexUser: globexUser.email
  })

  console.log('Seed completed successfully!')
  console.log('Test accounts available:')
  console.log('- admin@acme.test / password (Admin, Acme Corp)')
  console.log('- user@acme.test / password (Member, Acme Corp)')
  console.log('- admin@globex.test / password (Admin, Globex Corp)')
  console.log('- user@globex.test / password (Member, Globex Corp)')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
