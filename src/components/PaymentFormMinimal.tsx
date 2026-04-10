'use client'

import { useState, useEffect, createElement } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'
import Script from 'next/script'
import { motion } from 'framer-motion'
import { getUTMParams, formatPhoneMask, isValidPhone, reachMetrikaGoal } from '@/lib/utils'
import { getProductBySlug } from '@/lib/products'
import { SITE_PAYMENTS_DISABLED } from '@/lib/site-payments'

const minimalSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  contact: z
    .string()
    .min(1, 'Укажите номер телефона')
    .refine(isValidPhone, 'Введите корректный номер: +7 (XXX) XXX-XX-XX'),
  consent: z.boolean().refine((val) => val === true, 'Необходимо согласие на обработку данных'),
})

type MinimalFormData = z.infer<typeof minimalSchema>

interface PaymentFormMinimalProps {
  productSlug: string
}

const buyButtonId = process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

export function PaymentFormMinimal({ productSlug }: PaymentFormMinimalProps) {
  const selectedProduct = getProductBySlug(productSlug)

  const disableRecaptcha = process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true'
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  const isRecaptchaActive = !disableRecaptcha && !!siteKey

  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [utmParams, setUtmParams] = useState<Record<string, string | null>>({})
  const [orderIdForCheckout, setOrderIdForCheckout] = useState<string | null>(null)
  const [stripeBuyScriptReady, setStripeBuyScriptReady] = useState(false)

  useEffect(() => {
    setUtmParams(getUTMParams())
  }, [])

  useEffect(() => {
    if (!orderIdForCheckout) setStripeBuyScriptReady(false)
  }, [orderIdForCheckout])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MinimalFormData>({
    resolver: zodResolver(minimalSchema),
    defaultValues: { contact: '', consent: false },
  })

  if (!selectedProduct) return null

  if (SITE_PAYMENTS_DISABLED) {
    return (
      <section id="payment" className="relative py-20 px-4 z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold gradient-text mb-2">Оплата временно недоступна</h2>
            <p className="text-gray-300 text-sm">
              Онлайн-оплата на сайте отключена. Если нужен календарь — напишите нам в мессенджер или на почту.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              {selectedProduct.title} — {selectedProduct.price}
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  const onSubmit = async (data: MinimalFormData) => {
    if (isRecaptchaActive && !recaptchaValue) {
      setSubmitStatus('error')
      setPaymentError('Пройдите проверку reCAPTCHA')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setPaymentError(null)
    setOrderIdForCheckout(null)

    if (productSlug === 'astrologiya-otnosheniy') {
      reachMetrikaGoal('metodichka_pay_click')
    }

    try {
      const response = await fetch('/api/payments/stripe-prepare-digital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: selectedProduct.slug,
          productTitle: selectedProduct.title,
          amount: selectedProduct.amountTiyin,
          name: data.name,
          contact: data.contact,
          consent: data.consent,
          recaptchaToken: isRecaptchaActive ? recaptchaValue : undefined,
          utmSource: utmParams.utm_source,
          utmMedium: utmParams.utm_medium,
          utmCampaign: utmParams.utm_campaign,
          utmTerm: utmParams.utm_term,
          utmContent: utmParams.utm_content,
        }),
      })

      const json = await response.json().catch(() => ({}))

      if (!response.ok) {
        setPaymentError(typeof json.error === 'string' ? json.error : 'Ошибка создания платежа')
        setSubmitStatus('error')
        setIsSubmitting(false)
        return
      }

      if (json.paymentUrl) {
        window.location.href = json.paymentUrl
        return
      }

      if (json.orderId) {
        if (!buyButtonId || !publishableKey) {
          setPaymentError(
            'Не удалось показать кнопку оплаты. Обновите страницу или напишите в поддержку.'
          )
          setSubmitStatus('error')
          setIsSubmitting(false)
          return
        }
        setOrderIdForCheckout(json.orderId)
        setSubmitStatus('success')
        setIsSubmitting(false)
        return
      }

      setPaymentError('Не удалось получить ссылку на оплату. Попробуйте позже.')
      setSubmitStatus('error')
      setIsSubmitting(false)
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError(error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте ещё раз.')
      setSubmitStatus('error')
      setIsSubmitting(false)
    }
  }

  return (
    <section id="payment" className="relative py-20 px-4 z-10">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold gradient-text mb-2">Оплатить и получить календарь</h2>
          <p className="text-gray-300 text-sm mb-6">
            {selectedProduct.title} — {selectedProduct.price}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-gray-400 text-sm">
              Оплата картой (Visa, Mastercard, Apple Pay и др.) через Stripe — безопасно.
            </p>

            <div>
              <label className="block text-white font-medium mb-2">Имя *</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ваше имя"
                disabled={!!orderIdForCheckout}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Телефон *</label>
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value ?? ''}
                    type="tel"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+7 (999) 999-99-99"
                    onChange={(e) => field.onChange(formatPhoneMask(e.target.value))}
                    disabled={!!orderIdForCheckout}
                  />
                )}
              />
              {errors.contact && <p className="text-red-400 text-sm mt-1">{errors.contact.message}</p>}
            </div>

            <div className="flex items-start gap-3">
              <input
                {...register('consent')}
                type="checkbox"
                id="consent"
                className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-purple-500"
                disabled={!!orderIdForCheckout}
              />
              <label htmlFor="consent" className="text-gray-300 text-sm">
                Я согласен(а) на обработку персональных данных *
              </label>
            </div>
            {errors.consent && <p className="text-red-400 text-sm">{errors.consent.message}</p>}

            {isRecaptchaActive && !orderIdForCheckout && (
              <div className="flex justify-center">
                <ReCAPTCHA sitekey={siteKey} onChange={setRecaptchaValue} theme="dark" />
              </div>
            )}

            {submitStatus === 'error' && paymentError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">{paymentError}</div>
            )}

            {orderIdForCheckout && buyButtonId && publishableKey && (
              <>
                <Script
                  src="https://js.stripe.com/v3/buy-button.js"
                  strategy="afterInteractive"
                  onLoad={() => setStripeBuyScriptReady(true)}
                />
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-lg space-y-3">
                  <p className="text-emerald-200 text-sm">
                    Заказ создан. Нажмите «Buy» на кнопке Stripe ниже — после оплаты вы получите письмо.
                  </p>
                  {stripeBuyScriptReady &&
                    createElement('stripe-buy-button', {
                      key: orderIdForCheckout,
                      'buy-button-id': buyButtonId,
                      'publishable-key': publishableKey,
                      'client-reference-id': orderIdForCheckout,
                    })}
                </div>
              </>
            )}

            {!orderIdForCheckout && (
              <button
                type="submit"
                disabled={isSubmitting || (isRecaptchaActive && !recaptchaValue)}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white font-semibold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Переход к оплате...' : `Оплатить ${selectedProduct.price}`}
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
