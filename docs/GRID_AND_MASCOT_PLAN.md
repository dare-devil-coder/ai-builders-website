# Grid and mascot placement plan

The current dark blue visual system stays in place. The grid supports the idea of building and measuring; it should not compete with page copy.

| Surface | Grid treatment | Mascot placement |
| --- | --- | --- |
| Home first hero | Faint 40 px lines behind the hero, fading before the main statement and BUILD artwork | None |
| Shared navigation heroes on About, Projects, Events, Team, Resources, and Open Source | Faint 40 px lines in the open right side beneath the existing lamp and background word | Robot in the lower open area of the hero, below the decorative word and above the first-section divider, as marked in the About screenshot |
| Join hero | Faint 40 px lines in the open right side beneath the existing lamp and background word | None |
| Home Who We Are and About Our Story | Faint section grid behind the open upper-right area; the section content remains above it | None |
| Projects Build Directions, Events Workshop Topics, Team Ways to Contribute, and Resources Tools & Frameworks | Quieter grid in the open right side of each section, behind the heading and outside the card/list surfaces | None |
| Open Source Club Repositories | Quieter grid behind the right side of the heading and empty-state area | None |
| Other content sections | Existing section styling without another grid layer | None |
| Contribution guide | Keep its existing grid texture; remove the duplicate outlined step title | None |
| Forms, article rows, cards, footer, and later sections | No additional grid | None |

The six heroes share one mascot anchor. Below 900 px, the hero reserves space beneath the description and places the mascot at its lower right. At phone widths, the mascot shrinks to 126 px. The hero grid's cell arrival is a single short reveal. Selected content sections use a sparse 30-cell pulse based on the supplied AnimatedGridPattern reference; a 4-second cycle includes roughly 3 seconds of motion and 1 second at rest. It runs only while the section intersects the viewport and becomes static with reduced motion. The robot tracks a fine pointer, reacts to click or keyboard activation, and stays centered for touch and reduced-motion users. Text, controls, focus order, and the existing decorative word positions remain readable.
