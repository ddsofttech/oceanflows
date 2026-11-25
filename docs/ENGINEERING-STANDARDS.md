# Engineering Standards

## Metadata
- Stack: Astro 4, TypeScript, Netlify (CDN + Functions), Resend; design tokens W3C JSON + CSS variables; plain CSS (from UX prototype)
- Last changed by request: `company-branding-website`
- Date: 2026-11-25

Each rule: one line, one example, the tool that enforces it (or "review"), and whether it is **existing** or **proposed**.

## 1. Structure and boundaries
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| Marketing UI lives under `web/src/`; serverless handlers under `web/netlify/functions/` | `web/src/pages/index.astro` | review | proposed |
| Design tokens authoritative in `design/tokens/design-tokens.json`; CSS mirror `design/tokens/tokens.css` imported by global styles | `--color-action-primary` from tokens | stylelint + review | proposed |
| UI components under `web/src/components/`; no business logic in `.astro` frontmatter beyond props | `InquiryForm.astro` + `inquiry-form.ts` | ESLint | proposed |
| Inquiry delivery only in `inquiry` function; front end calls `POST /api/inquiry` | No Resend import in `web/src/` | ESLint `import/no-restricted-paths` | proposed |
| Prototype `prototype/` is reference until migrated; do not import from prototype in production build | Copy/adapt into `web/` | review | proposed |
| Catalog doc blocks stay in components; regenerate `docs/COMPONENTS.md` via `ui-catalog.py` | `@catalog` comment on `Button` | `ui-catalog.py --check` | proposed |

## 2. Naming
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| Astro components PascalCase `.astro` | `SiteHeader.astro` | review | proposed |
| Client scripts kebab-case `.ts` colocated or in `web/src/scripts/` | `theme.ts` | review | proposed |
| Netlify function file name matches route | `inquiry.ts` → `/api/inquiry` | Netlify | proposed |
| CSS classes kebab-case, BEM-like blocks from prototype | `.hero-banner`, `.services-table` | stylelint | proposed |
| Env vars: `PUBLIC_*` client-safe; secrets never prefixed `PUBLIC_` | `PUBLIC_BOOKING_URL` | review | proposed |

## 3. Errors
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| API returns OpenAPI error shapes; no stack traces in responses | `{ error: "validation_failed", fields: { email: "..." } }` | contract tests | proposed |
| Client maps 502 to delivery-failure UX (FR-08); spam `rejected` shows idle (BR-07) | No success `StatusMessage` on rejected | e2e test | proposed |
| Never swallow fetch errors; show user-safe copy | `catch` → delivery failure panel | ESLint | proposed |

## 4. Logging and observability
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| Structured JSON logs in functions | `console.log(JSON.stringify({ event: "inquiry.sent" }))` | review | proposed |
| Never log inquiry `message`, `phone`, or email | Log outcome + request id only | review + security review | proposed |
| No PII in client `console.*` | — | ESLint `no-console` in prod build | proposed |

## 5. Configuration and secrets
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| Secrets only in Netlify environment (or local `.env` gitignored) | `RESEND_API_KEY` | gitleaks | proposed |
| `.env.example` lists keys without values | `INQUIRY_EMAIL=` | review | proposed |
| Production build fails CI if placeholder `[BOOKING_URL]` in output | BR-09 check script | proposed CI step | proposed |

## 6. Data access
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| No database or ORM | — | review | proposed |
| Content edits in git-tracked Astro/content files | `web/src/content/site-copy.ts` | review | proposed |

## 7. Testing
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| Unit tests for validation/spam helpers colocated `*.test.ts` | `inquiry.validation.test.ts` | vitest | proposed |
| Contract test against OpenAPI for handler | `inquiry.contract.test.ts` | vitest | proposed |
| E2e: form happy path + validation (Playwright) | `contact.spec.ts` | Playwright in CI | proposed |
| Tests live under `web/tests/` | — | review | proposed |

## 8. Dependencies
| Rule | Example | Enforced by | Status |
|---|---|---|---|
| New npm deps need architect approval in PR description | Resend SDK | review | proposed |
| Pin major versions; Renovate/Dependabot enabled | `astro@^4` | npm audit | proposed |
| No client-side analytics SDKs with cookies | Cloudflare beacon script only | review | proposed |

## 9. Quality gates

| Gate | Tool | Configuration | Limit | Status |
|---|---|---|---|---|
| Format | Prettier | `web/.prettierrc` | Default | proposed |
| Lint | ESLint | `web/eslint.config.js`, eslint-plugin-astro | No errors on changed files | proposed |
| Types | `astro check` + `tsc` | `web/tsconfig.json` | Clean on PR | proposed |
| Duplication | jscpd | `web/` | Fail on new duplication >3% slice | proposed |
| Unused code | knip | `web/knip.json` | No new unused exports | proposed |
| Complexity | ESLint `complexity` | max 15 | Fail on new violations | proposed |
| Dependency audit | `npm audit` | CI | No new high/critical | proposed |
| SAST | eslint-plugin-security | functions + scripts | No new warnings | proposed |
| Secrets | gitleaks | repo root | No secrets in diff | proposed |
| Tests and coverage | vitest + Playwright | diff-cover on `web/` | Changed lines ≥80% | proposed |
| Change size | `sdlc-check.py` | small 250 / medium 600 / large 1200 lines | Per part plan | proposed |
| Accessibility | `@axe-core/playwright` | key routes | 0 new serious/critical | proposed |
| Design tokens | stylelint `declaration-strict-value` | color, spacing, font-size from vars | No new raw hex in components | proposed |
| UI catalog | `ui-catalog.py --check` | sources `web/src/components`, tokens path | Catalog matches blocks | proposed |

### Change-size budget
Changed lines per PR, excluding tests, generated files, and `docs/`.

| Slice-part size | Up to | Basis |
|---|---|---|
| Small | 250 | Greenfield marketing-site norm |
| Medium | 600 | UX migration tranche |
| Large | 1200 | Initial `cbw-fe-01` scaffold |

## 10. Known exceptions
| Location | Departs from rule | Why | Owner | Expires |
|---|---|---|---|---|
| `prototype/` | Pre-standards plain HTML | UX reference until `cbw-fe-01` | frontend-developer | After RP1 |