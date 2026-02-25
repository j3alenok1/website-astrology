/**
 * Точечная очистка базы.
 * Запуск: npx tsx prisma/clean.ts [команда] [аргументы]
 *
 * Команды:
 *   list                    — показать количество записей
 *   delete-lead <id>        — удалить заявку по ID
 *   delete-leads-before <YYYY-MM-DD> — удалить заявки до даты
 *   delete-order <id>       — удалить заказ по ID
 *   delete-test             — удалить тестовые заявки (name содержит "test" или "тест")
 *   delete-all-leads        — удалить ВСЕ заявки (осторожно!)
 *   delete-all-orders       — удалить ВСЕ заказы (осторожно!)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const [cmd, arg] = process.argv.slice(2)

  switch (cmd) {
    case 'list': {
      const [leads, orders] = await Promise.all([
        prisma.lead.count(),
        prisma.order.count(),
      ])
      console.log(`Заявок (Lead): ${leads}`)
      console.log(`Заказов (Order): ${orders}`)
      break
    }

    case 'delete-lead': {
      if (!arg) {
        console.error('Укажите ID: npx tsx prisma/clean.ts delete-lead <id>')
        process.exit(1)
      }
      const deleted = await prisma.lead.delete({ where: { id: arg } })
      console.log('Удалена заявка:', deleted.id, deleted.name)
      break
    }

    case 'delete-leads-before': {
      if (!arg) {
        console.error('Укажите дату: npx tsx prisma/clean.ts delete-leads-before 2025-01-01')
        process.exit(1)
      }
      const before = new Date(arg)
      const result = await prisma.lead.deleteMany({
        where: { createdAt: { lt: before } },
      })
      console.log(`Удалено заявок: ${result.count}`)
      break
    }

    case 'delete-order': {
      if (!arg) {
        console.error('Укажите ID: npx tsx prisma/clean.ts delete-order <id>')
        process.exit(1)
      }
      const deleted = await prisma.order.delete({ where: { id: arg } })
      console.log('Удалён заказ:', deleted.id)
      break
    }

    case 'delete-test': {
      const result = await prisma.lead.deleteMany({
        where: {
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { name: { contains: 'тест', mode: 'insensitive' } },
            { contact: { contains: '999' } },
          ],
        },
      })
      console.log(`Удалено тестовых заявок: ${result.count}`)
      break
    }

    case 'delete-all-leads': {
      const result = await prisma.lead.deleteMany({})
      console.log(`Удалено заявок: ${result.count}`)
      break
    }

    case 'delete-all-orders': {
      const result = await prisma.order.deleteMany({})
      console.log(`Удалено заказов: ${result.count}`)
      break
    }

    default:
      console.log(`
Точечная очистка базы.

Команды:
  npx tsx prisma/clean.ts list
  npx tsx prisma/clean.ts delete-lead <id>
  npx tsx prisma/clean.ts delete-leads-before 2025-01-01
  npx tsx prisma/clean.ts delete-order <id>
  npx tsx prisma/clean.ts delete-test
  npx tsx prisma/clean.ts delete-all-leads
  npx tsx prisma/clean.ts delete-all-orders

Или откройте Prisma Studio для визуального управления:
  npm run db:studio
`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
