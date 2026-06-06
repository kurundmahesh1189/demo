---
title: "Phase 3 — Core UX Upgrade"
type: phase
phase: 3
status: todo
week: 3
tags: [phase/3, status/todo]
updated: 2026-06-06
---

# Phase 3 — Core UX Upgrade

**Goal:** Polished product that users actually enjoy and return to.
**Week:** 3

## Tasks

- [ ] History sidebar — browse all past generations
- [ ] Search — find past generations by domain keyword
- [ ] Copy to clipboard button per card
- [ ] Export — download as PDF or markdown
- [ ] Regenerate — one-click to get fresh 3Ps for same domain
- [ ] Favorites/Bookmarks — star generations to save
- [ ] Dark/light mode toggle
- [ ] Keyboard shortcuts (Enter to generate, Esc to clear)
- [ ] Loading skeleton states (not just a spinner)
- [ ] Mobile-responsive layout

## Key Files

- `nextapp/app/history/page.tsx` — history view
- `nextapp/components/Sidebar.tsx` — history sidebar
- `nextapp/components/GenerationCard.tsx` — card with copy/export/regen
- `nextapp/hooks/useTheme.ts` — dark/light mode

## UX Principles

- Time to "aha moment" < 2 minutes for new users
- Every action should feel instant (optimistic UI)
- Mobile must work — many users on phone

## Notes

> Add UX decisions, A/B test ideas, and user feedback here.

## Related

- [[overview]]
- [[phases/phase-2-ai-integration/overview]]
- [[phases/phase-4-autofill-engine/overview]]
