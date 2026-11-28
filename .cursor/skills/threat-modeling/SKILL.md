---
name: threat-modeling
description: Threat-model a proposed design — trust boundaries, assets, threats, and mitigations — and turn each into a design item or a security requirement developers receive before they code.
---

# Threat Modeling

Playbook step **S3.1** (`security-engineer`, consulted by `architect`). Paths, gates, and routes come from your step card.

## When to use
- The architect consults you on a design touching authentication, authorization, PII, payments, infrastructure, secrets, or a new external integration.
- A developer consults you during delivery on a security question the threat model does not answer; add the answer to the threat model.

## Input
- The draft architecture: data flows, contracts, data model, deployment; the system architecture's containers, components, and trust boundaries.
- Security, privacy, and compliance requirements in this request's specs, and the PRD's constraints; data the product holds.
- The existing threat model or security review history, if any.

## Process
1. Draw the data flow in words or a small diagram: actors, components, data stores, external services, and the trust boundaries between them.
2. List the assets and classify the data each flow carries (public, internal, personal, sensitive, secret).
3. At each boundary, ask what could go wrong, by category:
   - **Spoofing:** can someone act as another user or service?
   - **Tampering:** can input, data, or messages be altered?
   - **Repudiation:** can an action be denied for lack of an audit trail?
   - **Information disclosure:** can data leak through responses, logs, errors, or object IDs?
   - **Denial of service:** can a caller exhaust resources (unbounded queries, uploads, rate)?
   - **Elevation of privilege:** can a user reach functions or objects beyond their role?
4. Rate each threat by likelihood and impact, and map it to the severity scale in `.cursor/sdlc/AGENT-RULES.md`.
5. For each threat, record the mitigation as either a **design item** for the architecture (for example, an authorization model, encryption, rate limits) or a **security requirement** for specific slices (for example, "check the order belongs to the caller on every order endpoint").
6. Name what stays as accepted risk and who must accept it.
7. Check that the engineering standards' Dependency audit, SAST, and Secrets gates cover the threats a tool can catch: the rule sets, paths, and limits. Give the architect any missing rule or configuration as a design item.

## Output
- Threat model in the shape of the `THREAT-MODEL.md` template.

## Quality checklist
- [ ] Every trust boundary in the design is named
- [ ] Every data flow carrying personal, sensitive, or secret data is classified
- [ ] Each category was considered at each boundary
- [ ] Every threat has a severity and a mitigation or a named risk owner
- [ ] Threats a tool can catch are covered by a security gate in the engineering standards
- [ ] Mitigations are concrete enough to design or implement and test
