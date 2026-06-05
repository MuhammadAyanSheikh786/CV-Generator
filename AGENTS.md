# CV Forge — AI Agent Instructions

## Tech Stack
- **Framework**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State**: Zustand (`src/store/cv-store.ts`)
- **Animation**: Framer Motion
- **Styling**: Tailwind + custom classes in `globals.css` (`card-3d`, `btn-lightning`, `btn-ghost`, `input-field`, `gradient-text`, `glass`, `bg-grid`)
- **Database**: Prisma ORM + Neon (PostgreSQL) via `@neondatabase/serverless` + `@prisma/adapter-neon`
- **Auth**: Firebase Auth (email/password + Google) — `firebase` (client) + `firebase-admin` (server)
- **AI Backend**: Google Gemini API (`gemma-4-31b-it` for scoring) + Groq Cloud (`llama-3.3-70b-versatile` for enhancement & template gen)
- **Env Keys**: `GEMINI_API_KEY`, `GROQ_API_KEY`, `DATABASE_URL`, `FIREBASE_*` in `.env.local`

## Auth Flow
- **Client**: Firebase Auth SDK handles all auth (sign in, sign up, Google OAuth, token refresh)
- **ID Token Sync**: `onAuthStateChanged` listener copies Firebase ID token to `token` cookie automatically
- **Server**: `getAuthUser(request)` in `src/lib/auth.ts` verifies the Firebase ID token from `Authorization: Bearer` header or `token` cookie using Firebase Admin SDK
- **Fallback**: Old JWT-based tokens (from `jsonwebtoken`) are still accepted for backward compatibility during migration
- **New Users**: Auto-created in the database on first API call (with 50 free tokens)
- **Logout**: `signOut(auth)` clears Firebase session + deletes `token` cookie

## Database (Prisma + Neon)
- `prisma/schema.prisma` defines 4 tables: `User`, `Scan`, `Token`, `DailyUsage`
- All storage libs use `@/lib/prisma` (Prisma client via Neon adapter)
- `DATABASE_URL` = Neon PostgreSQL connection string in `.env.local`
- Migration: `npx prisma migrate dev` (local) or `npx prisma migrate deploy` (prod)

## Conventions
- All interactive components are `"use client"` with Framer Motion `motion.div` for entry animations
- Use `cn()` from `@/lib/utils` for conditional class merging
- Colors: `lightning-*` (brand red #ff0033), `dark-*` (dark mode palette)
- Path alias: `@/*` → `./src/*`
- Forms use `input-field` class, buttons use `btn-lightning`/`btn-ghost`

## Routes
| Route | Page |
|-------|------|
| `/` | Landing page |
| `/builder` | CV builder (multi-step wizard + template preview) |
| `/resume-checker` | AI Resume Checker (multi-tool scoring 1-100) |
| `/login` | Login page (Firebase Auth — email/password + Google) |
| `/signup` | Signup page (Firebase Auth — email/password + Google, 50 free tokens) |
| `/dashboard` | User dashboard (PDF upload + AI scan + token balance + scan history) |

## API Routes
| Method | Route | Function |
|--------|-------|----------|
| POST | `/api/ai/check` | Resume scoring via **Gemini** (`gemma-4-31b-it`) |
| POST | `/api/ai/enhance` | Inline text enhancement via **Groq** (llama-3.3-70b-versatile) |
| POST | `/api/ai/generate-template` | Prompt-to-template generation via **Groq** (llama-3.3-70b-versatile) |
| GET | `/api/templates/community` | Fetch community-generated templates |
| PUT | `/api/templates/community` | Increment template download counter |
| GET | `/api/auth/me` | Get authenticated user + token info (Firebase ID token in cookie/header) |
| GET | `/api/tokens` | Get token balance + expiry |
| POST | `/api/cv/upload` | Upload PDF → parse text → analyze via Gemini → save scan → deduct 1 token |
| GET | `/api/cv/scans` | List user's CV scan history |

## AI Components (`src/components/ai/`)
| Component | Usage |
|-----------|-------|
| `ScoreGauge` | Radial progress bar (SVG, animated) for 1-100 score |
| `ImpressionBox` | Good/Bad impression lists with staggered animation |
| `EnhanceButton` | Sparkle icon button for inline AI text enhancement |
| `TemplateGenerator` | Modal for prompt-to-template AI generation |

## PDF Upload + AI Analysis Flow
1. User drops a .pdf file on the dashboard dropzone
2. `POST /api/cv/upload` receives the file via FormData
3. PDF text extracted via `pdf-parse` (v1.1.1, dynamically imported)
4. Buffer uploaded to ImageKit (if IMAGEKIT_* env vars configured)
5. Text sent to Gemini (`gemma-4-31b-it`) with `PDF_CV_ANALYSIS_SYSTEM_PROMPT`
6. Gemini returns JSON with: score, breakdown, overview, weaknesses, tips, action items
7. Scan saved to database, 1 token deducted, daily usage incremented
8. Results displayed on dashboard (gauge, breakdown bars, overview, strengths/weaknesses, tips)
9. Limits: 10 scans per day per user, 50 tokens per week

## Rate Limiting
- **10 checks/day per user** (resume checker + CV upload scans)
- **5 template generations/day per user**
- **50 tokens per week per user** (auto-reset on expiry)
- Daily counters stored in `DailyUsage` table, reset daily (by date string)
- Token balance stored in `Token` table, refresh every 7 days

## Common Tasks
- **New page**: create `src/app/<route>/page.tsx`
- **New component**: create under `src/components/`, use Framer Motion, accept `className` with `cn()`
- **State changes**: add actions to Zustand store, types in `src/lib/schemas.ts`
- **New AI feature**: add system prompt in `src/lib/ai-prompts.ts`, route in `src/app/api/ai/`, call via `src/lib/groq.ts` (for Groq) or `src/lib/gemini.ts` (for Gemini)
- **Auth check**: use `getAuthUser(request)` from `src/lib/auth.ts` to protect endpoints
- **Build**: `npm run build` (must pass before completing)
- **Env setup**: Copy `.env.example` to `.env.local` and set all API keys (Neon DATABASE_URL + Firebase credentials required)

## Database Setup
1. Create a Neon project at https://neon.tech
2. Copy the connection string to `DATABASE_URL` in `.env.local`
3. Run `npx prisma migrate dev` to create tables
4. Run `npx prisma generate` to regenerate client (done automatically after migration)

## Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Email/Password and Google sign-in methods in Authentication
3. Create a service account (Project Settings → Service Accounts → Generate new private key)
4. Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` in `.env.local`
5. Copy Web app config values for `NEXT_PUBLIC_FIREBASE_*` vars

## Website Overview
CV Forge is a **free online CV/resume builder** that helps users create professional, ready-to-download CVs in minutes. It targets job seekers, professionals, and career changers.

### Key Features
- **Multi-step form wizard** — 5 guided steps (Personal Info, Education, Experience, Skills, Advanced) with per-step validation
- **AI Resume Checker** — Multi-dimensional scoring (ATS, Impact, Formatting, Keywords, Tone) with Gemini-powered analysis
- **AI Text Enhancement** — Inline "Enhance with AI" buttons on summary and responsibility fields
- **AI Template Generator** — Prompt-to-template generation shared with the community
- **4 base templates** + community-generated templates — Minimalist, Executive, Tech Modern, Creative
- **Firebase Auth** — Email/password + Google OAuth with auto-sync ID token cookie
- **Token System** — 50 free tokens per week, 1 token per CV scan
- **Prisma + Neon DB** — PostgreSQL database with daily usage limits (10 scans/day, 5 generations/day)
- **PDF Upload & AI Analysis** — Upload a CV PDF, extract text, get ATS score + weaknesses + tips
- **ImageKit Integration** — Uploaded PDFs saved to ImageKit cloud storage (optional)
- **Live preview** — CV updates in real-time as users fill in data
- **Export** — Download as PDF or PNG via html2pdf.js
- **Auto-save** — Progress persists in localStorage across sessions
- **Dark/light mode** — Toggle via theme switch

### User Flow
1. User lands on `/` landing page → Signs up (Firebase) or clicks "Build Your CV"
2. Navigates to `/builder` → fills forms step-by-step (steps 1–5), uses inline AI enhancement on text fields
3. On step 5, selects a template (official or community-generated) or generates a new one via AI prompt
4. Checks CV quality at `/resume-checker` → gets 1-100 score + actionable feedback
5. Downloads final CV as PDF or PNG
6. Uploads existing CV PDF at `/dashboard` → gets ATS score + detailed analysis + weaknesses + tips
7. Can reset and start over anytime

### Target Audience
Job seekers, recent graduates, tech professionals, creatives, career changers — anyone needing a polished CV fast.

### Brand Identity
- Name: **CV Forge** (forge = craft/build)
- Tagline: *"Forge a CV That Opens Doors"*
- Brand color: Lightning red (`#ff0033`)
- Tone: Modern, professional, bold, accessible
- Dark mode by default
