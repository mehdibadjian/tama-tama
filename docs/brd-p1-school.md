# Tama-Tama — Business Requirements Document: P1 School (Singapore MOE Primary 1 Readiness)

| | |
|---|---|
| Document | `docs/brd-p1-school.md` |
| Feature | P1 School · 小学堂 — Singapore MOE Primary 1 readiness hub |
| Branch | `claude/p1-readiness-hub` |
| Base | `main` @ `17a4793` |
| Pull request | mehdibadjian/tama-tama#4 |
| Status | Implemented on branch; **not merged**, not released |
| Version | 1.0 — 25 Oct 2026 |
| Owner | Feature author (assistant-written); product decisions rest with the repo owner |
| Related | [`wiki-p1-school.md`](./wiki-p1-school.md) (how it works) · [`blueprint.md`](./blueprint.md) (whole-app plan) |

> **Honesty note.** This BRD was written after implementation, against the code that exists on the branch. Requirements are stated as they are actually built. Where the original brief asked for something the codebase did not allow, the deviation is recorded rather than smoothed over. No metric in §3 has been measured.

---

## 1. Problem Statement

Tama-Tama shipped as a Mandarin learning app for K2 children aged roughly 5–7, with two entry points: the Hanzi map (`/map` — flash-match and finger tracing) and 心算 mental math (`/math` — abacus and the nine-nine song). Singapore families using it face a specific, time-boxed problem the app does not address: **primary school readiness.**

A child entering Primary 1 in Singapore is expected to arrive with a defined readiness profile — English sight words and phonics from the STELLAR approach, CPA number bonds and coin recognition for the canteen, Mother Tongue sound awareness, and the school-routine habits PAL teaches. Parents of a K2 child have about one term to close those gaps, and the tools available to them are either worksheets with no feedback or paid apps with account walls and daily usage limits.

The gap in the product: a parent who wants to use Tama-Tama for P1 readiness finds one subject (Chinese) and no visibility into what their child has actually practised. There is no maths-curriculum exercise, no English track, no canteen money practice, no school-routine content, and the parent dashboard reports nothing about any of it.

**The problem, stated precisely:** Tama-Tama cannot yet be used as a P1 readiness tool, so a family doing daily practice must run a second app alongside it — and the second app is usually the one that charges.

---

## 2. Objectives

| # | Objective | Why it matters | Delivered by |
|---|---|---|---|
| O-1 | Make Tama-Tama sufficient for P1 readiness practice | Removes the need for a second app | 4 tracks, 14 exercises |
| O-2 | Teach the *Singapore-specific* content a generic app gets wrong | Number bonds and coin payment are how MOE teaches, not flashcards | `NumberBondWidget`, `P1CoinTrayWidget` with real denominations |
| O-3 | Be usable by a child who cannot read yet | Practice must not depend on literacy | TTS on every prompt, auto-read, large emoji |
| O-4 | Never punish a wrong answer | A punished 6-year-old stops trying; the app dies | Shake + retry, no subtraction, floor of 1 star |
| O-5 | Give the parent an honest picture | A parent who cannot see coverage cannot plan | `/parent` P1 section, per-track plays/stars/last played |
| O-6 | Ship without new infrastructure | The team has no backend and no budget for one | `localStorage` only, Web Speech TTS, oscillator SFX, zero audio files |
| O-7 | Keep the existing app working | Two older pages have real users | Legacy `useSpeech` API and storage keys untouched |

---

## 3. Success Metrics

**None of these numbers have been measured.** They are the metrics to instrument, with targets proposed here for the owner to accept or change. Treating this column as evidence would be a mistake.

| Metric | Proposed target | Status | How it would be measured |
|---|---|---|---|
| Child completes ≥1 track per session | ≥70% of sessions | **not measured** | Would require analytics; none exists |
| Wrong-answer rate before first success | tracked, no target | **not measured** | Would require event logging |
| Parent opens `/parent` weekly | ≥50% of active families | **not measured** | No instrumentation |
| Session length | 3–8 minutes, not maximised | **not measured** | Long sessions here are a warning, not a win |
| Zero frustration exits (closing mid-question) | <10% | **not measured** | Cannot be observed without logging |

There is currently **no analytics layer in this repository at all** — no event bus, no telemetry, no user IDs. Until one exists, O-1 through O-5 can only be assessed by watching a child use it. That is the honest position, and it is why the release criteria in §9 lean on review rather than on numbers.

---

## 4. Users & Journeys

**Primary user — the child (6–7, pre-reading or early-reading).**
Sits down with a parent's phone. Cannot read instructions reliably. Cannot read a clock. Has no concept of "session" and no tolerance for being told no.

```
Tap 🎒 on the splash → hear "Welcome to P1 School!"
  → see 4 big cards, Tama in a school uniform waving
  → tap 🔢 Math Champion
  → hear "The whole is eight. One part is five. What is the missing part?"
  → tap the "3" bubble → chime, number lands, Tama holds it
  → Next → the canteen: drag a $2 coin onto the tray, Pay Uncle → ✓ Paid!
  → Finish! 🎉 → 3 stars pop, Tama waves, "Look at you, solving number bonds
    like a math wizard!" → +5 Star Coins
  → Again, or back to the hub
```

**Secondary user — the parent.**
Not present for every session. Decides whether this app replaces the paid one. Wants to know what was covered and what was not.

```
Open /parent → "P1 School · 小学堂"
  🔥 3-day streak · 🪙 45 Star Coins
  🔢 Math Champion        2× played   3 / 3 ⭐   Yesterday
  📘 English Explorer     1× played   2 / 3 ⭐   Today
  🇨🇳 华文小达人            0× played   0 / 3 ⭐   Not yet
  🎒 P1 School Life & PAL 1× played   3 / 3 ⭐   18 Oct 2026
  → sees Chinese and PAL untouched, opens those cards next
```

The deliberately boring `Not yet` row is the most useful thing on the screen. A dashboard that lists only what has been played tells a parent nothing about coverage.

**Non-user — a teacher.** Not modelled. No class accounts, no assignment, no reporting beyond one device.

---

## 5. Scope

### In scope (this branch)

1. Four tracks exactly: English (STELLAR), Mathematics (CPA + canteen money), Chinese Mother Tongue, PAL / School Life.
2. Four interactive exercise types: number bond, coin payment, bag packing, multiple choice.
3. Tap-or-drag input for coins and bag items.
4. TTS on every question, `en-SG` by default, `zh-CN` for Mother Tongue.
5. Pet reward loop wired to track completion (+15 🧠 / +10 💖 / −5 ⚡ / +5 🪙).
6. Streak and per-track progress persistence.
7. Parent dashboard P1 section.
8. Unit tests for all pure logic (`pnpm test`, 27 tests).

### Out of scope — with reasons

| Excluded | Reason |
|---|---|
| **Science** | The MOE Primary Science syllabus begins at **P3**. A P1 Science track would teach a sibling app's content, not the syllabus. Stated on the hub and the parent screen so the absence reads as a decision, not an omission. |
| Accounts, logins, cloud sync | No backend exists; adding one changes the whole product, not a feature. |
| Paid tier / paywall | Would undercut O-1 (replace the second, paid app). |
| Handwriting / tracing for P1 | `HanziTracer` exists for the older Chinese flow; extending it is a separate brief. |
| Reading comprehension, story mode | Needs content volume this branch does not have. |
| Analytics | No instrumentation layer to add to; see §3. |
| Multi-profile (siblings on one device) | Single storage key set; two children share one pet today. |
| Teacher or classroom mode | No second user is modelled. |
| Recorded voice packs | Deliberately avoided; TTS keeps the repo asset-free (O-6). |

---

## 6. Functional Requirements

Each is written so a reviewer can check it by doing, not by reading code. All are implemented on the branch.

**Curriculum**
- FR-1 Exactly four tracks; no Science track is reachable anywhere in the app.
- FR-2 Each track declares its questions in a single data array that every screen reads.
- FR-3 Money prices are integer cents with a payable coin set — no order can be unsolvable.
- FR-4 Number bonds are self-consistent: the open slot is derivable and the stated answer appears in the options.
- FR-5 Chinese prompts are stored as Hanzi and spoken with a `zh-CN` voice.

**Interaction**
- FR-6 Every question is read aloud automatically on appearance and can be replayed from a visible 🔊 button.
- FR-7 A wrong answer shakes the control and keeps everything the child has earned; the question stays open.
- FR-8 Coins and bag items respond to drag **and** to tap; a child who cannot drag is never blocked.
- FR-9 A dropped item counts as delivered when its centre lands on the target, padded 24px outward.
- FR-10 The bag shows a live `n / 4` counter and rejects decoys with an explanation.
- FR-11 The coin tray shows a running total against the price and distinguishes short from over.
- FR-12 Reset is always available before payment.

**Progress and rewards**
- FR-13 Finishing a track awards ≥1 star, never zero; three stars require no retries.
- FR-14 Completion applies the pet deltas and persists them plus the play count and best stars.
- FR-15 A streak increments across consecutive local days and resets after a skipped day.
- FR-16 Reward application is not double-granted on a React re-render.
- FR-17 Hub cards and the result screen both state progress out of 3.

**Parent**
- FR-18 `/parent` lists all four tracks, including unplayed ones as `Not yet`.
- FR-19 The parent view is read-only; opening it cannot mutate the child's state.
- FR-20 Dates read as `Today` / `Yesterday` / `18 Oct 2026` and never backwards.

### Traceability

| FR | Implementation | Test |
|---|---|---|
| FR-1, FR-2 | `lib/p1-curriculum-data.ts` | `p1Curriculum.test.ts` (Science exclusion, track ids) |
| FR-3 | `coinsTotal`, `moneyCanteen` payloads | `p1Curriculum.test.ts` (payable-order, cents sum) |
| FR-4 | `missingBondSlot`, `expectedBondAnswer`, `isBondConsistent` | `p1Curriculum.test.ts` (all bonds) |
| FR-5 | `audioLang: 'zh-CN'` in data, `playP1Audio` in `hooks/useSpeech.ts` | `p1Curriculum.test.ts` (payload integrity) |
| FR-6 | `components/P1ActivityRunner.tsx`, `P1AudioButton.tsx` | manual / preview |
| FR-7 | `P1ChoiceWidget`, `P1NumberBondWidget`, `P1CoinTrayWidget` | manual / preview |
| FR-8, FR-9 | `components/P1Draggable.tsx`, `didLandOnTarget` | `p1Drop.test.ts` (5 tests) |
| FR-10 | `components/P1BagPackerWidget.tsx`, `bagShelfItems`, `isBagItemValid` | `p1Curriculum.test.ts` |
| FR-11 | `judgePayment`, `formatCents` | `p1Curriculum.test.ts` |
| FR-13 | `starsForAttempt` | `p1Curriculum.test.ts` (star thresholds) |
| FR-14 | `applyP1Rewards` in `lib/pet-state.ts` | `p1Curriculum.test.ts` |
| FR-15 | `nextStreak`, `todayKey`, `dayDifference` | `p1Curriculum.test.ts` (streak cases) |
| FR-16 | reward call in the click handler, `components/P1ActivityRunner.tsx` | code review |
| FR-17 | `p1StarBadge`, `P1_MAX_STARS` | `p1Badge.test.ts` (3 tests) |
| FR-18–FR-20 | `lib/p1-parent.ts`, `app/parent/page.tsx` | `p1Parent.test.ts` (7 tests) |

FR-6, FR-7 and FR-16 are **not covered by automated tests**. They are interaction and rendering behaviours that the node-environment suite cannot reach without jsdom. FR-6 and FR-7 were checked in a browser preview; FR-16 by construction (the reward call is in the tap handler, so a re-render cannot repeat it).

---

## 7. Non-Functional Requirements

| # | Requirement | Position on this branch |
|---|---|---|
| NF-1 | **Zero-penalty design.** No wrong answer may remove coins, stars, happiness or progress. | Met and pinned by tests. |
| NF-2 | **Accessibility for pre-readers.** All instruction content audible; visual-first with emoji. | Met. Audio depends on device voices (see R-3). |
| NF-3 | **No new infrastructure.** No backend, no API keys, no audio files, no new runtime dependency. | Met — `framer-motion` was already present; only `vitest` added as a dev dependency. |
| NF-4 | **Touch ergonomics.** `blueprint.md` sets a 64×64px minimum tap target. | **Partially met.** Coins render 44–70px; the 5¢ coin at 44px is below the floor. See OQ-2. |
| NF-5 | **No regressions to the existing app.** | Legacy `useSpeech` interface, `/map`, `/lesson`, `/math`, and all pre-existing storage keys untouched. |
| NF-6 | **Lint neutral.** | Baseline on `main` already reports 8 problems in pre-existing files; this branch adds none. |
| NF-7 | **Offline tolerance.** | Partially met. The app shell is service-worker cached, but emoji come from the Twemoji CDN and `public/sw.js` skips cross-origin requests, so offline falls back to system glyphs. Functional, not pixel-perfect. |
| NF-8 | **Data minimisation / child privacy.** | Strong. Nothing leaves the device: no account, no analytics, no network calls with personal data. Progress is `localStorage` only. |
| NF-9 | **Time on task bounded.** | No hard limit exists. A `Again` button is prominent and nothing paces the child — see R-5. |
| NF-10 | **Testable core.** | Met. All judging is pure functions in `lib/p1-curriculum-logic.ts`, tested in a plain node environment with no DOM. |

---

## 8. Risks

| # | Risk | Likelihood | Impact | Mitigation now | Residual |
|---|---|---|---|---|---|
| R-1 | **Curriculum accuracy is unverified.** Content was authored to the brief, not validated against an MOE scope-and-sequence document by a teacher. Some questions may be off-level for P1 entry. | High | High — a wrong syllabus is worse than no syllabus | Structural claims (no Science, CPA bond shape, real denominations) follow the published syllabus; individual items are reviewable in one data file | **Open.** Needs a teacher pass before this is marketed as P1 prep |
| R-2 | **Reward loop saturates.** Wisdom +15 reaches 100 in 6 tracks, happiness in 3; energy only ever decreases with no refill mechanic anywhere in the app. | Certain | Medium — bars stop carrying meaning, then energy hits 0 with no explanation | Documented in the PR body and wiki §15 rather than silently patched | **Open.** Needs either a feeding/rest mechanic or a different progression model |
| R-3 | **TTS voice availability varies.** `en-SG` voices are common on mobile, rare on desktop. | High | Low — the fallback ladder always speaks something | Voice ladder + `onvoiceschanged` retry | Accent is not guaranteed; an "SG English" claim cannot be made |
| R-4 | **Drag has never been exercised by a real finger.** Drop maths is unit-tested; the Framer wiring is verified only in a desktop browser. | Medium | High — a broken drag on a tablet breaks the marquee exercise | Tap works identically for every draggable, so the feature degrades to tap | **Open.** Requires a physical tablet session |
| R-5 | **No session pacing.** The child controls `Again`; nothing limits repeats or nudges a stop. | Medium | Medium — a parent may object to open-ended screen time | Track lengths are 2–5 questions, so one loop is short | **Open.** Product decision, not a code fix |
| R-6 | **Single-device progress.** Clearing site data or switching devices loses everything; two siblings share one pet. | Certain | Medium | `localStorage` is the whole design (O-6, NF-8) | Accepted for this scope; multi-profile is out of scope |
| R-7 | **Content depth.** 14 questions means a child sees the whole syllabus in two sittings, then replays identical items. | Certain | High — retention, and it weakens O-1 | Data layer makes new questions one-array edits, guarded by tests | **Open.** The biggest gap between "works" and "useful for a term" |

---

## 9. Release Criteria

Merge is the owner's call. This is the checklist I would hold the branch to.

**Must be true before merge**
1. `pnpm test` green (currently 27 passing) and `pnpm build` clean.
2. `pnpm lint` adds no new problems versus `main` (verified).
3. `/map`, `/lesson` and `/math` behave as before (legacy speech and storage untouched).
4. Preview walked end-to-end on all four tracks (done: hub, runner, number bond, canteen, bag, result, parent rows).
5. This BRD and the wiki present in `docs/`.

**Must be true before calling it a P1 readiness product** (not required for merge)
6. A Singapore primary teacher or P1 parent reviews all 14 questions for level fit (R-1).
7. Drag-and-drop verified on a real tablet with a child-sized finger (R-4).
8. The reward-saturation and energy-drain design resolved (R-2).
9. Content expanded to roughly a term's worth of practice, or the 14-question scope stated plainly to users (R-7).

**Explicitly not blocking:** analytics (none exists), accounts, offline emoji fidelity, multi-profile.

---

## 10. Deviations from the Original Brief

Recorded so nobody has to rediscover them.

| Brief asked for | Built | Why |
|---|---|---|
| `src/` layout | Flat `lib/`, `components/`, `app/` | That is how this repo is structured. |
| Redux-style store | `localStorage` + `useSyncExternalStore` | The repo has no store of any kind; adding one for one feature is not proportionate. |
| `P1SchoolHubModal` | Route `/p1-school` | The repo navigates by routes; a modal would fight every existing page. |
| "Deprecate Extra Activities" | Added the 🎒 card; nothing removed | No "Extra Activities" section exists in this codebase. Removing a named feature that is not there would have been fiction. |
| Jest | Vitest | Already the direction of the ecosystem here; faster, no extra transform config, and it runs in the repo's TS setup without ceremony. |
| `$2` coin "used by the syllabus" | Added `math_money_03`, $2.20 chicken rice with `[20, 50, 100, 200]` | Without it the $2 denomination was decorative. It now has a real job, and a test asserts it. |

---

## 11. Open Questions for the Owner

1. **Is the reward model worth keeping?** The stat bars saturate within days and energy only drains. Either add a way to restore it (feed / rest / sleep) or drop the bars and keep Star Coins alone. Currently the numbers look meaningful and are not.
2. **What do we do about the 44px 5¢ coin** — enlarge it past the 64px floor, or accept the deviation from `blueprint.md`? (NF-4 / R-4 family.)
3. **Do we pace the session?** A "that's enough for today" nudge after N tracks, or is self-directed repetition the feature? (R-5)
4. **Who validates the curriculum, and when?** Nothing here should be described as MOE-aligned before a teacher has read it. (R-1)
5. **How much content is enough before this is worth telling parents about?** 14 questions is a demo, not a term. (R-7)
6. **Is one pet per device acceptable**, given siblings? (R-6)

---

## 12. Approval

Implementation is complete on `claude/p1-readiness-hub` and open as PR #4 against `main`. Product acceptance, the curriculum review in §9 item 6, and the reward-model decision in §11 item 1 rest with the repo owner. Nothing in §3 has been measured, and no claim in this document should be read as user-validated until it has.
