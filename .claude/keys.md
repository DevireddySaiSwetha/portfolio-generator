# API Keys & Environment Variables

All keys go in `.env.local` at the project root. This file is git-ignored and never committed.

---

## Full .env.local Template

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
FAL_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key-by-Key Guide

---

### NEXT_PUBLIC_SUPABASE_URL
**What it is:** The URL of your Supabase project.
**Used for:** Connecting the app to your Supabase database and auth.

**How to get it:**
1. Go to [supabase.com](https://supabase.com) → sign in → open your project
2. Go to **Settings → API**
3. Copy **"Project URL"** (looks like `https://xxxxxxxxxxxx.supabase.co`)

---

### NEXT_PUBLIC_SUPABASE_ANON_KEY
**What it is:** The public/anonymous API key for Supabase.
**Used for:** Frontend browser calls — login, signup, reading published portfolios.
**Safe to expose in browser** (RLS policies protect the data).

**How to get it:**
1. Go to **Settings → API** in your Supabase project
2. Under **"Project API keys"**, copy **"anon public"** key (starts with `eyJ...`)

---

### SUPABASE_SERVICE_ROLE_KEY
**What it is:** The admin/service role key for Supabase.
**Used for:** Server-side API routes that write data (`/api/publish`). Bypasses RLS.
**Never expose this in the browser or commit to git.**

**How to get it:**
1. Go to **Settings → API** in your Supabase project
2. Under **"Project API keys"**, click **"Reveal"** next to **"service_role"**
3. Copy the key (starts with `eyJ...`)

---

### GROQ_API_KEY
**What it is:** API key for Groq — used for AI resume parsing (Llama 3.3 70B model).
**Used for:** Extracting structured JSON from resume text in `/api/parse-resume`.
**Cost:** Free — 14,400 requests/day on free tier. No credit card needed.

**How to get it:**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Go to **"API Keys"** in the sidebar
4. Click **"Create API key"**
5. Copy the key (starts with `gsk_...`)

---

### GEMINI_API_KEY
**What it is:** Google Gemini API key.
**Used for:** Alternative AI provider for resume parsing (not currently active — Groq is used).
**Cost:** Free tier via AI Studio — 1,500 requests/day.

**How to get it (IMPORTANT: use AI Studio, not Google Cloud Console):**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API key"** → **"Create API key in new project"**
3. Copy the key (starts with `AIza...`)

> **Warning:** Keys from Google Cloud Console have `limit: 0` on the free tier — always use AI Studio to get a working free key.

---

### ANTHROPIC_API_KEY
**What it is:** Anthropic (Claude) API key.
**Used for:** Originally planned for resume parsing — replaced by Groq (free tier). Keep for future use.
**Cost:** Pay-per-use. Requires adding credits at console.anthropic.com. No free tier.

**How to get it:**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Go to **"API Keys"** in the sidebar
4. Click **"Create Key"**
5. Copy the key (starts with `sk-ant-...`)
6. Go to **"Plans & Billing"** → add $5+ credits to activate

---

### FAL_API_KEY
**What it is:** API key for fal.ai — used for AI background image generation.
**Used for:** Generating custom 3D/abstract background images for portfolios in `/api/generate-background`.
**Cost:** Pay-per-image (~$0.02–0.05). $1 free credit on signup (~20–50 images).
**Optional:** If not set, app uses free Unsplash fallback images automatically.

**How to get it:**
1. Go to [fal.ai](https://fal.ai)
2. Sign up / log in
3. Click your profile icon → **"Keys"**
4. Click **"Add key"**
5. Copy the key

---

### NEXT_PUBLIC_APP_URL
**What it is:** The base URL of the running app.
**Used for:** Building absolute URLs for portfolio links and internal API calls.

| Environment | Value |
|---|---|
| Local dev | `http://localhost:3000` |
| Vercel production | `https://your-app.vercel.app` |
| Custom domain | `https://yourdomain.com` |

---

## Which Keys Are Required?

| Key | Required? | Notes |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Yes | App won't work without it |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | App won't work without it |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Publish flow won't work without it |
| GROQ_API_KEY | Yes | Resume parsing won't work without it |
| NEXT_PUBLIC_APP_URL | Yes | Set to `http://localhost:3000` for local |
| GEMINI_API_KEY | No | Not currently used |
| ANTHROPIC_API_KEY | No | Not currently used |
| FAL_API_KEY | No | Unsplash fallback used if missing |

---

## Production (Vercel) Setup

When deploying to Vercel, do **not** upload `.env.local`. Instead:

1. Go to your Vercel project → **Settings → Environment Variables**
2. Add each key individually
3. Set `NEXT_PUBLIC_APP_URL` to your actual Vercel URL (e.g. `https://portfolio-generator.vercel.app`)
4. Redeploy

Keys prefixed with `NEXT_PUBLIC_` are exposed to the browser. All others are server-only.
