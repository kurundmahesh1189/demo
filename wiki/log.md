---
title: "Activity Log"
type: log
updated: 2026-06-06
---

# Activity Log

Append-only. Each entry format: `## [YYYY-MM-DD] type | title`

Parse last 5 entries: `grep "^## \[" wiki/log.md | tail -5`

---

## [2026-06-06] setup | Vault initialized

- Created Karpathy-style LLM wiki structure in Obsidian vault
- Defined schema in `schema/CLAUDE.md`
- Created phase folders for all 8 phases
- 68 tasks already seeded in Neon DB `v1` table
- Progress page live at `/progress` with recharts dashboard

## [2026-06-06] setup | Initial decisions recorded

- ADR 001: Neon PostgreSQL selected as database
- ADR 002: Next.js 16 App Router selected as framework
- ADR 003: Anthropic Claude API selected for AI layer
