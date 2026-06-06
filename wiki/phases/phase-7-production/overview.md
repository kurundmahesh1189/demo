---
title: "Phase 7 — Production Readiness"
type: phase
phase: 7
status: todo
week: 7
tags: [phase/7, status/todo]
updated: 2026-06-06
---

# Phase 7 — Production Readiness

**Goal:** Stable, monitored, secure app that doesn't break when users arrive.
**Week:** 7

## Tasks

- [ ] Deploy to Vercel (CI/CD on push to main)
- [ ] Set up Neon DB branch per environment (dev/prod)
- [ ] Error monitoring — Sentry
- [ ] Logging — structured logs for API routes
- [ ] DB migrations with Prisma (`prisma migrate deploy`)
- [ ] Security audit: secrets in env, input sanitization, CSRF, rate limits
- [ ] Performance: caching frequent domains, CDN for static assets
- [ ] Uptime monitoring — Better Uptime or Checkly

## Checklist Before Launch

- [ ] All secrets in Vercel env vars (not hardcoded)
- [ ] No `.env.local` committed to git
- [ ] Sentry DSN configured
- [ ] DB connection pooling enabled (Neon pooler URL)
- [ ] Rate limiting on all AI endpoints
- [ ] Error boundaries on all pages
- [ ] `robots.txt` and `sitemap.xml` present

## Key Files

- `nextapp/sentry.config.ts`
- `nextapp/middleware.ts` — rate limiting + auth
- `nextapp/lib/logger.ts` — structured logging

## Notes

> Document all incidents, mitigations, and security decisions here.

## Related

- [[overview]]
- [[decisions/001-use-neon-postgres]]
- [[phases/phase-6-growth/overview]]
- [[phases/phase-8-yc-application/overview]]
