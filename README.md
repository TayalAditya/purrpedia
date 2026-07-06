# PurrPedia - The Cat Encyclopedia

**Built for [#HackTheKitty 2026](https://hackthekitty.devpost.com)**

PurrPedia is a full-stack cat encyclopedia with daily digests, schedulable postcards, a breed encyclopedia, personality quizzes, and a cat name generator — all wrapped in a playful, polished UI with custom cat cursors, paw trails, and synthesized meow sounds.

## Features

| Feature | Description |
|---------|-------------|
| **Daily Digest** | Subscribe to receive a cat fact, breed spotlight & cat photo every morning at 8am your timezone. Powered by Temporal durable workflows. |
| **Purr Postcards** | Design cat postcards with a Fabric.js canvas editor — stickers, text, backgrounds. Schedule delivery for any future date via Temporal. |
| **Breed Index** | Browse 247+ cat breeds with photos, temperament ratings, trait bars, Wikipedia summaries, and origin stories. |
| **Which Cat Are You?** | 7-question personality quiz that maps you to one of 10 cat breeds with custom result cards. |
| **Cat Name Generator** | Generate ridiculously royal cat names like *"Professor Biscuit McFluffington, Destroyer of Curtains"*. |
| **Cat Facts** | Swipeable TikTok-style fact cards with categories, keyboard/touch navigation, and sound effects. |

## Interactive Details

- Custom **paw cursor** (SVG) replaces the mouse on desktop
- **Paw trail** that follows your mouse movement with alternating left/right prints
- **Synthesized cat sounds** via Web Audio API — meows, purrs, and swipe sounds (no audio files)
- **Scroll reveal animations** with intersection observer
- **Light/dark theme** toggle with full CSS override system
- **Mobile-first responsive** design with hamburger nav and touch swipe support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Neon) + Prisma ORM |
| Auth | NextAuth v5 (magic link / email) |
| Workflows | Temporal (daily digest scheduling, postcard delivery) |
| Canvas | Fabric.js (postcard editor) |
| Email | Nodemailer (SMTP) |
| Fonts | Playfair Display, DM Sans, DM Mono |
| Validation | Zod |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (recommend [Neon](https://neon.tech))
- Temporal server (for digest/postcard scheduling)
- [The Cat API](https://thecatapi.com) key (free)

### Setup

```bash
# Clone the repo
git clone https://github.com/TayalAditya/purrpedia.git
cd purrpedia

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your DATABASE_URL, NEXTAUTH_SECRET, email credentials, etc.

# Push database schema
npx prisma db push

# Seed cat facts (optional)
curl -X POST http://localhost:3000/api/facts

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for all required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random secret for NextAuth
- `EMAIL_SERVER_*` — SMTP credentials for magic links & postcards
- `TEMPORAL_ADDRESS` — Temporal server address
- `THE_CAT_API_KEY` — Free API key from thecatapi.com

## Project Structure

```
src/
  app/
    page.tsx                 # Landing page
    breeds/                  # Breed index + detail pages
    facts/                   # Swipeable cat facts
    quiz/                    # Personality quiz
    name-generator/          # Cat name generator
    postcards/               # Postcard editor + viewer
    dashboard/               # User dashboard
    digest/                  # Digest subscribe/unsubscribe
    login/                   # Magic link auth
    api/                     # API routes
  components/
    CatCursor.tsx            # Custom paw cursor
    PawTrail.tsx             # Mouse trail paw prints
    CatSounds.tsx            # Web Audio synthesized sounds
    ThemeToggle.tsx          # Light/dark theme
    MobileNav.tsx            # Responsive navigation
    canvas/PostcardEditor.tsx # Fabric.js postcard editor
  temporal/
    workflows/               # Temporal workflow definitions
    activities/              # Temporal activity implementations
    worker.ts                # Temporal worker
  lib/
    auth.ts                  # NextAuth config
    prisma.ts                # Prisma client
    cat-api.ts               # External cat API wrappers
    mailer.ts                # Email sending
    rate-limit.ts            # API rate limiting
prisma/
  schema.prisma              # Database schema
```

## Security

PurrPedia passed an [Aikido Security](https://aikido.dev) AI code audit with **0 open issues** — all 5 findings identified and resolved:

| Issue | Severity | Fix |
|-------|----------|-----|
| Host Header Injection (`auth.ts`) | High | `trustHost` gated behind `AUTH_URL` env var |
| Business Logic Bypass (`rate-limit.ts`) | Medium | Dual user-ID + IP rate limiting with memory cleanup |
| XSS via unsanitized HTML in emails (`sendPostcardEmail.ts`) | Medium | HTML-escape all user content before email injection |
| Improper Input Validation (`sendPostcardEmail.ts`) | Medium | Validate postcardId, use `AUTH_URL` for base URLs |
| Missing Auth on bulk import (`/api/facts`) | Low | Added auth check + rate limiting |

Additional hardening:
- **Security headers**: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Input validation**: Zod schemas on all API inputs, regex validation on breed IDs (SSRF prevention), timezone validation via `Intl.DateTimeFormat`
- **Rate limiting**: All public API endpoints rate-limited per IP
- **No hardcoded secrets**: All credentials via environment variables

## License

MIT
