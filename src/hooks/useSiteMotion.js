import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function useSiteMotion(pathname) {
  useLayoutEffect(() => {
    let active = true
    let context
    let markerObserver
    let markerHeadings = []
    const splits = []
    window.scrollTo(0, 0)

    const setup = () => {
      if (!active) return
      const main = document.querySelector('#main-content')
      if (!main) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const headings = [...main.querySelectorAll('h1:not([data-motion-managed]), h2:not([data-motion-managed])'), ...document.querySelectorAll('footer h2')]

      context = gsap.context(() => {
        headings.forEach(heading => {
          gsap.set(heading, { opacity: 1 })
          if (heading.querySelector('em')) {
            if (!reduced && !heading.closest('.reveal')) {
              gsap.from(heading, {
                y: 20,
                opacity: 0,
                duration: .7,
                ease: 'power2.out',
                scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none reverse' },
              })
            }
            return
          }
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

      }, main)
      markerHeadings = [...main.querySelectorAll('h1, h2'), ...document.querySelectorAll('footer h2')].filter(heading => heading.querySelector('em'))
      markerHeadings.forEach(heading => {
        const length = [...heading.querySelectorAll('em')].reduce((total, em) => total + em.textContent.trim().length, 0)
        heading.style.setProperty('--marker-duration', `${Math.min(1.15, Math.max(.55, length * .04)).toFixed(2)}s`)
      })
      if ('IntersectionObserver' in window && !reduced) {
        markerObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            entry.target.classList.toggle('is-marker-visible', entry.intersectionRatio >= .25)
          })
        }, { rootMargin: '0px 0px -35% 0px', threshold: .25 })
        markerHeadings.forEach(heading => markerObserver.observe(heading))
      } else markerHeadings.forEach(heading => heading.classList.add('is-marker-visible'))
      ScrollTrigger.refresh()
    }

    document.fonts.ready.then(setup)
    return () => {
      active = false
      context?.revert()
      markerObserver?.disconnect()
      markerHeadings.forEach(heading => { heading.classList.remove('is-marker-visible'); heading.style.removeProperty('--marker-duration') })
      splits.forEach(split => split.revert())
    }
  }, [pathname])
}
