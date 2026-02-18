# SEO: как вывести сайт в топ

## Что уже сделано в коде

- ✅ Meta-теги (title, description, keywords) — охват Казахстан, Россия, онлайн
- ✅ Open Graph и Twitter Card для соцсетей
- ✅ JSON-LD разметка (LocalBusiness, WebSite) для поисковиков
- ✅ Sitemap.xml и robots.txt
- ✅ Canonical URL
- ✅ Поддержка Google Analytics и Meta Pixel

---

## Шаги для продвижения

### 1. Переменные в Vercel

Убедитесь, что заданы:

- `NEXT_PUBLIC_SITE_URL` = `https://astrobyndauzh.com`
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` = номер счётчика Яндекс.Метрики (обязательно для РФ/КЗ)
- `NEXT_PUBLIC_GA_ID` = ID из Google Analytics 4 (подключить позже на основной домен)
- `NEXT_PUBLIC_META_PIXEL_ID` = ID из Meta (Facebook) Pixel (если нужна реклама)

---

### 2. Google Search Console

1. Зайдите на [search.google.com/search-console](https://search.google.com/search-console)
2. Добавьте ресурс → URL-префикс: `https://astrobyndauzh.com`
3. Подтвердите владение (HTML-тег или DNS)
4. Отправьте sitemap: `https://astrobyndauzh.com/sitemap.xml`
5. Проверьте индексацию через 1–2 недели

---

### 3. Яндекс.Вебмастер

1. Зайдите на [webmaster.yandex.ru](https://webmaster.yandex.ru)
2. Добавьте сайт `https://astrobyndauzh.com`
3. Подтвердите владение
4. Добавьте sitemap: `https://astrobyndauzh.com/sitemap.xml`
5. Включите индексацию

---

### 4. Google Analytics 4

1. Создайте ресурс в [analytics.google.com](https://analytics.google.com)
2. Скопируйте ID (формат `G-XXXXXXXXXX`)
3. Добавьте в Vercel: `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`
4. Сделайте Redeploy

---

### 5. Яндекс.Метрика ✅ подключена

Счётчик уже добавлен в проект. Осталось:

1. Создайте счётчик на [metrika.yandex.ru](https://metrika.yandex.ru)
2. Скопируйте номер счётчика (число, например 12345678)
3. Добавьте в Vercel: `NEXT_PUBLIC_YANDEX_METRIKA_ID` = `12345678`
4. Сделайте Redeploy

Статистика: [metrika.yandex.ru](https://metrika.yandex.ru) → выберите счётчик

---

### 6. Контент и ключевые слова

Текущие фокус-запросы (широкий охват):

- астролог, астролог онлайн
- консультация астролога
- таро, таро онлайн, расклад таро
- разбор натальной карты, натальная карта
- соляр, соляр на год, годовой прогноз
- совместимость по дате рождения
- детская карта астрология
- профориентация астрология
- астропортрет, кармический урок
- астролог Казахстан, астролог Россия
- астролог Алматы, астролог Москва
- психологическая консультация
- астрология отношения, карьера, деньги

Рекомендации:

- Добавить страницы под отдельные услуги (например, `/uslugi/astroportret`)
- Регулярно обновлять контент (блог, кейсы)
- Получать отзывы и добавлять их на сайт

---

### 7. Проверка

- [Google PageSpeed Insights](https://pagespeed.web.dev/) — скорость и мобильная версия
- [Rich Results Test](https://search.google.com/test/rich-results) — проверка разметки
- [Яндекс Валидатор](https://webmaster.yandex.ru/tools/microtest/) — микроразметка

---

### 8. Сроки

- Индексация: 1–4 недели
- Рост позиций: 2–3 месяца при регулярном обновлении
- Для ускорения можно использовать контекстную рекламу (Яндекс.Директ, Google Ads)
