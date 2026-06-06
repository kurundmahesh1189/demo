---
title: "ADR 003 — Use Anthropic Claude API"
type: decision
status: done
updated: 2026-06-06
tags: [type/decision, status/done]
---

# ADR 003 — Use Anthropic Claude API

**Status:** Accepted

## Decision

Use Anthropic Claude (claude-haiku-4-5 for speed, claude-sonnet-4-6 for quality) as the AI backend.

## Reasons

- Claude follows structured output instructions reliably
- Streaming support via `@anthropic-ai/sdk`
- Haiku is fast and cheap for high-volume generation
- Better at following format constraints than GPT-3.5

## Model Strategy

| Use Case | Model |
|----------|-------|
| Free tier generation | claude-haiku-4-5 |
| Pro tier generation | claude-sonnet-4-6 |
| Bulk generation | claude-haiku-4-5 |

## Consequences

- `ANTHROPIC_API_KEY` must be in server-side env only (never exposed to client)
- Rate limit handling needed — Claude API has per-minute token limits
- Must implement retry logic for 529 (overloaded) responses
