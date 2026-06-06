---
title: "Phase 1 — Foundation & Auth"
type: phase
phase: 1
status: todo
week: 1
tags: [phase/1, status/todo]
updated: 2026-06-06
---

# Phase 1 — Foundation & Auth

**Goal:** Multi-user app with secure auth and persistent storage.
**Week:** 1

## Tasks

- [ ] Install & configure NextAuth.js (Google + Email/password)
- [ ] Install Prisma ORM + connect to Neon DB
- [ ] DB schema: `users`, `sessions`, `generations` (history table)
- [ ] Protect routes with middleware (auth guard)
- [ ] User profile page (name, email, avatar)
- [ ] Save every generation to DB with user association
- [ ] Add `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET` to `.env.local`

## Key Files

- `nextapp/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `nextapp/prisma/schema.prisma` — DB schema
- `nextapp/middleware.ts` — route protection
- `nextapp/app/profile/page.tsx` — user profile page

## Dependencies

- `next-auth`
- `@prisma/client`, `prisma`
- `@auth/prisma-adapter`

## Notes

> Add implementation notes here as work progresses.

## Related

- [[overview]]
- [[decisions/001-use-neon-postgres]]
- [[phases/phase-2-ai-integration/overview]]
