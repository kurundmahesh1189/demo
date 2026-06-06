---
title: "Phase 2 — AI Integration"
type: phase
phase: 2
status: todo
week: 2
tags: [phase/2, status/todo]
updated: 2026-06-06
---

# Phase 2 — AI Integration

**Goal:** Replace hardcoded logic with real AI — the core product differentiator.
**Week:** 2

## Tasks

- [ ] Install Anthropic SDK (`@anthropic-ai/sdk`)
- [ ] Replace `generate()` function with Claude API call
- [ ] Streaming response support (real-time output, not wait-then-show)
- [ ] Prompt engineering: structured output for consistent 3P format
- [ ] Add `ANTHROPIC_API_KEY` to `.env.local`
- [ ] API route `/api/generate` (server-side, key never exposed to client)
- [ ] Rate limiting per user (prevent abuse)
- [ ] Error handling: API failures, empty responses, timeouts

## Key Files

- `nextapp/app/api/generate/route.ts` — main AI endpoint
- `nextapp/lib/claude.ts` — Claude client wrapper
- `nextapp/lib/prompts.ts` — prompt templates

## Dependencies

- `@anthropic-ai/sdk`
- `@upstash/ratelimit` (or similar for rate limiting)

## Prompt Design

The system prompt should enforce this output structure:
```
Title: <property name>
Description: <1-2 sentence explanation>
```
×3, always exactly 3 properties.

## Notes

> Add implementation notes, prompt iterations, and learnings here.

## Related

- [[overview]]
- [[decisions/003-use-claude-api]]
- [[concepts/streaming-responses]]
- [[phases/phase-1-foundation/overview]]
- [[phases/phase-3-ux-upgrade/overview]]
