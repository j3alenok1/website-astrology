'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { motion } from 'framer-motion'
import { getUTMParams, formatPhoneMask, isValidPhone, reachMetrikaGoal } from '@/lib/utils'
import { getProductBySlug } from '@/lib/products'

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

export function PaymentFormMinimal({ productSlug }: PaymentFormMinimalProps) {
  const selectedProduct = getProductBySlug(productSlug)
  const disableRecaptcha = process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true'
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  const isRecaptchaActive = !disableRecaptcha && !!siteKey

  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [utmParams, setUtmParams] = useState<Record<string, string | null>>({})

  const { register, control, handleSubmit, formState: { errors } } = useForm<MinimalFormData>({
    resolver: zodResolver(minimalSchema),
    defaultValues: { contact: '', consent: false },
  })

  useEffect(() => {
    setUtmParams(getUTMParams())
  }, [])

  if (!selectedProduct) return null

  const onSubmit = async (data: MinimalFormData) => {
    if (isRecaptchaActive && !recaptchaValue) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    if (productSlug === 'astrologiya-otnosheniy') {
      reachMetrikaGoal('metodichka_pay_click')
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const returnUrl = `${baseUrl}/payment/success?product=${productSlug}`

    try {
      const endpoint = '/api/payments/create-digital'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: selectedProduct.slug,
          productTitle: selectedProduct.title,
          amount: selectedProduct.amountTiyin,
          name: data.name,
          contact: data.contact,
          consent: data.consent,
          utmSource: utmParams.utm_source,
          utmMedium: utmParams.utm_medium,
          utmCampaign: utmParams.utm_campaign,
          utmTerm: utmParams.utm_term,
          utmContent: utmParams.utm_content,
          recaptchaToken: isRecaptchaActive ? recaptchaValue : undefined,
        }),
      })

      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Ошибка создания платежа')

      if (json.paymentUrl) {
        window.location.href = json.paymentUrl
      } else if (json.provider === 'kaspi') {
        window.location.href = json.successUrl || `/payment/success?orderId=${json.orderId}&provider=kaspi&product=${productSlug}`
      } else {
        throw new Error('Не получена ссылка на оплату')
      }
    } catch (error) {
      console.error('Payment error:', error)
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
            <div>
              <label className="block text-white font-medium mb-2">Имя *</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ваше имя"
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
              />
              <label htmlFor="consent" className="text-gray-300 text-sm">
                Я согласен(а) на обработку персональных данных *
              </label>
            </div>
            {errors.consent && <p className="text-red-400 text-sm">{errors.consent.message}</p>}

            {isRecaptchaActive && (
              <div className="flex justify-center">
                <ReCAPTCHA sitekey={siteKey} onChange={setRecaptchaValue} theme="dark" />
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                Произошла ошибка. Попробуйте ещё раз.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || (isRecaptchaActive && !recaptchaValue)}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white font-semibold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Переход к оплате...' : `Оплатить ${selectedProduct.price}`}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
