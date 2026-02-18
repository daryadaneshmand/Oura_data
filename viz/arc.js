/**
 * Arc path rendering. Filters daily data by cycle, builds paths.
 */

import * as d3 from "d3";
import { CYCLES } from "../data/cycles.js";

function isDateInCycle(dateStr, cycle) {
  for (const p of cycle.phases) {
    if (dateStr >= p.start && dateStr <= p.end) return true;
  }
  return false;
}

export function getCycleDays(dailyData, cycle) {
  return dailyData
    .filter((d) => isDateInCycle(d.date, cycle))
    .filter((d) => d.readinessScore != null && d.resilienceScore != null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function buildArcPath(points, xScale, yScale) {
  const line = d3.line()
    .x((d) => xScale(d.readinessScore))
    .y((d) => yScale(d.resilienceScore))
    .curve(d3.curveMonotoneX);
  return line(points);
}

/** Segments for HRV coloring: [{ day, from, to }] where from/to are [x,y] */
export function buildArcSegments(points, xScale, yScale) {
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    segments.push({
      day: a,
      from: [xScale(a.readinessScore), yScale(a.resilienceScore)],
      to: [xScale(b.readinessScore), yScale(b.resilienceScore)],
    });
  }
  return segments;
}
