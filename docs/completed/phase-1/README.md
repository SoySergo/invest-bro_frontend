# Фаза 1 — Аутентификация и профили

> Дата выполнения: 2026-02-18

---

## Что реализовано

1. **NextAuth.js v5** — аутентификация через Credentials provider (JWT-стратегия)
2. **Тестовый вход** — admin@investbro.com / admin (авто-создание при первом логине)
3. **Страницы** — /login, /register (split-screen), /profile, /profile/settings
4. **Защита роутов** — middleware блокирует неавторизованных на protected paths
5. **Навигация** — user dropdown (аватар, имя, profile, settings, logout)
6. **Server actions** — mock user заменён на `auth()` во всех мутациях
7. **i18n** — секции Auth и Profile во всех 8 локалях

---

## Зависимости

| Пакет | Версия | Назначение |
|-------|--------|------------|
| next-auth | 5.0.0-beta.30 | Аутентификация |
| @auth/drizzle-adapter | 1.11.1 | Drizzle ORM адаптер для NextAuth |
| bcryptjs | 3.0.3 | Хэширование паролей |
| @types/bcryptjs | devDep | Типы для bcryptjs |

---

## Схема данных

### Изменения в `users`

| Поле | Тип | Описание |
|------|-----|----------|
| password | text, nullable | Хэш пароля (bcrypt) |
| role | enum (user, admin) | Роль пользователя, default: user |
| emailVerified | timestamp, nullable | Дата верификации email |
| bio | text, nullable | О себе (Markdown) |
| company | text, nullable | Компания |
| website | text, nullable | Веб-сайт |
| phone | text, nullable | Телефон |
| country | text, nullable | Код страны (ISO 3166-1 alpha-2) |
| city | text, nullable | Город |

### Новые таблицы

| Таблица | Назначение |
|---------|------------|
| accounts | OAuth аккаунты (NextAuth) |
| sessions | Сессии пользователей (NextAuth) |
| verification_tokens | Токены верификации email (NextAuth) |

### Enum: `user_role`

Значения: `user`, `admin`

---

## Созданные файлы

### Auth конфигурация

| Файл | Назначение |
|------|------------|
| `src/lib/auth.ts` | NextAuth config: providers, callbacks, adapter |
| `src/app/api/auth/[...nextauth]/route.ts` | API route handler (GET, POST) |
| `src/components/providers/auth-provider.tsx` | SessionProvider wrapper ("use client") |
| `src/types/next-auth.d.ts` | Type augmentation: session.user.id, session.user.role |

### Auth schemas и actions

| Файл | Назначение |
|------|------------|
| `src/lib/schemas/auth.ts` | Zod: loginSchema, registerSchema |
| `src/lib/schemas/profile.ts` | Zod: profileSchema |
| `src/lib/actions/auth.ts` | registerUser server action |
| `src/lib/actions/profile.ts` | updateProfile, deleteAccount server actions |
| `src/lib/data/profile.ts` | getProfile, getMyListings data fetchers |

### Страницы

| Файл | URL | Назначение |
|------|-----|------------|
| `src/app/[locale]/(auth)/layout.tsx` | — | Layout для auth страниц (без nav/footer) |
| `src/app/[locale]/(auth)/login/page.tsx` | /login | Страница входа (split-screen) |
| `src/app/[locale]/(auth)/register/page.tsx` | /register | Страница регистрации |
| `src/app/[locale]/profile/page.tsx` | /profile | Профиль пользователя |
| `src/app/[locale]/profile/settings/page.tsx` | /profile/settings | Настройки аккаунта |

### Компоненты

| Файл | Назначение |
|------|------------|
| `src/components/auth/login-form.tsx` | Форма входа (react-hook-form + zod + signIn) |
| `src/components/auth/register-form.tsx` | Форма регистрации + авто-логин |
| `src/components/profile/profile-form.tsx` | Форма редактирования профиля |
| `src/components/profile/profile-settings.tsx` | Настройки: язык, удаление аккаунта |

---

## Изменённые файлы

| Файл | Что изменено |
|------|-------------|
| `src/db/schema.ts` | Добавлены поля в users, новые таблицы accounts/sessions/verificationTokens, enum userRoleEnum, новые relations |
| `src/middleware.ts` | Комбинация next-intl + auth protection, проверка cookie session token |
| `src/app/[locale]/layout.tsx` | Обёрнут в AuthProvider (SessionProvider) |
| `src/components/layout/main-nav.tsx` | Добавлен user dropdown (аватар, profile, settings, logout), useSession |
| `src/components/layout/bottom-tab-bar.tsx` | Динамический таб Profile/Login в зависимости от сессии |
| `src/lib/actions/listings.ts` | Mock user → auth() |
| `src/lib/actions/favorites.ts` | Mock user → auth() |
| `src/lib/actions/chat.ts` | Mock user → auth() |
| `src/app/[locale]/chat/page.tsx` | Mock user → auth() |
| `src/app/[locale]/chat/[id]/page.tsx` | Mock user → auth() |
| `messages/*.json` (x8) | Добавлены секции Auth и Profile |
| `package.json` | Добавлены next-auth, @auth/drizzle-adapter, bcryptjs |

---

## i18n ключи

### Секция `Auth`

```
login, register, loginTitle, loginSubtitle, registerTitle, registerSubtitle,
email, password, confirmPassword, name, username, loginButton, registerButton,
noAccount, hasAccount, orContinueWith, forgotPassword, logoutButton,
loginError, registerError, registerSuccess
```

### Секция `Profile`

```
title, settings, editProfile, saveChanges, bio, company, website, phone,
country, city, myListings, noListings, accountSettings, language,
deleteAccount, deleteAccountWarning, profileUpdated, memberSince
```

---

## Архитектурные решения

### JWT vs Database Sessions

Выбрана **JWT-стратегия** (`session: { strategy: "jwt" }`), потому что:
- Credentials provider не поддерживает database sessions в NextAuth v5
- JWT не требует обращения к БД при каждом запросе
- Роль и ID пользователя добавляются в token через callbacks

### Middleware: Cookie-based Auth Check

Middleware проверяет наличие cookie `authjs.session-token` (или `__Secure-authjs.session-token` для HTTPS). Это лёгкая проверка без расшифровки JWT — полная валидация происходит в server actions через `auth()`.

### Auto-seed Admin

При первой попытке входа с `admin@investbro.com` пользователь автоматически создаётся с захешированным паролем и ролью `admin`. Это упрощает тестирование без seed-скриптов.

### Auth Layout Group

Страницы `/login` и `/register` используют отдельный layout `(auth)/layout.tsx` без навигации и footer — только лого InvestBro для чистого split-screen дизайна.

---

## Protected Routes

| Path | Тип защиты |
|------|-----------|
| /listing/create | Redirect → /login |
| /favorites | Redirect → /login |
| /chat | Redirect → /login |
| /profile | Redirect → /login |
| /dashboard | Redirect → /login |

При редиректе сохраняется `callbackUrl` для возврата после входа.
