---
title: "ADR 002 — Use Next.js 16 App Router"
type: decision
status: done
updated: 2026-06-06
tags: [type/decision, status/done]
---

# ADR 002 — Use Next.js 16 App Router

**Status:** Accepted

## Decision

Use Next.js 16 with App Router as the full-stack framework.

## Reasons

- Server components reduce client bundle size
- API routes co-located with pages
- Vercel deploy is seamless
- TypeScript + Tailwind v4 supported out of the box
- Streaming RSC works with Claude API streaming

## Consequences

- Must mark client components with `"use client"` explicitly
- `pg` pool must be module-level (not recreated per request) in API routes
- Middleware runs at the edge — keep it lightweight
