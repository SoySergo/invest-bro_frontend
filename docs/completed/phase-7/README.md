# Phase 7 — Trust and Safety

> Completed: 2026-02-18

## Overview

Phase 7 implements the trust and safety layer: user verification, reviews/ratings, and report/moderation system.

---

## Created Files

| File | Purpose |
|------|---------|
| `src/lib/schemas/review.ts` | Zod validation schema for reviews (rating 1-5, comment) |
| `src/lib/schemas/report.ts` | Zod validation schema for reports (reason, description) |
| `src/lib/actions/reviews.ts` | Server actions: `submitReview`, `deleteReview` |
| `src/lib/actions/reports.ts` | Server actions: `submitReport`, `resolveReport` (admin) |
| `src/lib/actions/verification.ts` | Server actions: `requestVerification`, `updateVerificationStatus` (admin), `toggleBlockUser` (admin) |
| `src/lib/data/reviews.ts` | Data fetching: `getReviewsForUser`, `getUserRating`, `getReviewsForListing` |
| `src/lib/data/reports.ts` | Data fetching: `getReports`, `getReportsForListing` |
| `src/components/shared/verified-badge.tsx` | Verified badge icon (BadgeCheck from Lucide) |
| `src/components/shared/star-rating.tsx` | Star rating display/input component (interactive or static) |
| `src/components/shared/user-rating.tsx` | User rating summary (stars + count) |
| `src/components/shared/review-form.tsx` | Dialog form for submitting reviews |
| `src/components/shared/review-list.tsx` | List of reviews with avatars and ratings |
| `src/components/shared/report-button.tsx` | Report dialog with reason selection |
| `src/components/shared/verification-request.tsx` | Verification request button with status display |
| `drizzle/0000_brave_northstar.sql` | Drizzle migration for full schema |

## Modified Files

| File | Changes |
|------|---------|
| `src/db/schema.ts` | Added enums: `verification_status`, `report_status`, `report_reason`. Added fields to `users`: `verificationStatus`, `verifiedAt`, `isBlocked`, `blockedAt`, `blockReason`. New tables: `reviews`, `reports`. Updated relations. |
| `src/lib/data/listing-details.ts` | Added `verificationStatus` to user columns in `getListingById` |
| `src/app/[locale]/listing/[id]/page.tsx` | Integrated VerifiedBadge on seller, StarRating, ReviewList, ReviewForm, ReportButton |
| `src/app/[locale]/profile/page.tsx` | Added VerificationRequest, ReviewList, StarRating, VerifiedBadge to profile page |
| `src/components/listings/listing-card.tsx` | Added VerifiedBadge next to listing title for verified sellers |
| `messages/*.json` (all 8 locales) | Added `Trust` section with 33 translation keys |

## Schema Changes

### New Enums

- `verification_status`: none, pending, verified, rejected
- `report_status`: pending, reviewed, resolved, dismissed
- `report_reason`: spam, fraud, inappropriate, duplicate, misleading, other

### New Fields on `users`

| Field | Type | Description |
|-------|------|-------------|
| `verification_status` | enum | User verification status (default: none) |
| `verified_at` | timestamp | When verification was approved |
| `is_blocked` | boolean | Whether user is blocked (default: false) |
| `blocked_at` | timestamp | When user was blocked |
| `block_reason` | text | Reason for blocking |

### New Table: `reviews`

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `from_user_id` | uuid FK → users | Reviewer |
| `to_user_id` | uuid FK → users | Reviewed user |
| `listing_id` | uuid FK → listings | Optional listing context |
| `rating` | integer | 1-5 stars |
| `comment` | text | Optional review text |
| `created_at` | timestamp | Creation date |

### New Table: `reports`

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `reporter_user_id` | uuid FK → users | Who reported |
| `reported_user_id` | uuid FK → users | Reported user (optional) |
| `listing_id` | uuid FK → listings | Reported listing (optional) |
| `reason` | enum | spam, fraud, inappropriate, duplicate, misleading, other |
| `description` | text | Additional details |
| `status` | enum | pending, reviewed, resolved, dismissed |
| `resolved_by` | uuid FK → users | Admin who resolved |
| `resolved_at` | timestamp | Resolution date |
| `created_at` | timestamp | Creation date |

## i18n Keys

Added `Trust` section to all 8 locale files with 33 keys covering:
- Verification statuses and actions
- Review form labels and messages
- Report form labels, reasons, and messages
- Rating display labels

## Architectural Decisions

- **Reviews tied to conversations**: A review can only be submitted by authenticated users. The listing context is optional but recommended.
- **Reports can target users or listings**: The `reports` table supports reporting either a user, a listing, or both.
- **Verification is request-based**: Users request verification, admins approve/reject. Three status levels: none → pending → verified/rejected.
- **Blocked users**: Admin-only action with reason tracking. `isBlocked` field on users table.
- **VerifiedBadge component**: Simple Lucide BadgeCheck icon, reusable across listing cards, detail pages, and profiles.
- **StarRating component**: Supports both static display and interactive input modes with 3 size variants.
