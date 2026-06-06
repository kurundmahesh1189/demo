---
title: "Phase 5 — Monetization"
type: phase
phase: 5
status: todo
week: 5
tags: [phase/5, status/todo]
updated: 2026-06-06
---

# Phase 5 — Monetization

**Goal:** Revenue signal — even $1 MRR matters for YC.
**Week:** 5

## Tasks

- [ ] Usage tracking — count generations per user per month
- [ ] Free tier — 10 generations/month
- [ ] Pro tier — unlimited, priority, export, browser extension ($9–19/mo)
- [ ] Stripe integration — checkout, webhooks, subscription management
- [ ] Upgrade prompt when free limit hit
- [ ] Billing portal (manage/cancel subscription)
- [ ] Usage dashboard for user (X of 10 used)

## Pricing Model

| Tier | Price | Limit | Features |
|------|-------|-------|---------|
| Free | $0 | 10/mo | Basic generation |
| Pro | $9–19/mo | Unlimited | + Export, templates, extension, priority |

## Key Files

- `nextapp/app/api/stripe/webhook/route.ts` — Stripe webhook handler
- `nextapp/app/api/stripe/checkout/route.ts` — checkout session
- `nextapp/lib/stripe.ts` — Stripe client
- `nextapp/lib/usage.ts` — usage counting logic

## DB Schema Additions

```sql
ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
CREATE TABLE usage (
  user_id TEXT, month TEXT, count INT,
  PRIMARY KEY (user_id, month)
);
```

## Notes

> Document Stripe webhook events handled, pricing experiments, conversion rate.

## Related

- [[overview]]
- [[phases/phase-4-autofill-engine/overview]]
- [[phases/phase-6-growth/overview]]
