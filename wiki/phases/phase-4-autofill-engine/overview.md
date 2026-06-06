---
title: "Phase 4 — Autofill Engine"
type: phase
phase: 4
status: todo
week: 4
tags: [phase/4, status/todo]
updated: 2026-06-06
---

# Phase 4 — Autofill Engine

**Goal:** The core YC-worthy differentiator — AI that knows you and fills for you.
**Week:** 4

## Tasks

- [ ] Profile data store — user saves bio, skills, role, company
- [ ] Template library — pre-built prompts (pitch deck bullets, LinkedIn bio, job desc, email intro)
- [ ] Autofill from profile — one click fills domain input + context from user's profile
- [ ] Context-aware generation — AI uses user profile to personalize output
- [ ] Bulk generation — paste a list of domains, generate all at once
- [ ] Browser Extension (MVP) — detect input fields on any webpage, offer autofill
- [ ] Shareable link per generation (public URL)

## Key Files

- `nextapp/app/profile/page.tsx` — extended profile with autofill data
- `nextapp/app/templates/page.tsx` — template library
- `nextapp/app/api/generate/route.ts` — updated with profile context
- `extension/` — Chrome extension (Manifest V3)

## Browser Extension Architecture

```
extension/
├── manifest.json       # Manifest V3
├── background.ts       # Service worker
├── content.ts          # Injected into pages, detects inputs
└── popup/              # Extension popup UI
```

## Notes

> This is the core moat. Document design decisions carefully.

## Related

- [[overview]]
- [[decisions/003-use-claude-api]]
- [[phases/phase-3-ux-upgrade/overview]]
- [[phases/phase-5-monetization/overview]]
