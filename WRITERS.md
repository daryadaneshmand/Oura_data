# Nobel Writers Bookshelf — SPEC

## Purpose

A secondary visualization section on the same page as the Oura cycle fingerprint, positioned below it. A horizontal shelf of book spines representing Nobel Prize–winning prose fiction authors, organized chronologically by prize year. Hovering a spine reveals a quote from that author about attention, reading, or the conditions of creative work.

The ambient background gradient encodes global average screen time as a proxy for attentional pressure — not as a data label, but as environmental context. Writers who worked before smartphones stand in warmth. Writers working now stand in comparative darkness. The viewer is meant to feel the shift, not read it.

This is a first-commit component, not the final visualization. It plants the data and the aesthetic logic for a future scrollytelling piece.

---

## Placement

Below the Sleep Fingerprint section in `index.html`. Separated by a section break — same page, no new file. Self-contained HTML block + JS at bottom of file.

---

## Visual Structure

### The shelf

A single horizontal row of book spines, left to right, ordered by Nobel Prize year (earliest left). All spines sit on a subtle shelf line. The shelf itself is full-width or close to it.

### Background gradient

A horizontal gradient spanning the full shelf width, representing the rise of screen time from left (pre-smartphone, warm amber) to right (2024, deep cool teal). Not labeled. Not explained in the UI. Intentionally ambient.

Suggested gradient stops (adjust in implementation):
- Far left (pre-1980): `#f5e6c8` — warm parchment
- 2007 midpoint: `#e8d5a3` — still warm but shifting
- 2015: `#b8c9c9` — transitional grey-teal
- 2024 (far right): `#2d4a52` — deep muted teal

The gradient sits behind all spines at low opacity (~15–20%) so spines remain legible.

### Spine design

Each spine is a narrow vertical rectangle. Height ~180–220px, width ~28–36px. Slightly variable height per author (can be randomized within a small range for shelf realism, or tied to output volume in a future iteration).

**Spine color:** A curated muted palette — dusty rose, olive, slate, ochre, burgundy, sage. No two adjacent spines the same color. Not mapped to any data variable in v1 — purely aesthetic.

**Spine text:** Author surname, rotated 90° (reading bottom to top, as on a real shelf). Small sans-serif, ~10–11px. Color: white or near-white, legible against spine.

**Prize year:** Below the surname, same rotation, smaller (~8px), slightly lower opacity.

---

## Hover interaction

On hover:
- Spine lifts slightly (translateY -8px, transition 200ms ease)
- Spine brightness increases subtly
- A quote bubble appears above the spine

### Quote bubble

Positioned above the hovered spine, centered horizontally. Fixed max-width (~280px). Drops in with a subtle fade + slight upward translate (150ms).

Contents:
- Quote text (the single most attention-adjacent quote for this author)
- Attribution line: `— [Full Name], [Source], [Year]`
- Small label: Nobel Prize year

Bubble sits above the shelf, never clipped. If spine is near left or right edge, bubble adjusts position to stay in viewport (clamp logic).

On mouse leave: spine returns, bubble fades out.

---

## Data structure

All author data lives in a JS array in the HTML file (no external JSON for v1, can be extracted later).

```javascript
const writers = [
  {
    surname: "Faulkner",
    fullName: "William Faulkner",
    nobelYear: 1949,
    spineColor: "#7a6a5a",
    quote: "Read, read, read. Read everything — trash, classics, good and bad; see how they do it.",
    source: "Paris Review, Art of Fiction No. 12",
    quoteYear: 1956
  },
  // ...
]
```

---

## Author list and quotes (v1)

Ordered by Nobel Prize year. All quotes sourced from the Nobel research compendium.

| Author | Nobel Year | Quote |
|--------|-----------|-------|
| William Faulkner | 1949 | "Read, read, read. Read everything — trash, classics, good and bad; see how they do it." |
| Ernest Hemingway | 1954 | "You read what you have written and, as you always stop when you know what is going to happen next, you go on from there." |
| Albert Camus | 1957 | "A person's creative work is nothing but a slow trek to rediscover those two or three images in whose presence his heart first opened." |
| John Steinbeck | 1962 | "In writing, habit seems to be a much stronger force than either willpower or inspiration." |
| Saul Bellow | 1976 | "I feel that art has something to do with an arrest of attention in the midst of distraction." |
| Gabriel García Márquez | 1982 | "After reading eighteen pages of Kafka I was possessed by such a creative fervor that I threw down the book, picked up a pen, and wrote." |
| Nadine Gordimer | 1991 | "The solitude of writing is also quite frightening. It's quite close to madness, one just disappears for a day and loses touch." |
| Toni Morrison | 1993 | "Writers all devise ways to approach that place where they expect to make the contact, where they become the conduit." |
| Kenzaburō Ōe | 1994 | "I spend the first three months reading a section over and over again in English until I have it memorized." |
| José Saramago | 1998 | "I write two pages. And then I read and read and read." |
| Orhan Pamuk | 2006 | "I would like to see myself as belonging to writers who cut themselves off from society and shut themselves up in their rooms with their books — this is the starting point of true literature." |
| Doris Lessing | 2007 | "There is only one way to read, which is to browse in libraries and bookshops, picking up books that attract you, reading only those, dropping them when they bore you." |
| J.M.G. Le Clézio | 2008 | "Writing for me is like travelling. I put a piece of paper on the table and then I travel. Literally." |
| Herta Müller | 2009 | "Writing was the only thing where I could be myself." |
| Mario Vargas Llosa | 2010 | "Like writing, reading is a protest against the insufficiencies of life." |
| Mo Yan | 2012 | "A computer would slow me down, because when I use one, I cannot control myself. I always go online." |
| Alice Munro | 2013 | "A writer can read too much and be paralyzed. Or don't read, don't think, just write — and the result could be a mountain of drivel." |
| Patrick Modiano | 2014 | "Once you get started you have to write every day, otherwise you lose the momentum. I can only write for a few hours at a time, after that my attention fades." |
| Kazuo Ishiguro | 2017 | "I would ruthlessly clear my diary and go on what we called a Crash. I would do nothing but write from 9am to 10.30pm. My fictional world was more real to me than the actual one." |
| Olga Tokarczuk | 2018 | "For every single written page, it is always one thousand pages which should be read." |
| Peter Handke | 2019 | "When I write, critics are behind me. No critic, no opinion — only images, rhythm, feeling." |
| Abdulrazak Gurnah | 2021 | "I love being able to go to my desk in the morning and write until I get a headache." |
| Han Kang | 2024 | "I'm hiding very well. I feel inner peace is very important for you to write on. That's my very important task at this moment." |

---

## Section header

Above the shelf, a small section label:

```
WHAT Nobel WRITERS SAY ABOUT ATTENTION
```

Optionally a one-line subhead in smaller type:
```
The ambient background reflects rising global screen time since 2007. Each spine is a writer who won the Nobel Prize in Literature.
```

Keep it minimal. The visualization should communicate before the text explains.

---

## Technical notes

- No D3 required for v1. Plain JS + CSS is sufficient.
- Hover logic: `mouseenter` / `mouseleave` event listeners on each spine element.
- Bubble positioning: calculate spine's `getBoundingClientRect()`, clamp horizontally.
- Gradient: CSS `linear-gradient` on the section background, left to right.
- Spine lift: CSS `transform: translateY(-8px)` on hover via class toggle or inline style.
- Responsive: shelf scrolls horizontally on mobile rather than wrapping. `overflow-x: auto` on container.

---

## Out of scope for v1

- Click to expand full quote context
- Filter by era (pre/post 2007)
- Output volume encoding on spine height
- Screen time data labels or annotations
- Animation of background gradient
- Connection to Oura data

---

## Future directions

This component is the seed of a larger scrollytelling piece comparing pre- and post-2007 Nobel laureates on attention management, output patterns, and process testimony. The bookshelf is the entry point — a satisfying standalone object that will eventually become one panel in a larger argument.

The screen time gradient will eventually be made explicit with a labeled axis and sourced data (DataReportal, Q3 2013–2024 longitudinal dataset). For now it is felt, not read.