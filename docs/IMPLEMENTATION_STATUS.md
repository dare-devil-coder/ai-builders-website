# Motion and responsive implementation status

This tracks the 19 items in the 2026-10-05 request. “Implemented” means the code is present; focused browser verification and remaining limits are recorded in `../agent.md` and `FRONTEND_QA.md`.

| # | Request | Current status |
| --- | --- | --- |
| 1, 14 | Lamp light on navigation page heroes | Implemented in shared `PageHero`, including Join; a radial cone replaces the hard-edged polygon under the light line. Existing heading build remains. Title/description offset by 2 px. Visual comparison pending. |
| 2 | Flipping statistics in Home “Who We Are” | All four metric cells remain visible. Their labels use character tiles, with one label animating every 6 seconds while in view. User-supplied totals are 26 members, 0 projects made, 1 workshop done, and 0 open contributions. |
| 3 | Pointer highlight on “study AI.” | Implemented on those words in Home hero. |
| 4 | Footer AI BUILDERS 1.5-second glow cycle | Existing working-tree CSS supplies the 3-second glow/dim loop. Visual timing pending. |
| 5 | Mobile compatibility | Responsive CSS and touch targets added or preserved; real viewport and touch QA pending. |
| 6 | Sample Team member | Implemented as a clearly marked illustrative profile, without invented identity. |
| 7 | Tab-like page transition | Implemented with View Transitions API: outgoing page tilts/scales, incoming page settles. Falls back to instant navigation when unsupported. Exact demo stack is not installed. |
| 8, 19 | Readable blurred and arranged background words | A shared 35% sharp outline plus 65% blurred copy and pointer glow apply to all decorative words except AI BUILDERS and BUILD. Home, About, Projects, Events, and Team screenshot placements use scoped rules. Visual QA pending. |
| 9 | Hover effect on background lettering | Shared section/page watermark treatment follows the pointer and activates when the cursor is within the visible word bounds on hover capable devices; touch remains static. Exact TextHoverEffect demo is not installed. |
| 10 | Four wave words near BUILD | Implemented as LEARN, BUILD, GROW, CONTRIBUTE in a horizontal group that wraps on narrow phones. |
| 11 | Kinetic Home statement | The word build starts after preloader exit so all three lines can animate visibly; the pointer outline starts when “study AI.” appears. Reduced motion shows the full statement at once. Visual parity remains unverified. |
| 12 | Generated intro paragraph | Implemented as staggered word reveal on only the specified paragraph. |
| 13 | Tracing beam across site | Implemented as a fixed scroll-progress line across routes. |
| 15 | Hover border gradient on buttons | Implemented for primary/shared buttons and bespoke event/process/menu controls. Visual and keyboard QA pending. |
| 16 | Background ripple only in first Home section | A clickable grid of cells ripples from the selected cell and is scoped to the hero. Touch and rendered interaction QA remain pending. |
| 17 | Section transitions and contribution steps | GSAP section motion remains. Open Source uses the selectable, cycling `ContributionMorph`; its former pinned cards were removed. Full rendered scroll QA remains open. |
| 18 | No scrollbar inside event flip back | Internal scroll removed. Card height is measured from both faces and remeasured after content, font, or viewport changes. Both route interactions and long-content case require browser QA. |

## Verification record

### 2026-10-06 Resources and motion follow-up

- Navigation page hero content moves 3 px upward within the shared lamp layout.
- Resources TUTORIALS and FRAMEWORKS and Open Source SOURCE have scoped screenshot placements.
- Home focus areas use the reusable `InfiniteRibbon` with the established lavender strip and a pause control.
- Open Source contribution steps use the selectable, cycling `ContributionMorph`; the former scroll-pinned card code was removed.
- Italic heading phrases receive an in-view marker sweep across routes, with a static reduced-motion state.
- Focused live checks of the italic marker and Open Source GUIDE/REPOSITORIES placement passed at desktop and narrow widths; broader appearance and interaction checks remain open in `FRONTEND_QA.md`.

- `npm.cmd run lint`: passed, 2026-10-06 after latest screenshot corrections.
- `npm.cmd run build`: passed, 2026-10-06 after latest screenshot corrections; chunk-size advisory only.
- `git diff --check`: passed, 2026-10-06 after latest screenshot corrections.
- Browser run: unavailable in this environment. The local server timed out in the in-app browser, npm returned `ENOTFOUND` when fetching Playwright CLI, and the browser blocked local `file:` navigation under its security policy. No rendered route, mobile, or interaction pass is claimed.

## Content still required from the club

Member names/roles/photos/profile links, project titles/descriptions/repositories, event date/venue/topic/registration, published articles, GitHub organization and repository links, and a verified Join submission destination.
