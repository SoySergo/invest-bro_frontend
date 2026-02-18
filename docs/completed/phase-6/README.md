# Phase 6 — UX, Discovery и SEO

> Completed: 2026-02-18

---

## Summary

Phase 6 transforms InvestBro from a basic catalog into a smart platform with discovery mechanics, Netflix-style browsing, global search, category navigation, recommendations, and full SEO coverage.

---

## Created Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/category/[slug]/page.tsx` | Category page with breadcrumbs, subcategory grid, filtered listings |
| `src/app/sitemap.ts` | Auto-generated sitemap.xml from listings, categories, and static pages |
| `src/app/robots.ts` | robots.txt with rules for crawlers |
| `src/components/shared/scroll-row.tsx` | Netflix-style horizontal scroll container with navigation arrows |
| `src/components/shared/animated-counter.tsx` | Animated number counter with IntersectionObserver |
| `src/components/shared/command-search.tsx` | Command palette (Cmd+K) with global search across listings, investors, jobs |
| `src/lib/actions/search.ts` | Server action for global search across all entity types |
| `docs/completed/phase-6/README.md` | This documentation file |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/[locale]/page.tsx` | Complete homepage redesign: Netflix scroll rows (Trending, Online, Offline, Investors, Jobs), hero search bar, animated statistics counters, `generateMetadata()` |
| `src/app/[locale]/listings/page.tsx` | Added `generateMetadata()` for SEO |
| `src/app/[locale]/investors/page.tsx` | Added `generateMetadata()` for SEO |
| `src/app/[locale]/jobs/page.tsx` | Added `generateMetadata()` for SEO |
| `src/app/[locale]/listing/[id]/page.tsx` | Added `generateMetadata()`, "Similar Businesses" section |
| `src/components/layout/main-nav.tsx` | Added `CommandSearch` component to header |
| `src/lib/data/listings.ts` | Added `getSimilarListings()` and `getListingsByCategorySlug()` |
| `src/lib/data/categories.ts` | Added `getCategoryBySlug()` with breadcrumb chain |
| `src/app/globals.css` | Added `scrollbar-hide` utility class |
| `messages/*.json` (all 8 locales) | Added `Search`, `HomePage` (new keys), `CategoryPage`, `SimilarListings`, `SEO` sections |

---

## Architectural Decisions

### Netflix-style Scroll Rows
- Used a reusable `ScrollRow` client component with scroll-snap, ResizeObserver for arrow visibility, and smooth scrolling
- Each content section (Trending, Online, Offline, Investors, Jobs) is a separate scroll row
- Navigation arrows appear on hover (desktop only) with gradient fade backgrounds

### Command Palette Search
- Implemented using shadcn/ui `Command` component (built on cmdk)
- Debounced search (300ms) with server action for data fetching
- Results grouped by type: Businesses, Investors, Jobs
- Keyboard shortcut: Cmd+K / Ctrl+K

### Category Page
- Hierarchical breadcrumb navigation built from parent chain
- Subcategory grid with Lucide icons for visual navigation
- Listings filtered by category and all subcategories

### Similar Listings
- Score-based algorithm considering: same category (+3), price range ±50-200% (+2), same country (+1), same location type (+1)
- Displayed on listing detail page below matching investors

### SEO
- `generateMetadata()` on all public pages with localized titles/descriptions
- Dynamic sitemap.xml generated from database (listings + categories + static pages × 8 locales)
- robots.txt blocking private routes (/chat/, /profile/, /dashboard/, create pages)
- Canonical URLs with locale prefix

---

## i18n Keys Added

| Section | Keys |
|---------|------|
| `HomePage` | heroSearchPlaceholder, trendingListings, investorsSection, jobsSection, platformStats, statListings, statInvestors, statCountries, statJobs |
| `CategoryPage` | breadcrumbHome, subcategories, listingsInCategory, noListingsInCategory, browseAll |
| `SimilarListings` | title, viewAll |
| `SEO` | homeTitle, homeDescription, listingsTitle, listingsDescription, investorsTitle, investorsDescription, jobsTitle, jobsDescription, categoryTitle, categoryDescription, listingDetailTitle, listingDetailDescription |
| `Search` | placeholder, inputPlaceholder, searching, noResults, businesses, investors, jobs |

All keys added to all 8 locale files (en, fr, es, pt, de, it, nl, ru) with proper translations.

---

## Dependencies

No new dependencies added. All features built using existing packages:
- `cmdk` (via shadcn/ui `command` component) — already installed
- `lucide-react` — existing
- `next-intl` — existing
- `recharts` — existing
