# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Site for tutor Anna Parshukova, reworked in October 2026 into a **one-page landing for her free course on the итоговое сочинение** (final essay, 11th grade) plus a student cabinet with the lessons and an admin panel. Anna's brief: short page, a button that leads straight to the course, a little about her, **no "sign up for lessons" anywhere** (she has no free slots). Paid course lives on another platform; on-site payments (Robokassa), reviews and the course catalog were removed — restore from git history if ever needed.

Next.js 16 (App Router, React 19.2) + TypeScript + Prisma 6 + SQLite. Node.js is not on PATH by default here (`export PATH="/c/Program Files/nodejs:$PATH"` in Git Bash).

## Commands

```bash
npx next dev --webpack     # dev server; Turbopack is blocked on this machine (AppControl), always --webpack
npx next build --webpack   # production build + full type check — the main correctness gate
npm run lint               # eslint; not run by next build in v16
npm run db:seed            # admin user + the free course built from prisma/course-content (idempotent)
npx prisma migrate dev --name <name>   # after editing prisma/schema.prisma
```

No test suite. Verify UI with headless Chrome (puppeteer-core + installed Chrome). To test flows that write data, run the server against a **copy** of `prisma/prisma/dev.db` (`DATABASE_URL="file:<copy>"`); the copy path must not contain Cyrillic.

## Architecture

**Route groups:**
- `src/app/(site)/` — landing `/` and `/privacy`, `/reset-password`. Layout: `LandingHeader` / `LandingFooter` + global `AuthModal`.
- `src/app/(cabinet)/cabinet/` — student area: course page, lesson page, course text pages (`docs/[docId]`). `lib/cabinet-course.ts` loads the course, checks login + enrollment (admins bypass enrollment to preview).
- `src/app/admin/(protected)/` — overview, course editor, requests, students; guarded by its layout. `admin/login` sits outside the group.
- `src/proxy.ts` (Next 16 name for middleware, function `proxy`) — cheap cookie check for `/cabinet/**` and `/admin/**`; real checks stay in layouts/actions.

**Content lives in code, not in the DB:** landing and in-course UI texts — `src/content/course.ts`; Anna, contacts, legal — `src/content/site.ts`; images — `src/content/media.ts`. Lesson texts (notes, answers, mock topics, route) are `CourseDoc` rows editable in the admin; their source files are `prisma/course-content/*.md` (Anna's 12 Oct 2026 materials). `CourseDoc.body` is simplified markdown rendered by `components/cabinet/CourseText.tsx` (`# ` headings, `1.1.` tasks, `А.` options, `Мой ответ: ____` blanks).

**Start-course flow:** `StartCourseButton` / `StartCourseTrigger` use `lib/course-access.ts`: guest → `AuthModal` register with intent `enroll` → `enrollFreeAction` → `/cabinet/courses/itogovoe-sochinenie`; enrolled → straight to the course.

**Auth is hand-rolled** (`lib/auth.ts`): JWT (jose, HS256) in httpOnly cookie `annasite_session`; `getCurrentUser()`, `requireAdmin()`, `requireUser()`.

**Mutations are Server Actions** (`lib/actions/**`). Route Handlers exist only where Server Actions don't fit:
- `api/admin/lessons/[lessonId]/video` — admin video upload, streamed to disk (Server Actions cap the body; videos are hundreds of MB). Client: `components/admin/VideoUploader.tsx` (XHR with progress).
- `api/stream/[lessonId]`, `api/files/[materialId]` — protected media with `Range` support; files live in private `storage/` (gitignored).

`serverActions.bodySizeLimit` is 10 MB (lesson files); proxy on `/admin` also caps at 10 MB by default.

**Data model:** SQLite, enum-like fields are `String`s with allowed values in comments in `schema.prisma`. Free course: one `Module` "Уроки" with 6 `Lesson`s (`prep` = "before the lesson"), `CourseDoc`s, `PaidCourseRequest` (finish-of-course request, shown in admin).

**Styling:** Tailwind v4, tokens in `src/app/globals.css` (`--color-primary` #4A3AFF, `--color-accent` pink #FF8FD4 — only dark text on pink). Soft neo-brutalism: 2px ink borders, hard shadows, notebook grid. Unbounded for h1/h2, Caveat (`font-hand`) for handwritten notes, Inter for text.

**Motion:** `components/ui/Reveal.tsx`. Above-the-fold (`immediate`) reveals are pure CSS (`.reveal-now` in globals.css) so the first screen paints without waiting for JS; scroll reveals use Framer Motion with `VIEWPORT` (triggers slightly before entering view). Don't wrap pages in opacity-0 transitions — it left the landing blank until hydration (~2 s on phones).

**Next.js 16 specifics:** `params`/`searchParams` are Promises; use generated `PageProps<"/route">` / `LayoutProps`; `cookies()`/`headers()` are async; `proxy.ts` instead of `middleware.ts`; `next/image` uses `preload` instead of `priority`.
