# PortfolioBot — Feature Documentation

## Overview
PortfolioBot is a web app that lets users sign up, chat with an AI bot, upload their resume, and get a live portfolio website — all in minutes. No coding required.

---

## Features

### 1. Authentication
- Email + password signup/login via Supabase Auth
- Google OAuth (requires Google Cloud Console setup)
- Session managed via Supabase SSR cookies
- Protected routes: `/dashboard`, `/bot` redirect to `/auth/login` if not authenticated

**Files:**
- `src/app/auth/signup/page.tsx` — signup UI
- `src/app/auth/login/page.tsx` — login UI
- `src/app/auth/callback/route.ts` — OAuth redirect handler
- `src/app/auth/signout/route.ts` — sign out handler
- `src/lib/supabase/client.ts` — browser Supabase client
- `src/lib/supabase/server.ts` — server Supabase client
- `src/lib/supabase/proxy.ts` — auth session middleware (Next.js 16 proxy)

---

### 2. Bot Chat UI
Multi-step chat interface that guides the user through portfolio creation.

**Flow:**
1. Upload resume (PDF) → parsed by AI
2. Pick portfolio style: Minimal / Techy / Creative / Bold
3. Pick background theme: Space / Geometric / Waves / Abstract
4. Select projects to highlight (auto-generated from experience if no projects in resume)
5. Choose extra sections (optional)
6. Bot generates + publishes portfolio → returns live link

**Files:**
- `src/app/bot/page.tsx` — bot page (auth-gated)
- `src/components/bot/BotChat.tsx` — full chat UI with step logic
- `src/lib/bot-steps.ts` — bot conversation step definitions

---

### 3. Resume Parsing
Extracts structured JSON from uploaded PDF using Groq (Llama 3.3 70B).

**Process:**
1. PDF uploaded via multipart form
2. `unpdf` extracts plain text from the PDF (ESM-native, works with Next.js App Router)
3. Text sent to Groq API with extraction prompt
4. Returns structured `PortfolioData` JSON (name, title, skills, experience, education, projects)

**Fallback:** If resume has no Projects section, project cards are auto-generated from Experience entries.

**Files:**
- `src/app/api/parse-resume/route.ts` — API route

---

### 4. Background Image Generation
Generates an AI background image based on the user's chosen theme.

**Process:**
1. Maps theme choice to a descriptive prompt
2. Calls fal.ai (Flux Schnell model) if `FAL_API_KEY` is set
3. Falls back to curated Unsplash images if no FAL key

**Theme → Prompt mapping:**
| Theme | Description |
|---|---|
| Space | Dark cosmos, 3D wireframe constellation, neon blue |
| Geometric | Abstract 3D mesh, low-poly, purple teal gradient |
| Waves | Fluid gradient waves, smooth curves, dark bg |
| Abstract | 3D wireframe sphere, floating particles, neon edges |

**Files:**
- `src/app/api/generate-background/route.ts` — API route

---

### 5. Portfolio Template (JSON-Driven)
A fully dynamic portfolio template that renders from a `PortfolioData` JSON object — no hardcoded data.

**Sections:**
- Hero (name, title, initials avatar, social links, phone)
- Skills & Expertise (grouped by category, tag pills)
- Career Timeline (experience + education in chronological order)
- Projects (gradient card grid)
- Navigation + Footer

**Themes:** 4 CSS themes (minimal, techy, creative, bold) + 4 background styles.

**Files:**
- `src/types/portfolio.ts` — `PortfolioData` TypeScript schema
- `src/components/portfolio/PortfolioLayout.tsx` — root layout with bg + nav
- `src/components/portfolio/PortfolioMain.tsx` — hero section
- `src/components/portfolio/PortfolioExpertise.tsx` — skills section
- `src/components/portfolio/PortfolioTimeline.tsx` — experience/education timeline
- `src/components/portfolio/PortfolioProjects.tsx` — project cards

---

### 6. Publish Flow
Saves portfolio JSON to Supabase and makes it instantly live.

**Process:**
1. Bot calls `/api/publish` with `userId` + `portfolioData`
2. Background image is generated
3. Slug is auto-generated from name (e.g. `sai-swetha-devireddy`), deduplicated if taken
4. Portfolio saved to `portfolios` table with `status: published`
5. Returns slug → live at `yourapp.com/u/{slug}`

**No separate deployment needed** — all portfolios are dynamic routes on one Next.js app.

**Files:**
- `src/app/api/publish/route.ts` — publish API
- `src/app/u/[slug]/page.tsx` — public portfolio page (SSR)

---

### 7. Dashboard
Shows all user portfolios with status, live link, and edit/preview actions.

**Files:**
- `src/app/dashboard/page.tsx` — dashboard page

---

## Database Schema
Single table: `public.portfolios`

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | References `auth.users` |
| slug | text | Unique URL slug |
| portfolio_json | jsonb | Full `PortfolioData` object |
| bg_image_url | text | Generated background image URL |
| status | text | `draft` or `published` |
| live_url | text | Full live URL |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto-updated via trigger |

**RLS Policies:**
- Users can only manage their own portfolios
- Published portfolios are publicly readable (for `/u/[slug]`)

**File:** `supabase-schema.sql`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth + DB | Supabase (Auth + Postgres) |
| AI (Resume) | Groq API — Llama 3.3 70B |
| PDF Parsing | unpdf (ESM-native) |
| Image Gen | fal.ai Flux Schnell (optional) |
| Hosting | Vercel (recommended) |

---

## Local Development
```bash
cd portfolio-generator
npm install
# Fill in .env.local (see .claude/keys.md)
npm run dev
# Open http://localhost:3000
```

## Test Script
```bash
node test-flow.mjs
# Tests: resume parsing, background generation, app health
```
