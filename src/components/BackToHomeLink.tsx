'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { reachGoal } from '@/lib/metrika'

export function BackToHomeLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
      onClick={() => reachGoal('click_back_to_home', { from: 'relationshipastrology' })}
    >
      <ArrowLeft className="w-5 h-5" />
      На главную
    </Link>
  )
}
