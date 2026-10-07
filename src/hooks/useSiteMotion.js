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
    let textObserver
    const markerTimers = []
    let markerHeadings = []
    const splits = []
    window.scrollTo(0, 0)

    const setup = () => {
      if (!active) return
      const main = document.querySelector('#main-content')
      if (!main) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const headings = [...main.querySelectorAll('h1:not([data-motion-managed])')]

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

        if (!reduced) {
          const panels = [...main.querySelectorAll('.home-page > .scroll-panel')]
          panels.slice(0, -1).forEach(panel => {
            const stage = panel.querySelector('.section-stage')
            if (!stage) return
            gsap.fromTo(stage, { opacity: 1, scale: 1 }, {
              opacity: 0,
              scale: 0.7,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'bottom bottom',
                end: () => `+=${Math.round(window.innerHeight * .65)}`,
                pin: window.innerWidth > 900 ? panel : false,
                pinSpacing: false,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
          })
          if (!panels.length && pathname !== '/about') {
            const sections = [...main.querySelectorAll(':scope > section')]
            sections.slice(0, -1).forEach(section => {
              gsap.fromTo(section, { opacity: 1, scale: 1 }, {
                opacity: 0,
                scale: 0.7,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: () => section.offsetHeight < window.innerHeight ? 'top top' : 'bottom bottom',
                  end: () => `+=${Math.round(window.innerHeight * .65)}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
            })
          }
        }
      }, main)
      markerHeadings = [...main.querySelectorAll('h1, h2'), ...document.querySelectorAll('footer h2')].filter(heading => heading.querySelector('em'))
      markerHeadings.forEach(heading => {
        const length = [...heading.querySelectorAll('em')].reduce((total, em) => total + em.textContent.trim().length, 0)
        heading.style.setProperty('--marker-duration', `${Math.min(1.15, Math.max(.55, length * .04)).toFixed(2)}s`)
      })
      if ('IntersectionObserver' in window && !reduced) {
        markerObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio >= .25) {
              if (entry.target.tagName === 'H2') markerTimers.push(window.setTimeout(() => entry.target.classList.add('is-marker-visible'), 650))
              else entry.target.classList.add('is-marker-visible')
            } else entry.target.classList.remove('is-marker-visible')
          })
        }, { rootMargin: '0px 0px -35% 0px', threshold: .25 })
        markerHeadings.forEach(heading => markerObserver.observe(heading))
      } else markerHeadings.forEach(heading => heading.classList.add('is-marker-visible'))
      const textTargets = [...main.querySelectorAll('h2, p:not(.sr-only)'), ...document.querySelectorAll('footer h2, footer p')].filter(element => !element.closest('.member-badge-overlay, .contribution-morph'))
      if (!reduced && 'IntersectionObserver' in window) {
        textTargets.forEach(element => element.classList.add(element.tagName === 'H2' ? 'dual-wipe' : 'rect-reveal'))
        const triggers = new Map()
        textTargets.forEach(element => {
          const trigger = element.parentElement
          if (!triggers.has(trigger)) triggers.set(trigger, [])
          triggers.get(trigger).push(element)
        })
        textObserver = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggers.get(entry.target)?.forEach(element => element.classList.add('motion-visible'))
            textObserver.unobserve(entry.target)
          }
        }), { rootMargin: '0px 0px -10% 0px', threshold: .08 })
        triggers.forEach((_, trigger) => textObserver.observe(trigger))
      }
      ScrollTrigger.refresh()
    }

    document.fonts.ready.then(setup)
    return () => {
      active = false
      context?.revert()
      markerObserver?.disconnect()
      textObserver?.disconnect()
      markerTimers.forEach(timer => window.clearTimeout(timer))
      document.querySelectorAll('.dual-wipe, .rect-reveal').forEach(element => element.classList.remove('dual-wipe', 'rect-reveal', 'motion-visible'))
      markerHeadings.forEach(heading => { heading.classList.remove('is-marker-visible'); heading.style.removeProperty('--marker-duration') })
      splits.forEach(split => split.revert())
    }
  }, [pathname])
}
