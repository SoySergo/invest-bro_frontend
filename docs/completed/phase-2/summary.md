# Phase 2 — Full CRUD + Media

## Summary

Phase 2 implements complete listing CRUD operations, Cloudflare R2 integration for image uploads, and an enhanced Markdown editor with live preview and an extended formatting toolbar.

---

## Created Files

| File | Purpose |
|------|---------|
| `src/lib/r2/client.ts` | S3-compatible client for Cloudflare R2, bucket config |
| `src/app/api/upload/route.ts` | API route for presigned upload URL generation |
| `src/components/shared/image-upload.tsx` | Drag-and-drop image upload component with preview, reorder, delete |
| `src/app/[locale]/listing/[id]/edit/page.tsx` | Edit listing page — reuses wizard with pre-filled data |
| `src/components/listings/listing-owner-actions.tsx` | Owner action buttons (edit, delete, status change) for listing detail page |

## Modified Files

| File | Changes |
|------|---------|
| `src/components/shared/markdown-editor.tsx` | Complete rewrite: side-by-side live preview, extended toolbar (H1-H3, Bold, Italic, Strikethrough, Code, Lists, Quote, Link, Table, HR) |
| `src/lib/actions/listings.ts` | Added `editListing`, `deleteListing`, `changeListingStatus` server actions; updated `createListing` to save images |
| `src/components/listings/listing-wizard/listing-wizard.tsx` | Added `mode`, `initialData`, `initialImages`, `listingId` props for edit mode; image state management |
| `src/components/listings/listing-wizard/step-images.tsx` | Integrated `ImageUpload` component instead of placeholder |
| `src/components/listings/listing-wizard/step-review.tsx` | Added image preview in review, edit mode support |
| `src/app/[locale]/listing/[id]/page.tsx` | Added owner actions (edit/delete/status), image gallery, auth check |
| `src/app/[locale]/profile/page.tsx` | Enhanced "My Listings" section with status badges, edit links, create button |
| `messages/*.json` (all 8 locales) | Added `MarkdownEditor`, `ImageUpload`, `ListingManage` translation sections |
| `package.json` | Added `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |

---

## Architecture Decisions

### Markdown Editor — Live Preview

Chose side-by-side editor/preview layout (toggled via Eye button) instead of separate Write/Preview tabs. This allows users to see rendered output while typing, fulfilling the "write directly in preview" requirement.

### R2 Integration — Presigned URLs

Used presigned URL pattern: client requests upload URL from API → uploads directly to R2 → stores URL in DB. This avoids routing large files through the Next.js server.

### Soft Delete

`deleteListing` sets `status = "hidden"` instead of removing the row. This preserves data integrity for existing conversations and favorites.

### Listing Edit — Wizard Reuse

The edit page reuses the same `ListingWizard` component with `mode="edit"` and `initialData`/`initialImages` props. This avoids code duplication.

---

## Schema Changes

No schema changes required — existing `listings` and `listingImages` tables support all operations.

---

## i18n Keys Added

| Section | Keys |
|---------|------|
| `MarkdownEditor` | heading, heading1-3, bold, italic, strikethrough, bulletList, numberedList, quote, inlineCode, link, horizontalRule, table, preview, showPreview, hidePreview, nothingToPreview, markdownSupported |
| `ImageUpload` | dragDrop, uploading, formats, maxSize, maxCount, selectFiles, cover, dragToReorder, imageCount, invalidType, fileTooLarge, maxImagesReached, uploadError, noR2Config |
| `ListingManage` | editTitle, editSubtitle, deleteTitle, deleteConfirm, deleteWarning, deleteSuccess, deleteError, updateSuccess, updateError, statusChange, statusActive, statusDraft, statusSold, statusHidden, statusUpdated, statusError, myListings, noListings, createFirst, allStatuses, actions, confirmDelete, saveDraft, savePublish |

---

## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `@aws-sdk/client-s3` | 3.992.0 | S3-compatible API for R2 |
| `@aws-sdk/s3-request-presigner` | 3.992.0 | Generate presigned upload URLs |

---

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API access key |
| `R2_SECRET_ACCESS_KEY` | R2 API secret key |
| `R2_BUCKET_NAME` | R2 bucket name (default: `investbro-media`) |
| `R2_PUBLIC_URL` | Public URL prefix for uploaded files |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Client-side public URL prefix |
