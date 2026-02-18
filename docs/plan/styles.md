# Визуальная система InvestBro

> Каждый экран — как кадр из фильма. Дизайн, который хочется трогать.

---

## 1. Философия дизайна

### Принципы

1. **Cinematic Dark-First** — тёмная тема как основная, светлая как альтернатива. Глубина, а не плоскость
2. **Контент — король** — UI обслуживает данные, не наоборот. Метрики, графики, цены — на первом плане
3. **Минимализм с характером** — каждый элемент оправдан; пустое пространство — осознанный выбор
4. **Ощущение премиума** — плавные transitions, subtle shadows, backdrop-blur — ощущение дорогого продукта
5. **Mobile-first** — проектируем сначала для телефона, потом расширяем

### Вдохновение

- Кинематографичность и ряды контента (стриминговые сервисы)
- Чистота и скорость (Linear, Vercel)
- Финансовая аналитика (торговые терминалы, дашборды)
- Ощущение доверия (банковские приложения)

---

## 2. Цветовая палитра

### 2.1 Система на oklch

Все цвета определяются через oklch() в CSS-переменных для точного контроля lightness, chroma и hue.

### 2.2 Dark Theme (основная)

```
Фон (Background)
├── Base:        oklch(0.13 0.005 270)      — глубокий тёмно-синий, почти чёрный
├── Surface 1:   oklch(0.18 0.008 270)      — карточки, панели
├── Surface 2:   oklch(0.22 0.010 270)      — elevated элементы (dropdown, modal)
├── Surface 3:   oklch(0.26 0.012 270)      — hover-состояния

Текст (Foreground)
├── Primary:     oklch(0.95 0.005 270)      — основной текст, почти белый
├── Secondary:   oklch(0.70 0.010 270)      — вторичный текст, подписи
├── Muted:       oklch(0.50 0.010 270)      — placeholder, disabled
├── Inverse:     oklch(0.13 0.005 270)      — текст на светлых кнопках

Brand / Primary
├── Default:     oklch(0.55 0.25 275)       — индиго, основной акцент
├── Hover:       oklch(0.60 0.27 275)       — светлее при hover
├── Active:      oklch(0.50 0.23 275)       — темнее при active
├── Foreground:  oklch(0.98 0 0)            — текст на primary кнопках

Accent / Success (финансы, рост)
├── Emerald:     oklch(0.65 0.20 160)       — выручка, прибыль, позитивные метрики
├── Emerald Dim: oklch(0.45 0.15 160)       — фон для badge «profit»

Warning
├── Amber:       oklch(0.75 0.18 80)        — предупреждения, pending
├── Amber Dim:   oklch(0.50 0.12 80)        — фон для warning badge

Destructive
├── Red:         oklch(0.60 0.22 25)        — ошибки, удаление
├── Red Dim:     oklch(0.40 0.15 25)        — фон для error badge

Chart Palette (5 цветов для графиков)
├── Chart 1:     oklch(0.55 0.25 275)       — индиго (primary)
├── Chart 2:     oklch(0.65 0.20 160)       — emerald
├── Chart 3:     oklch(0.75 0.18 80)        — amber
├── Chart 4:     oklch(0.60 0.25 310)       — violet
├── Chart 5:     oklch(0.65 0.22 25)        — coral

Borders & Dividers
├── Border:      oklch(1 0 0 / 8%)          — subtle border
├── Border Hover:oklch(1 0 0 / 15%)         — border на hover
├── Divider:     oklch(1 0 0 / 5%)          — разделители секций

Gradients
├── Hero:        linear-gradient(135deg, oklch(0.30 0.15 275), oklch(0.20 0.12 300), oklch(0.13 0.005 270))
├── Card Hover:  linear-gradient(135deg, oklch(0.22 0.03 275), oklch(0.18 0.008 270))
├── CTA Button:  linear-gradient(135deg, oklch(0.55 0.25 275), oklch(0.50 0.22 300))
├── Emerald Glow:linear-gradient(180deg, oklch(0.65 0.20 160 / 20%), transparent)
```

### 2.3 Light Theme (альтернативная)

```
Фон (Background)
├── Base:        oklch(0.985 0.002 270)     — молочно-белый с холодным оттенком
├── Surface 1:   oklch(1.0 0 0)             — карточки — чистый белый
├── Surface 2:   oklch(0.97 0.003 270)      — elevated элементы
├── Surface 3:   oklch(0.94 0.005 270)      — hover-состояния

Текст (Foreground)
├── Primary:     oklch(0.15 0.010 270)      — почти чёрный с синим оттенком
├── Secondary:   oklch(0.40 0.015 270)      — вторичный
├── Muted:       oklch(0.60 0.010 270)      — placeholder

Brand / Primary
├── Default:     oklch(0.50 0.25 275)       — чуть темнее для контраста на светлом фоне
├── Hover:       oklch(0.45 0.23 275)
├── Foreground:  oklch(0.98 0 0)

Accent
├── Emerald:     oklch(0.55 0.20 160)       — темнее для контраста
├── Amber:       oklch(0.65 0.18 80)
├── Red:         oklch(0.55 0.22 25)

Borders
├── Border:      oklch(0 0 0 / 8%)
├── Border Hover:oklch(0 0 0 / 15%)
```

### 2.4 Категориальные цвета

Каждый раздел категорий имеет свой уникальный gradient для badge и иконок:

```
Онлайн-бизнес:   oklch(0.55 0.25 275) → oklch(0.50 0.22 300)    — индиго → фиолет
Офлайн-бизнес:   oklch(0.65 0.20 160) → oklch(0.60 0.18 180)    — emerald → teal
Франшизы:        oklch(0.75 0.18 80)  → oklch(0.70 0.20 50)     — amber → orange
Стартапы:        oklch(0.60 0.25 310) → oklch(0.55 0.22 340)    — violet → pink
Доли/партнёрство:oklch(0.60 0.20 200) → oklch(0.55 0.18 220)   — sky → blue
Инвесторы:       oklch(0.70 0.15 60)  → oklch(0.65 0.18 40)     — gold → warm
Вакансии:        oklch(0.60 0.22 25)  → oklch(0.55 0.20 350)    — coral → rose
```

---

## 3. Типографика

### 3.1 Шрифт

**Outfit** — основной и единственный шрифт (уже подключён через `next/font`).

Геометрический, современный, отлично читается на всех размерах. Поддерживает латиницу и кириллицу.

### 3.2 Масштаб размеров

```
Hero Title:      48px / 56px line-height / 700 weight    — только главная страница
                 64px / 72px на xl+ экранах

Page Title (h1): 36px / 44px / 700                       — заголовки страниц
                 40px / 48px на lg+

Section Title:   28px / 36px / 600                       — заголовки секций
(h2)             32px / 40px на lg+

Subtitle (h3):   22px / 30px / 600                       — подзаголовки

Card Title:      18px / 26px / 600                       — заголовки карточек
                 20px / 28px на lg+

Body:            16px / 26px / 400                       — основной текст

Body Small:      14px / 22px / 400                       — вторичный текст, подписи

Caption:         12px / 18px / 500                       — badges, мелкие подписи

Metric Value:    28px / 34px / 700                       — финансовые показатели
                 32px / 38px на lg+

Price (Large):   36px / 42px / 700                       — цена на детальной странице
```

### 3.3 Правила

- `font-weight: 400` — body текст
- `font-weight: 500` — UI-элементы (кнопки, навигация, badges)
- `font-weight: 600` — заголовки секций, карточек
- `font-weight: 700` — hero, page titles, цены и метрики
- Не использовать `font-weight: 300` (light) — плохая читаемость на тёмном фоне
- Letter-spacing: `-0.02em` для заголовков ≥28px; `0` для body; `0.02em` для captions/badges

---

## 4. Компоненты (кастомизация shadcn/ui)

### 4.1 Глобальные настройки

```
Base radius:     0.75rem (12px)  — скруглённее стандартного shadcn
Ring width:      2px             — focus ring
Transition:      200ms ease      — все hover/focus переходы
```

### 4.2 Кнопки (Button)

```
Primary:
  bg: gradient (primary → primary-hover)
  text: primary-foreground
  hover: brightness +5%, shadow-lg с glow primary/20%
  active: brightness -5%
  height: 44px (default), 52px (lg), 36px (sm)
  padding: 20px horizontal
  border-radius: 0.75rem
  font-weight: 500
  transition: all 200ms ease

Secondary:
  bg: surface-2
  border: 1px solid border
  hover: bg surface-3, border-hover
  
Ghost:
  bg: transparent
  hover: bg surface-2
  
Destructive:
  bg: red
  hover: red + brightness
```

### 4.3 Карточки (Card)

```
Listing Card:
  bg: surface-1 / 80% opacity
  backdrop-filter: blur(16px) saturate(150%)
  border: 1px solid border (oklch 1 0 0 / 8%)
  border-radius: 1rem (16px)
  overflow: hidden
  transition: transform 200ms ease, box-shadow 200ms ease
  
  hover:
    transform: translateY(-4px)
    box-shadow: 0 20px 40px oklch(0 0 0 / 30%), 0 0 0 1px oklch(1 0 0 / 12%)
    border-color: border-hover
  
  Внутри:
    Image/Chart area: aspect-ratio 16/10, bg surface-2, overflow hidden
    Content: padding 20px
    Footer: padding 16px 20px, border-top 1px solid border
```

### 4.4 Inputs

```
Input / Select / Textarea:
  bg: surface-2 / 50%
  border: 1px solid border
  border-radius: 0.75rem
  height: 44px (input/select), auto (textarea)
  padding: 12px 16px
  font-size: 16px (предотвращает zoom на iOS)
  
  focus:
    border-color: primary
    ring: 2px primary / 20%
    bg: surface-2 / 80%
  
  placeholder:
    color: muted-foreground
```

### 4.5 Badges

```
Default Badge:
  height: 24px
  padding: 4px 10px
  border-radius: 9999px (pill)
  font-size: 12px
  font-weight: 500
  
Category Badge:
  bg: gradient (по разделу категории, см. 2.4)
  text: white
  
Status Badge:
  Active:  bg emerald/15%, text emerald, border emerald/25%
  Draft:   bg amber/15%, text amber, border amber/25%
  Sold:    bg muted, text muted-foreground
  
Type Badge:
  Online:  bg primary/15%, text primary
  Offline: bg emerald/15%, text emerald
```

### 4.6 Диалоги и Sheet

```
Dialog / Sheet:
  bg: surface-2
  backdrop-filter: blur(24px)
  border: 1px solid border
  border-radius: 1.25rem (20px)
  
Overlay:
  bg: oklch(0 0 0 / 60%)
  backdrop-filter: blur(4px)
```

---

## 5. Навигация

### 5.1 Desktop Header (sticky)

```
Container:
  position: sticky, top: 0, z-index: 50
  bg: background / 80%
  backdrop-filter: blur(16px) saturate(150%)
  border-bottom: 1px solid border
  height: 64px
  transition: height 200ms, background 200ms

При скролле (scrolled > 20px):
  height: 56px
  bg: background / 95%

Содержимое:
  LEFT:   Logo (Lucide BriefcaseBusiness + "InvestBro") — font-weight 700, 20px
  CENTER: Nav links — Бизнесы, Инвесторы, Вакансии, Франшизы
          Active link: text-primary, border-bottom 2px primary
          Hover: text-primary / 80%
  RIGHT:  ThemeToggle + LanguageSwitcher + [Login | Avatar+Dropdown]
          CTA Button: "Разместить" — primary, sm size
```

### 5.2 Mobile Bottom Tab Bar

```
Container:
  position: fixed, bottom: 0, left: 0, right: 0
  z-index: 50
  bg: surface-1 / 95%
  backdrop-filter: blur(16px)
  border-top: 1px solid border
  height: 64px + safe-area-inset-bottom
  padding-bottom: env(safe-area-inset-bottom)

5 табов (равномерно):
  Home     — House icon
  Поиск    — Search icon
  Создать  — PlusCircle icon (выделен primary цветом, увеличен)
  Чат      — MessageCircle icon + badge с кол-вом непрочитанных
  Профиль  — User icon

Active tab:
  color: primary
  icon: filled variant (если доступен) или text-primary
  label: font-weight 600

Inactive tab:
  color: muted-foreground
  
Анимация: spring-like scale при тапе (0.95 → 1.0)
```

### 5.3 Mobile Top Header

```
  height: 56px
  LEFT: Logo (иконка + "IB" сокращённо)
  RIGHT: ThemeToggle + LanguageSwitcher (compact)
  
  Без бургер-меню — вся навигация в bottom tab bar
```

---

## 6. Главная страница — Netflix-стиль

### 6.1 Hero-секция

```
Container:
  height: min(85vh, 700px)
  bg: mesh gradient (indigo → violet → dark blue → background)
  position: relative
  overflow: hidden

Декоративный слой:
  Radial gradient circles (subtle, animated):
    Circle 1: oklch(0.55 0.25 275 / 15%) — top-right, 600px, blur 200px
    Circle 2: oklch(0.60 0.25 310 / 10%) — bottom-left, 400px, blur 150px
  
  Grid pattern (subtle):
    bg-image: linear-gradient(oklch(1 0 0 / 3%) 1px, transparent 1px),
              linear-gradient(90deg, oklch(1 0 0 / 3%) 1px, transparent 1px)
    bg-size: 60px 60px

Контент (по центру):
  max-width: 720px
  Title: 48-64px / 700 / text-center / animate fade-up
  Subtitle: 18-20px / 400 / text-secondary / text-center / animate fade-up delay-100ms
  Search bar: 52px height, bg surface-2/80%, backdrop-blur, rounded-2xl / animate fade-up delay-200ms
  CTA row: 2 кнопки — Primary "Смотреть бизнесы" + Secondary "Разместить" / animate fade-up delay-300ms
```

### 6.2 Контентные ряды (Netflix-scroll)

```
Row Container:
  padding: 48px 0

Row Header:
  display: flex, justify-between, align-center
  Title: h2 28px/600
  "Все →" link: text-primary, hover underline

Scroll Container:
  overflow-x: auto
  scroll-snap-type: x mandatory
  scrollbar: hidden (webkit-scrollbar: none)
  gap: 20px
  padding: 0 container-padding

Navigation Arrows (desktop only):
  position: absolute, top: 50%, transform: translateY(-50%)
  LEFT: left edge, gradient fade from background
  RIGHT: right edge, gradient fade from background
  Button: 48px circle, bg surface-2/80%, backdrop-blur
  hover: bg surface-3, shadow-lg
  Появляются только при hover на ряд

Card в ряду:
  min-width: 320px (mobile: 280px)
  scroll-snap-align: start
```

### 6.3 Категориальные ряды

```
Category Card (в горизонтальном ряду):
  width: 160px (desktop), 130px (mobile)
  aspect-ratio: 1
  bg: gradient (по разделу категории)
  border-radius: 1rem
  display: flex, flex-col, items-center, justify-center, gap-8px
  
  Icon: Lucide, 32px, stroke-width 1.5, color white
  Label: 14px / 500, color white, text-center, max 2 lines
  
  hover:
    transform: scale(1.05)
    shadow-xl
  
  active:
    transform: scale(0.98)
```

---

## 7. Карточка листинга — детально

### 7.1 Структура

```
┌─────────────────────────────────────┐
│  [Chart Area / Image]     aspect    │
│                          16:10      │
│  ┌──────┐                           │
│  │Online│  badge top-left overlay   │
│  └──────┘                           │
│                          ♡ top-right│
├─────────────────────────────────────┤
│  Category Badge (gradient pill)     │
│  Title (18px/600, max 2 lines)      │
│  Location • Country (14px, muted)   │
├─────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┐ │
│  │ Revenue  │  Profit  │ Payback  │ │
│  │ €125K/yr │  €45K/yr │ 2.3 yrs  │ │
│  │ emerald  │  emerald │ primary  │ │
│  └──────────┴──────────┴──────────┘ │
├─────────────────────────────────────┤
│  Asking Price: €280,000        [→]  │
│  (36px/700)              View btn   │
└─────────────────────────────────────┘
```

### 7.2 Мини-чарт на карточке

```
Chart Area:
  AreaChart (recharts)
  height: 180px
  bg: surface-2
  
  Area:
    fill: linear-gradient(180deg, emerald/30% → transparent)
    stroke: emerald, 2px
    
  Без осей, без тиков, без tooltip — чистый тренд
  CartesianGrid: hidden
  
  Fallback (нет данных):
    bg: surface-2
    centered: BarChart3 icon (muted, 48px) + "Нет данных"
```

---

## 8. Анимации

### 8.1 Page Transitions

```
Entrance:
  opacity: 0 → 1
  transform: translateY(8px) → translateY(0)
  duration: 300ms
  easing: cubic-bezier(0.25, 0.1, 0.25, 1)
```

### 8.2 Stagger Animation (для сеток карточек)

```
Каждая карточка:
  animation-delay: index * 50ms (max 10 карточек, потом без задержки)
  opacity: 0 → 1
  transform: translateY(12px) → translateY(0)
  duration: 400ms
```

### 8.3 Scroll-triggered (секции на главной)

```
При появлении в viewport (IntersectionObserver):
  opacity: 0 → 1
  transform: translateY(20px) → translateY(0)
  duration: 500ms
  threshold: 0.1

Для счётчиков статистики:
  Число анимируется от 0 до target за 1.5s
  easing: ease-out
```

### 8.4 Micro-interactions

```
Кнопка Favorite:
  При клике: scale(1.3) → scale(1.0), duration 300ms, spring easing
  Heart: animate fill от контура к заливке

Кнопка CTA:
  hover: subtle glow-shadow primary/25%, translateY(-1px)
  
Skeleton Loading:
  Shimmer gradient animation
  bg: surface-2
  Animated: bg-position slide from left to right, 1.5s, infinite
  
Tab switch:
  Indicator: width и position анимируются через transform
  Duration: 200ms

Dropdown открытие:
  scale(0.95) opacity(0) → scale(1) opacity(1)
  Duration: 150ms
  Origin: top
```

---

## 9. Иконки — маппинг категорий

Все иконки — Lucide React. Хранятся в `lib/constants/category-icons.ts` как маппинг `slug → LucideIcon`.

### 9.1 Онлайн-бизнес

```
E-commerce:         ShoppingCart
SaaS:               Cloud
Контент/Медиа:      FileText
Маркетплейсы:       Store
EdTech:             GraduationCap
Финтех:             Landmark
Мобильные приложения: Smartphone
Агентства:          Megaphone
Игровая индустрия:  Gamepad2
```

### 9.2 Офлайн-бизнес

```
HoReCa:              UtensilsCrossed
Ритейл:              ShoppingBag
Услуги B2C:          Scissors (красота), Dumbbell (фитнес), Heart (медицина)
Недвижимость:        Building2
Производство:        Factory
Оптовая торговля:    Warehouse
Логистика:           Truck
Агросектор:          Wheat
Развлечения:         Ticket
Туризм:              Plane
B2B Услуги:          Handshake
```

### 9.3 Разделы

```
Франшизы:            Award
Стартапы:            Rocket
Доли/Партнёрство:    Users
Инвесторы:           TrendingUp
Вакансии:            Briefcase
```

---

## 10. Responsive-дизайн

### 10.1 Breakpoints (Tailwind 4)

```
sm:   640px    — горизонтальный мобильный, маленький планшет
md:   768px    — планшет вертикальный
lg:   1024px   — планшет горизонтальный, маленький ноутбук
xl:   1280px   — десктоп
2xl:  1536px   — широкий десктоп
```

### 10.2 Container

```
max-width: 1280px
padding-inline: 16px (mobile) → 24px (md) → 32px (lg)
margin-inline: auto
```

### 10.3 Grid-сетки

```
Listing Cards:
  mobile:  1 column
  sm:      2 columns
  lg:      3 columns
  
Investor Cards:
  mobile:  1 column
  md:      2 columns
  
Job Cards:
  mobile:  1 column (list view)
  lg:      2 columns
  
Detail Page:
  mobile:  1 column (sidebar под контентом)
  lg:      2/3 + 1/3 columns (sidebar sticky)
  
Category Row:
  Горизонтальный scroll на всех размерах
  Card width: 130px (mobile) → 160px (desktop)
  
Filters:
  mobile:  Sheet (slide-up)
  lg:      Left sidebar (250px)
```

### 10.4 Мобильная навигация

```
< 768px (md):
  — Top header: 56px, logo + theme/lang
  — Bottom tab bar: 64px + safe-area
  — Без десктопного nav
  — Фильтры в Sheet (bottom slide-up)
  — «Создать» — выделенная кнопка в tab bar

≥ 768px:
  — Top header: 64px, полная навигация
  — Без bottom tab bar
  — Фильтры в sidebar (≥ lg) или collapsible panel (md)
```

---

## 11. Dark vs Light — переключение

### 11.1 Настройки

- По умолчанию: **Dark** (defaultTheme: "dark")
- Поддерживается: Dark / Light / System
- Переключатель: в header (desktop — dropdown с Sun/Moon/Monitor, mobile — compact toggle)
- Переход: `transition: background-color 200ms ease, color 200ms ease` на `<html>`

### 11.2 Правила перехода

- Все цвета определены через CSS-переменные — переключение мгновенное
- Изображения: без фильтров (одинаковые в обеих темах)
- Чарты: цвета адаптируются через переменные `--chart-1..5`
- Иконки: color наследуется от text (currentColor)
- Shadows: в dark — чёрные тени (oklch 0 0 0 / 30-50%), в light — серые (oklch 0 0 0 / 10-20%)

---

## 12. Skeleton Loading

### 12.1 Компоненты-скелетоны

Для каждого data-зависимого компонента существует skeleton-версия:

```
ListingCardSkeleton:
  Chart area: rectangle, aspect-ratio 16/10, shimmer
  Title: rectangle 60% width, 20px height, shimmer
  Location: rectangle 40% width, 14px height, shimmer
  Metrics: 3 rectangles, 80px width each, 32px height, shimmer
  Price: rectangle 50% width, 28px height, shimmer

InvestorCardSkeleton:
  Avatar: circle 64px, shimmer
  Name: rectangle 50% width, shimmer
  Details: 3 lines, shimmer

FiltersSkeleton:
  3 inputs: rectangles, full width, 44px height, shimmer
```

### 12.2 Shimmer-эффект

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, 
    var(--surface-2) 25%, 
    var(--surface-3) 37%, 
    var(--surface-2) 63%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}
```
