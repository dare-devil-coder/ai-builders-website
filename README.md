# AI Builders website

React 19 + Vite website for AI Builders at Universal AI University. The site uses the supplied `Website Docs` content as its source for copy, page structure, focus areas, workshop topics, and membership fields. The original Effect website analysis remains in `EFFECT_WEBSITE_DESIGN_REFERENCE.md` for reference; the live site now has its own AI Builders visual direction.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. To verify production output:

```bash
npm run lint
npm run build
```

## Content status

The source document explicitly labels project names, metrics, events, team members, articles, GitHub organization, social links, and contact email as placeholders. The site shows honest empty states in those areas. It does not invent public activity or use the old site's unverified `club@uai.university` address.

The Join page validates the requested membership fields, saves a draft in the visitor's browser, and offers copy/download. It **does not submit** an application: a verified destination or backend was not supplied. Its text makes that clear to visitors.

## Where to update content

- `src/data/site.js`: focus areas, approach, workshop topics, resource tools, four verified club totals, featured projects, and the next event. Leave unknown values as `null` until confirmed. Set `nextEvent.startsAt` to an ISO date and time with an offset (for example, `2026-11-04T17:00:00+05:30`) to activate the countdown.
- `src/data/pages.js`: page titles and introductory copy.
- `src/pages/`: each page's content and any future confirmed listings.
- `src/index.css` and `src/feature.css`: visual system, responsive layout, and animation.

The home hero uses a BUILD constellation of paired topics. The work gallery uses a React/Vite adaptation of Spectrum UI's Animated Card; its source attribution is in `src/components/spectrumui/AnimatedCard.jsx`. The event passport shows a live countdown once a confirmed date is entered. Until then, it displays TBA.

The site uses GSAP SplitText for masked heading reveals and ScrollTrigger for gentle section exit motion. Sections remain in normal document flow, so scrolling works in both directions and tall sections are fully accessible. Visitors requesting reduced motion get static headings and sections. The motion hook is in `src/hooks/useSiteMotion.js`.
