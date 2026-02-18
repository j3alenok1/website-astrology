import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import nodemailer from 'nodemailer'

function isValidBirthDate(val: string): boolean {
  if (!val) return false
  const match = val.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return false
  const [, year, month, day] = match
  const yearNum = parseInt(year, 10)
  const monthNum = parseInt(month, 10)
  const dayNum = parseInt(day, 10)
  if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false
  if (monthNum < 1 || monthNum > 12) return false
  const d = new Date(val)
  if (isNaN(d.getTime())) return false
  if (d.getFullYear() !== yearNum || d.getMonth() + 1 !== monthNum || d.getDate() !== dayNum) return false
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return d <= today
}

const leadSchema = z.object({
  name: z.string().min(2),
  birthDate: z.string().min(1).refine(isValidBirthDate, 'Некорректная дата рождения'),
  birthTime: z.string().optional(),
  city: z.string().min(2),
  birthCity: z.string().min(2).optional(),
  contact: z.string().min(5),
  request: z.string().max(1500).optional(),
  consent: z.boolean(),
  productSlug: z.string().optional(),
  productTitle: z.string().optional(),
  amount: z.number().int().nonnegative().optional(),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
  utmTerm: z.string().nullable().optional(),
  utmContent: z.string().nullable().optional(),
})

// Rate limiting (simple in-memory store, use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // requests per 15 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

async function sendEmailNotification(leadData: z.infer<typeof leadSchema>) {
  const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  }

  if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.error('[LEADS] SMTP не настроен: добавьте SMTP_HOST, SMTP_USER, SMTP_PASSWORD в переменные окружения Vercel')
    return
  }

  try {
    const transporter = nodemailer.createTransport(smtpConfig)
    await transporter.verify()

    const requestText = (leadData.request ?? '').replace(/\n/g, '<br>') || '—'
    const [y, m, d] = (leadData.birthDate || '').split('-')
    const birthDateFormatted = y && m && d ? `${d}.${m}.${y}` : leadData.birthDate

    await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: process.env.SMTP_TO || smtpConfig.auth.user,
      subject: `✨ Новая заявка от ${leadData.name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; line-height: 1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #1e1b4b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(88, 28, 135, 0.3);">
          <tr>
            <td style="background-color: #7c3aed; padding: 24px 32px; text-align: center;">
              <h1 style="margin:0; color: #fff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                ✨ Новая заявка на консультацию
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${leadData.name}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 16px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Имя</td></tr>
                      <tr><td style="padding: 0 0 8px; color: #fff; font-size: 16px; font-weight: 500;">${leadData.name}</td></tr>
                      <tr><td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Дата рождения</td></tr>
                      <tr><td style="padding: 0 0 8px; color: #fff; font-size: 16px;">${birthDateFormatted}${leadData.birthTime ? ` в ${leadData.birthTime}` : ''}</td></tr>
                      <tr><td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Город проживания</td></tr>
                      <tr><td style="padding: 0 0 8px; color: #fff; font-size: 16px;">${leadData.city}</td></tr>
                      ${leadData.birthCity ? `<tr><td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Город рождения</td></tr><tr><td style="padding: 0 0 8px; color: #fff; font-size: 16px;">${leadData.birthCity}</td></tr>` : ''}
                      <tr><td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Контакты</td></tr>
                      <tr><td style="padding: 0; color: #fff; font-size: 16px; font-weight: 600;">${leadData.contact}</td></tr>
                      ${leadData.productTitle ? `<tr><td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Выбранный продукт</td></tr><tr><td style="padding: 0; color: #fff; font-size: 16px;">${leadData.productTitle}${leadData.amount ? ` · ${(leadData.amount / 100).toLocaleString('ru-KZ')} ₸` : ''}</td></tr>` : ''}
                      <tr><td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Статус оплаты</td></tr>
                      <tr><td style="padding: 0; color: #fbbf24; font-size: 16px; font-weight: 600;">Не оплачено</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 8px; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Запрос</p>
                    <p style="margin: 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">${requestText}</p>
                  </td>
                </tr>
              </table>
              ${(leadData.utmSource || leadData.utmMedium || leadData.utmCampaign) ? `
              <p style="margin: 20px 0 0; color: #94a3b8; font-size: 12px;">
                ${leadData.utmSource ? `Source: ${leadData.utmSource} · ` : ''}
                ${leadData.utmMedium ? `Medium: ${leadData.utmMedium} · ` : ''}
                ${leadData.utmCampaign ? `Campaign: ${leadData.utmCampaign}` : ''}
              </p>
              ` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 32px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">Заявка с сайта · ${new Date().toLocaleString('ru-RU')}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[LEADS] Ошибка отправки email:', msg)
    if (error instanceof Error && 'code' in error) {
      console.error('[LEADS] Код ошибки:', (error as { code?: string }).code)
    }
  }
}

async function sendToGoogleSheets(leadData: z.infer<typeof leadSchema>) {
  // Placeholder for Google Sheets integration
  // Implement using googleapis library
  if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) return

  try {
    // Implementation would go here
    console.log('Google Sheets integration not fully implemented')
  } catch (error) {
    console.error('Google Sheets error:', error)
  }
}

async function sendToCRM(leadData: z.infer<typeof leadSchema>) {
  const webhookUrl = process.env.CRM_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    })

    if (!response.ok) {
      console.error('CRM webhook error:', response.statusText)
    }
  } catch (error) {
    console.error('CRM webhook error:', error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const disableRecaptcha = process.env.DISABLE_RECAPTCHA === 'true'

    // Rate limiting
    const rateLimitKey = getRateLimitKey(req)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      )
    }

    // Verify reCAPTCHA
    const body = await req.json()
    const recaptchaToken = body.recaptchaToken

    if (!disableRecaptcha) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: 'Требуется проверка reCAPTCHA' },
          { status: 400 }
        )
      }
      if (!process.env.RECAPTCHA_SECRET_KEY) {
        return NextResponse.json(
          { error: 'reCAPTCHA не настроена на сервере' },
          { status: 500 }
        )
      }

      const recaptchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        }
      )

      const recaptchaData = await recaptchaResponse.json()
      if (!recaptchaData.success) {
        return NextResponse.json(
          { error: 'Ошибка проверки reCAPTCHA' },
          { status: 400 }
        )
      }
    }

    // Validate data (поддержка utm_source и utmSource)
    const validatedData = leadSchema.parse({
      name: body.name,
      birthDate: body.birthDate,
      birthTime: body.birthTime,
      city: body.city,
      birthCity: body.birthCity,
      contact: body.contact,
      request: body.request,
      consent: body.consent,
      productSlug: body.productSlug,
      productTitle: body.productTitle,
      amount: body.amount,
      utmSource: body.utmSource ?? body.utm_source,
      utmMedium: body.utmMedium ?? body.utm_medium,
      utmCampaign: body.utmCampaign ?? body.utm_campaign,
      utmTerm: body.utmTerm ?? body.utm_term,
      utmContent: body.utmContent ?? body.utm_content,
    })

    if (!validatedData.consent) {
      return NextResponse.json(
        { error: 'Необходимо согласие на обработку данных' },
        { status: 400 }
      )
    }

    // Get additional metadata
    const userAgent = req.headers.get('user-agent') || undefined
    const referrer = req.headers.get('referer') || undefined

    let leadId: string | null = null

    // Save to database (только если DATABASE_URL настроен)
    if (process.env.DATABASE_URL) {
      try {
        const lead = await prisma.lead.create({
          data: {
            name: validatedData.name,
            birthDate: new Date(validatedData.birthDate),
            birthTime: validatedData.birthTime,
            city: validatedData.city,
            birthCity: validatedData.birthCity,
            contact: validatedData.contact,
            request: validatedData.request ?? '',
            consent: validatedData.consent,
            productSlug: validatedData.productSlug,
            productTitle: validatedData.productTitle,
            amount: validatedData.amount,
            utmSource: validatedData.utmSource,
            utmMedium: validatedData.utmMedium,
            utmCampaign: validatedData.utmCampaign,
            utmTerm: validatedData.utmTerm,
            utmContent: validatedData.utmContent,
            userAgent,
            referrer,
            ipAddress: getRateLimitKey(req),
          },
        })
        leadId = lead.id
      } catch (dbError) {
        console.error('[LEADS] Ошибка сохранения в БД:', dbError)
      }
    }

    // Отправляем уведомления (email — всегда, даже без БД)
    try {
      await Promise.all([
        sendEmailNotification(validatedData),
        sendToGoogleSheets(validatedData),
        sendToCRM(validatedData),
      ])
    } catch (notifyErr) {
      console.error('[LEADS] Ошибка отправки уведомлений:', notifyErr)
    }

    return NextResponse.json({ success: true, id: leadId }, { status: 201 })
  } catch (error) {
    console.error('Lead creation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации данных', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
