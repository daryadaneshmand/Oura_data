# SPEC.md — Cycle Resilience Arc Visualization

## Project overview

An interactive D3.js visualization mapping 4 menstrual cycles of Oura Ring
biometric data onto animated resilience arc paths. Each arc traces daily
readiness + resilience scores through the Oura resilience map coordinate
space, with HRV balance encoded as a diverging color scale. Strength training
days are marked as ticks along each arc path.

The piece makes visible what the Oura app cannot show: how cycle phase shapes
the arc's path, how HRV balance shifts across that path, and how a consistent
lifting regimen changed the arc's shape in cycle 4.

Deployed as a standalone HTML file on GitHub Pages. Forkable with a personal
Oura PAT.

---

## Data source

**API:** Oura API v2, personal access token
**Base URL:** `https://api.ouraring.com/v2/usercollection/`
**Auth:** Bearer token via `Authorization: Bearer ${PAT}` header
**Date range:** 2025-10-28 to 2026-02-12

### Endpoints

| Endpoint | Purpose | Priority |
|---|---|---|
| `/daily_resilience` | Resilience score (y-axis) | Primary |
| `/daily_readiness` | Readiness score (x-axis) | Primary |
| `/workout` | Strength training days (tick marks) | Primary |
| `/daily_activity` | Steps per day | Secondary |

> When the workout endpoint returns, console.log the first few objects to
> confirm the exact string Oura uses for strength training activity type
> before filtering. It may be "strength_training", "weights", or similar.

---

## Hardcoded cycle phase data

Phases are manually tagged from Oura Cycle Insights. Do not derive from API.
Phase durations are intentionally unequal — do not normalize arc lengths.
Unequal lengths are meaningful data.

```js
const CYCLES = [
  {
    id: "cycle_1",
    label: "Cycle 1",
    lifting: false,
    phases: [
      { phase: "follicular", start: "2025-10-28", end: "2025-11-11" },
      { phase: "luteal",     start: "2025-11-12", end: "2025-11-23" },
    ]
  },
  {
    id: "cycle_2",
    label: "Cycle 2",
    lifting: false,
    phases: [
      { phase: "follicular", start: "2025-11-24", end: "2025-12-09" },
      { phase: "luteal",     start: "2025-12-10", end: "2025-12-20" },
    ]
  },
  {
    id: "cycle_3",
    label: "Cycle 3",
    lifting: false,
    phases: [
      { phase: "follicular", start: "2025-12-21", end: "2026-01-05" },
      { phase: "luteal",     start: "2026-01-06", end: "2026-01-18" },
    ]
  },
  {
    id: "cycle_4",
    label: "Cycle 4 — lifting",
    lifting: true,
    phases: [
      { phase: "follicular", start: "2026-01-19", end: "2026-01-30" },
      { phase: "luteal",     start: "2026-01-30", end: "2026-02-12" },
    ]
  }
]
```

---

## Visual encoding

| Data dimension | Visual channel | Notes |
|---|---|---|
| Readiness score | X axis | Oura scale 0–100 |
| Resilience score | Y axis | Oura scale: Low → Exceptional |
| HRV balance | Stroke color (diverging) | Cool = parasympathetic (recovery), warm = sympathetic (stress) |
| Cycle phase | Annotation at transition point | Label placed on arc at follicular→luteal boundary |
| Cycle identity | Arc layer, labeled | 4 arcs overlaid for comparison |
| Strength training day | Tick mark on arc path | Dot or notch at that day's position along arc |
| Steps | Secondary tooltip field | Not encoded visually, available on hover |

### HRV balance color scale
- Diverging, centered at 0 (Oura baseline)
- Negative (parasympathetic dominant, recovery): cool blue-green
- Positive (sympathetic dominant, stress/load): warm amber-red
- Implement with `d3.scaleDiverging`
- Each arc segment between consecutive days is colored by that day's HRV balance

---

## Interaction model

1. **On load:** all 4 arcs animate simultaneously, drawing day by day across
   the same relative cycle-day timeline (not calendar timeline)
2. **After animation completes:** scrubber appears, user can seek to any
   cycle day position
3. **Hover / tooltip:** shows date, phase, readiness score, resilience score,
   HRV balance value, steps, whether it was a training day
4. **Cycle toggles:** show/hide individual cycles for direct comparison

---

## Animation model

- Single `t` value drives all rendering (0 → 1, representing progress
  through cycle days)
- D3 transition drives `t` automatically on load
- `<input type="range">` scrubber also sets `t` manually
- One render function handles both — no separate code paths for
  animated vs static state

---

## File structure

```
/
├── index.html            # Entry point, imports modules
├── data/
│   ├── fetch.js          # Oura API calls + response transforms
│   └── cycles.js         # CYCLES const + phase lookup helpers
├── viz/
│   ├── arc.js            # D3 arc path rendering + tick marks
│   ├── scales.js         # x scale, y scale, diverging color scale
│   └── animation.js      # t-value driver, scrubber binding, tooltip
├── .env.example          # OURA_PAT=your_token_here
├── README.md             # Fork instructions, PAT setup, what you're looking at
└── SPEC.md               # This file
```

---

## What "done" looks like

- [ ] Oura API fetch returns clean daily objects across all 4 cycle date ranges
- [ ] Workout endpoint confirms strength training activity type string
- [ ] Each day correctly maps to its cycle and phase via date lookup
- [ ] Arc draws on readiness (x) / resilience (y) coordinate space
- [ ] HRV balance visible as continuous color shift along arc segments
- [ ] Strength training days marked as ticks on the arc path
- [ ] Cycles 1–3 show sparse ticks; cycle 4 shows dense regular ticks
- [ ] Animation plays on load across all 4 arcs simultaneously
- [ ] Scrubber seeks correctly after animation completes
- [ ] Tooltip surfaces all data dimensions on hover
- [ ] Cycle 4 arc is visually distinguishable (tighter shape, denser ticks)
- [ ] Individual cycle toggles work
- [ ] Deploys to GitHub Pages as single entry point
- [ ] README explains how to fork with own PAT and cycle data

---

## Explicitly out of scope
- Ovulatory as a separate labeled phase (folded into follicular)
- Oct 21–27 short luteal (excluded — copper IUD recovery, not representative)
- Any data before 2025-10-28
- Current cycle (2026-02-12 onward — excluded, incomplete)
- Normalization of phase lengths across cycles