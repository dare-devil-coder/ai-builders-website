import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function useSiteMotion(pathname) {
  useLayoutEffect(() => {
    let active = true
    let context
    const splits = []
    window.scrollTo(0, 0)

    const setup = () => {
      if (!active) return
      const main = document.querySelector('#main-content')
      if (!main) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const headings = [...main.querySelectorAll('h1, h2'), ...document.querySelectorAll('footer h2')]

      context = gsap.context(() => {
        headings.forEach(heading => {
          gsap.set(heading, { opacity: 1 })
          const isFirstHeading = heading.tagName === 'H1'
          const split = SplitText.create(heading, {
            type: 'words,lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: instance => {
              if (reduced) return undefined
              if (isFirstHeading) return gsap.from(instance.lines, { yPercent: 120, duration: 0.8, stagger: 0.1, ease: 'power2.out' })
              return gsap.from(instance.lines, {
                yPercent: 120,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: {
                  trigger: heading.closest('section, footer') || heading,
                  start: 'clamp(top 82%)',
                  end: 'clamp(top 38%)',
                  scrub: 1.1,
                  invalidateOnRefresh: true,
                },
              })
            },
          })
          splits.push(split)
        })

        if (!reduced) {
          const panels = [...main.querySelectorAll('.home-page > .scroll-panel')]
          panels.forEach(panel => {
            const stage = panel.querySelector('.section-stage')
            gsap.fromTo(stage, { opacity: 1, scale: 1 }, {
              opacity: 0.82,
              scale: 0.975,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 1.4,
                invalidateOnRefresh: true,
              },
            })
          })
          if (!panels.length) {
            main.querySelectorAll('section').forEach(section => {
              gsap.fromTo(section, { opacity: 1 }, {
                opacity: 0.88,
                ease: 'none',
                scrollTrigger: { trigger: section, start: 'bottom bottom', end: 'bottom top', scrub: 1.1 },
              })
            })
          }
        }
      }, main)
      ScrollTrigger.refresh()
    }

    document.fonts.ready.then(setup)
    return () => {
      active = false
      context?.revert()
      splits.forEach(split => split.revert())
    }
  }, [pathname])
}
