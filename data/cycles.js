/**
 * Hardcoded cycle phase data from Oura Cycle Insights.
 * Phase durations are intentionally unequal — do not normalize.
 */

export const LIFTING_START = "2026-01-01";

export const CYCLES = [
  {
    id: "cycle_1",
    label: "Cycle 1",
    lifting: false,
    phases: [
      { phase: "follicular", start: "2025-10-28", end: "2025-11-11" },
      { phase: "luteal", start: "2025-11-12", end: "2025-11-23" },
    ],
  },
  {
    id: "cycle_2",
    label: "Cycle 2",
    lifting: false,
    phases: [
      { phase: "follicular", start: "2025-11-24", end: "2025-12-09" },
      { phase: "luteal", start: "2025-12-10", end: "2025-12-20" },
    ],
  },
  {
    id: "cycle_3",
    label: "Cycle 3",
    lifting: false,
    phases: [
      { phase: "follicular", start: "2025-12-21", end: "2026-01-05" },
      { phase: "luteal", start: "2026-01-06", end: "2026-01-18" },
    ],
  },
  {
    id: "cycle_4",
    label: "Cycle 4 — lifting",
    lifting: true,
    phases: [
      { phase: "follicular", start: "2026-01-19", end: "2026-01-30" },
      { phase: "luteal", start: "2026-01-30", end: "2026-02-12" },
    ],
  },
];

export function getPhaseForDate(dateStr, cycle) {
  for (const p of cycle.phases) {
    if (dateStr >= p.start && dateStr <= p.end) return p.phase;
  }
  return null;
}
