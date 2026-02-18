import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function toISODate(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

const statusLabels: Record<string, string> = {
  new: 'Новая',
  contacted: 'Связались',
  completed: 'Завершена',
  archived: 'Архив',
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'ID',
      'Имя',
      'Дата рождения',
      'Время рождения',
      'Город проживания',
      'Город рождения',
      'Контакты',
      'Запрос',
      'Статус',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Дата создания',
    ]

    const rows = leads.map((lead) => [
      lead.id,
      lead.name,
      toISODate(lead.birthDate),
      lead.birthTime || '',
      lead.city,
      lead.birthCity || '',
      lead.contact,
      (lead.request || '').replace(/"/g, '""'),
      statusLabels[lead.status] || lead.status,
      lead.utmSource || '',
      lead.utmMedium || '',
      lead.utmCampaign || '',
      toISODate(lead.createdAt),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell)}"`).join(',')),
    ].join('\r\n')

    const BOM = '\uFEFF'
    const body = BOM + csv

    return new NextResponse(body, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting leads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
