/**
 * Scales for the resilience arc visualization.
 * x: readiness 0–100, y: resilience 1–5 (ordinal)
 */

import * as d3 from "d3";

export function createScales(width, height, margins) {
  const { top, right, bottom, left } = margins;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;

  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([1, 5])
    .range([innerHeight, 0]);

  const colorScale = d3.scaleDiverging()
    .domain([-1, 0, 1])
    .interpolator(d3.interpolateRdBu);

  return { xScale, yScale, colorScale, innerWidth, innerHeight };
}
