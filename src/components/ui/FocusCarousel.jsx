import { useLayoutEffect, useRef, useState } from 'react'
import { MoveUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { TiltCard } from './Sections'
import './FocusCarousel.css'

gsap.registerPlugin(ScrollTrigger)

export default function FocusCarousel({ items, label = 'What we explore', itemLabel = 'FOCUS', showArrow = true }) {
  const stageRef = useRef(null)
  const railRef = useRef(null)
  const trackRef = useRef(null)
  const travelRef = useRef(0)
  const inView = useInView(stageRef, { once: true, amount: 0.25 })
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const section = stageRef.current?.closest('.focus-scroll-section')
    const rail = railRef.current
    const track = trackRef.current
    if (!section || !rail || !track || reduceMotion) return undefined

    section.classList.add('is-motion-ready')
    const move = gsap.quickTo(track, 'x', { duration: 0.32, ease: 'power3.out' })
    const update = self => {
      const distance = travelRef.current
      const first = track.querySelector('.focus-carousel-item')
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const step = (first?.offsetWidth || 1) + gap
      const raw = distance * self.progress / step
      const base = Math.floor(raw)
      const fraction = raw - base
      const phase = Math.max(0, Math.min(1, (fraction - 0.42) / 0.16))
      const eased = phase * phase * (3 - 2 * phase)
      const position = Math.min(distance, (base + eased) * step)
      move(-position)
      const next = Math.min(items.length - 1, Math.round(position / step))
      setActiveIndex(current => current === next ? current : next)
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => section.classList.contains('has-horizontal-handoff') ? `+=${travelRef.current}` : 'bottom bottom',
      onUpdate: update,
      onRefresh: update,
    })
    const measure = () => {
      travelRef.current = Math.max(0, track.scrollWidth - rail.clientWidth)
      section.style.setProperty('--focus-travel', `${travelRef.current}px`)
      ScrollTrigger.refresh()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    observer.observe(track)
    measure()

    return () => {
      observer.disconnect()
      trigger.kill()
      gsap.killTweensOf(track)
      gsap.set(track, { clearProps: 'transform' })
      section.classList.remove('is-motion-ready')
      section.style.removeProperty('--focus-travel')
    }
  }, [items.length, reduceMotion])

  const onRailKeyDown = event => {
    if (reduceMotion || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
    const section = stageRef.current?.closest('.focus-scroll-section')
    const track = trackRef.current
    const rail = railRef.current
    const first = track?.querySelector('.focus-carousel-item')
    if (!section || !rail || !first || !travelRef.current) return
    event.preventDefault()
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const cardStep = first.offsetWidth + gap
    const scrollStep = (cardStep / travelRef.current) * (section.offsetHeight - window.innerHeight)
    window.scrollBy({ top: (event.key === 'ArrowRight' ? 1 : -1) * scrollStep, behavior: 'instant' })
  }

  return <div className="focus-carousel" aria-label={label}>
    <div ref={stageRef} className="focus-carousel-stage">
      <div ref={railRef} className="focus-carousel-rail" role="region" aria-label={`${items.length} AI Builders ${itemLabel.toLowerCase()} cards; scroll the page to move through them`} tabIndex={reduceMotion ? undefined : 0} onKeyDown={onRailKeyDown}>
        <motion.div
          className="focus-carousel-reveal"
          initial={reduceMotion ? false : { transform: 'scale(0.18)', opacity: 0.65, filter: 'blur(3px)' }}
          animate={{ transform: inView || reduceMotion ? 'scale(1)' : 'scale(0.18)', opacity: inView || reduceMotion ? 1 : 0.65, filter: inView || reduceMotion ? 'blur(0px)' : 'blur(3px)' }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 105, damping: 17, mass: 0.9 }}
        >
          <div ref={trackRef} className="focus-carousel-track">
            {items.map(item => <div className="focus-carousel-item" key={item.id}>
              <TiltCard className="pillar-card">
                <div className="pillar-top"><span>{item.id} / {itemLabel}</span><span className="pillar-icon">{item.icon}</span></div>
                <h3>{item.title}</h3><p>{item.text}</p>{showArrow && <MoveUpRight size={19} className="pillar-arrow" aria-hidden="true" />}
              </TiltCard>
            </div>)}
          </div>
        </motion.div>
      </div>
    </div>
    <div className="focus-carousel-footer"><span className="focus-carousel-count" aria-live="off">{reduceMotion ? String(items.length).padStart(2, '0') : String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span><span className="focus-carousel-instruction">SCROLL TO EXPLORE</span></div>
  </div>
}
