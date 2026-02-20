/**
 * Oura API fetch layer — build step.
 * Fetches daily_resilience, daily_readiness, workout, daily_activity, sleep
 * for 2025-10-28 to 2026-02-12, merges by date, writes data/daily.json.
 * Run: npm run fetch (requires OURA_TOKEN or OURA_PAT in .env)
 */

import "dotenv/config";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const BASE_URL = "https://api.ouraring.com/v2/usercollection";
const START_DATE = "2025-10-28";
const END_DATE = "2026-02-12";

const RESILIENCE_LEVEL_MAP = {
  limited: 1,
  adequate: 2,
  solid: 3,
  strong: 4,
  exceptional: 5,
};

/**
 * Validate token by calling personal_info (no date params).
 * Throws if token is invalid or expired.
 */
function getToken() {
  const token = process.env.OURA_TOKEN || process.env.OURA_PAT;
  if (!token) {
    throw new Error("OURA_TOKEN or OURA_PAT not set. Run npm run get-token first.");
  }
  return token;
}

async function validateToken() {
  const token = getToken();

  const res = await fetch(`${BASE_URL}/personal_info`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oura API token invalid (${res.status}): ${res.statusText}\n${text}`);
  }

  const info = await res.json();
  console.log("Token valid. Account:", info.email ?? info.id ?? "(see personal_info response)");
}

/**
 * Fetch all pages for an endpoint using next_token pagination.
 */
async function fetchPaginated(endpoint, params = {}) {
  const token = getToken();

  const allData = [];
  let nextToken = null;

  do {
    const searchParams = new URLSearchParams({
      start_date: START_DATE,
      end_date: END_DATE,
      ...params,
    });
    if (nextToken) searchParams.set("next_token", nextToken);

    const url = `${BASE_URL}/${endpoint}?${searchParams}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Oura API ${endpoint}: ${res.status} ${res.statusText}\n${text}`);
    }

    const json = await res.json();
    allData.push(...(json.data || []));
    nextToken = json.next_token || null;
  } while (nextToken);

  return allData;
}

/**
 * Fetch all five endpoints in parallel.
 */
async function fetchAll() {
  const [resilience, readiness, workouts, activity, sleep] = await Promise.all([
    fetchPaginated("daily_resilience"),
    fetchPaginated("daily_readiness"),
    fetchPaginated("workout"),
    fetchPaginated("daily_activity"),
    fetchPaginated("sleep"),
  ]);

  return { resilience, readiness, workouts, activity, sleep };
}

/**
 * Build set of dates that have strength training workouts.
 * Activity type check is flexible; update after confirming from console.log.
 */
function buildStrengthDates(workouts) {
  const strengthDates = new Set();
  for (const w of workouts) {
    const activity = (w.activity || "").toLowerCase();
    if (
      activity.includes("strength") ||
      activity.includes("weight") ||
      activity.includes("resistance") ||
      activity === "weights" ||
      activity === "strength_training"
    ) {
      if (w.day) strengthDates.add(w.day);
    }
  }
  return strengthDates;
}

/**
 * Remap HRV balance from [1, 100] to [-1, 1] centered at 0.
 */
function remapHrvBalance(val) {
  if (val == null || typeof val !== "number") return null;
  return (val - 50) / 50;
}

/**
 * Convert deep_sleep_duration (seconds) to minutes. Sleep endpoint returns seconds.
 */
function toDeepSleepMinutes(val) {
  if (val == null || typeof val !== "number") return null;
  return Math.round(val / 60);
}

/**
 * Merge all endpoints into a single array of day objects.
 */
function mergeDailyData({ resilience, readiness, workouts, activity, sleep }) {
  const strengthDates = buildStrengthDates(workouts);

  const byDate = new Map();

  for (const r of resilience) {
    const day = r.day;
    if (!day) continue;
    const level = r.level || "";
    byDate.set(day, {
      date: day,
      readinessScore: null,
      resilienceScore: RESILIENCE_LEVEL_MAP[level] ?? null,
      resilienceLevel: level || null,
      hrvBalance: null,
      steps: null,
      deepSleepMinutes: null,
      isStrengthDay: strengthDates.has(day),
    });
  }

  for (const r of readiness) {
    const day = r.day;
    if (!day) continue;
    const existing = byDate.get(day) || {
      date: day,
      readinessScore: null,
      resilienceScore: null,
      resilienceLevel: null,
      hrvBalance: null,
      steps: null,
      deepSleepMinutes: null,
      isStrengthDay: strengthDates.has(day),
    };
    existing.readinessScore = r.score ?? null;
    existing.hrvBalance = remapHrvBalance(r.contributors?.hrv_balance);
    byDate.set(day, existing);
  }

  for (const a of activity) {
    const day = a.day;
    if (!day) continue;
    const existing = byDate.get(day) || {
      date: day,
      readinessScore: null,
      resilienceScore: null,
      resilienceLevel: null,
      hrvBalance: null,
      steps: null,
      deepSleepMinutes: null,
      isStrengthDay: strengthDates.has(day),
    };
    existing.steps = a.steps ?? null;
    byDate.set(day, existing);
  }

  for (const s of sleep || []) {
    const day = s.day;
    if (!day) continue;
    const existing = byDate.get(day) || {
      date: day,
      readinessScore: null,
      resilienceScore: null,
      resilienceLevel: null,
      hrvBalance: null,
      steps: null,
      deepSleepMinutes: null,
      isStrengthDay: strengthDates.has(day),
    };
    const mins = toDeepSleepMinutes(s.deep_sleep_duration);
    existing.deepSleepMinutes = existing.deepSleepMinutes != null && mins != null
      ? existing.deepSleepMinutes + mins
      : existing.deepSleepMinutes ?? mins;
    byDate.set(day, existing);
  }

  const merged = Array.from(byDate.values()).sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  return merged;
}

async function main() {
  await validateToken();

  const { resilience, readiness, workouts, activity, sleep } = await fetchAll();

  console.log("Raw response counts:", {
    resilience: resilience.length,
    readiness: readiness.length,
    workouts: workouts.length,
    activity: activity.length,
    sleep: sleep.length,
  });

  if (sleep.length > 0) {
    console.log("First sleep object (deep_sleep_duration in seconds):", JSON.stringify(sleep[0], null, 2));
  }

  if (resilience.length === 0 && readiness.length === 0 && activity.length === 0) {
    console.warn("\nAll endpoints returned 0. Running diagnostic: fetching daily_readiness without date params...");
    const diagRes = await fetch(`${BASE_URL}/daily_readiness`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const diagJson = await diagRes.json();
    const diagData = diagJson.data || [];
    console.warn(`Diagnostic (no date filter): daily_readiness returned ${diagData.length} items.`);
    if (diagData.length > 0) {
      console.warn("Date range may be wrong. First item day:", diagData[0]?.day);
    } else {
      console.warn("No data without date filter. Check: 1) OAuth app has daily+workout+stress scopes enabled, 2) Re-run npm run get-token, 3) Oura account has data in range.");
    }
  }

  if (workouts.length === 0) {
    console.warn("Warning: workout endpoint returned 0 items. Ensure your token has the 'workout' scope.");
  }

  console.log("First 3 workout objects (raw, before filtering):");
  console.log(JSON.stringify(workouts.slice(0, 3), null, 2));

  const merged = mergeDailyData({ resilience, readiness, workouts, activity, sleep });

  const outPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "daily.json"
  );
  writeFileSync(outPath, JSON.stringify(merged, null, 2), "utf8");
  console.log(`Wrote ${merged.length} days to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
