import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import './SiteEffects.css'

export function LampLight() {
  return <div className="lamp-light" aria-hidden="true"><span className="lamp-light-line" /><span className="lamp-light-halo" /><span className="lamp-light-cone" /></div>
}

export function BackgroundWord({ text }) {
  const ref = useRef(null)
  useEffect(() => {
    const word = ref.current
    const region = word?.closest('section') ?? word?.parentElement
    if (!word || !region) return undefined
    const move = event => {
      const bounds = word.getBoundingClientRect()
      word.style.setProperty('--hover-x', `${event.clientX - bounds.left}px`)
      word.style.setProperty('--hover-y', `${event.clientY - bounds.top}px`)
      const overWord = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
      word.classList.toggle('is-active', overWord)
    }
    const leave = () => word.classList.remove('is-active')
    region.addEventListener('pointermove', move, { passive: true })
    region.addEventListener('pointerleave', leave)
    return () => { region.removeEventListener('pointermove', move); region.removeEventListener('pointerleave', leave) }
  }, [])
  return <span ref={ref} className={`section-backdrop-word text-hover-word${text.length > 10 ? ' is-long' : ''}`} aria-hidden="true"><span className="text-hover-word-base">{text}</span><span className="text-hover-word-soft">{text}</span><span className="text-hover-word-glow">{text}</span></span>
}

export function PointerHighlight({ children }) {
  return <span className="pointer-highlight">{children}<svg viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true"><path d="M8 42 C10 12 45 9 96 7 C153 3 216 6 287 13 C299 16 299 45 286 56 C232 65 120 63 54 61 C20 60 6 56 8 42 Z" /></svg></span>
}

const heroWords = ['We', 'don’t', 'just', 'study', 'AI.', 'We', 'build', 'it.']

export function HeroKineticBuild() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(reduced ? heroWords.length : 0)
  useEffect(() => {
    if (reduced) return undefined
    let id
    const start = () => {
      setVisible(1)
      id = window.setInterval(() => setVisible(value => {
        if (value >= heroWords.length) { window.clearInterval(id); return value }
        return value + 1
      }), 330)
    }
    if (document.documentElement.dataset.preloaderDone === 'true') start()
    else window.addEventListener('site-preloader-done', start, { once: true })
    return () => { window.clearInterval(id); window.removeEventListener('site-preloader-done', start) }
  }, [reduced])
  const line = (start, end) => heroWords.slice(start, Math.min(end, reduced ? heroWords.length : visible)).map((word, index) => <motion.span key={`${start}-${index}`} layout="position" className="hero-kinetic-word" initial={reduced ? false : { opacity: 0, x: 35, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ duration: reduced ? 0 : .5, ease: [0.16, 1, .3, 1] }}>{word}</motion.span>)
  return <h1 data-motion-managed aria-label="We don’t just study AI. We build it." className={`hero-kinetic-heading${visible >= 5 ? ' has-highlight' : ''}`}><span className="sr-only" aria-live="polite" aria-atomic="true">{heroWords.slice(0, reduced ? heroWords.length : visible).join(' ')}</span><span aria-hidden="true" className="hero-kinetic-line">{line(0, 3)}</span><span aria-hidden="true" className="hero-kinetic-line hero-serif"><PointerHighlight>{line(3, 5)}</PointerHighlight></span><strong aria-hidden="true" className="hero-kinetic-line">{line(5, 8)}</strong></h1>
}

export function WordGenerate({ text }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()
  return <p ref={ref} className="word-generate" aria-label={text}>{text.split(/\s+/).map((word, i) => <motion.span key={i} aria-hidden="true" initial={reduced ? false : { opacity: 0, filter: 'blur(5px)' }} animate={visible || reduced ? { opacity: 1, filter: 'blur(0px)' } : undefined} transition={{ duration: reduced ? 0 : .42, delay: reduced ? 0 : Math.min(i * .035, 1), ease: [0.16, 1, .3, 1] }}>{word}</motion.span>)}</p>
}

export function WaveText({ children }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return <span ref={ref} className={`wave-text${visible ? ' is-visible' : ''}`} aria-label={children}>{[...children].map((letter, index) => <span aria-hidden="true" key={index} style={{ '--wave-index': index }}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>
}

export function BackgroundRipple() {
  const [clicked, setClicked] = useState(null)
  const columns = 20
  const rows = 9
  return <div className="background-ripple" aria-hidden="true" onClick={event => {
    const cell = event.target.closest('[data-ripple-cell]')
    if (cell) setClicked({ index: Number(cell.dataset.rippleCell), columns: window.matchMedia('(max-width: 640px)').matches ? 10 : columns, cycle: Date.now() })
  }}>{Array.from({ length: columns * rows }, (_, index) => {
    const currentColumns = clicked?.columns ?? columns
    const distance = clicked == null ? 0 : Math.abs(Math.floor(index / currentColumns) - Math.floor(clicked.index / currentColumns)) + Math.abs(index % currentColumns - clicked.index % currentColumns)
    return <span className="ripple-cell" data-ripple-cell={index} key={index}><i key={clicked?.cycle ?? 'idle'} className={clicked ? 'ripple-cell-flash' : ''} style={{ '--cell-delay': `${distance * 38}ms` }} /></span>
  })}</div>
}

const flapAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'

function FlapLabel({ text, flipping, reduced }) {
  const [frame, setFrame] = useState(12)
  useEffect(() => {
    if (!flipping || reduced) return undefined
    let step = 0
    const id = window.setInterval(() => {
      step += 1
      setFrame(step)
      if (step >= 12) window.clearInterval(id)
    }, 65)
    return () => window.clearInterval(id)
  }, [flipping, reduced])
  return <span className="flap-label" aria-label={text}>{[...text.toUpperCase()].map((character, index) => character === ' ' ? <span className="flap-space" aria-hidden="true" key={index} /> : <span aria-hidden="true" className="flap-character" key={`${index}-${frame}`} data-frame={frame}>{flipping && frame < 9 && frame > 0 ? flapAlphabet[(index * 7 + frame * 5) % flapAlphabet.length] : character}</span>)}</span>
}

export function TextFlippingBoard({ stats }) {
  const ref = useRef(null)
  const visible = useInView(ref, { amount: .2 })
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || !visible) return undefined
    const id = window.setInterval(() => setActive(value => (value + 1) % stats.length), 6000)
    return () => window.clearInterval(id)
  }, [reduced, stats.length, visible])
  return <div ref={ref} className="stats-grid flipping-stats" aria-label="Club statistics">{stats.map((stat, index) => <div className="stat-cell" key={stat.label}><span className="stat-index">0{index + 1} / CLUB</span><div className="stat-content"><strong aria-label={stat.value == null ? `${stat.label} count not yet published` : undefined}>{stat.value ?? '—'}</strong><FlapLabel text={stat.label} flipping={visible && active === index} reduced={reduced} /></div></div>)}<p className="stats-note">Verified totals will appear when the club provides them.</p></div>
}

export function TracingBeam() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [location.pathname])
  return <div className="tracing-beam" aria-hidden="true"><span style={{ transform: `scaleY(${progress})` }} /><i style={{ top: `${progress * 100}%` }} /></div>
}
