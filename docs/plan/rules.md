# Правила разработки InvestBro

> Этот документ — источник истины для всех разработчиков. Любое решение должно проверяться на соответствие этим правилам.

---

## 1. Стек технологий

| Слой | Технология | Версия | Примечание |
|------|-----------|--------|------------|
| Фреймворк | Next.js | 16+ | App Router, RSC |
| UI-библиотека | React | 19+ | Server Components по умолчанию |
| Стилизация | Tailwind CSS | 4+ | oklch-цвета, custom theme |
| UI-кит | shadcn/ui | new-york | Единственный источник UI-компонентов |
| Иконки | Lucide React | latest | Единственная библиотека иконок, без эмодзи |
| ORM | Drizzle ORM | latest | PostgreSQL, type-safe |
| БД | PostgreSQL | 15+ | Docker для dev-окружения |
| Валидация | Zod | latest | Все формы, все API-границы |
| i18n | next-intl | latest | Мультиязычность |
| Формы | react-hook-form | latest | + @hookform/resolvers/zod |
| Графики | Recharts | latest | Финансовые метрики |
| Markdown | react-markdown | latest | Описания листингов |
| Уведомления | Sonner | latest | Toast-уведомления |
| Темы | next-themes | latest | Dark/Light/System |
| Аутентификация | NextAuth.js | v5 | OAuth + Magic Link (будущее) |
| Хранилище файлов | Cloudflare R2 / S3 | — | Загрузка изображений (будущее) |
Используем bun

### Запрещено

- Добавлять зависимости без обоснования и согласования
- Использовать UI-библиотеки помимо shadcn/ui (никаких MUI, Ant Design, Chakra)
- Использовать иконки помимо Lucide (никаких Font Awesome, Heroicons)
- Использовать эмодзи в интерфейсе — только Lucide-иконки
- Упоминать названия конкурирующих платформ и сервисов в коде, UI или seed-данных

---

## 2. Архитектурные принципы

### 2.1 RSC-first (React Server Components)

- **По умолчанию** — все компоненты серверные
- `"use client"` добавляется **только** когда компонент использует: `useState`, `useEffect`, `onClick`, `onChange`, browser API, хуки next-intl (`useTranslations`), хуки react-hook-form
- Клиентские компоненты должны быть **максимально маленькими** — выносить логику в серверные обёртки

### 2.2 Структура директорий

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx              # Корневой layout с провайдерами
│       ├── page.tsx                # Главная страница
│       ├── (auth)/                 # Группа: авторизация
│       │   ├── login/page.tsx
│       │   └── register/page.tsx
│       ├── listings/               # Каталог бизнесов
│       │   └── page.tsx
│       ├── listing/
│       │   ├── create/page.tsx
│       │   └── [id]/
│       │       ├── page.tsx        # Детальная страница
│       │       └── edit/page.tsx   # Редактирование
│       ├── investors/              # Каталог инвесторов
│       │   └── page.tsx
│       ├── investor/
│       │   ├── create/page.tsx
│       │   └── [id]/page.tsx
│       ├── jobs/                   # Каталог вакансий
│       │   └── page.tsx
│       ├── job/
│       │   ├── create/page.tsx
│       │   └── [id]/page.tsx
│       ├── franchises/             # Каталог франшиз
│       │   └── page.tsx
│       ├── category/
│       │   └── [slug]/page.tsx     # Страница категории
│       ├── favorites/page.tsx
│       ├── chat/
│       │   ├── page.tsx            # Список чатов
│       │   └── [id]/page.tsx       # Чат-комната
│       ├── profile/
│       │   ├── page.tsx            # Профиль пользователя
│       │   └── settings/page.tsx
│       ├── dashboard/              # Дашборд продавца/инвестора
│       │   └── page.tsx
│       ├── about/page.tsx
│       ├── privacy/page.tsx
│       ├── terms/page.tsx
│       └── contact/page.tsx
├── components/
│   ├── ui/                         # shadcn/ui компоненты (не трогаем)
│   ├── layout/                     # Навигация, footer, sidebar
│   │   ├── main-nav.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── footer.tsx
│   │   └── bottom-tab-bar.tsx
│   ├── listings/                   # Компоненты листингов
│   │   ├── listing-card.tsx
│   │   ├── listing-filters.tsx
│   │   ├── listing-grid.tsx
│   │   └── listing-wizard/
│   │       ├── listing-wizard.tsx
│   │       ├── step-category.tsx
│   │       ├── step-basic-info.tsx
│   │       ├── step-metrics.tsx
│   │       ├── step-images.tsx
│   │       └── step-review.tsx
│   ├── investors/                  # Компоненты инвесторов
│   │   ├── investor-card.tsx
│   │   ├── investor-filters.tsx
│   │   └── investor-profile-form.tsx
│   ├── jobs/                       # Компоненты вакансий
│   │   ├── job-card.tsx
│   │   ├── job-filters.tsx
│   │   └── job-form.tsx
│   ├── charts/                     # Графики
│   │   ├── revenue-chart.tsx
│   │   └── metrics-chart.tsx
│   ├── shared/                     # Переиспользуемые
│   │   ├── favorite-button.tsx
│   │   ├── category-badge.tsx
│   │   ├── country-select.tsx
│   │   ├── currency-display.tsx
│   │   ├── markdown-editor.tsx
│   │   ├── markdown-viewer.tsx
│   │   ├── image-upload.tsx
│   │   └── empty-state.tsx
│   └── providers/
│       ├── theme-provider.tsx
│       └── auth-provider.tsx
├── db/
│   ├── index.ts                    # Подключение к БД
│   ├── schema.ts                   # Drizzle-схема (все таблицы)
│   └── seed.ts                     # Заполнение БД тестовыми данными
├── i18n/
│   ├── routing.ts                  # Конфигурация локалей
│   └── request.ts                  # Серверная загрузка переводов
├── lib/
│   ├── utils.ts                    # cn() и общие утилиты
│   ├── constants/
│   │   ├── countries.ts            # Список стран Европы
│   │   ├── currencies.ts           # EUR, GBP, CHF
│   │   └── category-icons.ts       # Маппинг slug → Lucide-иконка
│   ├── actions/                    # Server Actions (мутации)
│   │   ├── listings.ts
│   │   ├── investors.ts
│   │   ├── jobs.ts
│   │   ├── favorites.ts
│   │   ├── chat.ts
│   │   └── auth.ts
│   ├── data/                       # Запросы данных (read-only)
│   │   ├── listings.ts
│   │   ├── listing-details.ts
│   │   ├── investors.ts
│   │   ├── jobs.ts
│   │   ├── categories.ts
│   │   └── dashboard.ts
│   └── schemas/                    # Zod-схемы валидации
│       ├── listing.ts
│       ├── investor.ts
│       ├── job.ts
│       └── auth.ts
└── middleware.ts                   # next-intl middleware
```

### 2.3 Конвенция слоёв

| Слой | Папка | Ответственность |
|------|-------|----------------|
| Данные (чтение) | `lib/data/` | SELECT-запросы, функции `getXxx()` — вызываются из серверных компонентов |
| Действия (запись) | `lib/actions/` | INSERT/UPDATE/DELETE, `"use server"`, `revalidatePath` |
| Валидация | `lib/schemas/` | Zod-схемы, переиспользуются в actions и формах |
| Константы | `lib/constants/` | Статичные маппинги (страны, валюты, иконки категорий) |
| UI-компоненты | `components/` | Презентационная логика, feature-based группировка |
| Страницы | `app/[locale]/` | Серверные компоненты, загрузка данных, передача в клиентские компоненты |

---

## 3. Правила интернационализации (i18n)

### 3.1 Поддерживаемые локали

| Код | Язык | Приоритет |
|-----|------|-----------|
| `en` | English | Основной (дефолт) |
| `fr` | Français | Высокий |
| `es` | Español | Высокий |
| `pt` | Português | Высокий |
| `de` | Deutsch | Высокий |
| `it` | Italiano | Высокий |
| `nl` | Nederlands | Средний |
| `ru` | Русский | Средний |

### 3.2 Жёсткие правила

- **НОЛЬ хардкода строк** в компонентах. Абсолютно все тексты — через `useTranslations()` (client) или `getTranslations()` (server)
- Ключи переводов — **английские**, вложенные по секциям: `Navigation.home`, `Listings.search`
- Файлы переводов: `messages/{locale}.json` — плоская структура секций
- При добавлении нового текста — **сразу** добавлять ключ во ВСЕ файлы переводов
- Даты форматировать через `Intl.DateTimeFormat` с учётом локали
- Числа и валюту — через `Intl.NumberFormat` с учётом локали
- Плюрализация — через ICU Message Format (поддерживается next-intl)

### 3.3 Структура ключей переводов

```
{
  "HomePage": { ... },
  "Navigation": { ... },
  "Listings": { ... },
  "ListingCard": { ... },
  "ListingDetail": { ... },
  "Investors": { ... },
  "InvestorCard": { ... },
  "InvestorDetail": { ... },
  "Jobs": { ... },
  "JobCard": { ... },
  "JobDetail": { ... },
  "Franchises": { ... },
  "Wizard": { ... },
  "Favorites": { ... },
  "Chat": { ... },
  "Profile": { ... },
  "Dashboard": { ... },
  "Auth": { ... },
  "Footer": { ... },
  "Categories": { ... },
  "Countries": { ... },
  "Common": { ... },
  "Errors": { ... },
  "Filters": { ... }
}
```

---

## 4. Модель данных: ключевые принципы

### 4.1 Мы — площадка

- InvestBro — **доска объявлений**, а не брокер, не посредник, не краудфандинг
- Мы **не берём обязательств** по сделкам, не обрабатываем платежи
- Мы **связываем стороны**: продавец ↔ покупатель, стартап ↔ инвестор, работодатель ↔ кандидат
- Вся коммуникация — через встроенный чат платформы
- Мы **не гарантируем** достоверность данных, но предоставляем инструменты верификации

### 4.2 Категории

- Иерархическая структура: **3 уровня** (раздел → категория → подкатегория)
- Поле `parentId` (self-referencing) в таблице `categories`
- Навигация по slug: `/category/online-business/saas/micro-saas`
- Каждая категория имеет: `slug`, `nameEn`, `nameRu`, `nameFr`, `nameEs` (и другие локали), `parentId`, `icon` (slug Lucide-иконки), `order` (для сортировки)
- Все категории из `categories.md` должны быть представлены в seed-данных
- Удалённые названия сторонних платформ заменяются на обобщённые описания (напр. «Магазин на маркетплейсе» вместо конкретных названий)

### 4.3 Валюта и география

- **Основная валюта**: EUR
- **Поддерживаемые валюты**: EUR, GBP, CHF, USD (для онлайн-бизнесов)
- **Формат цен**: `Intl.NumberFormat` с locale-aware форматированием
- **География**: предзаполненный список **европейских стран** с городами
- **Локация в листинге**: структурированные данные `{ country: string, city?: string }` — не свободный текст
- Для онлайн-бизнесов — опция «Remote / Global»

### 4.4 Целевые страны (приоритет)

| Страна | Код | Валюта |
|--------|-----|--------|
| Франция | FR | EUR |
| Испания | ES | EUR |
| Португалия | PT | EUR |
| Италия | IT | EUR |
| Германия | DE | EUR |
| Великобритания | GB | GBP |
| Нидерланды | NL | EUR |
| Бельгия | BE | EUR |
| Швейцария | CH | CHF |
| Австрия | AT | EUR |
| Ирландия | IE | EUR |
| Люксембург | LU | EUR |
| Греция | GR | EUR |
| Швеция | SE | EUR* |
| Дания | DK | EUR* |
| Норвегия | NO | EUR* |
| Финляндия | FI | EUR |
| Польша | PL | EUR* |
| Чехия | CZ | EUR* |

> *Для стран вне еврозоны — используется EUR как базовая валюта, но можно указать локальную.

---

## 5. Правила кода

### 5.1 TypeScript

- **Strict mode** — всегда
- Типы — **explicit** для функций и пропсов, `infer` разрешён для переменных
- `interface` для пропсов компонентов, `type` для утилитарных типов
- Никаких `any` — использовать `unknown` + type guards
- `as const` для константных массивов и объектов

### 5.2 Именование

| Сущность | Конвенция | Пример |
|----------|-----------|--------|
| Файлы | kebab-case | `listing-card.tsx` |
| Компоненты | PascalCase | `ListingCard` |
| Функции/хуки | camelCase | `useListingFilters` |
| Константы | UPPER_SNAKE_CASE | `MAX_IMAGES_COUNT` |
| CSS-классы | Tailwind utility | `className="flex gap-4"` |
| DB-поля | snake_case | `yearly_revenue` |
| URL-сегменты | kebab-case | `/listing/create` |
| i18n-ключи | PascalCase.camelCase | `ListingCard.viewDetails` |

### 5.3 Компоненты

- **Один компонент — один файл**
- Пропсы описываются `interface` в том же файле
- Дефолтный экспорт **запрещён** — только именованные (`export function`)
- Стили — только Tailwind-классы, inline `style={}` запрещён (кроме dynamic values)
- Условный рендеринг: `{condition && <Component />}` или тернарник — не `condition ? <A/> : null`

### 5.4 Server Actions

- Каждый action — отдельная функция с `"use server"` директивой
- Валидация входных данных через Zod **до** любых DB-операций
- Возвращаемый тип: `{ success: true, data: T } | { success: false, error: string }`
- `revalidatePath()` после каждой мутации
- Обработка ошибок через try/catch — никаких unhandled rejections

### 5.5 Git-конвенции

- Коммиты на английском, conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`
- Ветки: `feature/`, `fix/`, `refactor/`, `docs/`
- PR-описание — что изменено, зачем, скриншот (если UI)

---

## 6. Качество и производительность

### 6.1 SEO

- Каждая публичная страница имеет `metadata` (title, description, og:image)
- Динамические metadata через `generateMetadata()`
- Локализованные metadata для каждой локали
- `sitemap.xml` генерируется автоматически
- Семантический HTML: `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`

### 6.2 Производительность

- Изображения — `next/image` с `loading="lazy"` (кроме above-the-fold)
- Шрифты — `next/font` (Outfit)
- Минимизация клиентского JS — максимум серверных компонентов
- Skeleton-loading для всех асинхронных блоков
- `Suspense` boundaries для streaming
- Пагинация для списков (infinite scroll или page-based)
- Кеширование запросов через `unstable_cache` или React cache

### 6.3 Доступность (a11y)

- Все интерактивные элементы — accessible (shadcn/ui обеспечивает из коробки)
- `aria-label` для иконочных кнопок
- Контраст — WCAG AA минимум
- Keyboard navigation — Tab, Enter, Escape работают везде
- Focus visible стили — не скрывать

---

## 7. Безопасность

- Все пользовательские данные — валидация и санитизация на сервере
- Markdown-описания — рендерить через `react-markdown` (XSS-safe)
- Загрузка файлов — проверка типа, размера, вирусов (будущее)
- Rate limiting для server actions (будущее)
- CSRF-защита через NextAuth
- Sensitive данные — только в переменных окружения (`process.env`)
- `.env` файлы — **никогда** не коммитить в git

---

## 8. Документирование выполненных этапов

- После завершения каждой фазы создавать папку `docs/completed/phase-N/` с конспектом выполненных изменений
- Конспект должен содержать:
  - **Список всех созданных файлов** и их назначение
  - **Список всех изменённых файлов** и краткое описание правок
  - **Архитектурные решения** — почему выбрано именно это решение
  - **Схема данных** — какие таблицы/поля добавлены или изменены
  - **i18n ключи** — какие секции переводов добавлены
  - **Зависимости** — какие пакеты установлены
- Обновлять `docs/plan/roadmap.md` — отмечать фазу как выполненную с датой
- Документация пишется для **навигации и быстрого понимания**, без воды — конкретные факты, файлы, решения
- Формат: Markdown, структурированный, с якорями для быстрого поиска
