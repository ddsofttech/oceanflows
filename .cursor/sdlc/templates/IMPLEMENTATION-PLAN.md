# Implementation Plan

## Metadata
- Architecture version:
- G4 decision (recorded on approval):
- Author:
- Date:

## 1. Slice parts
Each part is built, reviewed, and merged as its own PR. How to build it is in its part plan.

| Part ID | Slice | AC IDs | Part (front-end / back-end) | Owner | Depends on (part IDs) | Release point | Size (S / M / L) | Review class (Routine / Important / Sensitive) | Part plan |
|---|---|---|---|---|---|---|---|---|---|

- Deferred acceptance criteria, with reasons:

## 2. Shared pieces
| Piece | Built by slice | Reused by slices |
|---|---|---|

## 3. Sequence and spikes
Contracts and shared pieces first; a back-end part that defines a contract merges before the front-end part that uses it.

| Order | Part or spike | Depends on | Can run in parallel with | Risk |
|---|---|---|---|---|

## 4. Release points
| Release point | Slice parts | What the user gets | Why release here |
|---|---|---|---|

## 5. CI and environments (provisioned at S3.4)
- Git host:
- Pipelines:
- Quality gates: those in the engineering standards (pointer, not a copy):
- Environments:
- Greenfield scaffold, and the part that creates it:

## 6. Rollout
- Migrations and their order:
- Feature flags:
- Rollout order:
