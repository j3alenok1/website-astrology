'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Meta (Facebook) Pixel — PageView на первой загрузке и при клиентских переходах.
 * ID: NEXT_PUBLIC_META_PIXEL_ID (Events Manager).
 * @see https://www.facebook.com/business/help/402791146561655
 */
export function MetaPixel() {
  const pathname = usePathname()
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pixelId || typeof window === 'undefined' || !window.fbq) return
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname
      return
    }
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname
      window.fbq('track', 'PageView')
    }
  }, [pathname, pixelId])

  if (!pixelId) return null

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
          `.trim(),
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- пиксель Meta noscript */}
        <img
          height={1}
          width={1}
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
  }
}
