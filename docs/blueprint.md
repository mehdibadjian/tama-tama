# Tama-Tama — App Blueprint

A Mandarin learning app for K2 learners (~5-7 years old), powered by the browser's Web Speech API so no audio files need to be recorded or sourced. The parent can add new vocabulary at any time and TTS handles pronunciation automatically.

---

## Phase 1 — Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | File-based routing, API routes, easy Vercel deploy |
| Audio | Web Speech API (`window.speechSynthesis`) | Free, on-device, supports `zh-CN`/`en-US` natively |
| Styling | Tailwind CSS + shadcn/ui | Fast touch-friendly UI, accessible defaults |
| Animations | Framer Motion | Bouncing characters, confetti rewards, card flips |
| Database | Vercel Postgres (or Supabase free tier) | Stores vocab pairs and per-lesson progress |
| Hosting | GitHub → Vercel | Zero-config CI/CD, preview URLs per PR |

---

## Phase 2 — TTS Architecture

### The Two-Voice System

A custom `useSpeech` hook switches voices dynamically based on content type.

```
Text type               Audience    Voice config     Trigger
─────────────────────────────────────────────────────────────────
Instructions            Kid+Parent  en-US / en-GB    Auto after audio unlock
Mandarin vocab          Kid         zh-CN / zh-TW    On tap / card reveal
Parent UI labels        Parent      none             Visual only
```

### Mobile Audio Unlock

Browsers block programmatic audio until the user interacts. The first screen **must** be a large "Start" / "Wake Up" button. That tap unlocks the `AudioContext` for the entire session.

```tsx
// useSpeech.ts (sketch)
function speak(text: string, lang: 'en-US' | 'zh-CN') {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.voice = window.speechSynthesis.getVoices().find(v => v.lang === lang) ?? null;
  window.speechSynthesis.speak(u);
}
```

### Re-play UX

Every Hanzi card has a small speaker icon / pulse ring. Tapping it re-fires the Mandarin TTS so the child can hear a word as many times as needed without parent involvement.

---

## Phase 3 — Kid-First UI Principles

- **No game over.** Wrong answer → card bounces back with a gentle sound, try again.
- **English is scaffolding only.** Menus, instructions, feedback in English (vocalized). Mandarin = learning content only.
- **Micro-rewards on every correct match.** Framer Motion confetti burst or star animation. Keep sessions feeling celebratory.
- **Large tap targets.** Min 64×64px touch areas. No small text that requires reading.
- **Visual-audio pairing.** Character + image + pinyin shown together so context reinforces meaning.

---

## Phase 4 — MVP Feature Set

### 4.1 Home Map
A vertically scrolling Candy-Crush-style path. Each node = one 3–5 minute lesson. Completed nodes show a gold star. Locked nodes are grayed out.

```
Route: /
State: fetched from DB — which lessons are complete for this device/user
```

### 4.2 Flash-Match Mini-Game (core loop)
1. English TTS fires: *"Find the cat."*
2. Three Hanzi cards appear face-down, flip over with animation.
3. Tapping any card plays its Mandarin TTS pronunciation.
4. Child drags the correct card to a center target zone.
5. Correct → confetti + next card. Wrong → bounce back, try again.

```
Route: /lesson/[id]/match
```

### 4.3 Trace & Listen
Large Hanzi rendered on a `<canvas>`. Child traces with finger. On stroke completion: Framer Motion glow + Mandarin TTS fires the word aloud.

```
Route: /lesson/[id]/trace
Dependency: stroke-order data from cdn.jsdelivr.net/npm/hanzi-writer-data
Library: hanzi-writer (MIT)
```

### 4.4 Parent Dashboard
Password-protected route (simple PIN, no auth overhead for V1). Parent can:
- Add vocab pairs: English label · Pinyin · Hanzi character
- Assign to a lesson node
- View per-lesson completion counts

```
Route: /parent
Auth: PIN stored in env var, checked in middleware
```

---

## Phase 5 — Data Model

```sql
-- vocab_items
id          serial primary key
hanzi       text not null          -- e.g. "苹果"
pinyin      text not null          -- e.g. "píngguǒ"
english     text not null          -- e.g. "apple"
image_url   text                   -- optional illustration
lesson_id   integer references lessons(id)
created_at  timestamptz default now()

-- lessons
id          serial primary key
title       text not null          -- e.g. "Animals"
position    integer not null       -- order on the map
created_at  timestamptz default now()

-- progress (device-local or per anonymous session)
lesson_id   integer references lessons(id)
completed   boolean default false
stars       integer default 0
updated_at  timestamptz default now()
```

---

## Phase 6 — Deployment Pipeline

### Initial Setup
```bash
npx create-next-app@latest tama-tama --typescript --tailwind --app
cd tama-tama
npx shadcn-ui@latest init
npm install framer-motion hanzi-writer
git init && git remote add origin <your-github-repo>
git push -u origin main
```

### Vercel Connection
1. `vercel.com` → New Project → Import GitHub repo
2. Framework auto-detected as Next.js — no config needed
3. Storage tab → Add Vercel Postgres → env vars injected automatically

### CI/CD Flow
```
commit to main  →  Vercel prod deploy  (tama-tama.vercel.app)
open PR         →  Vercel preview URL  (test touch + TTS on phone before merge)
```

### Environment Variables
```
DATABASE_URL          injected by Vercel Postgres
PARENT_PIN            4-digit PIN for /parent route
NEXT_PUBLIC_APP_NAME  "Tama-Tama"
```

---

## Phase 7 — Color System

"Cotton candy" palette — soft and vibrant, easy on a child's eyes for daily use. Color doubles as navigation signal so she doesn't need to read instructions.

### Token Definitions

| Role | Tailwind name | Hex | Usage |
|---|---|---|---|
| Primary action | `tama-pink` | `#FF8EAF` | "Tap me" affordance — Start button, correct-answer flash, food drops |
| Reward / magic | `tama-purple` | `#A855F7` | Progress bars filling, milestone stars, map path line |
| Background / calm | `tama-blue` | `#7DD3FC` | Sky canvas — soft background gradient, headers |
| Card surface | `tama-white` | `#FAFAFA` | Flashcard face — high contrast for Hanzi stroke detail |
| Text & outlines | `tama-ink` | `#334155` | Pinyin, English labels, character borders (softer than pure black) |

### Per-Screen Color Logic

**Daily Map** — `tama-blue` sky background · `tama-purple` path line · lesson nodes default white → turn `tama-pink` + star on completion.

**Flash-Match** — `tama-white` cards with `tama-purple` border · correct tap flashes `tama-pink` + triggers TTS · wrong answer: muted gray bounce (no red — keep energy positive).

**Pet Screen** — pet character rendered in `tama-purple` / `tama-pink` tones · earned food items glow `tama-pink` to signal "drag me."

**Error States** — never use red; use a desaturated gray + bounce animation so failure feels gentle, not scary.

### tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tama-pink':   '#FF8EAF',
        'tama-purple': '#A855F7',
        'tama-blue':   '#7DD3FC',
        'tama-white':  '#FAFAFA',
        'tama-ink':    '#334155',
      },
      fontFamily: {
        // Rounded sans feels friendlier for kids
        display: ['Nunito', 'ui-rounded', 'sans-serif'],
        body:    ['Nunito', 'ui-rounded', 'sans-serif'],
      },
      borderRadius: {
        // Everything rounded — sharp corners feel harsh
        DEFAULT: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
```

Usage in components:

```tsx
// Primary CTA
<button className="bg-tama-pink text-white rounded-2xl px-8 py-4 text-2xl font-display shadow-lg active:scale-95 transition-transform">
  Start
</button>

// Flashcard
<div className="bg-tama-white border-4 border-tama-purple rounded-2xl p-6 shadow-md">
  <span className="text-6xl font-display text-tama-ink">苹果</span>
</div>

// Progress bar
<div className="h-4 rounded-full bg-tama-blue/30">
  <div className="h-4 rounded-full bg-tama-purple transition-all duration-500" style={{ width: `${pct}%` }} />
</div>
```

---

## Phase 8 — App Icon

### Concept: "The Hatching Tama"

A round, dumpling-like creature peeking out of a cracked eggshell. Pays homage to the Tamagotchi/DanDan origin, signals "your pet is waiting inside" at a glance, and works as a single recognizable silhouette at 120×120px.

### Layer-by-Layer Breakdown

**Background — `tama-blue` `#7DD3FC`**
Solid sky-blue canvas. Blue recedes so the character pops. Optional: subtle radial gradient (center slightly lighter) to create a soft spotlight effect. Do not add texture — it disappears at small sizes.

**Character "Tama" — `tama-pink` `#FF8EAF`**
Plump, perfectly round creature filling the center. Large wide-set eyes + tiny smile in `tama-ink` (`#334155`). Round shape = friendly, non-threatening, memorable silhouette. Pink links the pet visually to every positive in-game action (correct answers, feeding).

**Eggshell — `tama-white` `#FAFAFA`**
Bottom third of the icon. Bold jagged zigzag crack line. White grounds the character so it doesn't float. High contrast against both the blue bg and the pink pet.

**Outlines & Sparkles — `tama-purple` `#A855F7`**
Use purple (not black) for all character and eggshell outlines — keeps the icon soft and palette-cohesive. Add 2–3 small purple sparkle/star shapes floating above the pet's head. These hint at the in-game reward system and tie the icon to the purple progress/milestone color.

### Color-Role Summary for the Icon

| Element | Color | Token |
|---|---|---|
| Background | Sky blue | `tama-blue` |
| Pet body | Bubblegum pink | `tama-pink` |
| Eggshell, card face | Soft white | `tama-white` |
| Outlines, sparkles | Friendly violet | `tama-purple` |
| Eyes, smile | Slate gray | `tama-ink` |

### Export & Technical Constraints

- **No text.** "Tama-Tama" and Hanzi characters are illegible at 120px. The OS renders the app name below the icon.
- **Squircle safe zone.** iOS clips to a rounded square; Android may clip to a circle. Keep all elements centered with ≥12% padding from edges so nothing is cropped by the device mask.
- **Thick strokes.** Purple outlines should be 8–12px at 1024px canvas (≈1–1.5% stroke weight). Thin lines vanish on high-DPI screens.
- **Export sizes.** Generate from a 1024×1024 master; the App Store / Play Store will derive all smaller sizes automatically.

```
1024×1024  — App Store / Play Store master
180×180    — iOS home screen (@3x)
120×120    — iOS home screen (@2x)
192×192    — Android adaptive icon foreground layer
512×512    — PWA manifest icon
```

- **PWA manifest** (for the Next.js web app): add `icons` array in `public/manifest.json` pointing to the 192 and 512 exports so the "Add to Home Screen" prompt shows the correct icon on iPads and Android tablets.

---

## Open Questions / V2 Ideas

- **Voice quality**: Browser TTS quality varies by device. If zh-CN voice is poor, swap to ElevenLabs or Azure TTS for Mandarin only (API route, still no pre-recorded files).
- **Progress persistence**: V1 uses `localStorage` keyed by device. V2 adds a lightweight account (magic link email) so progress syncs across tablets.
- **Stroke order validation**: hanzi-writer can validate stroke direction. Enable in V2 once the child is comfortable.
- **Spaced repetition**: Surface words she missed most often more frequently (simple SM-2 implementation in the DB).
