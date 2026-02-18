# Phase 4 — Jobs and Talents

> Completed: 2026-02-18

---

## Summary

Implementation of the "Hiring and Talents" section — job postings in startups and businesses with unique formats (co-founder, intern, fractional CXO, advisory).

---

## Created Files

| File | Purpose |
|------|---------|
| `src/db/schema.ts` (modified) | Added `jobs`, `jobApplications` tables, `jobStatusEnum`, `jobUrgencyEnum`, `jobLevelEnum` enums |
| `src/lib/schemas/job.ts` | Zod validation schema + constants (ROLE_CATEGORIES, JOB_LEVELS, EMPLOYMENT_TYPES, URGENCY_LEVELS) |
| `src/lib/actions/jobs.ts` | Server actions: createJob, editJob, deleteJob, applyToJob |
| `src/lib/data/jobs.ts` | Data queries: getJobs (with filters), getJobById, getJobApplications, getUserApplication |
| `src/components/jobs/job-card.tsx` | Job card component with special format badges |
| `src/components/jobs/job-filters.tsx` | Filter panel (role, level, employment type, equity) |
| `src/components/jobs/job-form.tsx` | Job creation/edit form with all fields |
| `src/components/jobs/job-apply-button.tsx` | Apply button with auth/state handling |
| `src/components/jobs/job-delete-button.tsx` | Delete button with confirmation |
| `src/app/[locale]/jobs/page.tsx` | Job catalog page |
| `src/app/[locale]/job/create/page.tsx` | Job creation page |
| `src/app/[locale]/job/[id]/page.tsx` | Job detail page |
| `src/app/[locale]/job/[id]/edit/page.tsx` | Job edit page |

## Modified Files

| File | Changes |
|------|---------|
| `src/db/schema.ts` | Added jobs, jobApplications tables + relations + enums |
| `src/middleware.ts` | Added `/job/create` to protected routes |
| `src/components/layout/main-nav.tsx` | Added "Jobs" link to desktop nav and mobile sheet |
| `messages/*.json` (all 8 locales) | Added Jobs, JobCard, JobDetail sections + Navigation.jobs key |

---

## Data Schema

### `jobs` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| userId | uuid (FK → users) | Job poster |
| listingId | uuid (FK → listings, nullable) | Optional link to business |
| title | text | Job title |
| description | text | Markdown description |
| roleCategory | text | Slug from ROLE_CATEGORIES |
| level | enum | junior/middle/senior/lead/head/clevel |
| employmentType | jsonb (string[]) | Multiple: fulltime, parttime, project, etc. |
| country | text | ISO country code (nullable) |
| city | text | City name (nullable) |
| salaryMin | decimal | Min annual salary |
| salaryMax | decimal | Max annual salary |
| currency | text | Default EUR |
| hasEquity | boolean | Whether position includes equity |
| equityDetails | text | Equity terms description |
| experienceYears | integer | Min years of experience |
| requiredStack | jsonb (string[]) | Technologies/tools |
| languages | jsonb (string[]) | Working languages |
| urgency | enum | low/medium/high/asap |
| status | enum | active/closed/draft |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |

### `jobApplications` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| jobId | uuid (FK → jobs) | Applied job |
| userId | uuid (FK → users) | Applicant |
| coverLetter | text | Optional cover letter |
| resumeUrl | text | Optional resume URL |
| status | text | pending/reviewed/accepted/rejected |
| createdAt | timestamp | Auto |

---

## i18n Keys Added

- `Jobs` — full section with title, subtitle, roles, levels, employment types, urgency, form labels
- `JobCard` — card-level labels (salary, equity, remote, special format badges)
- `JobDetail` — detail page labels (compensation, description, stack, languages, apply)
- `Navigation.jobs` — navigation link text

All 8 locales updated: en, ru, fr, es, pt, de, it, nl

---

## Unique Formats (Special Badges)

| Format | Role Category | Visual |
|--------|--------------|--------|
| Co-Founder | `co-founder` | Violet badge with Users icon |
| Internship | `intern` or `internship` in employmentType | Amber badge with Award icon |
| Fractional CXO | `fractional-cxo` | Primary badge with Zap icon |
| Advisory | `adviser` | Emerald badge with Award icon |
| With Equity | `hasEquity: true` | Amber badge with Coins icon |

---

## Architecture Decisions

1. **Followed investor pattern**: All structure mirrors Phase 3 (investors) — same file organization, same component patterns, same i18n approach
2. **RSC-first**: Pages are server components; forms, filters, and interactive buttons are client components
3. **Soft application model**: Applications are simple (cover letter + resume URL) — can be expanded later
4. **jsonb for arrays**: employmentType, requiredStack, languages stored as jsonb arrays for flexible multi-select
5. **No new dependencies**: All implemented with existing stack (shadcn/ui, Drizzle, Zod, react-hook-form, next-intl)
