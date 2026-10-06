# Frontend QA handoff

The source was audited across every route. `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` passed after the latest edits on 2026-10-06. The in-app browser reached `http://localhost:5173/`. The focused checks below are visually verified; the remaining checklist is still open.

## Live verification, 2026-10-06

- Opened the local URL and scrolled to the first emphasized heading on each of the eight main routes. Every tested marker reached full painted width after entering view.
- Checked all 36 emphasized `h2` phrases in the rendered DOM. None had an empty italic element after preserving italic headings from GSAP SplitText. Left and returned to the Open Source GUIDE heading to check marker replay.
- Visually compared Open Source GUIDE and REPOSITORIES with the supplied red boxes at the browser's desktop viewport. Checked their placement and readability at 390 px and 320 px.
- Found and fixed horizontal overflow at 320 px caused by `body`'s fixed minimum width. The document and viewport both measured 320 px after the change.

These checks do not establish complete visual, keyboard, touch, reduced-motion, or device coverage.

## Route and viewport pass

For each route (`/`, `/about`, `/projects`, `/events`, `/team`, `/blog`, `/open-source`, `/join`), inspect desktop, tablet, 390 px and 320 px widths. Confirm the first viewport, every section boundary, footer, navigation, heading readability, background word placement, horizontal overflow, and focus order. Check touch targets and landscape height. Compare the six requested page lamps against the supplied About reference image. Confirm the 2 px title/intro uplift does not clip masked text.

## Interaction and motion pass

- Home: word build, “study AI.” outline, introductory reveal, clickable hero grid ripple, four horizontal wave words, four visible statistics, and six-second flap cycle.
- Shared: pointer-responsive background lettering, button focus/hover borders, scroll tracing beam, route transitions, GSAP section flow, reverse scrolling, and reduced-motion static states.
- Events and Home: flip and flip back by pointer and keyboard; confirm focus moves to the visible side and no inner scrollbar or clipped content at all target widths. Repeat when a real event title and description are available.
- Team: sample profile layout stays clearly labeled as illustrative.
- Open Source: four contribution steps stay readable during and after their scroll motion.
- Join: field validation, saved draft, copy/download, and truthful no-submission messaging.

Record tested browser/device, viewport, date, observed failures, and fixes here when real UI access is available. Source inspection and a passing build alone do not close this list.

## Screenshot corrections to confirm

The 2026-10-06 user screenshots mark the intended empty upper-right area for WHO, EXPLORE, and both WORK watermarks on Home. Confirm each word sits in that region without crossing its heading at desktop, tablet, and phone widths. Confirm the project folder front spans the full folder and covers its papers when closed; then open it by hover, tap, and keyboard. Confirm the footer glow follows only letter shapes without a rectangular band. Confirm the hero paragraph has readable word spacing through and after its reveal.

The next 2026-10-06 screenshots mark the lamp's left-side box, THE CLUB's right-side box, and the upper-right boxes for STORY, PILLARS, and APPROACH. Confirm their positions after refresh on About and check the lamp across Projects, Events, Team, Resources, Open Source, and Join. On Home, watch the hero from preloader exit through the final word to confirm every line animates and the pointer outline begins with “study AI.” Hover directly over THE WORK word and the other decorative words to compare blur and glow behavior. Confirm touch devices retain readable static words.

The latest screenshots require a lamp without a visible cone boundary on every navigation route; check the full fade at desktop and phone widths. Hover directly over STORY, then move just outside its lettering, and confirm the glow appears on the letters under the cursor only. Confirm PILLARS sits 5 px farther left. Compare the 65% blurred word treatment and inspect the final S of TOPICS for any dark strip during hover. Check the upper-right placements of Projects DIRECTIONS, Events TOPICS, Team BUILDERS, and Team CONTRIBUTE against their red boxes at desktop, tablet, 390 px, and 320 px.

The next screenshot set marks upper-right positions for Resources TUTORIALS, Resources FRAMEWORKS, and Open Source SOURCE. Compare those at desktop and narrow widths; confirm the navigation hero heading group sits 3 px higher. On Home, watch the lavender ribbon cross its repeat seam, pause and resume it by keyboard, and check its static reduced-motion state. On Open Source, watch all four contribution stages cycle, select each button, pause/resume, check the progress bar, and verify the guide remains readable at 390 px and 320 px. Across all routes, confirm each italic heading phrase receives one marker sweep without obscuring its text or interfering with the existing reveal.

The `build session.` screenshot showed the marker extending below the glyphs. Confirm the revised marker sits within each italic phrase, fills its exact text width at desktop and mobile, wraps cleanly across lines, and starts only when its heading reaches the viewport. Scroll away and back to confirm replay. Check short and long phrases, including `build session.`, `is to build with it.`, and `Make it useful to others.`
