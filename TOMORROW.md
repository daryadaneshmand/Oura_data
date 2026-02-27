# TOMORROW

## Nobel Shelf → Author Expansion

When a spine is clicked, a panel expands **below the shelf** (inline, no new page, no modal) revealing that author's writing life as a timeline visualization.

### The panel shows:
- Birth to death (or present) as a horizontal span
- Each published book as a mark — weight or size TBD
- **Silence before first book** visible as empty leftward space (this is the point)
- **Gaps between books** visible as breath — not labeled, just felt
- Nobel Prize year as a distinct marker
- Panel collapses when another spine is clicked, or clicked again

### Data needed:
- Birth year, death year (or living)
- Full bibliography with publication years
- Source: Wikipedia first pass, cross-check with Open Library
- Write a fetch/scrape script or build the JSON manually for 23 authors — manual is probably faster and more accurate

### Form question to answer before building:
What does the timeline *look like* — dots on a line, or something with more physical weight? The silence should feel heavy, not just empty. Sketch before coding.

### This is NOT:
- A new page
- A modal
- A combined view of all authors (that comes later)