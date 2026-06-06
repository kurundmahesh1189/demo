# LLM Wiki Schema — 3P Autofill YC App

This is the schema file. It tells Claude Code how this Obsidian vault is structured and what workflows to follow. Read this first before touching any wiki file.

---

## Vault Layout

```
/
├── raw/                  # Immutable source documents. Never edit these.
├── wiki/
│   ├── index.md          # Master catalog — update on every change
│   ├── log.md            # Append-only chronological log
│   ├── overview.md       # High-level synthesis of the whole project
│   ├── phases/
│   │   ├── phase-1-foundation/
│   │   ├── phase-2-ai-integration/
│   │   ├── phase-3-ux-upgrade/
│   │   ├── phase-4-autofill-engine/
│   │   ├── phase-5-monetization/
│   │   ├── phase-6-growth/
│   │   ├── phase-7-production/
│   │   └── phase-8-yc-application/
│   ├── concepts/         # Tech concepts, patterns, design decisions
│   └── decisions/        # ADRs — Architecture Decision Records
└── schema/
    └── CLAUDE.md         # This file
```

---

## Page Frontmatter Convention

Every wiki page must start with YAML frontmatter:

```yaml
---
title: "Page Title"
type: phase | concept | decision | overview | index | log
phase: 1-8 (if applicable)
status: todo | in_progress | done | reference
tags: [tag1, tag2]
updated: YYYY-MM-DD
---
```

---

## Workflows

### When a task is completed
1. Update the relevant phase page — mark task done, add notes on how it was implemented
2. Update `wiki/overview.md` if it changes the big picture
3. Append to `wiki/log.md`
4. Update `wiki/index.md` if a new page was created

### When a new concept is introduced
1. Create a page in `wiki/concepts/`
2. Link to it from the phase page where it was introduced
3. Update `wiki/index.md`

### When an architectural decision is made
1. Create an ADR in `wiki/decisions/` (format: `NNN-title.md`)
2. Link from the relevant phase page
3. Append to `wiki/log.md`

### Ingest a new source
1. Drop source in `raw/`
2. Create a summary page in the relevant phase folder
3. Update cross-references in related pages
4. Append to `wiki/log.md`

---

## Naming Conventions

- Phase pages: `phase-N-title/overview.md` + one file per task group
- Concept pages: kebab-case noun (e.g. `rate-limiting.md`, `streaming-responses.md`)
- Decision records: `NNN-short-title.md` (e.g. `001-use-neon-postgres.md`)
- Log entries: `## [YYYY-MM-DD] type | title`

---

## Color Coding (Obsidian Tags)

Use these tags consistently — they map to Obsidian's color-coded tag system:

- `#status/todo` — not started
- `#status/in-progress` — actively being worked on
- `#status/done` — complete
- `#status/blocked` — blocked on dependency
- `#phase/1` through `#phase/8`
- `#type/concept` `#type/decision` `#type/task`

---

## Database Source of Truth

The `v1` table in Neon DB is the authoritative task status store. The wiki is the *narrative* layer — context, decisions, learnings. When status diverges between DB and wiki, the DB wins for status; the wiki wins for context.
