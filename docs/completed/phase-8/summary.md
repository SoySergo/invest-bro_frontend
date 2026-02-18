# Фаза 8 — Аналитика и монетизация

> Дата: 2026-02-18  
> Цель: дашборды для пользователей, платные функции для выручки.

---

## Созданные файлы

| Файл | Назначение |
|------|-----------|
| `src/app/[locale]/dashboard/page.tsx` | Страница дашборда с вкладками: продавец, инвестор, монетизация |
| `src/components/dashboard/dashboard-stats.tsx` | Карточки статистики: просмотры, избранное, контакты, активные листинги |
| `src/components/dashboard/dashboard-chart.tsx` | График просмотров за 30 дней (Recharts AreaChart) |
| `src/components/dashboard/dashboard-listings.tsx` | Таблица листингов с метриками: просмотры, избранное, контакты, статус |
| `src/components/dashboard/dashboard-messages.tsx` | Последние входящие сообщения |
| `src/components/dashboard/dashboard-tips.tsx` | Контекстные советы (фото, продвижение, публикация черновиков) |
| `src/components/dashboard/investor-dashboard.tsx` | Панель инвестора: входящие запросы, подходящие проекты |
| `src/components/dashboard/monetization-section.tsx` | Монетизация: Premium подписка, продвижение листингов |
| `src/components/dashboard/view-tracker.tsx` | Клиентский компонент для записи просмотров листингов |
| `src/lib/data/dashboard.ts` | Data layer: getSellerDashboard(), getInvestorDashboard() |
| `src/lib/actions/dashboard.ts` | Server actions: recordListingView(), promoteListing(), subscribePremium() |

---

## Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `src/db/schema.ts` | Добавлены таблицы listingViews, promotedListings, premiumSubscriptions + enums + relations |
| `src/app/[locale]/listing/[id]/page.tsx` | Добавлен ViewTracker для записи просмотров |
| `src/components/layout/main-nav.tsx` | Добавлена ссылка Dashboard в dropdown пользователя |
| `messages/en.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |
| `messages/ru.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |
| `messages/fr.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |
| `messages/es.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |
| `messages/pt.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |
| `messages/de.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |
| `messages/it.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |
| `messages/nl.json` | Добавлена секция Dashboard + ключ Navigation.dashboard |

---

## Схема данных

### Новые таблицы

#### listing_views
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | PK |
| listing_id | uuid | FK → listings |
| user_id | uuid | FK → users (nullable, для анонимных) |
| created_at | timestamp | Время просмотра |

#### promoted_listings
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | PK |
| listing_id | uuid | FK → listings |
| user_id | uuid | FK → users |
| duration | enum('7','14','30') | Срок продвижения в днях |
| start_date | timestamp | Начало |
| end_date | timestamp | Окончание |
| is_active | boolean | Активно ли |
| created_at | timestamp | Дата создания |

#### premium_subscriptions
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| status | enum('active','cancelled','expired') | Статус подписки |
| start_date | timestamp | Начало |
| end_date | timestamp | Окончание |
| created_at | timestamp | Дата создания |

### Новые enums
- `promotion_duration`: '7', '14', '30'
- `subscription_status`: 'active', 'cancelled', 'expired'

### Обновлённые relations
- `listings` → добавлены `views` (many listingViews), `promotions` (many promotedListings)
- `users` → добавлены `premiumSubscriptions` (many)

---

## Архитектурные решения

1. **View Tracking через клиентский компонент**: `ViewTracker` — invisible React component с `useEffect`, вызывающий server action `recordListingView`. Не блокирует рендеринг страницы. Записывает userId если пользователь авторизован, null для анонимных.

2. **Dashboard — три вкладки**: Seller / Investor / Monetization — один URL `/dashboard`, разделение через shadcn Tabs. Позволяет пользователю видеть оба дашборда без переключения страниц.

3. **Seller Dashboard — агрегация по листингам**: Для каждого листинга считаются views, favorites, contacts (conversations) отдельными SQL count запросами. Views by day — GROUP BY с to_char для PostgreSQL.

4. **Investor Dashboard — matching**: Использует существующий механизм matching из Фазы 3 — скоринг по industries и geoFocus.

5. **Монетизация — подготовка**: Promoted Listings и Premium Subscriptions реализованы как DB-записи с датами start/end. Оплата не реализована (будущая интеграция с платёжным провайдером). Текущая реализация позволяет активировать без оплаты (демо).

6. **Tips — контекстные**: Показываются только если применимы. Например, совет про фото показывается только если есть листинг без фото.

---

## i18n ключи

### Новая секция: Dashboard

```
title, subtitle, sellerTab, investorTab, monetizationTab,
totalViews, totalFavorites, totalContacts, activeListings,
viewsOverTime, noViewsYet, myListings, noListings,
recentMessages, viewAll, noMessages, unknownUser,
tips, tipAddPhotos, tipPromote, tipComplete,
investorDashboard, noInvestorProfile, createInvestorProfile,
incomingRequests, matchingProjects, noMatchingProjects,
premiumTitle, premiumActive, premiumDescription,
premiumFeature1, premiumFeature2, premiumFeature3,
subscribePremium, premiumSuccess,
promoteTitle, promoteDescription, promoteSuccess, processing
```

### Обновлённая секция: Navigation
- Добавлен ключ `dashboard`

---

## Зависимости

Новые зависимости не добавлены. Используются существующие:
- recharts (графики)
- sonner (toast-уведомления)
- shadcn/ui tabs (вкладки)
- lucide-react (иконки)
