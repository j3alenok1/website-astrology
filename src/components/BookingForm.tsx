'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { getUTMParams, formatPhoneMask, isValidPhone } from '@/lib/utils'
import { reachGoal } from '@/lib/metrika'
import { getProductBySlug } from '@/lib/products'
import { BirthDatePicker } from '@/components/BirthDatePicker'
import type { LeadFormData } from '@/types'

function isValidBirthDate(val: string): boolean {
  if (!val) return false
  // Формат YYYY-MM-DD, год ровно 4 цифры (1900–текущий год)
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
  // Проверка, что дата реальная (например, 31.02 невалидна)
  if (d.getFullYear() !== yearNum || d.getMonth() + 1 !== monthNum || d.getDate() !== dayNum) return false
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return d <= today
}

const formSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  birthDate: z
    .string()
    .min(1, 'Укажите дату рождения')
    .refine(isValidBirthDate, 'Укажите корректную дату (не в будущем, с 1900 года)'),
  birthTime: z.string().optional(),
  city: z.string().min(2, 'Укажите город проживания'),
  birthCity: z.string().min(2, 'Укажите город рождения'),
  contact: z
    .string()
    .min(1, 'Укажите номер телефона')
    .refine(isValidPhone, 'Введите корректный номер: +7 (XXX) XXX-XX-XX'),
  request: z.string().max(1500, 'Максимум 1500 символов').optional(),
  consent: z.boolean().refine((val) => val === true, 'Необходимо согласие на обработку данных'),
})

interface BookingFormProps {
  productSlugOverride?: string
}

export function BookingForm({ productSlugOverride }: BookingFormProps = {}) {
  const searchParams = useSearchParams()
  const productSlug = productSlugOverride ?? searchParams.get('product')
  const selectedProduct = productSlug ? getProductBySlug(productSlug) : null

  const disableRecaptcha = process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true'
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  const isRecaptchaActive = !disableRecaptcha && !!siteKey
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [utmParams, setUtmParams] = useState<Record<string, string | null>>({})

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: '',
      consent: false,
    },
  })

  useEffect(() => {
    setUtmParams(getUTMParams())
  }, [])

  const onSubmit = async (data: LeadFormData) => {
    if (isRecaptchaActive && !recaptchaValue) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...utmParams,
          productSlug: selectedProduct?.slug,
          productTitle: selectedProduct?.title,
          amount: selectedProduct?.amountTiyin,
          recaptchaToken: isRecaptchaActive ? recaptchaValue : undefined,
        }),
      })

      if (!response.ok) throw new Error('Ошибка отправки')

      setSubmitStatus('success')
      reset()
      setRecaptchaValue(null)
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', { send_to: process.env.NEXT_PUBLIC_GA_ID })
      }
      if (typeof window !== 'undefined' && window.ym) {
        const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '106988269'
        window.ym(parseInt(metrikaId, 10), 'reachGoal', 'lead_submit')
      }
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPay = async (data: LeadFormData) => {
    if (!selectedProduct) return
    if (isRecaptchaActive && !recaptchaValue) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setPaymentError(null)

    try {
      const response = await fetch('/api/payments/stripe-prepare-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: selectedProduct.slug,
          productTitle: selectedProduct.title,
          amount: selectedProduct.amountTiyin,
          name: data.name,
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          city: data.city,
          birthCity: data.birthCity,
          contact: data.contact,
          request: data.request,
          consent: data.consent,
          utmSource: utmParams.utm_source,
          utmMedium: utmParams.utm_medium,
          utmCampaign: utmParams.utm_campaign,
          utmTerm: utmParams.utm_term,
          utmContent: utmParams.utm_content,
        }),
      })

      const json = await response.json()
      if (!response.ok) {
        setPaymentError(typeof json.error === 'string' ? json.error : 'Ошибка создания платежа')
        setSubmitStatus('error')
        setIsSubmitting(false)
        return
      }

      if (json.paymentUrl) {
        window.location.href = json.paymentUrl
      } else {
        setPaymentError('Не получена ссылка на оплату')
        setSubmitStatus('error')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError(error instanceof Error ? error.message : 'Ошибка сети')
      setSubmitStatus('error')
      setIsSubmitting(false)
    }
  }

  return (
    <section id="booking" className="relative py-32 px-4 z-10">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Записаться на консультацию
          </h2>
          <p className="text-xl text-gray-300">
            Заполните форму, и я свяжусь с вами
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6"
          >
            {selectedProduct && (
              <div className="p-4 bg-purple-500/20 border border-purple-500/50 rounded-xl">
                <p className="text-purple-200 text-sm font-medium">Выбранный продукт</p>
                <p className="text-white font-semibold">{selectedProduct.title}</p>
                <p className="text-purple-200 text-sm mt-1">{selectedProduct.price}</p>
              </div>
            )}
            <div>
              <label className="block text-white font-medium mb-2">Имя *</label>
              <input
                {...register('name')}
                type="text"
                className="form-input"
                placeholder="Ваше имя"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Дата рождения *</label>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <BirthDatePicker
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.birthDate?.message}
                      placeholder="ДД.ММ.ГГГГ"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Время рождения</label>
                <input
                  {...register('birthTime')}
                  type="time"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Город *</label>
              <input
                {...register('city')}
                type="text"
                className="form-input"
                placeholder="Город проживания"
              />
              {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Город рождения *</label>
              <input
                {...register('birthCity')}
                type="text"
                className="form-input"
                placeholder="Город, в котором вы родились"
              />
              {errors.birthCity && (
                <p className="text-red-400 text-sm mt-1">{errors.birthCity.message}</p>
              )}
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
                    inputMode="numeric"
                    autoComplete="tel"
                    className="form-input"
                    placeholder="+7 (999) 999-99-99"
                    onChange={(e) => {
                      const formatted = formatPhoneMask(e.target.value)
                      field.onChange(formatted)
                    }}
                  />
                )}
              />
              {errors.contact && (
                <p className="text-red-400 text-sm mt-1">{errors.contact.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Ваш запрос</label>
              <textarea
                {...register('request')}
                rows={5}
                maxLength={1500}
                className="form-input form-textarea"
                placeholder="Опишите, с чем вы хотели бы поработать..."
              />
              <p className="text-right text-gray-400 text-xs mt-1">{(watch('request') || '').length} / 1500</p>
              {errors.request && (
                <p className="text-red-400 text-sm mt-1">{errors.request.message}</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                {...register('consent')}
                type="checkbox"
                id="consent"
                className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 
                         focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="consent" className="text-gray-300 text-sm">
                Я согласен(а) на обработку персональных данных *
              </label>
            </div>
            {errors.consent && (
              <p className="text-red-400 text-sm">{errors.consent.message}</p>
            )}

            {!disableRecaptcha && !siteKey && (
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
                reCAPTCHA не настроена. Для локального запуска можно выставить
                <code className="mx-1 px-1 py-0.5 bg-black/30 rounded">NEXT_PUBLIC_DISABLE_RECAPTCHA=true</code>
                и <code className="mx-1 px-1 py-0.5 bg-black/30 rounded">DISABLE_RECAPTCHA=true</code>
                в <code className="mx-1 px-1 py-0.5 bg-black/30 rounded">.env</code>, либо заполнить ключи reCAPTCHA.
              </div>
            )}

            {isRecaptchaActive && (
              <div className="flex justify-center">
                <ReCAPTCHA sitekey={siteKey} onChange={setRecaptchaValue} theme="dark" />
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {paymentError ? (
                  <p>{paymentError}</p>
                ) : (
                  <p>Произошла ошибка. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.</p>
                )}
              </div>
            )}

            {selectedProduct ? (
              <div className="space-y-3">
                {/алматы|астана|шымкент|aktau|almaty|astana|shymkent|karaganda|aktobe/i.test((watch('city') || '').trim()) && (
                  <p className="text-sm text-purple-200">
                    💳 Оплата картой через Stripe.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting || (isRecaptchaActive && !recaptchaValue)}
                    onClick={handleSubmit(onSubmit)}
                    className="flex-1 px-5 py-2.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 
                             rounded-full text-white font-semibold hover:from-purple-500 
                             hover:to-pink-500 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Отправка...' : 'Записаться'}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || (isRecaptchaActive && !recaptchaValue)}
                    onClick={() => {
                      reachGoal('click_payment_intent', { product: selectedProduct.slug })
                      handleSubmit(onPay)()
                    }}
                    className="flex-1 px-5 py-2.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 
                             rounded-full text-white font-semibold hover:from-green-500 
                             hover:to-emerald-500 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Переход к оплате...' : `Записаться и оплатить ${selectedProduct.price}`}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={isSubmitting || (isRecaptchaActive && !recaptchaValue)}
                onClick={handleSubmit(onSubmit)}
                className="w-full px-5 py-2.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-full text-white font-semibold hover:from-purple-500 
                         hover:to-pink-500 transition-all duration-300 cosmic-glow
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            )}
          </form>
        </motion.div>
      </div>

    </section>
  )
}
