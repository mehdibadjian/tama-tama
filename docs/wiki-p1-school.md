# Tama-Tama — P1 School Wiki (`claude/p1-readiness-hub`)

The working reference for the Singapore MOE Primary 1 readiness hub: what is on the timetable, how each exercise is solved and scored, where state lives, and which known gaps are still open. Written against the code on this branch, not against the original brief — every number below was read out of the files or produced by the test suite.

For the *why* (problem, users, requirements, risks) see [`brd-p1-school.md`](./brd-p1-school.md). For the whole-app plan see [`blueprint.md`](./blueprint.md).

---

## 1. At a Glance

| | |
|---|---|
| Route root | `/p1-school` (hub) → `/p1-school/[trackId]` (one track) |
| Entry point | 🎒 **P1 School · 小学堂** card on the home splash (`app/page.tsx`) |
| Parent surface | `P1 School · 小学堂` section on `/parent` |
| Tracks | 4 (English, Mathematics, Chinese, PAL / School Life) |
| Questions | 14 total (4 / 5 / 3 / 2) |
| Exercise types | 7 (`P1ActivityType`) |
| Star scale | Every track is out of **3** stars |
| Reward per finished track | 🧠 +15 · 💖 +10 · ⚡ −5 · 🪙 +5 |
| Persistence | `localStorage`, keys `tama-tama-p1-progress` and `tama-tama-pet` |
| Audio | Web Speech API TTS + WebAudio oscillator blips — **no audio files** |
| Tests | 27 (`pnpm test`), Vitest 5, node environment |
| Science | **Deliberately absent** — MOE Primary Science begins at P3 |

---

## 2. Navigation

```
                        ┌───────────────────────────┐
   home splash ──🎒──▶  │  /p1-school  (the hub)    │
                        │  Tama in school uniform   │
                        │  streak · Star Coins      │
                        │  🧠 💖 ⚡ stat bars       │
                        └────────────┬──────────────┘
             tap a card (4 of them)  │
                                    ▼
                        ┌───────────────────────────┐
                        │ /p1-school/[trackId]      │
                        │ P1ActivityRunner          │
                        │ prompt → widget → Next    │
                        └────────────┬──────────────┘
                                     │ last question correct
                                     ▼
                        ┌───────────────────────────┐
                        │  Result screen            │
                        │  Tama waves, 3 stars pop  │
                        │  School Hub  |  Again     │
                        └───────────────────────────┘
```

An unknown `trackId` renders a friendly "not on the timetable" card rather than a Next.js error page. `←` inside the runner always returns to the hub.

Routes use `useParams()` inside client components. Next.js 16 makes route `params` an async promise on the server; the repo already avoids that by resolving params on the client, and the P1 pages follow the same convention.

---

## 3. The Timetable

| Track | id | Subject | Qs | Accent | Exercises |
|---|---|---|---|---|---|
| 📘 English Explorer | `sg_p1_english` | english | 4 | `#3B82F6` | 3 × sight-word audio, 1 × phonics blend |
| 🔢 Math Champion | `sg_p1_math` | mathematics | 5 | `#10B981` | 2 × number bond, 3 × canteen money |
| 🇨🇳 华文小达人 (Mother Tongue) | `sg_p1_chinese` | chinese | 3 | `#EF4444` | 1 × pinyin tone, 2 × character match |
| 🎒 P1 School Life & PAL | `sg_p1_pal` | pal_life | 2 | `#8B5CF6` | 1 × bag packer, 1 × recess routine |

Accent colour drives the progress bar, the track header, and the "Again" button on the result screen. Chinese is the only track that speaks `zh-CN`; everything else is `en-SG`.

**Content coverage, by design question:**

| id | What it drills |
|---|---|
| `eng_01` | STELLAR high-frequency connective — hear "because", pick it among `became / before / belong` |
| `eng_02` | Digraph `sh` in *ship* against `ch / th / wh` |
| `eng_03` | Irregular plural *child → children* |
| `eng_04` | Sentence-level capitalisation and full stop |
| `math_nb_01` | Whole 8, part 5 → missing part 3 |
| `math_nb_02` | Whole 10, part 4 → missing **partA** 6 (proves either part can be the hole) |
| `math_money_01` | 80¢ noodles from `5 / 10 / 20 / 50 / 100` |
| `math_money_03` | $2.20 chicken rice from `20 / 50 / 100 / 200` — the **$2** coin |
| `math_money_02` | $1.20 Milo from `10 / 20 / 50 / 100` |
| `chi_01` | First tone `mā` against the other three tones |
| `chi_02` | 老师 = teacher, school-topic vocabulary |
| `chi_03` | 猫 = cat |
| `pal_01` | Pack 4 timetable-correct items, reject 3 decoys |
| `pal_02` | Tray return at recess — a Singapore-specific routine |

Adding a question means appending to `P1_CURRICULUM_DATA` in `lib/p1-curriculum-data.ts`. Nothing else has to change: the hub, the runner, the parent dashboard, and the test suite all read from that one array.

---

## 4. The Four Widgets

### 4.1 `NumberBondWidget` — part-part-whole

An SVG tree (`viewBox="0 0 300 200"`, circle radius `R = 34`): whole at the top `(150, 45)`, the two parts below at `(70, 155)` and `(230, 155)`, joined by lines.

- The slot holding `null` in the payload is drawn as an open circle with a dashed pink rim and a **blinking `?`** (`animate={{ opacity: [1, 0.25, 1] }}`).
- Which slot is open is derived by `missingBondSlot(bond)`, never assumed to be `partB`.
- Four option bubbles sit underneath. Correct → `playChime()` and the number lands with a `scale: [0.4, 1.25, 1]` pop. Wrong → the bubble shakes left-right and `playRetry()` plays; the child simply tries another bubble.
- Answer checked against `numberBond.correctAnswer` via `isAnswerCorrect`.

### 4.2 `P1CoinTrayWidget` — the canteen

Money is **integer cents everywhere**. Prices, tray contents and totals are all cents; floats never appear, so `0.1 + 0.2` style drift is impossible.

| cents | label | face | ring | size | metal |
|---|---|---|---|---|---|
| 5 | `5¢` | `#D98C5F` | `#A9663C` | 44px | bronze |
| 10 | `10¢` | `#D6DBE0` | `#9AA5B1` | 50px | cupro-nickel |
| 20 | `20¢` | `#CBD3DA` | `#8D99A6` | 56px | cupro-nickel |
| 50 | `50¢` | `#C2CCD6` | `#83919F` | 62px | cupro-nickel |
| 100 | `$1` | `#E8C87A` | `#B7C0C9` | 66px | bimetallic, brass core |
| 200 | `$2` | `#F0D48A` | `#C9A227` | 70px | bimetallic |

Size grows with value so a child can read the amount with their eyes, not only their fingers. `formatCents` renders `80 → "80¢"` and `120 → "$1.20"`.

Flow: a purse of `availableCoins` → **drag or tap** coins into the tray → **Pay Uncle / Auntie**.

- `judgePayment(tray, price)` returns `'exact' | 'short' | 'over'`.
- **Short** → tray shakes, message says how much more is needed. No coin is taken away.
- **Over** → tray shakes, message says it is too much, the change idea is mentioned. No penalty.
- **Exact** → button reads `✓ Paid!`, `playChime()`, the widget locks.
- ↺ **Reset Tray** empties the tray at any time, including after a mistake.

### 4.3 `P1BagPackerWidget` — pack the school bag

A shelf of `validItems + decoyItems` shuffled by `bagShelfItems`, and a bag that shows a live **`{packed} / {needed}`** badge (`4 / 4` when ready).

- Drag an item into the bag, or tap it — both work.
- Tapping a packed item takes it back out; the widget is only `disabled` once locked or checked, so removal stays possible.
- A decoy refuses to enter, shakes, and the hint explains why (video games and giant pillows stay home).
- **Close My Bag** is disabled until the bag is non-empty. Correct only when `packed.length === needed`, which — since decoys can't be packed — is enough.

### 4.4 `P1ChoiceWidget` — sight words, pinyin, characters

Used for the four multiple-choice types. Shows `targetVisual` as a large emoji, then options as tappable cards. Wrong option shakes; the correct one locks the question and reveals `explanation`. `activityType` only changes labels and styling, never the judging (`guess === multipleChoice.correctIndex`).

---

## 5. Scoring

`starsForAttempt(total, missedFirstTry)` — `missedFirstTry` counts distinct question ids that needed more than one try:

| condition | stars |
|---|---|
| `missedFirstTry === 0` | **3** |
| `missedFirstTry <= floor(total / 3)` | **2** |
| otherwise | **1** |
| `total <= 0` (defensive) | 1 |

Worked examples on the 5-question Math track (`floor(5/3) = 1`):

- 0 retried → 3 ⭐
- 1 retried → 2 ⭐
- 2, 3, 4 or 5 retried → 1 ⭐

**There is no zero.** Finishing a track always gives at least one star, which the hub badge states plainly as `"2 / 3 Completed"` via `p1StarBadge`. The badge always reports out of `P1_MAX_STARS = 3`, regardless of question count, so cards stay comparable.

Replaying a track keeps the **best** star count (`Math.max`) and increments `count`.

---

## 6. Rewards

`applyP1Rewards(trackId, stars)` runs **inside the winning tap handler, never inside an effect** — under React StrictMode an effect could fire twice and hand out double coins.

| stat | delta | bounds |
|---|---|---|
| 🧠 wisdom | +15 | clamped 0–100 |
| 💖 happiness | +10 | clamped 0–100 |
| ⚡ energy | −5 | clamped 0–100 |
| 🪙 starCoins | +5 | uncapped |
| speech | one of 4 encouragement lines, picked at random | — |

The four lines live in `lib/pet-state.ts`:

```
Wah, you are so clever! Primary 1 will be super easy for you! 🌟
Good job! Your teacher will be so proud! 🎒
Yum! You paid the canteen uncle correctly! 🍜
Look at you, solving number bonds like a math wizard! 🧙
```

A finished track also calls `recordTrackCompletion`, which bumps the play count, keeps the best stars, stamps the time, and updates the streak. Nothing in the P1 flow ever subtracts coins or happiness.

---

## 7. Streaks

Dates are **local** `YYYY-MM-DD` (`todayKey`), not UTC — a child playing at 11pm Singapore time is not pushed to tomorrow.

| situation | streak |
|---|---|
| first ever completion | 1 |
| played earlier today | unchanged (never resets to 1) |
| last played yesterday | previous + 1 |
| last played ≥ 2 days ago | back to 1 |
| clock skew / same date in future | treated as today, unchanged |

Streak is shown as a pill on the hub (`🔥 N-Day Learning Streak!`, or `Start a streak today!`) and on the parent dashboard.

---

## 8. Audio

Two systems, neither needing recorded assets.

**Speech — `hooks/useSpeech.ts`**

`playP1Audio(text, lang = 'en-SG')` speaks at `rate 0.85`, `pitch 1.1`. Voice selection is a ladder in `pickVoice`: exact-locale female voice → locale-prefix female → exact locale → locale prefix → `null` (let the browser choose). `SpeechSynthesis` populates its voice list asynchronously, so a miss is retried when `onvoiceschanged` fires.

The pre-existing legacy lessons keep their own pacing (0.65 for `zh-CN`, 0.75 for `en-US`, pitch 1.25). P1 deliberately does **not** reuse those numbers; `useSpeech` still returns `{ speak, speakMandarin, speakEnglish }` unchanged so `/lesson` and `/math` behave exactly as before.

Prompts are auto-spoken 350 ms after a question appears, and every question also carries a visible 🔊 `P1AudioButton` — a child can replay it as often as they like. The Chinese track sets `audioLang: 'zh-CN'` and stores real Hanzi in `audioPromptText` (妈 / 老师 / 猫); speaking latin pinyin to a `zh-CN` voice would produce garbage.

Browsers block audio before the first interaction. The 🎒 button on the splash speaks on tap, which unlocks both `speechSynthesis` and the `AudioContext` for the session.

**Sound effects — `lib/sfx.ts`**

Plain oscillator tones, no files:

| call | notes | meaning |
|---|---|---|
| `playChime()` | C5 → E5 → G5 | right answer |
| `playRetry()` | Eb4 → Bb3, quiet | wrong answer, gentle |
| `playFanfare()` | rising arpeggio | track finished |

---

## 9. Interaction: Tap **and** Drag

Every coin and every bag item is wrapped in `components/P1Draggable.tsx`, which supports **both** input styles:

- **Drag** it onto the tray / bag and release → `onDrop()`
- **Tap** it → `onTap()` (the same add action)

The drop test is rectangle-vs-rectangle, not pointer coordinates:

```
item centre = getBoundingClientRect() of the dragged node
target      = getBoundingClientRect() of trayRef / bagRef

didLandOnTarget(x, y, target, tolerancePx = 24)
   →  x within [left − 24, left + width + 24]
   →  y within [top  − 24, top  + height + 24]
```

Why this shape:

1. Framer Motion documents `info.point` only as "relative to the device or page", which is ambiguous under scroll and `transform` contexts. Comparing two rects the browser already measured has no such ambiguity.
2. `tolerancePx = 24` pads the target outward, so a small finger that stops just short of the tray still counts. A near-miss that a 5–7 year old cannot see as their fault is the failure mode to avoid.
3. `dragSnapToOrigin` returns the item to the purse when the drop misses, so nothing is ever lost.

A drag also produces a synthetic click on release. Rather than trusting undocumented suppression, `carrying` is tracked in a ref and the click is ignored while set; it is cleared on a `setTimeout(…, 0)` after `onDragEnd` has judged the drop.

While an item is held, the tray scales up slightly and the bag tints (`bg-tama-pink/25`) so the drop zone is obvious. `whileTap={{ scale: 0.9 }}` gives immediate feedback on touch.

> **Honest status:** the drop maths is unit-tested (`tests/p1Drop.test.ts`), but no real finger has ever exercised it. It has not been validated on a physical tablet.

---

## 10. Child-Safety Rules

These are invariants, not preferences. The suite pins them.

- **No red error states.** Rejections use pink/purple and motion; `globals.css` forces light mode.
- **No penalty.** Wrong answers never remove coins, stars, happiness or progress. Energy is only spent for *finishing*, never for failing.
- **No zero scores.** Completing anything earns at least 1 star.
- **No timer, no fail state, no "game over".** A child can sit on a question as long as they like.
- **Retry is always available.** Reset Tray, tap-to-remove from the bag, and `Again` on the result screen.
- **Everything is read aloud.** A pre-reader can complete every track without decoding English.
- **Drag is optional.** Every draggable also accepts a plain tap, so a child who cannot manage a drag is never stuck.

One deviation worth flagging: `blueprint.md` sets a 64×64px minimum tap target, and the coin faces are 44–70px. The 5¢ coin (44px) is below that floor. See BRD **NF-4** and the open questions.

---

## 11. State & Storage

```
localStorage
├── tama-tama-p1-progress   P1UserProgress   (new on this branch)
├── tama-tama-pet           PetState         (new on this branch)
├── tama-tama-progress                       (pre-existing, untouched)
├── tama-tama-math-progress                  (pre-existing, untouched)
└── tama-tama-math-settings                  (pre-existing, untouched)
```

```ts
P1UserProgress {
  completedActivityIds: { [trackId]: { count, starsEarned, lastPlayedTimestamp } },
  dailyStreak: number,
  lastActiveDate: 'YYYY-MM-DD'
}

PetState { wisdom, happiness, energy, starCoins, speech }
DEFAULT_PET_STATE = { wisdom: 10, happiness: 70, energy: 100, starCoins: 0, speech: '' }
```

Reads merge over the defaults, so a half-written or older payload still loads.

`lib/local-store.ts` is the plumbing: `readStore` caches its parsed snapshot keyed by the raw string, so repeated reads of unchanged storage return the **same object identity**. That is what makes `useSyncExternalStore` safe here — without it React would see a new object every render and loop. Writes notify listeners directly, and a single `window 'storage'` listener covers other tabs.

`hooks/useP1Stores.ts` exposes `useP1Progress()` and `usePetState()`, each with a server snapshot (`EMPTY_P1_PROGRESS` / `DEFAULT_PET_STATE`) so hydration never mismatches. The repo's older pages set state inside effects; the new code avoids that because `react-hooks/set-state-in-effect` is an error in this ESLint config.

---

## 12. Code Map

```
lib/
  p1-curriculum-types.ts     domain models (subjects, 7 activity types, payloads, PetState)
  p1-curriculum-data.ts      P1_CURRICULUM_DATA — the whole syllabus, 4 tracks / 14 questions
  p1-curriculum-logic.ts     pure judging: money, bonds, drops, stars, badges
  p1-progress.ts             track records, streak maths, storage read/write
  pet-state.ts               pet stats + applyP1Rewards + encouragement lines
  p1-parent.ts               read-only parent dashboard rows
  local-store.ts             localStorage pub/sub with stable snapshots
  sfx.ts                     WebAudio chime / retry / fanfare

hooks/
  useSpeech.ts               + playP1Audio, + en-SG, voice ladder
  useP1Stores.ts             useP1Progress / usePetState

components/
  P1SchoolHub.tsx            hub screen, cards, badges, stat bars
  P1ActivityRunner.tsx       plays one track, owns retry + reward hand-off
  P1NumberBondWidget.tsx     SVG part-part-whole
  P1CoinTrayWidget.tsx       canteen payment
  P1BagPackerWidget.tsx      school bag
  P1ChoiceWidget.tsx         multiple choice
  P1Draggable.tsx            tap-or-drag wrapper, drop judgement
  P1AudioButton.tsx          🔊 replay
  P1PetStats.tsx             🧠 💖 ⚡ bars
  TamaCharacter.tsx          + uniform, + waving paw
  Emoji.tsx                  Twemoji via CDN (pre-existing)

app/
  p1-school/page.tsx
  p1-school/[trackId]/page.tsx
  page.tsx                   🎒 entry card
  parent/page.tsx            P1 readiness section

tests/
  p1Curriculum.test.ts (12) · p1Badge.test.ts (3) · p1Drop.test.ts (5) · p1Parent.test.ts (7)
```

---

## 13. Running It

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # production build
pnpm start          # serve the build
pnpm test           # 27 unit tests
pnpm test:watch
pnpm lint
```

Vitest runs in a **node** environment (`vitest.config.mts`) over `tests/**/*.test.ts`, so nothing pulls in jsdom — which is possible only because all P1 judging is pure. The config is `.mts`, not `.ts`, to avoid a Vite native-loader warning.

Lint note: the baseline on `main` already carries 8 problems (7 errors, 1 warning) in pre-existing files. This branch adds none — verified by comparing `pnpm lint` output before and after stashing the changes.

---

## 14. Parent Dashboard

`/parent` gains one section, `P1 School · 小学堂`, above the Math Difficulty card. One row per track, always all four — an unplayed track reads `0× played · 0 / 3 ⭐ · Not yet` so the gap is visible rather than hidden.

```
🔢  Math Champion        2× played    3 / 3 ⭐    Yesterday
📘  English Explorer     1× played    2 / 3 ⭐    Today
🇨🇳  华文小达人           0× played    0 / 3 ⭐    Not yet
🎒  P1 School Life & PAL 1× played    3 / 3 ⭐    18 Oct 2026
```

Header line carries 🔥 streak and 🪙 Star Coins. Dates are parent-readable (`Today` / `Yesterday` / `18 Oct 2026`); a timestamp ahead of today never reads backwards. The section is read-only — opening `/parent` cannot change the child's state. A footer repeats that Science is missing on purpose.

---

## 15. Known Limitations

Read these before extending. They are real, not boilerplate.

1. **Energy only goes down.** `applyP1Rewards` spends 5 energy per track and nothing in the app ever refills it — there is no feeding, resting or sleep mechanic anywhere. After ~20 tracks energy hits 0 and stays there.
2. **The reward loop saturates fast.** Wisdom starts at 10 and gains 15 per track, so it reaches 100 in 6 tracks; happiness 70 → 100 in 3. Within a week of daily play the stat bars are full and stop communicating anything. Star Coins are the only stat that keeps moving.
3. **14 questions is a small syllabus.** A child can see every question in two sittings, and replaying a track yields no new content.
4. **`en-SG` voices are device-dependent.** Android Chrome and iOS Safari usually have one; desktop browsers often do not. The ladder falls back to any `en` voice, then to the browser default, so prompts are always spoken — but the accent is not guaranteed.
5. **Offline has an asterisk.** The app installs a service worker, but emoji render through the Twemoji CDN (`cdn.jsdelivr.net`) and `public/sw.js` explicitly skips cross-origin requests. Offline the app still opens and works; emoji fall back to native system glyphs.
6. **Drag-and-drop has never been tested by touch.** The rectangle maths is unit-tested; the Framer wiring has not been exercised with a real finger on a real tablet.
7. **Curriculum content is unvalidated.** The questions were authored to the brief, not checked against a MOE scope-and-sequence document by a teacher.
8. **No accounts, no sync, single device.** Progress lives in this browser's `localStorage`. Clearing site data resets everything; a child switching between a phone and a tablet has two separate pets.

---

## 16. Extending P1 School

- **New question** → append to a track's `questions` in `lib/p1-curriculum-data.ts`. Give it a unique `id`, and for money keep cents integral with a solvable `availableCoins` set. `tests/p1Curriculum.test.ts` asserts every bond is self-consistent and every canteen order is payable, so an unpayable price fails the suite rather than the child.
- **New exercise type** → add to `P1ActivityType`, a payload field in `P1QuestionPayload`, a branch in `isAnswerCorrect`, and a widget rendered from `P1ActivityRunner`.
- **New track** → one entry in `P1_CURRICULUM_DATA`. The hub, runner and parent rows pick it up; `p1ParentSummary` iterates the array, so no dashboard list goes stale.
- **Never** put reward logic in an effect. Non-idempotent writes belong in the click handler.
