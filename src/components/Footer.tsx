'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

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
                <Mail className="w-5 h-5 text-purple-400" />
                <a href="mailto:j3alenok@gmail.com" className="hover:text-purple-400 transition-colors">j3alenok@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>+7 (XXX) XXX-XX-XX</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>Москва, Россия</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Услуги</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Астрология</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Таро</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Психология</a></li>
              <li><a href="#booking" className="hover:text-purple-400 transition-colors">Записаться</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Информация</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#methodology" className="hover:text-purple-400 transition-colors">Методология</a></li>
              <li><a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a></li>
              <li><a href="/privacy" className="hover:text-purple-400 transition-colors">Политика конфиденциальности</a></li>
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
