import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Astro Consult',
  description: 'Политика конфиденциальности и обработки персональных данных',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto glass-effect rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
          Политика конфиденциальности
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты 
              персональных данных пользователей сайта Astro Consult.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Собираемые данные</h2>
            <p>Мы собираем следующие персональные данные:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Имя</li>
              <li>Дата и время рождения</li>
              <li>Город проживания</li>
              <li>Контактные данные (телефон, email, мессенджеры)</li>
              <li>Текст запроса</li>
              <li>Технические данные (IP-адрес, User-Agent, UTM-метки)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Цели обработки данных</h2>
            <p>Персональные данные обрабатываются для:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Обработки заявок на консультацию</li>
              <li>Связи с клиентами</li>
              <li>Проведения консультаций</li>
              <li>Улучшения качества услуг</li>
              <li>Аналитики и статистики</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Защита данных</h2>
            <p>
              Мы применяем технические и организационные меры для защиты персональных данных 
              от несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Права пользователей</h2>
            <p>Вы имеете право:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Получать информацию о ваших персональных данных</li>
              <li>Требовать исправления неточных данных</li>
              <li>Требовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Контакты</h2>
            <p>
              По вопросам обработки персональных данных обращайтесь по адресу: 
              j3alenok@gmail.com
            </p>
          </section>

          <section>
            <p className="text-sm text-gray-400 mt-8">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
