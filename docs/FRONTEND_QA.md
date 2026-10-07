# Frontend QA handoff

The source was audited across every route. `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` passed after the latest edits on 2026-10-06. The in-app browser reached `http://localhost:5173/`. The focused checks below are visually verified; the remaining checklist is still open.

## Live verification, 2026-10-06

- Rooted at UAI path refinement: reshaped the curved guide on About to follow the user-marked lower-middle → crest → dip → upper-right route while retaining the site's lavender line and continuously looping text. Visually checked at 1280 px and 390 px on `http://localhost:5173/about`; no document horizontal overflow. The mobile lettering was enlarged within the existing lower panel area. The red stroke in the supplied image was treated as an annotation marking the route, not as a new brand color.
- About end-scroll repair: reproduced the empty gap before “Rooted at UAI” on `http://localhost:5173/about`. The shared non-Home GSAP exit effect had faded and scaled the preceding section to zero opacity while leaving its document space. About now keeps all sections in normal visible flow. Scrolled down into the footer and back up at desktop, then checked the Rooted panel at 390 px and 320 px; no horizontal overflow appeared. The curved `LEARN · BUILD · SHIP · CONTRIBUTE` text now loops independently of scroll with two offset copies, and reduced-motion rendering keeps one static copy. Physical-device touch and browser reduced-motion emulation remain untested.
- About mission/vision follow-up: the dotted SVG texture, corner accents, and mixed-weight headings were visually checked in the in-app browser at desktop, 390 px, and 320 px. The original mission and vision wording remains intact; the cards stack and stay within the 320 px viewport.
- Home ribbon and cursor follow-up: the two lavender focus-area tracks cross on Home at desktop and phone widths. The accessible pause control changed to Play and both tracks reported `animation-play-state: paused`. A browser drag left the custom cursor visible with the page cursor computed as `none`. Physical touch and reduced-motion browser emulation remain untested.
- Navigated `/`, `/about`, `/projects`, `/events`, `/team`, `/blog`, `/open-source`, and `/join` at 1280 px, 390 px, and 320 px. Every route loaded with no document horizontal overflow. `https://localhost:5173/` was visited once as requested and returned `ERR_SSL_PROTOCOL_ERROR` because the local Vite server serves HTTP; the same site was then verified at `http://localhost:5173/`.
- Motion brief follow-up: inspected Team, About, and Open Source in the in-app browser at 1440 px, 768 px, 414 px, 390 px, 375 px, and 320 px widths. The Builders heading and paragraph became visible after their scroll reveals; a clipped-heading observer bug found during this pass was fixed. The About path initially escaped its panel because an existing direct-child selector overrode absolute positioning; the final desktop and 320 px renders place the path inside the panel, away from the copy. The Open Source guide showed the new kinetic step word and selecting “Pick an issue” changed the selected step and paused playback.
- Team badge follow-up: checked both faces at 390 × 844 and 320 × 700; card artwork, close and flip controls stayed in view. At 1440 × 900, dragging the card visibly displaced it and swung the lanyard. The camera and physics coordinates were adjusted after the first render placed the card too low. The opening state holds the card briefly before physics release. Physical touch dragging and reduced-motion browser emulation remain untested.
- Shared-motion route pass: navigated all eight routes at 320 px, 390 px, and 1440 px, and Team/About/Open Source at 375 px, 414 px, and 768 px. No tested route had document horizontal overflow or a Vite error overlay. The footer reveal and watermark were visually checked on About desktop. These route checks do not establish a full section-by-section visual audit of every page.

- Team member badge follow-up: opened the illustrative profile on `/team` in the in-app browser at 1440 × 900, 390 × 844, and 320 × 700. The Spectrum UI physics badge displayed the supplied front and back artwork; the Show back/Show front controls changed faces, and the X and Escape closed the dialog. Escape returned keyboard focus to Show more details. The dialog and page had no horizontal overflow at the tested phone widths. A 320 px modal expansion found during QA was fixed by constraining the dialog grid and stage. Reduced-motion code uses a static image, but browser emulation and physical-device touch behavior were not exercised. The profile remains explicitly illustrative until member details are confirmed.

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
