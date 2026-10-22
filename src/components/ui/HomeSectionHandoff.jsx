import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HomeSectionHandoff({ children }) {
  const panelRef = useRef(null)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const explore = panel?.previousElementSibling
    const stage = panel?.querySelector('.section-stage')
    if (!panel || !explore?.classList.contains('home-focus-scroll-section') || !stage) return undefined

    const media = gsap.matchMedia()
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      explore.classList.add('has-horizontal-handoff')
      panel.classList.add('is-horizontal-handoff')
      gsap.set(stage, { xPercent: 100 })

      const tween = gsap.to(stage, {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: 'top top',
          end: () => `+=${window.innerHeight}`,
          scrub: true,
          pin: panel,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      })
      ScrollTrigger.refresh()

      return () => {
        tween.kill()
        explore.classList.remove('has-horizontal-handoff')
        panel.classList.remove('is-horizontal-handoff')
        gsap.set(stage, { clearProps: 'xPercent' })
      }
    })

    media.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo(stage, { x: Math.min(window.innerWidth * 0.16, 64) }, {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: 'top 90%',
          end: 'top 35%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      return () => { tween.kill(); gsap.set(stage, { clearProps: 'x' }) }
    })

    return () => media.revert()
  }, [])

  return <div ref={panelRef} className="scroll-panel home-how-panel">
    <div className="section-stage"><div className="section-inner">{children}</div></div>
  </div>
}
