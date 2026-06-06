---
title: "ADR 001 — Use Neon PostgreSQL"
type: decision
status: done
updated: 2026-06-06
tags: [type/decision, status/done]
---

# ADR 001 — Use Neon PostgreSQL

**Status:** Accepted

## Decision

Use Neon PostgreSQL as the primary database.

## Reasons

- Serverless — scales to zero, no idle cost during development
- Branching — separate dev/prod branches built-in
- Compatible with Prisma and standard `pg` driver
- Generous free tier
- Pooler URL available for connection pooling with Next.js serverless functions

## Connection

- Pooled: `ep-small-river-apdoesek-pooler.c-7.us-east-1.aws.neon.tech`
- Direct: `ep-small-river-apdoesek.c-7.us-east-1.aws.neon.tech`
- Database: `neondb`, User: `neondb_owner`

## Consequences

- Must use `sslmode=require` on all connections
- Use pooler URL in serverless (Next.js API routes), direct URL for migrations
