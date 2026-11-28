---
name: backend-implementation
description: Build the server-side part of a slice so it is correct under load and change — contract-validated boundaries, consistent errors, safe transactions and migrations, bounded queries, resilient integrations, and observability.
---

# Backend Implementation

Playbook steps **S4.1, S4.2** (`backend-developer`). Paths, gates, and routes come from your step card. Use with `feature-implementation`, which owns the approach, tests, and the PR.

## When to use
- A slice has a back-end part: an endpoint, domain logic, persistence, a migration, a job, or an integration.
- Review findings or QA defects concern server behavior.

## Input
- The slice's acceptance criteria, and the requirements and business rules it touches in its feature spec, with the PRD rules and constraints the spec inherits.
- The architecture sections the part plan points to: contracts, data model, scale approach, failure modes; and the part plan's security requirements.
- The engineering standards, and the existing code to reuse or extend.

## Process
**Boundaries**

1. Validate every request against the contract at the boundary; reject what does not match with the standard error model. Generate types from the contract schema where the project does.
2. Enforce authentication and authorization on every entry point, including object-level checks: the caller may act on this record, not just on this kind of record.
3. Keep domain logic out of transport and persistence code, in the layer the standards name.

**Data**

4. Wrap each business operation that changes several records in one transaction; keep transactions short and free of remote calls.
5. Make retried operations idempotent where a client or job may repeat them (idempotency key or natural key).
6. Migrations are backward-compatible and reversible: add the new structure, move readers and writers, then remove the old in a later release. Never rename or drop in one step what running code still uses.
7. Every list is paginated and bounded; no query inside a loop; add an index for every new filter, join, or sort on a large table, and check the query plan for hot paths.

**Integrations**

8. Every outbound call has a timeout, bounded retries with backoff for safe operations, and a defined behavior when the dependency is down.
9. Move slow or bursty work the design marks asynchronous to a job or queue; never block a request on it.

**Operations**

10. Log with the standard structured fields at the right level, never secrets or PII; emit the metrics the architecture names for the slice.
11. Read configuration and secrets only from the places the standards name; no defaults that hide a missing secret.

**Verify**

12. Test the rules, edge cases, authorization denials, and failure paths, not only the happy path. Run migrations up and down against a disposable database.

## Output
- Server code, migrations, and tests in the slice's PR, with migration order and any new metrics noted.

## Quality checklist
- [ ] Every request is validated against the contract; errors follow the standard model
- [ ] Authorization is checked on every entry point and object
- [ ] Multi-record changes are transactional; retried operations are idempotent
- [ ] Migrations are backward-compatible, reversible, and tested up and down
- [ ] Lists are paginated; no query in a loop; new access paths are indexed
- [ ] Outbound calls have timeouts and a defined failure behavior
- [ ] No secrets or PII in logs; slice metrics emitted
- [ ] Failure paths and authorization denials are tested
