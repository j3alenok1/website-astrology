'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function MetaPixel() {
  const pathname = usePathname()

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
    if (!pixelId || typeof window === 'undefined') return

    if (!window.fbq) {
      const script = document.createElement('script')
      script.innerHTML = `
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
      `
      document.head.appendChild(script)
    } else {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  return null
}

declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}
