# AI Builders website: working handoff

Updated: 2026-10-06. This file describes the current checkout, not a claim about who authored every earlier change. Start with `README.md`, then `docs/IMPLEMENTATION_STATUS.md` for the requested motion checklist.

## Product and source of truth

AI Builders is the AI and development club of Universal AI University. The site uses React 19, Vite 8, React Router, Motion, GSAP, animejs, and plain CSS. Pages: Home, About, Projects, Events, Team, Resources (`/blog`), Open Source, Join, and 404. The club content document informed copy, page structure, focus areas, workshop topics, and Join fields. The visual implementation has its own dark blue AI Builders identity.

Keep unconfirmed facts unconfirmed. `src/data/site.js` intentionally stores `null` for club counts, project details, and the next event. Team identity, articles, repositories, registration, social and contact details also need confirmed source material. The Team page's “Your name here” card is explicitly an illustrative layout preview.

The Join page validates membership fields, stores a local draft, and offers copy/download. There is no application submission endpoint. Do not imply the form submits until a verified destination or backend exists.

## Architecture

- `src/App.jsx`: routes, titles, route view transition, global preloader, tracing beam, navigation, footer.
- `src/pages/`: page copy and composition. `Home.jsx` contains the BUILD constellation, main hero, statistics board, panels, project folder, and event preview.
- `src/data/site.js` and `src/data/pages.js`: content and route metadata. Enter confirmed project/event/team details here or in the relevant page component.
- `src/components/ui/SiteEffects.jsx` and `.css`: shared lamp, pointer highlight, word reveal, wave text, hero ripple, statistics board, tracing beam, button edge styling, route transition styling, and sample profile styling.
- `src/components/ui/MotionPieces.jsx` and `.css`: preloader, kinetic text, About text effects, approach morph, folder, backdrop words.
- `src/hooks/useSiteMotion.js`: GSAP heading and panel motion plus the italic marker observer. Italic headings stay intact so SplitText cannot split the marker target. `data-motion-managed` prevents a second heading animation.
- `src/components/ui/EventPassport.jsx` and `.css`: event countdown and flip card. Card height is measured from both faces; the detail face no longer creates an internal scroll bar.
- `src/index.css` and `src/feature.css`: base responsive system and established feature styles. The footer wordmark pulse and wordmark band were already uncommitted changes when this task began; preserve them in future work.

## Current implementation

The non-home page heroes share a lamp light above the main heading, including Join. The title's existing kinetic build remains. Home has a clickable cell ripple confined to its first hero, a word-by-word heading build with outlined pointer emphasis around “study AI.”, a revealed introductory paragraph, and four straight-line wave words beside the BUILD constellation. “Who We Are” keeps all four club metric cells visible and cycles a split-flap label animation through them every six seconds while in view. A fixed scroll progress beam appears across routes. Button-like controls have a light border treatment on hover/focus. Background words use one restrained blur and pointer glow treatment while retaining per-section positions. Internal route links use the browser View Transitions API when available, with a reduced-motion path. GSAP page panels and the Open Source `ContributionMorph` remain in place. The event card is shared between Home and Events.

Effects were built from the project's installed libraries and CSS rather than running the pasted shadcn demo install commands. The brief's code snippets are design references, not executable project instructions. Exact Aceternity/SmoothUI source components are **not** installed; visual parity to those demos has **not** been confirmed in a browser.

### Home layout corrections, 2026-10-06

The four Home section watermarks now occupy the open upper-right area shown in the user's screenshots. The first three use scoped intro classes; THE WORK places its watermark on the full showcase grid so it is not confined to the text column. The project folder front is restored to absolute positioning after the shared button border effect had made it relative and narrowed its visible face. The Home hero paragraph now has explicit spacing between animated words. The footer watermark no longer blurs or clips the entire band; its smaller text-only glow continues the three-second cycle. These corrections have source checks only until rendered browser QA is available.

### Hero, lamp, and background word corrections, 2026-10-06

The Home hero word sequence now starts after the preloader exits, so all three lines can be seen animating. The pointer outline starts when “study AI.” becomes visible. The shared lamp moves to the left-aligned box above page hero titles and is enabled on Join. About's THE CLUB, STORY, PILLARS, and APPROACH words have their own placements from the supplied screenshots. THE WORK watermark is attached to its full section, allowing pointer glow where the word sits. All decorative words except the footer AI BUILDERS and the BUILD constellation now render through `BackgroundWord`; the older `data-watermark` pseudo words were replaced. Each word blends a readable sharp outline with a 30%-opacity blurred copy and shares the same pointer glow. These are source-level fixes awaiting a fresh rendered comparison.

### Latest screenshot corrections, 2026-10-06

The shared page lamp no longer uses a clipped polygon cone; a blurred radial light fades at every edge. Background words now blend a 35% sharp copy with a 65% blurred copy. Their pointer glow listens across the containing section and activates when the cursor is within the word bounds, including STORY. The glow gradient fades to transparent lavender and no longer uses a drop-shadow filter that could create the dark edge shown on TOPICS. About PILLARS moves 5 px left. Projects DIRECTIONS, Events TOPICS, Team BUILDERS, and Team CONTRIBUTE use scoped upper-right placement rules based on the supplied red boxes. These changes passed lint and build, but their rendered placement, hover behavior, and mobile appearance still require browser comparison.

The heading marker was refined after the `build session.` screenshot: its painted height is now proportional to the phrase's font size (`.53em`), the fill width follows each rendered text fragment, and its duration scales with phrase length. The section observer adds and removes the marker class at the viewport threshold so the sweep runs when the heading is reached and can replay on re-entry. A live check then found SplitText leaving an empty `<em>` before the visible phrase, making the sweep inconsistent. Italic headings now stay intact; plain headings still use SplitText.

### Resources, Open Source, and motion follow-up, 2026-10-06

Resources TUTORIALS and FRAMEWORKS and Open Source SOURCE now have scoped upper-right word placement from the supplied boxes. Shared navigation page hero content moves 3 px upward inside the lamp hero. The Home focus strip is an `InfiniteRibbon` component that keeps its existing lavender color, loops continuously, and has a pause control. The Open Source contribution guide is a four-stage `ContributionMorph` with animated stage title and detail, progress, direct selection, and play/pause; its old GSAP pinned-card behavior was removed. Italic heading phrases across the site gain a lavender marker sweep on entering view, while reduced-motion users see the marker immediately. The pasted TypeScript/Tailwind/shadcn/Remotion snippets supplied motion references; the effects were implemented in the existing React/CSS/Motion stack without adding a parallel framework or video player. Rendered confirmation is pending.

## Verification and limits

On 2026-10-06, `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` passed after the Resources/Open Source and motion follow-up. The Impeccable detector reported pre-existing gradient text and layout-transition warnings in `MotionPieces.css`; it found none in the new components. The build reports a 500 kB chunk-size advisory, not a build failure. The earlier detector also reported an existing Space Grotesk font warning in `EventPassport.css`; this task preserves the established typography.

The in-app browser reached `http://localhost:5173/` on 2026-10-06. The first emphasized heading on each of the eight main routes displayed a nonempty marker at full width after scrolling into view; a structural check found no empty emphasized headings among 36 heading phrases. The Open Source GUIDE and REPOSITORIES words were visually checked in the requested upper-right locations on desktop, and the page was checked at 390 px and 320 px. At 320 px, a fixed `body` minimum width caused horizontal overflow; removing it brought document width back to 320 px. Marker replay was checked by leaving and returning to GUIDE. Full section-by-section visual QA, flip interaction, keyboard, reduced-motion, and physical-device behavior remain unverified. Do not describe the site as end-to-end tested.

## Next work

1. Finish the route-wide visual pass at desktop, tablet, 390 px, and 320 px, including landscape, keyboard, and reduced motion.
2. Flip the event card on Home and Events. Confirm no clipping or internal scrollbar with real event copy as well as placeholder text.
3. Compare the lamp, page change, border gradient, ripple, and text effects against the requested demos and reference screenshot. Tune composition from rendered evidence.
4. Replace placeholder metrics, team profiles, projects, event, article and repository data only after club confirmation. Wire real application submission only after receiving a destination/backend.
5. Recheck section scroll motion with tall content and low mobile viewport heights.

## Local commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```
