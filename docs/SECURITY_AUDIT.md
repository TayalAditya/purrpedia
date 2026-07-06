# PurrPedia — Security Audit Report

## Tool Used
[Aikido Security](https://aikido.dev) — AI-powered code audit

## Results

**Final Status: 0 Open Issues / 5 Solved Issues**

### Issues Found & Resolved

| # | Issue | Severity | File | Resolution |
|---|-------|----------|------|------------|
| 1 | Host Header Injection | **High** | `src/lib/auth.ts` | `trustHost` is now conditional — only enabled when `AUTH_URL` environment variable is explicitly configured, preventing attackers from manipulating the Host header to redirect auth flows |
| 2 | Business Logic Bypass | **Medium** | `src/lib/rate-limit.ts` | Switched from IP-only to dual user-ID + IP rate limiting. Added memory cleanup (eviction at 10k entries) to prevent DoS via memory exhaustion |
| 3 | Improper Input Validation | **Medium** | `src/temporal/activities/sendPostcardEmail.ts` | Added type/length validation on `postcardId`. Replaced raw `NEXTAUTH_URL` with `AUTH_URL` for constructing view URLs |
| 4 | XSS via Unsanitized HTML | **Medium** | `src/temporal/activities/sendPostcardEmail.ts` | All user-controlled content (`message`, `recipientName`, `previewImageUrl`) is now HTML-escaped via `escapeHtml()` before injection into email templates |
| 5 | Missing Authentication | **Low** | `src/app/api/facts/route.ts` | Added `auth()` session check to the `POST /api/facts` bulk-import endpoint. Also added rate limiting to the `GET` endpoint |

### Additional Security Measures

- **Security Headers** (via `next.config.ts`):
  - `Content-Security-Policy` — restricts script/style/img/connect sources
  - `Strict-Transport-Security` — enforces HTTPS with 2-year max-age
  - `X-Frame-Options: DENY` — prevents clickjacking
  - `X-Content-Type-Options: nosniff` — prevents MIME sniffing
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` — disables camera, microphone, geolocation

- **Input Validation**:
  - Zod schemas on all API POST endpoints
  - Breed ID regex validation (`/^[a-z]{3,4}$/`) to prevent SSRF
  - Timezone validated via `Intl.DateTimeFormat`
  - `scheduledFor` must be a valid future date
  - Email validated with max 254 chars
  - Wiki name parameter capped at 100 chars

- **Rate Limiting**: All public API endpoints are rate-limited per IP (30 req/min for reads, 5 req/min for writes)

- **Auth**: Magic link (passwordless) via NextAuth v5 with Prisma adapter. No passwords stored. Session-based with CSRF protection built into NextAuth.

- **Secrets**: All credentials stored as environment variables, `.env` is gitignored, `.env.example` provided with placeholder values only.
