import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    )

    const data = await response.json()

    return NextResponse.json({ success: data.success })
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
