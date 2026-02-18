# Высокоуровневый план развития InvestBro

> Roadmap от текущего состояния до полноценной европейской платформы.

---

## Текущее состояние (baseline)

### Что работает

- Next.js 16 + React 19 + Tailwind 4 + shadcn/ui (new-york) — настроены
- PostgreSQL + Drizzle ORM — схема с таблицами: users, categories, listings, metrics, listingImages, favorites, conversations, messages
- Категории — 8 штук, плоские (без иерархии), хотя `parentId` есть в схеме
- Листинги — создание (wizard 5 шагов), просмотр списка с фильтрами, детальная страница
- Избранное — toggle, список
- Чат — создание диалога, отправка сообщений, список чатов
- i18n — 2 локали (en, ru), частичное покрытие (много хардкода)
- Темы — dark/light/system
- Графики — recharts AreaChart (revenue, users)
- Markdown — редактор + viewer для описаний

### Что НЕ работает / отсутствует

- Авторизация — mock user (первый в БД)
- Загрузка изображений — заглушка "Feature coming soon"
- Хардкод строк — wizard steps, create page, chat page, detail page
- Только 8 категорий вместо 200+ из `categories.md`
- Фильтры — хардкодный массив из 13 категорий
- Страницы /privacy, /terms, /contact — не существуют
- Нет edit/delete листинга
- Нет раздела инвесторов
- Нет раздела вакансий
- Нет раздела франшиз
- Нет профиля пользователя
- Нет дашборда
- Валюта — USD вместо EUR
- Локация — свободный текст вместо структурированных данных
- Дизайн — стандартный neutral shadcn, не cinematic dark-first

---

## Фаза 0 — Рефакторинг фундамента

> Цель: привести текущий код в соответствие с правилами из `rules.md` и визуальной системой из `styles.md`. Никаких новых фич — только чистка и подготовка.

### 0.1 Интернационализация

- Убрать ВСЕ хардкодные строки из компонентов
- Заменить на ключи `useTranslations()` / `getTranslations()`
- Расширить `routing.ts`: локали `['en', 'fr', 'es', 'pt', 'de', 'it', 'nl', 'ru']`, дефолт `'en'`
- Создать файлы переводов: `messages/fr.json`, `messages/es.json`, `messages/pt.json`, `messages/de.json`, `messages/it.json`, `messages/nl.json`
- Обновить `middleware.ts` matcher под новые локали
- Добавить новые секции переводов: `Investors`, `Jobs`, `Franchises`, `Profile`, `Dashboard`, `Auth`, `Filters`, `Countries`, `Errors`
- Добавить переводы названий категорий для всех локалей в таблицу `categories` (новые поля: `nameFr`, `nameEs`, `namePt`, `nameDe`, `nameIt`, `nameNl`)

### 0.2 Категории — иерархическая структура

- Расширить таблицу `categories`: добавить поля `nameFr`, `nameEs`, `namePt`, `nameDe`, `nameIt`, `nameNl`, `icon` (slug Lucide-иконки), `order` (integer для сортировки)
- Создать seed-данные с полной иерархией из `categories.md`:
  - Уровень 0 (разделы): «Онлайн-бизнес», «Офлайн-бизнес», «Франшизы», «Стартапы», «Доли и партнёрство»
  - Уровень 1 (категории): E-commerce, SaaS, HoReCa, Ритейл, и т.д.
  - Уровень 2 (подкатегории): Монобрендовый магазин, B2B SaaS, Fine Dining, и т.д.
- Убрать все упоминания сторонних платформ и сервисов из seed-данных, описаний и переводов
- Создать `lib/constants/category-icons.ts` — маппинг slug → Lucide-иконка
- Обновить фильтры — каскадный выбор из БД вместо хардкода

### 0.3 Валюта и география

- Поменять дефолтную валюту с USD на EUR
- Создать `lib/constants/countries.ts` — список европейских стран с кодами и валютами
- Изменить поле `location` в схеме: `country` (text) + `city` (text, optional) вместо свободного текста
- Обновить seed с европейскими городами
- Форматирование валюты через `Intl.NumberFormat` с учётом локали

### 0.4 Визуальный рефакторинг

- Обновить `globals.css`: новая oklch-палитра из `styles.md`
- Dark theme — основная (defaultTheme: "dark" в ThemeProvider)
- Обновить hero-секцию: mesh gradient, декоративные элементы
- Обновить карточки: glass-morphism (backdrop-blur, полупрозрачность)
- Обновить навигацию: backdrop-blur, уменьшение при скролле
- Добавить mobile bottom tab bar (5 табов)
- Добавить stagger-анимации для сеток карточек
- Skeleton-loading для асинхронных блоков

### 0.5 Структура компонентов

- Реорганизовать `components/` из плоской в feature-based структуру:
  - `components/layout/` — main-nav, footer, mobile-nav, bottom-tab-bar
  - `components/listings/` — listing-card, listing-filters, listing-grid, listing-wizard/*
  - `components/charts/` — revenue-chart, metrics-chart
  - `components/shared/` — favorite-button, markdown-editor, markdown-viewer, category-badge, country-select, currency-display, empty-state, image-upload
  - `components/providers/` — theme-provider
- Обновить все импорты

---

## Фаза 1 — Аутентификация и профили

> Цель: реальные пользователи вместо mock user. Профили и роли.

### 1.1 Аутентификация

- Интеграция NextAuth.js v5 (Auth.js)
- Провайдеры: Google, GitHub, LinkedIn, Magic Link (email), и 1 просто тестовый сделай для админ с логином admin пароль admin
- Таблицы NextAuth: accounts, sessions, verificationTokens (Drizzle adapter)
- Обновить таблицу `users`: добавить `role` (enum: user, admin), `bio`, `company`, `website`, `phone`, `country`, `city`
- Middleware: protected routes (/listing/create, /favorites, /chat, /profile, /dashboard)
- Убрать mock user из ВСЕХ server actions — использовать `auth()` из NextAuth

### 1.2 Страницы аутентификации

- `/login` — OAuth-кнопки (Google, LinkedIn, GitHub) + Magic Link email input
- `/register` — то же + выбор начального профиля (продавец, инвестор, соискатель)
- Дизайн: split-screen (форма + hero-графика), тёмный фон, gradient

### 1.3 Профиль пользователя

- `/profile` — просмотр и редактирование профиля
  - Аватар (загрузка)
  - Имя, Bio (Markdown)
  - Компания, Сайт, Телефон
  - Страна, Город
  - Мои листинги (список)
  - Мои вакансии (если есть)
  - Статистика: сколько листингов, избранных, сообщений
- `/profile/settings` — настройки аккаунта
  - Язык интерфейса (сохраняется в профиле)
  - Уведомления (email — вкл/выкл)
  - Удаление аккаунта

---

## Фаза 2 — Полный CRUD листингов + Медиа

> Цель: завершить функциональность листингов — редактирование, удаление, изображения, статусы.

### 2.1 CRUD

- `editListing` server action — обновление всех полей
- `/listing/[id]/edit` — wizard с предзаполненными данными
- `deleteListing` server action — soft delete (статус → hidden) или полное удаление
- `changeListingStatus` server action — draft ↔ active ↔ sold ↔ hidden
- Мои листинги — список с фильтром по статусу, действиями (edit, delete, change status)

### 2.2 Загрузка изображений

- Интеграция с Cloudflare R2 (или S3-compatible)
- Компонент `ImageUpload`: drag-and-drop, preview, reorder, crop (optional)
- Ограничения: max 10 изображений, max 5MB каждое, JPEG/PNG/WebP
- Оптимизация: сжатие на клиенте перед загрузкой
- Таблица `listingImages`: url, order, listingId
- Обложка: первое изображение или выбранное пользователем

### 2.3 Wizard — 6 шагов (обновлённый)

1. Тип + Категория + Подкатегория (каскадный выбор)
2. Основная информация (название, описание-Markdown, цена в EUR/GBP/CHF)
3. Локация (страна → город или Remote/Global)
4. Финансовые метрики (выручка, прибыль, данные по месяцам)
5. Изображения (загрузка, порядок, обложка)
6. Проверка + Публикация / Черновик

---

## Фаза 3 — Раздел «Инвесторы»

> Цель: каталог инвесторов и инвестиционных структур. Стартапы могут находить инвесторов, инвесторы — проекты.

### 3.1 Модель данных

Новые таблицы:
- `investorProfiles` — userId, type (angel/vc/private/strategic/institutional), stages (jsonb), industries (jsonb), ticketMin, ticketMax, currency, geoFocus (jsonb), instrumentTypes (jsonb), participationType, requirements (text/markdown), portfolio (jsonb), exitStrategy, isPublic, createdAt, updatedAt
- `investorIndustries` (enum или справочник) — tech, ecommerce, horeca, healthcare, edtech, fintech, greentech, agritech, proptech, logtech, generalist, и т.д.

### 3.2 Страницы

- `/investors` — каталог с фильтрами (тип, стадия, отрасль, чек, страна, тип участия)
- `/investor/[id]` — детальный профиль: тип, чек, стадии, отрасли, гео-фокус, требования, портфолио, контакт
- `/investor/create` — форма создания профиля инвестора (для авторизованных пользователей)
- `/investor/[id]/edit` — редактирование профиля

### 3.3 Matching

- На странице стартап-листинга — блок «Подходящие инвесторы» (по стадии + отрасли)
- На странице инвестора — блок «Подходящие проекты» (по стадии + отрасли)
- Простой matching по пересечению массивов stages ∩ industries

---

## Фаза 4 — Раздел «Найм и таланты»

> Цель: вакансии в стартапах и бизнесе с уникальными форматами (со-основатель, стажёр, fractional, advisory).

### 4.1 Модель данных

Новые таблицы:
- `jobs` — userId, listingId (optional, привязка к бизнесу), title, description (markdown), roleCategory (slug из раздела 3 categories.md), level (junior/middle/senior/lead/head/clevel), employmentType (jsonb — fulltime, parttime, project, freelance, internship, fractional, remote, hybrid, onsite), country, city, salaryMin, salaryMax, currency, hasEquity, equityDetails, experienceYears, requiredStack (jsonb), languages (jsonb), urgency (low/medium/high/asap), status (active/closed/draft), createdAt, updatedAt
- `jobApplications` — jobId, userId, coverLetter, resumeUrl, status (pending/reviewed/accepted/rejected), createdAt

### 4.2 Страницы

- `/jobs` — каталог вакансий с фильтрами (роль, уровень, формат, локация, зарплата, с опционами, стажировка)
- `/job/[id]` — детальная страница: описание, условия, компания/проект, кнопка «Откликнуться»
- `/job/create` — форма публикации вакансии
- `/job/[id]/edit` — редактирование

### 4.3 Уникальные форматы

- **Со-основатель**: специальный тип вакансии, фильтр «Ищу ко-фаундера», поля equity + роль
- **Стажировка**: оплачиваемая / неоплачиваемая, фильтр
- **Fractional CXO**: несколько часов в неделю, C-level позиции
- **Advisory**: опционная схема, менторство
- Каждый формат — визуально выделен badge на карточке

---

## Фаза 5 — Коммуникации

> Цель: надёжный real-time чат, уведомления, контекстные диалоги.

### 5.1 Улучшенный чат

- Real-time через Server-Sent Events (SSE) или WebSocket
- Типизированные диалоги: бизнес-сделка (привязан к листингу), инвестиция (привязан к стартапу), найм (привязан к вакансии)
- Статусы сообщений: отправлено, доставлено, прочитано
- Отображение контекста: карточка листинга/вакансии в шапке чата
- Поиск по сообщениям

### 5.2 Уведомления

- In-app уведомления: колокольчик в навигации + dropdown с историей
- Типы: новое сообщение, новый отклик на вакансию, листинг добавлен в избранное, приглашение к диалогу
- Email-уведомления (опционально, настраивается в /profile/settings)
- Таблица `notifications`: userId, type, title, body, link, isRead, createdAt

---

## Фаза 6 — UX, Discovery и SEO ✅ (2026-02-18)

> Цель: превратить каталог в умную платформу с discovery-механиками.

### 6.1 Главная страница — Netflix-стиль ✅

- ✅ Hero с поисковой строкой и mesh-gradient фоном
- ✅ Горизонтальные scroll-ряды: «Trending», «Онлайн-бизнесы», «Офлайн-бизнесы», «Инвесторы», «Вакансии»
- ✅ Каждый ряд — карточки с navigation arrows на hover
- ✅ Анимированные счётчики статистики

### 6.2 Страница категории ✅

- ✅ `/category/[slug]` — заголовок, подкатегории (grid иконок), листинги в категории
- ✅ Хлебные крошки: Home → Раздел → Категория → Подкатегория
- ✅ При клике на подкатегорию — фильтрация листингов

### 6.3 Advanced Search & Filters ✅

- ✅ Глобальная поисковая строка в header (Command+K / Ctrl+K — Command palette стиль)
- ✅ Результаты: бизнесы + инвесторы + вакансии — в разных группах
- Фильтры на каталоге: dual-slider для цены и выручки, multi-select для стран, каскадный select для категорий — *будущее улучшение*
- Сохранённые поиски — *будущее*

### 6.4 Рекомендации ✅

- ✅ Блок «Похожие бизнесы» на детальной странице (по категории + ценовой диапазон)
- Блок «Рекомендуем для вас» на главной (по избранным категориям — простой collaborative filtering) — *будущее*

### 6.5 SEO ✅

- ✅ `generateMetadata()` для всех публичных страниц: title, description, og:type
- ✅ Локализованные metadata
- ✅ `sitemap.xml` — автогенерация из листингов, категорий, страниц
- ✅ `robots.txt`
- ✅ Canonical URLs для мультиязычных версий
- JSON-LD structured data для листингов — *будущее улучшение*

---

## Фаза 7 — Доверие и безопасность ✅ (2026-02-18)

> Цель: верификация, отзывы, защита от мошенничества.

### 7.1 Верификация

- Продавец может запросить верификацию профиля
- Типы: email (автоматическая), телефон (SMS), документы (ручная проверка)
- Badge «Verified» на профиле и карточках
- Верифицированные листинги — выше в выдаче

### 7.2 Отзывы и рейтинги

- Таблица `reviews`: fromUserId, toUserId, listingId, rating (1-5), comment, createdAt
- Рейтинг продавца: средний балл + количество отзывов
- Только после завершения сделки (статус listing → sold + conversation exists)
- Модерация отзывов (ручная или автоматическая по ключевым словам)

### 7.3 Безопасность

- Report listing / report user — форма жалобы, таблица `reports`
- Модерация: admin-панель для просмотра жалоб
- Чёрный список: заблокированные пользователи
- Автоматическая проверка: дубликаты листингов, подозрительные цены

---

## Фаза 8 — Аналитика и монетизация ✅ (2026-02-18)

> Цель: дашборды для пользователей, платные функции для выручки.

### 8.1 Дашборд продавца (`/dashboard`)

- Мои листинги: статусы, просмотры, в избранном, контакты
- Графики: просмотры по дням, конверсия (просмотр → контакт)
- Последние сообщения
- Подсказки: «Добавьте фото — листинги с фото получают в 3x больше контактов»

### 8.2 Дашборд инвестора

- Мой профиль: просмотры, входящие запросы
- Подходящие проекты: matching по стадии/отрасли
- Сохранённые поиски

### 8.3 Монетизация

- **Promoted Listing** — объявление поднимается в выдаче и появляется в ряду «Рекомендуемые» на главной. Оплата за 7/14/30 дней
- **Premium-профиль** — badge «Premium», расширенная аналитика, приоритетная поддержка. Подписка месячная
- **Верификация бизнеса** — платная проверка документов, финансов. Разовая оплата. Badge «Verified Business»
- **Featured Investor** — профиль инвестора в блоке «Топ-инвесторы». Оплата за период
- **API-доступ** (далёкое будущее) — для брокеров и консультантов, массовое размещение

---

## Сводная таблица фаз

| Фаза | Название | Ключевые deliverables | Зависимости |
|------|----------|----------------------|-------------|
| 0 | Рефакторинг фундамента | i18n, категории, валюта, дизайн-система, структура компонентов | — |
| 1 | Аутентификация и профили | NextAuth, login/register, профиль, настройки | Фаза 0 |
| 2 | Полный CRUD + Медиа | Edit/delete, загрузка изображений, статусы | Фаза 1 |
| 3 | Инвесторы | Модель, каталог, профиль, matching | Фаза 1 |
| 4 | Найм и таланты | Модель, каталог, вакансии, отклики | Фаза 1 |
| 5 | Коммуникации | Real-time чат, уведомления | Фаза 1 |
| 6 | UX и Discovery | Netflix-главная, search, SEO, рекомендации | Фазы 2-4 |
| 7 | Доверие | Верификация, отзывы, модерация ✅ | Фаза 5 |
| 8 | Монетизация | Promoted, Premium, платная верификация, дашборды | Фаза 7 |

---

## Приоритеты по страницам

### Must Have (Фазы 0-2)

| Страница | Статус | Фаза |
|----------|--------|------|
| Главная (/) | Рефакторинг — Netflix-стиль | 0 |
| Каталог бизнесов (/listings) | Рефакторинг — dynamic filters | 0 |
| Детали листинга (/listing/[id]) | Рефакторинг — i18n, EUR | 0 |
| Создание листинга (/listing/create) | Рефакторинг — 6 шагов, i18n | 0 |
| Избранное (/favorites) | Рефакторинг — i18n | 0 |
| Чат (/chat, /chat/[id]) | Рефакторинг — i18n | 0 |
| 404 (not-found) | Рефакторинг — i18n | 0 |
| Login (/login) | Новая | 1 |
| Register (/register) | Новая | 1 |
| Профиль (/profile) | Новая | 1 |
| Настройки (/profile/settings) | Новая | 1 |
| Редактирование (/listing/[id]/edit) | Новая | 2 |

### Should Have (Фазы 3-5)

| Страница | Статус | Фаза |
|----------|--------|------|
| Каталог инвесторов (/investors) | Новая | 3 |
| Профиль инвестора (/investor/[id]) | Новая | 3 |
| Создание профиля инвестора (/investor/create) | Новая | 3 |
| Каталог вакансий (/jobs) | Новая | 4 |
| Детали вакансии (/job/[id]) | Новая | 4 |
| Создание вакансии (/job/create) | Новая | 4 |
| Страница категории (/category/[slug]) | Новая | 6 |
| Дашборд (/dashboard) | Новая | 8 |

### Nice to Have (Фазы 6-8)

| Страница | Статус | Фаза |
|----------|--------|------|
| Каталог франшиз (/franchises) | Новая | 6 |
| О нас (/about) | Новая | 6 |
| Конфиденциальность (/privacy) | Новая | 6 |
| Условия (/terms) | Новая | 6 |
| Контакты (/contact) | Новая | 6 |
| Admin-панель (/admin) | Новая | 7 |

---

## Статус выполнения

| Фаза | Статус | Дата |
|------|--------|------|
| 0 | ⏳ В процессе | — |
| 1 | ✅ Выполнено | 2026-02-18 |
| 2 | ✅ Выполнено | 2026-02-18 |
| 3 | ✅ Выполнено | 2026-02-18 |
| 4 | ✅ Выполнено | 2026-02-18 |
| 5 | ✅ Выполнено | 2026-02-18 |
| 6-8 | ✅ Выполнено | 2026-02-18 |

### Фаза 1 — Что реализовано

- NextAuth.js v5 с Credentials provider (JWT-стратегия)
- Тестовый вход: `admin@investbro.com` / `admin` (авто-создание при первом логине)
- DB schema: добавлены поля role, bio, company, website, phone, country, city в users; таблицы accounts, sessions, verificationTokens
- Middleware: защита роутов /listing/create, /favorites, /chat, /profile, /dashboard
- Страницы: /login, /register (split-screen дизайн), /profile, /profile/settings
- Навигация: user dropdown с аватаром, logout, profile ссылками
- Mock user заменён на auth() во всех server actions (listings, favorites, chat)
- i18n: ключи Auth и Profile добавлены во все 8 локалей
- Документация: docs/completed/phase-1/

### Фаза 2 — Что реализовано

- Markdown-редактор: live preview (side-by-side), расширенная панель (H1-H3, Bold, Italic, Strikethrough, Code, Lists, Quote, Link, Table, HR)
- R2 интеграция: клиент (`lib/r2/client.ts`), API route для presigned URLs (`/api/upload`)
- Компонент `ImageUpload`: drag-and-drop, превью, сортировка, удаление, лимиты (10 файлов, 5MB, JPEG/PNG/WebP)
- CRUD server actions: `createListing` (обновлён с images), `editListing`, `deleteListing` (soft delete), `changeListingStatus`
- Страница `/listing/[id]/edit` — wizard с предзаполненными данными
- Кнопки edit/delete/status на детальной странице (для владельца)
- Галерея изображений на детальной странице
- Улучшенный раздел «Мои листинги» в профиле со статусами и действиями
- i18n: MarkdownEditor, ImageUpload, ListingManage во все 8 локалей
- Зависимости: @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- Документация: docs/completed/phase-2/

### Фаза 3 — Что реализовано

- DB schema: таблица `investorProfiles` с полями type, stages, industries, ticketMin/Max, currency, geoFocus, instrumentTypes, participationType, requirements, portfolio, exitStrategy, isPublic
- Enum `investorTypeEnum`: angel, vc, private, strategic, institutional
- Zod-схема: `investorProfileSchema` с константами INVESTOR_TYPES, INVESTOR_STAGES, INVESTOR_INDUSTRIES, INSTRUMENT_TYPES, PARTICIPATION_TYPES
- Server actions: `createInvestorProfile`, `editInvestorProfile`, `deleteInvestorProfile`
- Data queries: `getInvestors` (с фильтрами), `getInvestorById`, `getMatchingInvestors`, `getMatchingListings`
- Компоненты: `InvestorCard`, `InvestorFilters`, `InvestorProfileForm`
- Страницы: `/investors` (каталог), `/investor/[id]` (детали), `/investor/create` (создание), `/investor/[id]/edit` (редактирование)
- Matching: блок «Подходящие инвесторы» на странице листинга, блок «Подходящие проекты» на странице инвестора
- Навигация: ссылка «Investors» в desktop nav и mobile sheet
- Middleware: `/investor/create` в protected routes
- i18n: секции Investors, InvestorCard, InvestorDetail во все 8 локалей
- Документация: docs/completed/phase-3/

### Фаза 4 — Что реализовано

- DB schema: таблицы `jobs` и `jobApplications` с полями title, description, roleCategory, level, employmentType (jsonb), salaryMin/Max, hasEquity, equityDetails, experienceYears, requiredStack (jsonb), languages (jsonb), urgency, status
- Enums: `jobStatusEnum` (active/closed/draft), `jobUrgencyEnum` (low/medium/high/asap), `jobLevelEnum` (junior/middle/senior/lead/head/clevel)
- Zod-схема: `jobSchema` с константами ROLE_CATEGORIES (19 ролей), JOB_LEVELS, EMPLOYMENT_TYPES (9 форматов), URGENCY_LEVELS
- Server actions: `createJob`, `editJob`, `deleteJob`, `applyToJob`
- Data queries: `getJobs` (с фильтрами), `getJobById`, `getJobApplications`, `getUserApplication`
- Компоненты: `JobCard` (с badge для спецформатов: co-founder, internship, fractional CXO, advisory), `JobFilters`, `JobForm`, `JobApplyButton`, `JobDeleteButton`
- Страницы: `/jobs` (каталог), `/job/[id]` (детали), `/job/create` (создание), `/job/[id]/edit` (редактирование)
- Уникальные форматы: визуально выделены badge — со-основатель (violet), стажировка (amber), fractional CXO (primary), advisory (emerald), с опционами (amber)
- Навигация: ссылка «Jobs» в desktop nav и mobile sheet
- Middleware: `/job/create` в protected routes
- i18n: секции Jobs, JobCard, JobDetail во все 8 локалей
- Документация: docs/completed/phase-4/

### Фаза 5 — Что реализовано

- DB schema: enums conversationTypeEnum, messageStatusEnum, notificationTypeEnum; таблица notifications; обновлены conversations (type, jobId) и messages (status)
- Типизированные диалоги: listing (бизнес-сделка), investment (инвестиция), job (найм)
- Server actions: startInvestorChat, startJobChat, sendMessage (обновлён с уведомлениями), markMessagesRead
- Server actions уведомлений: createNotification, markNotificationRead, markAllNotificationsRead
- Data queries: getUserConversations, getConversationById, searchMessages, getUnreadMessageCount, getUserNotifications, getUnreadNotificationCount
- Real-time SSE: /api/chat/stream (polling 2s), /api/notifications/stream (polling 5s)
- Компоненты: ChatMessages (real-time, optimistic updates, статусы сообщений), ChatContextCard, ChatSearch, NotificationBell (dropdown с историей)
- Уведомления при: новом сообщении, отклике на вакансию, добавлении в избранное, создании диалога
- Навигация: NotificationBell с badge в header
- Chat list: badge типа диалога, контекст, счётчик непрочитанных
- i18n: секции Chat и Notifications обновлены во все 8 локалей
- Документация: docs/completed/phase-5/

### Фаза 8 — Что реализовано

- DB schema: таблицы listingViews (аналитика просмотров), promotedListings (продвижение), premiumSubscriptions (премиум подписка); enums promotionDurationEnum, subscriptionStatusEnum
- Data queries: getSellerDashboard (listings stats, views by day, recent messages), getInvestorDashboard (matching projects, incoming requests)
- Server actions: recordListingView, promoteListing, subscribePremium
- Компоненты: DashboardStats, DashboardChart (views over 30 days), DashboardListings (с метриками), DashboardMessages, DashboardTips (контекстные советы), InvestorDashboard, MonetizationSection (premium + promote)
- ViewTracker: клиентский компонент, интегрирован в listing detail page
- Страница /dashboard: вкладки Seller / Investor / Monetization
- Навигация: ссылка Dashboard в dropdown пользователя
- i18n: секция Dashboard добавлена во все 8 локалей
- Документация: docs/completed/phase-8/
