# Fluent Demo — Complete Flow Spec v3
*Updated August 2026 — reflects actual built state*
*For research chat review + continued dev*

---

## Overview

Four fixed personas. One shared onboarding flow. Per-persona content throughout. No live AI — pre-built content stands in for real-time detection. Every card, copy line, and routing decision is traceable to a specific research finding.

**Core constraint governing every screen:** nothing shown may reference context the system hasn't been given. Every card must be legible to someone who has never met any persona and has ~30 seconds of attention.

**Tech stack:** Vite + React, @nivo/core 0.99, Framer Motion 12, react-scrollama
**Live URL:** demo.yvntsu.design
**Local:** ~/Dev/fluent-demo/src/

---

## The Four Personas

| | Jamie | Yvonne | Robert | Alex |
|---|---|---|---|---|
| Age | Late 30s | Early 30s | Retired, 65+ | Mid 40s |
| Activity | Moderately active | Very active | Moderately active | Lightly active |
| Data | 8mo **inconsistent** wearable | 4+ yrs consistent | 2yr consistent | 5yr phone steps, **no wearable** |
| Annotations | Minimal | Life events documented | Minimal | None |
| Question | "Why do some weeks feel harder?" | "What's shaping how I feel?" | "What did retiring do to my body?" | "What does my phone know?" |

**"Lightly active" for Alex** — deliberate. Prevents four-card set reading as fitness hierarchy (F12 equity concern).

---

## Screen 1 — Onboarding Q1: "What brings you here?"

**Q2 is the primary router. Q1 breaks ties within consistent-wearable tier.**

| Q1 Option | Routes to |
|---|---|
| "I want to understand how my workouts are affecting my body" | Yvonne (default consistent) |
| "I want to keep doing the things I love" | Robert (triggers capability chips) |
| "Something feels different lately" | Yvonne (consistent) or Jamie (inconsistent) |
| "I want to explore what my data actually shows about me" | Yvonne (default) or Alex (steps only) |

**Robert-only follow-up:** "What do you wish you could keep doing?"
Chips: [golf] [walking/hiking] [travel] [gardening] [strength] [other]
Robert's pre-set answer: golf + garden + travel — must match his insight content.

---

## Screen 2 — Onboarding Q2: "How do you currently track your health?"

| Q2 Option | Routes to |
|---|---|
| "I track consistently, including sleep" | Yvonne or Robert (Q1 breaks tie) |
| "I have a tracker but wear it inconsistently" | **Always Jamie** |
| "I use my phone for steps only" | **Always Alex** |
| "I don't currently track anything" | Dead-end explainer + soft branch to Alex |

**Dead-end copy (locked):**
> "Fluent works best with at least 3–6 months of wearable data.
> → Apple Watch or similar wearable
> → Wear it consistently, especially to sleep
> → Export your data after 90+ days
> The longer you track, the more meaningful the patterns become."
> [Back] · [Explore with sample data instead →]

**Edge case — Q1 ambition exceeds Q2 data:**
"Something feels different" + phone only →
> "With step data, we can show patterns in your movement —
> but if you noticed something about energy, sleep, or recovery,
> that's harder to see from steps alone.
> Alex's data shows what's possible with phone steps.
> Or see what investigating a hunch looks like with full wearable data."
> [Explore Alex's data] · [See what Yvonne discovered instead]

---

## Screen 3 — Persona Picker

Four gradient cards. Suggested persona highlighted based on Q1+Q2.
Each card: name, age, activity level, their question (dynamic for suggested), data profile, chips (Robert only).

**Suggested persona logic:**
```
Q2 consistent   → suggest Yvonne or Robert (Q1 breaks tie)
Q2 inconsistent → suggest Jamie
Q2 steps only   → suggest Alex
Q2 nothing      → suggest Alex
```

**Persona questions (on cards):**
- Jamie: "Can I keep doing this without burning out?"
- Yvonne: "What's actually shaping how I feel?"
- Robert: "What does my body need in this new chapter?"
- Alex: "What does my phone already know about me?"

**Bottom nav:** ← back (routes to Q2) · continue (routes to loading)
**Top right:** persona name → tappable → routes to persona picker

---

## Screen 4 — Loading Screen

Per-persona gradient + sequential text reveal. Auto-advances after all lines shown.

**Jamie:**
> "Loading Jamie's data...
> 8 months of inconsistent wearable data.
> Some weeks have gaps — her watch wasn't always charged.
> Fluent shows what's there and names what isn't.
> Jamie's question: why do some weeks feel so much harder than others?
> This takes about 30 seconds."

**Yvonne:**
> "Loading Yvonne's data...
> 1,645 days of consistent wearable data.
> Looking for patterns across sleep, activity, cardiovascular data, and life annotations.
> Yvonne's question: what's actually shaping how she feels?
> This takes about 30 seconds."

**Robert:**
> "Loading Robert's data...
> 547 days of consistent wearable data.
> Looking for patterns across activity, cardiovascular health, and sleep.
> Robert's question: what did retiring actually do to his body?
> This takes about 30 seconds."

**Alex:**
> "Loading Alex's data...
> Alex's activity history from phone step tracking — no wearable.
> Fluent shows what's visible from steps alone and where a tracker would add depth.
> Alex's question: what does his phone already know about him?
> This takes about 30 seconds."

---

## Screen 5 — "Here's what Fluent noticed"

**Verb: "noticed" not "found."**

Two cards per persona. Each card: headline → chart preview → subtitle. Tap → Flow 2.

Bottom nav (fixed):
- Left: ← explore other sample data
- Right primary: "go straight to [Q1 topic] →" (dynamic)
- Right secondary: "explore other topics"

**Special case — "something feels different" Q1:**
Right side shows only "explore other topics" — this screen IS what they came for.

### All 8 Cards — Locked Copy

**JAMIE**

Card 1 — **"Your Mondays are actually your best days"**
*Your weekends seem to be costing you more than your work week does — the opposite of what you might expect.*
Chart: WeeklyRhythmChart (line, Mon–Sun avg, Mon green dot, Sat amber dot, baseline dashed)

Card 2 — **"Your sleep looked fine — your HRV says otherwise"**
*Some weeks your sleep tracked normally, but your HRV tells a different story. That mismatch might explain why some weeks feel harder than others, even when your sleep numbers look okay.*
Chart: SleepHRVChart (scatter quadrant, mismatch nights in red)

**YVONNE**

Card 1 — **"Your RHR has quietly shifted"**
*Your resting heart rate has been lower than usual for the past two weeks. Fluent noticed — but doesn't know why yet.*
Chart: RHRTrendChart (line, 4–6 weeks, baseline reference, shift marker unlabeled)

Card 2 — **"Tennis might be your best recovery tool"**
*Out of everything you do, tennis produces the strongest recovery response — more than any other activity in your data.*
Chart: SportHRVChart (pos/neg bars, tennis green, skiing red)

**ROBERT**

Card 1 — **"Retirement left a mark on your heart rate"**
*Your resting heart rate settled into a new, healthier pattern after you retired — a shift your body registered even though retirement itself felt like pure relief.*
Chart: RetirementArcChart (line, 2yr, retirement marker, before baseline dashed)

Card 2 — **"Nothing stood out this quarter — and that's worth knowing"**
*Your key patterns are all consistent with how you've been trending. No news is the finding here.*
Chart: none — text only, more white space, restrained by design.

**ALEX**

Card 1 — **"October was your most active month — February your quietest"**
*Your steps follow a seasonal rhythm you've probably felt but never seen confirmed.*
Chart: SeasonalStepsChart (12 bars, Oct blue, Feb grey)

Card 2 — **"Here's what steps can't tell you"**
*Your activity patterns are clear, but Fluent can't see whether those active days left you energized or depleted. That's what a wearable would add.*
Chart: capability gap (3 ghost layer cards with dashed border)

---

## Screen 6 — Flow 2 (Insight Deep Dive)

All 8 cards have full Flow 2 treatment. Template:
1. Headline + subtitle
2. Chart (with metric toggle for Jamie card 1)
3. Data note
4. Plain language explanation
5. Verification question (only where interpretation incomplete)
6. Context annotation (chips or freetext)
7. Acknowledgment
8. Navigation: ← back · next insight → (appears after ack or if no question)

### Complete Flow 2 Copy — All 8 Cards

**JAMIE CARD 1 — monday**
Explanation: "Your resting heart rate is consistently lower on Mondays than any other day — lower than Friday, lower than Saturday and Sunday. This pattern has shown up in 7 of the last 8 weeks."
Data note: "Based on 8 weeks of available data. Some weekend readings are missing where her tracker wasn't worn."
Question (felt): "Does this match how your Mondays typically feel?"
Chips: [Yes] [Not really] [Skip]
Context question: "Anything come to mind about your weekends?"
Context chips: [Late night] [Social] [Alcohol] [Travel] [Stress] [Busy weekend] [Other] [Skip]
Acknowledgment: "Worth knowing either way — your weekends are likely setting your Mondays, not the other way around."
Chart: WeeklyRhythmFullChart (8 weeks with gaps, metric toggle RHR/HRV)

**JAMIE CARD 2 — sleep_hrv**
Explanation: "Last week your sleep tracked normally — around 7 hours, reasonable deep and REM. But your HRV the following mornings told a different story. Your nervous system hadn't fully recovered, even though your sleep numbers looked okay. These two signals don't always agree. When they don't, the mismatch often explains weeks that feel harder than they should."
Data note: "Based on weeks where both sleep and HRV were tracked overnight."
Question: none — pattern speaks for itself
Chart: SleepHRVChart (scatter quadrant)

**YVONNE CARD 1 — rhr_shift**
Explanation: "Your resting heart rate has been below your personal baseline for the past two weeks — consistently, not just a one-day fluctuation. A few things typically produce this kind of sustained shift: a change in routine, cooler temperatures, less training load, or something else entirely."
Data note: "Compared against your personal baseline — not a population average."
Question (annotation — this IS the question): "Does anything come to mind about the past two weeks?"
Chips (multi-select, green): [Travel] [Cooler weather] [Less training] [More rest] [Life change] [Something else]
Freetext: primary input
Acknowledgment (after context added): "That makes sense. Fluent saved this to your timeline so the shift has context when you look back at it."
Acknowledgment (if skipped): "No problem — the pattern is saved either way. If something comes to mind later, you can always add context from your timeline."
Chart: RHRTrendChart

**YVONNE CARD 2 — tennis**
Explanation: "Out of everything in your data, tennis produces the strongest recovery response — your HRV is consistently higher in the day or two after a session than after any other activity. Cycling and running show modest positive effects. Skiing costs recovery for several days. Tennis does something different: it seems to leave your nervous system more regulated, not less. Fluent can't say exactly why from the data alone."
Data note: "Based on 22 tennis sessions tracked since 2025."
Question: none — chart is self-evident
Chart: SportHRVChart

**ROBERT CARD 1 — retirement**
Explanation: "In the months after you retired, your resting heart rate gradually settled into a new, lower range — and has stayed there. The shift didn't happen overnight. It took several months to establish, which suggests your body was adapting to a different kind of daily rhythm rather than responding to a single event."
Data note: "Compared against your pre-retirement baseline of 63 bpm."
Question (felt): "Does this match how that transition felt for you?"
Chips: [Yes, things settled] [It was more complicated] [Skip]
Context chips: [Took time to adjust] [Felt immediate] [Still adjusting] [Something else] [Skip]
Acknowledgment: "Major life transitions often show up in the data long before they feel resolved — and sometimes the body settles before the mind does."
Chart: RetirementArcChart

**ROBERT CARD 2 — silence**
Explanation: "Your key patterns this quarter — resting heart rate, activity, sleep — are all consistent with how you've been trending. Nothing exceeded the threshold that would normally prompt a closer look. Sometimes the most useful thing to know is that nothing unusual is happening."
Question: none. No chips. No acknowledgment. More white space.
Chart: none
[Continue →]

**ALEX CARD 1 — seasonal**
Explanation: "Your step count follows a seasonal rhythm — higher in autumn, lower in mid-winter. October consistently shows your most active days. February consistently shows your quietest. This pattern has held across the years in your data."
Data note: "Based on 5 years of iPhone step data."
Question (felt): "Does October feel like your most active time of year?"
Chips: [Yes, that tracks] [Not really] [Skip]
Context chips: [Weather / season] [Work schedule] [Social life] [Daylight hours] [Just how it is] [Something else] [Skip]
Acknowledgment: "Seasonal rhythms in activity are common and often invisible until you see them across multiple years. Yours is consistent enough to be a real pattern, not just noise."
Chart: SeasonalStepsChart

**ALEX CARD 2 — capability**
Explanation: "Your activity patterns are clear — Fluent can see when you move more and when you move less, across weeks, months, and seasons. But steps alone can't tell us whether those active days left you energized or depleted. They can't see how your body recovered overnight, or whether your sleep was restoring or just passing time. That's what a wearable would add — not more data about movement, but a window into how your body is responding to the life you're living."
Question: none. Forward-looking.
[See what a wearable would add →] → routes to Yvonne's data
Chart: ghost layers (3 cards: recovery signals, sleep quality, cardiovascular)

---

## Screen 7 — "Something Feels Different Lately"

**NOT a direct Flow 2 route. Routes through felt experience question first.**

Question: "Let's see if the data can help explain it. What's feeling different?"

Signal options:
- ⚡ My energy feels off
- 😴 My sleep feels different
- 💪 I'm not recovering well
- 🫀 Something feels physical
- 🔍 I'm not sure — show me

**Routing by persona + signal:**

Jamie: energy/recovery → monday card | sleep/physical → sleep_hrv card | unsure → noticed screen
Yvonne: energy/sleep/physical → rhr_shift card | recovery → tennis card | unsure → noticed screen
Robert: all signals → retirement card | unsure → noticed screen
Alex: energy/unsure → seasonal card | sleep/recovery/physical → wearable-only message

**Alex wearable-only message:**
> "[Signal] changes require overnight wearable data to investigate properly.
> Steps alone can't explain this.
> A wearable worn overnight would capture HRV, resting heart rate, and sleep staging.
> [See what Yvonne's data shows with a wearable →]"

After signal selection → reason appears → [Investigate this →] → Flow 2

---

## Screen 8 — Home Screen: "What are you curious about today?"

Six categories as two-column text list.
Cursor-following tooltip with icon + description on hover.
Floating nav pill (6 icons, active = square indicator).

**Categories + descriptions:**

| Category | Description | Routes to |
|---|---|---|
| Something feels different lately | "A pattern shifted in your data." | SomethingDifferentScreen |
| How I've changed over time | "Through the lens of your wearable data." | HowIveChangedScreen |
| Movement & Recovery | "What you do, what it costs, and how your body responds." | MovementRecoveryScreen |
| Heart & Nervous System | "Your cardiovascular health over time." | HeartNervousSystemScreen |
| Sleep | "What your sleep is actually doing." | SleepScreen |
| Moments that shaped my health | "When life showed up in your data." | MomentsScreen |

---

## Screen 9 — Movement & Recovery

Compilation view. 3 charts for Yvonne, 2 for Jamie/Robert/Alex.

**Yvonne (richest):**
- SportHRVChart — "How each sport affects your recovery" (HRV deviation day-of through day+3)
- HRRecoveryChart — "HR recovery by sport" (grouped bars, 60/90 sec)
- SportMixChart — "How your activity has shifted over the years" (NivoStream)

**Jamie:**
- WeeklyRhythmChart — weekly rhythm
- SeasonalStepsChart — monthly activity levels

**Robert:**
- RetirementArcChart — activity before/after retirement
- Structure vs unstructured week comparison (stat cards)

**Alex:**
- SeasonalStepsChart — seasonal step pattern
- Capability gap cards (3 ghost layers)

---

## Screen 10 — Heart & Nervous System

**Yvonne:**
- QuarterlyArcChart — 18 quarters dual axis RHR+HRV (hero)
- HRRecoveryChart — HR recovery trend
- Respiratory rate stat card (15.8 br/min, ↓ from 20-22)
- Blood panel info card (directional only: hs-CRP 0.6→0.2, Trig 116→68, HDL 72→93)

**Jamie:**
- RHRTrendChart — 8 months
- HRV weekly pattern (placeholder)

**Robert:**
- RHRTrendChart — 2 years
- Structure dependency stat cards (structured: HRV 33ms, RHR 57.9 vs unstructured: HRV 26.6, RHR 62.0)

**Alex:**
- Capability gap message → link to Yvonne's data

---

## Screen 11 — Sleep

**All wearable personas (Yvonne, Jamie, Robert):**
- SleepArchitectureChart — weekly stacked bars (Deep/REM/Core/Awake), gap-aware for Jamie
- QQRTCard — four pillars per persona
- SleepTrendCards — 4 stage trend cards vs last quarter
- SleepHRVChart — scatter quadrant (Yvonne only)
- Epistemic qualifier: "Sleep data is directional guidance — not a score to optimize."

**Alex:**
- Capability gap message → link to Yvonne's sleep data

**QQRT values:**

Yvonne: Q 7.1hr → · Qu 92% ↑ · R ±34m ↓ · T 6:30am →
Jamie:  Q 7.1hr → · Qu 88% → · R ±48m → · T 7:00am →
Robert: Q 7.0hr ↑ · Qu 88% → · R ±28m → · T 6:45am →

---

## Screen 12 — How I've Changed Over Time

Two entry points:
1. **Compilation view** (default) — metric cards + hero chart + interesting facts
2. **"Your [year] story →"** button → ScrollytellingScreen (not yet built)

**Metric trend cards by persona:**

Yvonne (4 cards): RHR 59 (↓7 from 66) · HRV 45.6ms (↑37% from personal low) · Breathing 15.8 (↓28%) · Active hours 312 (↑58% from 198)
Jamie (3 cards): RHR 70.4 (↓2.7) · HRV 37.2 (↑3.4) · Sleep 7.1hr (↑0.3)
Robert (4 cards): RHR 57.2 (↓5.8 from 63) · HRV 35.5 (↑7) · Sleep 7.0hr (↑0.6) · Steps 6,900 (↑33%)
Alex (2 cards): Steps 8,400 (↑500) · Peak month October (every year)

**Hero chart:**
Yvonne → QuarterlyArcChart (18 quarters, dual axis, 3 annotation markers always visible)
Robert → RetirementArcChart
Alex → SeasonalStepsChart
Jamie → "Come back in a year. The arc will be clearer." (text)

**Interesting facts (Yvonne):**
- "5,051 cycling miles — Chicago to Tokyo"
- "1,248 running miles — started January 2024. Just to see if you could."
- "Tennis produces your strongest recovery signal. +5.5ms HRV the day after."
- "Skiing costs the most. −10.4ms HRV day-of. You ski anyway. That's not optimization. That's agency."
- "You sleep most on Mondays. 7.7 hr avg."
- "10,080 fewer heartbeats every day than when you started tracking."

---

## Screen 13 — Moments That Shaped My Health

Annotated vertical timeline. Tap any card → expands with description + data note + insight quote.

**Yvonne moments:**
1. The 13-day warning (Feb 2026) — INSIGHT — red
   "Two sensors flagged something 13 days before symptoms appeared."
   Data: HRV −10ms · Wrist temp ↑ · RHR stable
   Insight: "The data noticed before you did."

2. Half marathon (Jun 2026) — MILESTONE — green
   "HRV peaked the night before and rebounded within 5 days."
   Data: HRV 83ms night before · Full recovery day +5
   Insight: "4 years of training showed up on one morning."

3. Seattle trip (Jun–Jul 2026) — TRAVEL — blue
   "RHR dropped 5.7 bpm over 12 days. Fluent noticed. You added the context."
   Data: RHR −5.7 bpm · Sustained 12 days
   Insight: "Travel + tennis + cooler weather. The data couldn't name it. You could."

4. Tennis era begins (Sep 2025) — PATTERN — green
   "A life change coincided with discovering tennis."
   Data: HRV avg ↑ · Strongest recovery sport confirmed
   Insight: "The data shows it. What happened is yours."

Closing line (Yvonne only):
*"The data can see it. Whether it matches how you feel — that's the conversation Fluent is trying to start."*

**Robert moments:** Retirement (Aug 2023) · Golf routine (Jan 2024) · Portugal trip (May 2024) · Structure dependency discovered (Mar 2025)

**Jamie moments:** Started tracking (Aug 2024) · Heavy project period (Nov 2024) · Weekend hikes begin (Jan 2025)

**Alex moments:** 5 years of movement (2021–2025) — single card showing seasonal pattern

---

## Chart Components — Complete Inventory

All built, all rendering in production.

| Component | Type | Used in | Data source |
|---|---|---|---|
| WeeklyRhythmChart | NivoLine, Mon-Sun avg | Noticed (Jamie 1), Flow 2 | synthetic |
| WeeklyRhythmFullChart | NivoLine, 8 weeks, gaps | Flow 2 (Jamie 1) | synthetic |
| SportHRVChart | NivoBar pos/neg | Noticed (Yvonne 2), Movement | real |
| HRRecoveryChart | NivoBar grouped | Movement, Cardio | real |
| SportMixChart | NivoStream | Movement | real |
| SleepArchitectureChart | NivoBar stacked | Sleep | synthetic+real |
| SleepHRVChart | NivoScatterplot | Noticed (Jamie 2), Sleep | synthetic |
| RHRTrendChart | NivoLine | Noticed (Yvonne 1), Cardio | real |
| RetirementArcChart | NivoLine | Noticed (Robert 1), Movement | synthetic |
| QuarterlyArcChart | NivoLine dual-axis | How I've Changed, Cardio | real |
| SeasonalStepsChart | NivoBar | Noticed (Alex 1), Movement | synthetic |

**Shared:** CHART_THEME (dark tooltips), PageContainer (maxWidth 1100px), FloatingNav (6 icons)

---

## Routing Map (App.jsx)

```
q1 → q2 → suggestion → loading → noticed → flow2
                                          ↓
                                        home
                                          ↓
                    different | changed | activity | cardio | sleep | moments
```

All screens: top-left "fluent" · top-right "[persona name]" → routes to suggestion/picker

---

## Design Tokens

```
--color-base:       #0F0F0E
--color-surface:    #1A1A18
--color-accent:     #0681fc
--color-recovery:   #27C48A
--color-stress:     #E8504A
--color-quiet:      #888780
--color-text-primary:   #FFFFFF
--color-text-secondary: rgba(255,255,255,0.6)
--color-text-tertiary:  rgba(255,255,255,0.35)
--font-display: DM Sans (loaded via Google Fonts in index.html)
```

**Persona gradients:**
- Jamie: warm red-purple (radial, bottom-left)
- Yvonne: blue-green (radial, top-right)
- Robert: teal-purple (radial, bottom-left)
- Alex: muted teal-grey (radial, center)

---

## Copy Principles (Locked)

- "Fluent" or "your data" — never "we"
- "typical" not "normal" (avoids population norm framing — F2)
- Epistemic qualifier on every metric info card
- "data gap" shown honestly — never interpolated or hidden
- No streaks, no scores, no optimization language
- Closing line: *"The data can see it. Whether it matches how you feel — that's the conversation Fluent is trying to start."*
- "That's not optimization. That's agency." (skiing insight)

---

## Research Traceability — Key Decisions

| Design Decision | Finding | Participant Voice |
|---|---|---|
| Personal baseline not population norms | F2 | E2: "10-20% deviation from their own baseline" |
| "Typical" not "normal" | F2 | E1, E2, E3 unanimous |
| Annotation as chips, never required | F4 | P8: "gaslight" framing |
| Verification question only where interpretation incomplete | F1, F9 | P3: "why are you telling me this?" |
| Calibrated silence card (Robert 2) | F14 | R2: "stable is reassuring" |
| No weekly scheduled delivery | F11 | 0/9 participants wanted weekly |
| Something feels different → felt experience first | F1, F9 | P3, P7, P4 |
| Alex capability gap honest framing | F3, F12 | E3: nocebo risk |
| "Not really" path treated same as "yes" | F9 | **OPEN QUESTION — see below** |

---

## Open Design Questions (for research chat review)

**1. The "not really" verification path:**
Currently: [Yes] [Not really] [Skip] all produce the same acknowledgment.
Research question: What SHOULD happen when user says the pattern doesn't match their felt experience? Is identical acknowledgment honest? Or does "not really" deserve a different system response — e.g., "That's worth noting. The data shows the pattern consistently — there may be something it can't see."

**2. Is the happy path sufficient?**
Current demo shows: data detects → surfaces → user verifies → user annotates → system acknowledges.
What's not shown: what does understanding look like AFTER annotation? How does the pattern appear differently once context is added? The narrative loop closes ("saved to timeline") but the integration of context + data isn't demonstrated.

**3. The mismatch case:**
Jamie card 2 (sleep × HRV mismatch) surfaces the finding but doesn't have a verification question. The most important demonstration of the interpretation gap — "sleep looked fine, HRV says otherwise" — has no interaction. Should it? Or is showing the chart enough?

**4. Persona switcher mid-demo:**
Tapping persona name → routes to picker. Is this the right behavior? Demo viewers might want to compare personas but the loading screen re-plays each time. Is there a faster comparison path needed?

---

## What's Not Yet Built

```
ScrollytellingScreen.jsx
  — 7 scenes Yvonne, 4 scenes Robert
  — react-scrollama wrapper
  — Scene progress indicator (right-side dots)
  — NivoCalendar heatmap (scene 3)
  — Chart draw-on-scroll animations

Timeframe selector (HowIveChangedScreen)
  — Toggle: 3m / 6m / 1yr / all
  — Filter quarterly data

Alex capability gap layered reveal
  — Currently static ghost cards
  — Should animate in on interaction

Mobile responsive pass
  — All screens tested desktop only

Polish pass
  — Gradient elevation (mesh/animated blob)
  — Count-up number animations
  — Loading screen more dramatic
```

---

*This document reflects the fully built state as of August 3, 2026.*
*Live at demo.yvntsu.design*
*Code at ~/Dev/fluent-demo/*
