import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** Синхронизация статуса оплаты Kaspi с ApiPay — для случаев когда webhook не пришёл */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { leadId } = await req.json()
    if (!leadId) {
      return NextResponse.json({ error: 'Укажите leadId' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    const order = lead?.orderId
      ? await prisma.order.findUnique({ where: { id: lead.orderId } })
      : null

    if (!order?.apipayInvoiceId) {
      return NextResponse.json(
        { error: 'Заявка не связана с Kaspi или счёт отсутствует' },
        { status: 400 }
      )
    }

    const apiKey = process.env.APIPAY_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'APIPAY_API_KEY не настроен' },
        { status: 500 }
      )
    }

    const res = await fetch(
      `https://bpapi.bazarbay.site/api/v1/invoices/${order.apipayInvoiceId}`,
      {
        headers: { 'X-API-Key': apiKey },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('[SYNC-KASPI] ApiPay error:', res.status, text)
      return NextResponse.json(
        { error: `ApiPay: ${res.status}`, details: text },
        { status: 502 }
      )
    }

    const json = await res.json()
    // ApiPay может вернуть { invoice: {...} } или плоский объект
    const invoice = json.invoice ?? json.data ?? json
    const rawStatus = invoice?.status ?? invoice?.invoice?.status ?? ''
    const status = String(rawStatus).toLowerCase().trim()

    if (!status) {
      console.error('[SYNC-KASPI] No status. invoiceId=', order.apipayInvoiceId, 'response=', JSON.stringify(json).slice(0, 500))
    }

    // refunded, partially_refunded + возможные русские/альтернативные значения
    const isRefund = [
      'refunded', 'partially_refunded',
      'возвращён', 'возвращен', 'частичный возврат',
    ].some((s) => status.includes(s))

    if (isRefund) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'refunded' },
      })
      await prisma.lead.update({
        where: { id: leadId },
        data: { paymentStatus: 'refunded' },
      })
      return NextResponse.json({
        ok: true,
        status: 'refunded',
        message: 'Статус обновлён: Возврат',
        debug: { apipayInvoiceId: order.apipayInvoiceId, rawStatus },
      })
    }

    if (status === 'paid') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'paid' },
      })
      await prisma.lead.update({
        where: { id: leadId },
        data: { paymentStatus: 'paid' },
      })
      return NextResponse.json({
        ok: true,
        status: 'paid',
        message: 'Статус: Оплачено',
      })
    }

    return NextResponse.json({
      ok: true,
      status: status || 'unknown',
      message: status ? `Текущий статус в ApiPay: ${rawStatus}` : 'Статус не определён — проверьте логи Vercel',
      debug: { apipayInvoiceId: order.apipayInvoiceId, rawStatus, keys: json ? Object.keys(json) : [] },
    })
  } catch (error) {
    console.error('[SYNC-KASPI] Error:', error)
    return NextResponse.json(
      { error: 'Ошибка синхронизации' },
      { status: 500 }
    )
  }
}
