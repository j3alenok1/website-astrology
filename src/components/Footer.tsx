'use client'

import { MessageCircle, MapPin } from 'lucide-react'
import { reachGoal } from '@/lib/metrika'
import { CONTACTS } from '@/lib/contacts'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-16 px-4 border-t border-white/10 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Контакты</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_whatsapp')}>
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>{CONTACTS.address.display}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Услуги</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#services" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_service', { service: 'astrology' })}>Астрология</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_service', { service: 'taro' })}>Таро</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_service', { service: 'psychology' })}>Психология</a></li>
              <li><a href="#booking" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_booking')}>Записаться</a></li>
              <li><a href="/astrolog-almaty" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_astrolog_almaty')}>Астролог в Алматы</a></li>
              <li><a href="/relationshipastrology" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_relationship')}>Астрология Отношений</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Информация</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#methodology" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_methodology')}>Методология</a></li>
              <li><a href="#faq" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_faq')}>FAQ</a></li>
              <li><a href="/privacy" className="hover:text-purple-400 transition-colors" onClick={() => reachGoal('click_footer_privacy')}>Политика конфиденциальности</a></li>
              <li><a href="/partners" className="hover:text-purple-400 transition-colors">Партнёрам</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-gray-400 pt-8 border-t border-white/10">
          <p>&copy; {currentYear} Astro Consult. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
