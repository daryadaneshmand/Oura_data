/**
 * Debug script: fetch raw workout data for cycle 4 luteal (2026-01-30 to 2026-02-12)
 * and log every object's activity and day fields.
 * Run: node data/debug_workouts.js
 */

import "dotenv/config";

const BASE_URL = "https://api.ouraring.com/v2/usercollection";
const START_DATE = "2026-01-30";
const END_DATE = "2026-02-12";

function getToken() {
  const token = process.env.OURA_TOKEN || process.env.OURA_PAT;
  if (!token) {
    throw new Error("OURA_TOKEN or OURA_PAT not set.");
  }
  return token;
}

async function fetchWorkouts() {
  const token = getToken();
  const allData = [];
  let nextToken = null;

  do {
    const searchParams = new URLSearchParams({
      start_date: START_DATE,
      end_date: END_DATE,
    });
    if (nextToken) searchParams.set("next_token", nextToken);

    const url = `${BASE_URL}/workout?${searchParams}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Oura API workout: ${res.status} ${res.statusText}\n${text}`);
    }

    const json = await res.json();
    allData.push(...(json.data || []));
    nextToken = json.next_token || null;
  } while (nextToken);

  return allData;
}

async function main() {
  const workouts = await fetchWorkouts();
  console.log(`\nCycle 4 luteal (${START_DATE} to ${END_DATE}): ${workouts.length} workout objects\n`);
  console.log("--- activity | day ---\n");
  for (const w of workouts) {
    console.log(`${w.activity ?? "(null)"} | ${w.day ?? "(null)"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
