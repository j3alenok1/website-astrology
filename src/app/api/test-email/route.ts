import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/**
 * Тестовый endpoint для проверки отправки писем.
 * Работает только в dev-режиме (DISABLE_RECAPTCHA=true).
 * Откройте в браузере: http://localhost:3000/api/test-email
 */
export async function GET() {
  if (process.env.DISABLE_RECAPTCHA !== 'true') {
    return NextResponse.json(
      { error: 'Доступно только в dev-режиме (DISABLE_RECAPTCHA=true)' },
      { status: 403 }
    )
  }

  const to = process.env.SMTP_TO || 'j3alenok@gmail.com'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!user || !pass || pass === 'your-app-password') {
    return NextResponse.json(
      {
        error: 'SMTP не настроен. Добавьте в .env пароль приложения Gmail (SMTP_PASSWORD).',
        hint: 'Пароль приложения: Google Account → Безопасность → 2-Step Verification → App passwords',
      },
      { status: 500 }
    )
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      subject: 'Тест: заявки с сайта приходят на эту почту',
      html: `
        <h2>Проверка отправки</h2>
        <p>Если вы получили это письмо — форма заявок настроена верно.</p>
        <p>Заявки с сайта будут приходить на <strong>${to}</strong>.</p>
        <p><em>Отправлено в ${new Date().toLocaleString('ru-RU')}</em></p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: `Тестовое письмо отправлено на ${to}. Проверьте почту.`,
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        error: 'Ошибка отправки',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
