---
title: "Project Overview"
type: overview
status: in_progress
updated: 2026-06-06
---

# 3P Autofill — YC App Overview

## What It Is

An AI-powered tool that takes any domain/topic and generates 3 structured Properties, Pillars, or Points (3P) for it. The autofill engine lets users store their profile and auto-populate inputs across templates and forms.

**One-liner:** AI-powered 3P content generator with profile-based autofill for structured writing tasks.

## Current State

- [x] Next.js 16 app scaffolded
- [x] Neon PostgreSQL connected
- [x] Basic 3P generator working (hardcoded logic)
- [x] Progress page with recharts dashboard at `/progress`
- [x] 68-task roadmap in DB (`v1` table)
- [ ] Auth (Phase 1)
- [ ] Claude API integration (Phase 2)

## Tech Stack

| Layer | Choice | Decision |
|-------|--------|----------|
| Framework | Next.js 16 (App Router) | [[decisions/002-use-nextjs-app-router]] |
| Database | Neon PostgreSQL | [[decisions/001-use-neon-postgres]] |
| ORM | Prisma | Phase 1 |
| Auth | NextAuth.js | Phase 1 |
| AI | Anthropic Claude | [[decisions/003-use-claude-api]] |
| Payments | Stripe | Phase 5 |
| Email | Resend | Phase 6 |
| Analytics | PostHog | Phase 6 |
| Deploy | Vercel | Phase 7 |

## Roadmap Summary

| Phase | Goal | Week | Status |
|-------|------|------|--------|
| 1 | Foundation & Auth | 1 | #status/todo |
| 2 | AI Integration | 2 | #status/todo |
| 3 | Core UX Upgrade | 3 | #status/todo |
| 4 | Autofill Engine | 4 | #status/todo |
| 5 | Monetization | 5 | #status/todo |
| 6 | Growth & Traction | 6 | #status/todo |
| 7 | Production Readiness | 7 | #status/todo |
| 8 | YC Application | 8 | #status/todo |

## YC Thesis

- **Problem:** Structured content generation (pitch bullets, LinkedIn, job desc) is slow and inconsistent
- **Solution:** AI that learns your profile and fills structured formats instantly
- **Moat:** Profile context makes output more personal than generic ChatGPT prompts
- **Revenue:** Freemium SaaS ($9–19/mo Pro)
- **Market:** Knowledge workers, job seekers, founders, sales teams
