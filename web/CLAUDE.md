# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Full-stack site for tutor Anna Parshukova (ЕГЭ/ОГЭ Russian-language exam prep): marketing pages, paid/free video courses with a student cabinet, Robokassa payments, and an admin panel. Built from a Russian-language spec at `../prompt.pdf` — read it for product intent before changing product behavior.

Next.js 16 (App Router, Turbopack, React 19.2) + TypeScript + Prisma 6 + SQLite. Node.js is not on PATH by default in this environment — commands below assume it's been added (e.g. `export PATH="/c/Program Files/nodejs:$PATH"` in Git Bash on Windows).

## Commands

```bash
npm run dev          # start dev server (Turbopack) at localhost:3000
npm run build         # production build; also type-checks (tsc) — treat build failures as blocking
npm run start          # run a production build
npm run lint            # eslint (flat config); NOT run automatically by `next build` in v16
npm run db:seed          # (re)seed: creates admin user + the 2 seed courses + placeholder reviews
npm run db:studio         # Prisma Studio GUI on the SQLite db
npx prisma migrate dev --name <name>   # after editing prisma/schema.prisma
npx prisma generate                     # regenerate client only (migrate dev does this too)
```

There is no test suite yet. `npm run build` is the main correctness gate (full TypeScript check across the app).

Seeded admin login (`/admin/login`): credentials come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), defaults `anna@example.com` / `change-me-admin-123`.

## Architecture

**Route groups by audience**, each with its own chrome — do not mix them:
- `src/app/(site)/` — public marketing site. Layout wraps children in `AuthModalProvider` + `<Header>`/`<Footer>` + the global `<AuthModal>` (see below).
- `src/app/(cabinet)/cabinet/` — logged-in student/parent area. Layout does its own `getCurrentUser()` guard (`redirect("/?auth=1")` if absent).
- `src/app/admin/(protected)/` — admin panel, guarded by its own layout (`redirect("/admin/login")` if not `role === "ADMIN"`). `src/app/admin/login/page.tsx` sits *outside* the `(protected)` group so the login page itself isn't guarded.
- `src/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`, function must be named `proxy`) does a cheap first-pass redirect for `/cabinet/**` and `/admin/**` based on the JWT cookie alone — the real, authoritative checks still live in each layout/Server Action. Don't rely on the proxy as the only gate.

**Auth is hand-rolled, not NextAuth**: `src/lib/auth.ts` signs a JWT (jose, `HS256`) into an httpOnly cookie (`annasite_session`) holding `{ sub: userId, role }`. `getCurrentUser()` re-reads the user from Prisma each time (strips `passwordHash`) — actions that need the hash (e.g. password change) must fetch the full row themselves via `getSessionPayload()` + `prisma.user.findUnique`. `requireAdmin()` / `requireUser()` throw if the check fails; call these at the top of any new admin/user Server Action.

**Mutations are Server Actions, not API routes.** Everything under `src/lib/actions/**` is `"use server"` and is invoked either from a `<form action={...}>` (optionally `fn.bind(null, id, ...)` to curry extra args — used extensively in the admin panel) or called directly from a client event handler/`useEffect` (see `AuthModal.tsx`'s `resolveSuccess()`, which calls `enrollFreeAction`/`createPaymentAction` after a successful login — both end in `redirect()`, which works whether the action was invoked via a form or called directly). Reach for a Server Action first; only add a real Route Handler (`route.ts`) when something outside Next's RSC protocol needs to hit the endpoint (Robokassa's webhook, file streaming with `Range` support).

**Route Handlers that do exist and why:**
- `src/app/api/payments/result/route.ts` — Robokassa's server-to-server Result URL webhook. Verifies the MD5 signature (`src/lib/robokassa.ts`), flips the `Payment` to `SUCCESS`, upserts the `Enrollment`. Must reply with the literal body `OK<InvId>` or Robokassa retries. This is the *only* source of truth for payment success — the `/payment/success` page is just a friendly UI reflection of DB state, not itself authoritative (Robokassa's client-side SuccessURL redirect is not signature-checked here).
- `src/app/api/stream/[lessonId]/route.ts` and `src/app/api/files/[materialId]/route.ts` — protected media delivery. Every request re-checks session + `Enrollment` (or `role === ADMIN`) before streaming from the private `storage/` directory (never `public/`). Stream route supports HTTP `Range` for video seeking. This is the mechanism behind the "no direct download link" requirement in the spec — see `src/components/cabinet/VideoPlayer.tsx` for the matching frontend half (`controlsList`, `onContextMenu` block).

**File storage split:**
- `storage/{videos,materials,covers}/` — private, gitignored, served only through the two protected routes above. Written by the admin upload actions in `src/lib/actions/admin/courses.ts`.
- `public/uploads/covers/` — course cover images, served as normal static files (not access-controlled — marketing content, not course content).

**Payments (`src/lib/robokassa.ts` + `src/lib/actions/payments.ts`):** `createPaymentAction` creates a `Payment` row with a fresh numeric `invoiceId` before redirecting to Robokassa's hosted payment page — this row is what the webhook later matches against. Real Merchant Login / Password1 / Password2 / test-mode flag live in `.env` (`ROBOKASSA_*`) — currently placeholders; Anna configures the real Result/Success/Fail URLs in her own Robokassa dashboard to point at this site.

**Auth modal + intent resumption:** `AuthModalContext` tracks a `PendingIntent` (`{type: "enroll"|"pay", courseSlug}`) set when an unauthenticated visitor clicks a course CTA (`CourseActionButton.tsx`). After successful login/register inside `AuthModal.tsx`, the pending intent is resolved automatically (enroll in the free course / start the paid checkout) so the user doesn't lose their place. `AuthQueryOpener.tsx` opens the login modal on `?auth=1`, which is how the proxy redirect for `/cabinet` surfaces the login prompt.

**Data model** (`prisma/schema.prisma`): SQLite doesn't support native enums in this Prisma setup, so `User.role`, `User.accountType`, `Enrollment.source`, and `Payment.status` are plain `String` fields with the allowed values documented in comments directly above each model — check those comments rather than assuming an enum exists.

**Styling:** Tailwind v4 (CSS-based config, no `tailwind.config.ts`) — design tokens are CSS custom properties in `src/app/globals.css` (`--color-primary`, `--color-accent`, `--color-ink`, etc.), referenced in components as `text-[var(--color-primary)]` etc. rather than Tailwind theme color names. Scroll-triggered reveal animations go through `src/components/ui/FadeIn.tsx` (framer-motion `whileInView`); reuse it instead of hand-rolling intersection observers.

**Next.js 16 specifics that differ from older docs/training data** (also called out in `AGENTS.md`, which is auto-regenerated by `next dev` — don't hand-edit that block): `params`/`searchParams` in pages and Route Handlers are `Promise`s and must be `await`ed; use the generated `PageProps<"/route/[param]">` / `LayoutProps<...>` helper types (regenerated on `next dev`/`next build`); `cookies()`/`headers()` from `next/headers` are async; the middleware convention is `proxy.ts` exporting `proxy`, not `middleware.ts`.
