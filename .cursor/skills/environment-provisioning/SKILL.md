---
name: environment-provisioning
description: Set up the CI pipelines, quality gates, and environments an implementation plan names, so every PR is checked the same way and staging and production exist before the first release.
---

# Environment Provisioning

Playbook step **S3.4** (`devops`). Paths, gates, and routes come from your step card.

## When to use
- The design and delivery plan are approved (G4).
- A CI or environment handoff arrives during delivery.

## Input
- The implementation plan's CI and environments section, and its release points.
- The engineering standards: tools and CI quality gates.
- The current repository's pipelines, environments, and deployment configuration.

## Process
1. **Existing repo: extend what exists.** Reuse the current pipeline and environments; add only what the plan names. Never replace a working pipeline to fit a preference.
2. Wire every gate in the engineering standards' quality gates table as a separate CI check, in every profile, with the tool, configuration, and limit the table names.
3. Make each gate fail only on what the PR adds, as the engineering standards require: run it on the base branch and on the PR and compare findings, or run it on changed files and lines only.
4. Make every PR run the gates and report each result on the PR. Ask the human, through the orchestrator, to mark the gates as required checks in branch protection when you lack the rights; a gate that is not required can be bypassed.
5. Add the process check as a CI job on every PR: `python .cursor/sdlc/scripts/sdlc-check.py`.
6. Provision the environments the plan names, at least staging before the first release point, through infrastructure as code where the project uses it. Staging mirrors production in configuration, not in data.
7. Wire the secrets store into CI and deploys; no credential in git, logs, or the plan.
8. Prove readiness: a trivial PR runs every gate, each gate fails on a seeded violation (for example a deliberate duplicate or unused helper), and a deploy to each environment succeeds. Prove the Secrets gate with the tool's own rule tests or the fixtures it ships, never with a secret you write. Greenfield: finish CI with the scaffold slice part, as the plan says.
9. A git host, credential, account, or paid service only the human can provide is a question for the orchestrator, never a workaround: a local script never stands in for CI.
10. For an environment handoff: reproduce the failure, fix the environment or pipeline, and say what was wrong.

## Output
- Pipelines, quality gates, and environments running, with the evidence for each, for the delivery board.

## Quality checklist
- [ ] Every gate in the engineering standards runs on every PR, fails only on what the PR adds, and blocks the merge
- [ ] Each gate was seen failing on a seeded violation, the Secrets gate without a written secret
- [ ] The gates are required checks, or the human was asked to make them so
- [ ] `sdlc-check.py` runs on every PR
- [ ] Each environment the plan names exists and a deploy to it succeeded
- [ ] Secrets come only from the secrets store
- [ ] Existing pipelines were extended, not replaced
- [ ] Anything only the human can provide was asked for, not worked around
