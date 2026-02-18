# Phase 5 — Communications

> Real-time чат, уведомления, контекстные диалоги.

---

## Что реализовано

### 5.1 DB Schema

**Новые enum'ы:**
- `conversationTypeEnum`: `listing`, `investment`, `job`
- `messageStatusEnum`: `sent`, `delivered`, `read`
- `notificationTypeEnum`: `new_message`, `job_application`, `favorite_added`, `chat_invitation`

**Изменения в таблице `conversations`:**
- Добавлено поле `type` (conversationTypeEnum) — тип диалога
- Добавлено поле `jobId` (uuid, FK → jobs) — привязка к вакансии

**Изменения в таблице `messages`:**
- Добавлено поле `status` (messageStatusEnum, default: `sent`) — статус сообщения

**Новая таблица `notifications`:**
- `id` (uuid, PK)
- `userId` (uuid, FK → users)
- `type` (notificationTypeEnum)
- `title` (text)
- `body` (text, nullable)
- `link` (text, nullable)
- `isRead` (boolean, default: false)
- `createdAt` (timestamp)

### 5.2 Typed Conversations

Три типа диалогов:
- **listing** — бизнес-сделка (привязан к листингу)
- **investment** — инвестиция (привязан к листингу/стартапу)
- **job** — найм (привязан к вакансии)

Новые server actions:
- `startInvestorChat(investorUserId, listingId?)` — диалог с инвестором
- `startJobChat(jobId)` — диалог по вакансии
- Обновлён `startChat(listingId)` — теперь создаёт уведомление

### 5.3 Enhanced Chat UI

- **ChatMessages** — клиентский компонент с real-time через SSE
  - Статусы сообщений: sent (✓), delivered (✓✓), read (✓✓ blue)
  - Optimistic updates при отправке
  - Автоскролл к новым сообщениям
  - Автоматическая отметка прочитанных
- **ChatContextCard** — карточка контекста в шапке чата (листинг/вакансия)
  - Разные иконки и цвета для каждого типа
  - Ссылка на детальную страницу
- **ChatSearch** — поиск по сообщениям (toggle)

### 5.4 Real-time (SSE)

- `/api/chat/stream?conversationId=...` — SSE для новых сообщений (polling 2s)
- `/api/notifications/stream` — SSE для уведомлений (polling 5s)
- Клиентские EventSource подключения в компонентах

### 5.5 Notifications System

**Server actions:**
- `createNotification(data)` — создание уведомления
- `markNotificationRead(id)` — отметить как прочитанное
- `markAllNotificationsRead()` — прочитать все

**Data queries:**
- `getUserNotifications(userId, limit)` — получить уведомления пользователя
- `getUnreadNotificationCount(userId)` — количество непрочитанных

**Компоненты:**
- `NotificationBell` — колокольчик в навигации с dropdown
  - Real-time обновление через SSE
  - Badge с количеством непрочитанных
  - Список уведомлений с иконками по типу
  - «Mark all as read» кнопка
  - Relative time formatting
- `NotificationBellWrapper` — серверная обёртка для начальных данных

### 5.6 Notification Triggers

Уведомления создаются при:
- **new_message** — новое сообщение в чате (уведомляется собеседник)
- **job_application** — отклик на вакансию (уведомляется владелец вакансии)
- **favorite_added** — листинг добавлен в избранное (уведомляется владелец)
- **chat_invitation** — создан новый диалог (уведомляется получатель)

### 5.7 Chat List Enhancements

- Badge типа диалога (listing/investment/job) с иконкой
- Контекстный заголовок (название листинга или вакансии)
- Счётчик непрочитанных сообщений

---

## Созданные файлы

| Файл | Назначение |
|------|-----------|
| `src/app/api/chat/stream/route.ts` | SSE endpoint для real-time чата |
| `src/app/api/notifications/stream/route.ts` | SSE endpoint для real-time уведомлений |
| `src/components/shared/chat-messages.tsx` | Компонент сообщений с real-time |
| `src/components/shared/chat-context-card.tsx` | Карточка контекста в чате |
| `src/components/shared/chat-search.tsx` | Поиск по сообщениям |
| `src/components/shared/notification-bell.tsx` | Колокольчик уведомлений |
| `src/components/shared/notification-bell-wrapper.tsx` | Серверная обёртка для NotificationBell |
| `src/lib/actions/notifications.ts` | Server actions для уведомлений |
| `src/lib/data/chat.ts` | Data queries для чата |
| `src/lib/data/notifications.ts` | Data queries для уведомлений |

## Изменённые файлы

| Файл | Изменения |
|------|----------|
| `src/db/schema.ts` | Добавлены enums, notifications таблица, обновлены conversations и messages |
| `src/lib/actions/chat.ts` | Типизированные диалоги, startInvestorChat, startJobChat, markMessagesRead, уведомления |
| `src/lib/actions/favorites.ts` | Добавлено создание уведомления при добавлении в избранное |
| `src/lib/actions/jobs.ts` | Добавлено создание уведомления при отклике на вакансию |
| `src/app/[locale]/chat/page.tsx` | Типы диалогов, badge, контекст, непрочитанные |
| `src/app/[locale]/chat/[id]/page.tsx` | ChatMessages, ChatContextCard, поддержка job |
| `src/components/layout/main-nav.tsx` | Добавлен NotificationBell |
| `messages/*.json` (×8) | Обновлены Chat и Notifications секции |

## Архитектурные решения

1. **SSE вместо WebSocket**: выбран SSE для простоты реализации в Next.js App Router. Polling каждые 2-5 секунд как fallback для масштабируемости.
2. **Optimistic updates**: сообщения добавляются в UI до подтверждения сервером для мгновенного отклика.
3. **Типизированные диалоги**: enum `conversation_type` вместо отдельных таблиц — проще расширять в будущем.
4. **Notification bell в клиенте**: использует SSE для real-time обновления без перезагрузки страницы.

## i18n ключи

Добавлены/обновлены секции во всех 8 локалях:
- `Chat` — расширена: typeListing, typeInvestment, typeJob, statusSent, statusDelivered, statusRead, searchMessages
- `Notifications` — новая: title, empty, markAllRead, newMessage, jobApplication, favoriteAdded, chatInvitation, justNow, minutesAgo, hoursAgo, daysAgo

## Зависимости

Новые зависимости не добавлены — всё реализовано на существующем стеке (Next.js API Routes, native EventSource, Drizzle ORM).
