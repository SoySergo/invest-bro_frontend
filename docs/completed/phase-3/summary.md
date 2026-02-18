# Фаза 3 — Раздел «Инвесторы»

> Дата завершения: 2026-02-18

---

## Созданные файлы

| Файл | Назначение |
|------|-----------|
| `src/db/schema.ts` | Добавлена таблица `investorProfiles` + enum `investorTypeEnum` + relations |
| `src/lib/schemas/investor.ts` | Zod-схема валидации профиля инвестора, константы типов/стадий/отраслей |
| `src/lib/actions/investors.ts` | Server actions: `createInvestorProfile`, `editInvestorProfile`, `deleteInvestorProfile` |
| `src/lib/data/investors.ts` | Data queries: `getInvestors`, `getInvestorById`, `getMatchingInvestors`, `getMatchingListings` |
| `src/components/investors/investor-card.tsx` | Карточка инвестора для каталога |
| `src/components/investors/investor-filters.tsx` | Фильтры: тип, стадия, отрасль, тип участия |
| `src/components/investors/investor-profile-form.tsx` | Форма создания/редактирования профиля инвестора |
| `src/app/[locale]/investors/page.tsx` | Страница каталога инвесторов |
| `src/app/[locale]/investor/[id]/page.tsx` | Детальная страница профиля инвестора |
| `src/app/[locale]/investor/create/page.tsx` | Страница создания профиля инвестора |
| `src/app/[locale]/investor/[id]/edit/page.tsx` | Страница редактирования профиля инвестора |

---

## Изменённые файлы

| Файл | Описание изменений |
|------|-------------------|
| `src/db/schema.ts` | Добавлены: `investorTypeEnum`, `investorProfiles` table, `investorProfilesRelations`, обновлены `usersRelations` |
| `src/middleware.ts` | Добавлен `/investor/create` в `protectedPaths` |
| `src/components/layout/main-nav.tsx` | Добавлена ссылка «Investors» в desktop nav и mobile sheet, импорт `TrendingUp` |
| `src/app/[locale]/listing/[id]/page.tsx` | Добавлен блок «Matching Investors» с карточками инвесторов |
| `messages/*.json` (8 файлов) | Добавлены секции: `Investors`, `InvestorCard`, `InvestorDetail`; ключи в `Navigation` и `ListingDetail` |

---

## Схема данных

### Таблица `investor_profiles`

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | uuid (PK) | Уникальный идентификатор |
| `user_id` | uuid (FK → users) | Владелец профиля |
| `type` | enum (angel/vc/private/strategic/institutional) | Тип инвестора |
| `stages` | jsonb (string[]) | Стадии инвестирования |
| `industries` | jsonb (string[]) | Отрасли интереса |
| `ticket_min` | decimal(12,2) | Минимальный чек |
| `ticket_max` | decimal(12,2) | Максимальный чек |
| `currency` | text | Валюта чека (default: EUR) |
| `geo_focus` | jsonb (string[]) | Географический фокус (коды стран) |
| `instrument_types` | jsonb (string[]) | Инструменты входа |
| `participation_type` | text | Тип участия (passive/smart-money/operational) |
| `requirements` | text | Требования к проектам (Markdown) |
| `portfolio` | jsonb ({name, url?}[]) | Портфолио проектов |
| `exit_strategy` | text | Стратегия выхода |
| `is_public` | boolean | Видимость в каталоге |
| `created_at` | timestamp | Дата создания |
| `updated_at` | timestamp | Дата обновления |

---

## i18n ключи

Добавлены секции во все 8 локалей (en, ru, fr, es, pt, de, it, nl):

- `Investors` — каталог, фильтры, типы инвесторов, стадии, отрасли, инструменты, участие, форма создания
- `InvestorCard` — карточка инвестора
- `InvestorDetail` — детальная страница профиля
- `Navigation.investors` — ссылка в навигации
- `ListingDetail.matchingInvestors` — блок подходящих инвесторов на странице листинга

---

## Архитектурные решения

### Matching-алгоритм

Простой scoring-based matching по пересечению:
- **Отрасли** (industries ↔ category slug): +2 за совпадение
- **Generalist**: +1 (инвестор интересуется всем)
- **Стадии**: +1 за наличие pre-seed/seed
- **География** (geoFocus ↔ listing.country): +1 за совпадение

Результаты сортируются по score, отсекаются нулевые.

### Фильтрация на стороне приложения

Фильтрация по JSONB-полям (stages, industries, geoFocus) выполняется в JavaScript после SELECT, а не через SQL JSONB-операторы — для простоты и совместимости с Drizzle ORM query builder.

### Форма

Использует `react-hook-form` + `@hookform/resolvers/zod` (как в остальном проекте). Badge-компоненты используются как toggleable chips для выбора из массивов (стадии, отрасли, страны, инструменты).

---

## Зависимости

Новые зависимости не добавлены. Используются существующие:
- `drizzle-orm` — схема и запросы
- `zod` — валидация
- `react-hook-form` + `@hookform/resolvers` — форма
- `next-intl` — i18n
- `shadcn/ui` — UI-компоненты
- `lucide-react` — иконки
