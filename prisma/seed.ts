import { config } from 'dotenv'
import { existsSync } from 'fs'
import { resolve } from 'path'

// Сначала .env.local (Vercel), иначе .env
const envLocal = resolve(process.cwd(), '.env.local')
const envFile = resolve(process.cwd(), '.env')
if (existsSync(envLocal)) {
  config({ path: envLocal })
} else if (existsSync(envFile)) {
  config({ path: envFile })
}

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
  console.error('Ошибка: DATABASE_URL не настроен или указывает на localhost.')
  console.error('Выполните: vercel env pull .env.local')
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
    },
  })

  console.log('Admin user created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
