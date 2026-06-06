---
title: "Phase 6 — Growth & Traction"
type: phase
phase: 6
status: todo
week: 6
tags: [phase/6, status/todo]
updated: 2026-06-06
---

# Phase 6 — Growth & Traction

**Goal:** Measurable traction — users, retention, growth rate for YC application.
**Week:** 6

## Tasks

- [ ] Waitlist / referral system — invite friends, get extra generations
- [ ] Analytics — PostHog or Mixpanel (track funnel: visit → signup → generate → upgrade)
- [ ] Onboarding flow — guided first generation with examples
- [ ] Email sequences — welcome email, day-3 nudge, upgrade prompt (Resend)
- [ ] Landing page — hero, how it works, pricing, testimonials, CTA
- [ ] SEO — meta tags, OG image per generation, sitemap
- [ ] Social share button ("I generated 3Ps for X")
- [ ] Public gallery of best generations (viral loop)

## Key Funnel to Track

```
Visit → Signup → First Generation → Day-3 Return → Upgrade
```

Target: 10% week-over-week growth in signups.

## Key Files

- `nextapp/app/page.tsx` — landing page (replace current home)
- `nextapp/app/onboarding/page.tsx` — new user flow
- `nextapp/app/gallery/page.tsx` — public gallery
- `nextapp/lib/analytics.ts` — PostHog wrapper

## Notes

> Track every growth experiment here. What worked, what didn't, numbers.

## Related

- [[overview]]
- [[phases/phase-5-monetization/overview]]
- [[phases/phase-7-production/overview]]
