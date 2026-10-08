import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { approach, featuredProjects } from '../../data/site'
import './MotionPieces.css'

const easeOut = [0.23, 1, 0.32, 1]

export function SpinningText({ text = 'LEARN • BUILD • GROW • CONTRIBUTE • ' }) {
  const characters = [...text]
  return <div className="spinning-text" role="img" aria-label={text}>
    <div className="spinning-text-ring" aria-hidden="true">{characters.map((character, index) =>
      <span key={index} style={{ '--angle': `${index * 360 / characters.length}deg` }}>{character}</span>)}</div>
    <span className="spinning-text-center" aria-hidden="true">AI<br />BUILDERS</span>
  </div>
}

function KineticWord({ word, index, count, progress }) {
  const center = (index + .5) / count
  const start = Math.max(0, center - .28)
  const end = Math.min(1, center + .28)
  const scale = useTransform(progress, [start, center, end], [.91, 1.08, .91])
  const y = useTransform(progress, [start, center, end], [6, -7, 6])
  const opacity = useTransform(progress, [start, center, end], [.6, 1, .6])
  const letterSpacing = useTransform(progress, [start, center, end], ['-.025em', '.015em', '-.025em'])
  return <motion.span aria-hidden="true" className="kinetic-word" style={{ scale, y, opacity, letterSpacing }}>{word}</motion.span>
}

function StaticKineticType({ text }) {
  return <p className="kinetic-type kinetic-type-static">{text}</p>
}

function AnimatedKineticType({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.45'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: .7 })
  const words = text.trim().split(/\s+/)
  return <p ref={ref} className="kinetic-type" role="text" aria-label={text}>{words.map((word, index) =>
    <KineticWord key={index} word={word} index={index} count={words.length} progress={smooth} />)}</p>
}

export function KineticType({ text }) {
  const reduced = useReducedMotion()
  return reduced ? <StaticKineticType text={text} /> : <AnimatedKineticType text={text} />
}

export function SoftBlurText({ text }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const reduced = useReducedMotion()
  let index = 0
  return <span ref={ref} className="soft-blur-text" role="text" aria-label={text}>{text.split(' ').map((word, wordIndex) =>
    <span className="soft-blur-word" key={wordIndex} aria-hidden="true">{wordIndex > 0 && ' '}{[...word].map(character => {
      const letterIndex = index++
      return <motion.span key={letterIndex} className="soft-blur-letter"
        initial={reduced ? false : { opacity: 0, filter: 'blur(8px)', transform: 'translateY(10px)' }}
        animate={inView || reduced ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' } : undefined}
        transition={{ duration: reduced ? 0 : .65, delay: reduced ? 0 : Math.min(letterIndex * .018, .6), ease: [0.22, 1, 0.36, 1] }}>{character}</motion.span>
    })}</span>)}</span>
}

export function ShineText({ children }) {
  return <span className="shine-text">{children}</span>
}

function tokenKeys(text) {
  const counts = new Map()
  return [...text].map(character => {
    const count = counts.get(character) || 0
    counts.set(character, count + 1)
    return { character, key: `${character}-${count}` }
  })
}

export function TextMorph({ text }) {
  const reduced = useReducedMotion()
  if (reduced) return <span className="text-morph-static">{text}</span>
  return <motion.span layout className="text-morph"><span className="sr-only">{text}</span><span aria-hidden="true" className="text-morph-visual">
    <AnimatePresence initial={false} mode="popLayout">{tokenKeys(text).map(({ character, key }, index) =>
      <motion.span layout="position" key={key} className="text-morph-token"
        initial={{ opacity: 0, filter: 'blur(6px)', transform: 'translateY(10px) scale(.95)' }}
        animate={{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px) scale(1)' }}
        exit={{ opacity: 0, filter: 'blur(5px)', transform: 'translateY(-7px) scale(.95)' }}
        transition={{ duration: .3, delay: Math.min(index * .025, .16), ease: easeOut }}>{character}</motion.span>)}</AnimatePresence>
  </span></motion.span>
}

export function ApproachMorph() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (paused || reduced) return undefined
    const timer = window.setInterval(() => setActive(value => (value + 1) % approach.length), 3800)
    return () => window.clearInterval(timer)
  }, [paused, reduced])
  const progress = ((active + 1) / approach.length) * 100
  return <div className="approach-morph" aria-label="How we work">
    <div className="approach-morph-display"><span className="eyebrow">THE BUILD LOOP / 0{active + 1}</span><h3><TextMorph text={approach[active].title} /></h3><p>{approach[active].text}</p></div>
    <div className="approach-progress"><span>Progress</span><strong>{progress}%</strong><div className="approach-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
    <div className="approach-morph-controls"><div className="approach-morph-steps" role="group" aria-label="Explore our process">{approach.map((step, index) =>
      <button key={step.number} type="button" className={index === active ? 'is-active' : ''} aria-pressed={index === active}
        onClick={() => { setPaused(true); setActive(index) }}>{step.title}</button>)}</div><button className="approach-pause" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play process animation' : 'Pause process animation'}>{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? 'Play' : 'Pause'}</button></div>
  </div>
}

export function PagePreloader() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState('hold')
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (reduced) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const words = [370, 740, 1110].map((delay, value) => window.setTimeout(() => setIndex(value + 1), delay))
    const welcome = window.setTimeout(() => setPhase('welcome'), 1480)
    const leave = window.setTimeout(() => setPhase('exit'), 4480)
    const done = window.setTimeout(() => setPhase('done'), 5160)
    return () => { words.forEach(window.clearTimeout); window.clearTimeout(welcome); window.clearTimeout(leave); window.clearTimeout(done); document.body.style.overflow = previous }
  }, [reduced])
  useEffect(() => {
    if (phase === 'done') {
      document.body.style.overflow = ''
      document.documentElement.dataset.preloaderDone = 'true'
      window.dispatchEvent(new Event('site-preloader-done'))
    }
  }, [phase])
  if (reduced || phase === 'done') return null
  return <div className={`site-preloader ${phase === 'exit' ? 'is-exiting' : ''}`} role="status" aria-live="polite"><span className="sr-only">{phase === 'welcome' ? 'Welcome to the world of AI Builders' : 'Loading AI Builders'}</span><div className="preloader-visual" aria-hidden="true"><span>AI BUILDERS / UAI</span><strong key={phase === 'welcome' || phase === 'exit' ? 'welcome' : index} className={phase === 'welcome' || phase === 'exit' ? 'preloader-welcome' : ''}>{phase === 'welcome' || phase === 'exit' ? 'WELCOME TO THE WORLD OF AI BUILDERS' : ['LEARN', 'BUILD', 'SHIP', 'CONTRIBUTE'][index]}</strong><span>MADE TO MAKE THINGS REAL</span></div></div>
}

export function KineticCenterBuild({ words = ['Learn.', 'Build.', 'Repeat.'] }) {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(1)
  useEffect(() => {
    if (reduced) return undefined
    const timer = window.setInterval(() => setVisible(value => {
      if (value >= words.length) { window.clearInterval(timer); return value }
      return value + 1
    }), 480)
    return () => window.clearInterval(timer)
  }, [reduced, words.length])
  const displayed = reduced ? words.length : visible
  return <span className="kinetic-center-build" aria-live="polite" aria-atomic="true"><span className="sr-only">{words.slice(0, displayed).join(' ')}</span><span aria-hidden="true" className="kinetic-center-visual">
    <AnimatePresence initial={false}>{words.slice(0, displayed).map(word => <motion.span key={word} layout
      initial={reduced ? false : { opacity: 0, filter: 'blur(10px)', transform: 'translateX(34px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)', transform: 'translateX(0px)' }}
      transition={{ duration: reduced ? 0 : .42, ease: easeOut }}>{word}</motion.span>)}</AnimatePresence>
  </span></span>
}

export function FolderReveal() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const hoverAllowed = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
  return <div className={`folder-reveal ${open ? 'is-open' : ''} ${reduced ? 'is-reduced' : ''}`}
    onPointerEnter={() => { if (hoverAllowed()) setOpen(true) }}
    onPointerLeave={() => { if (hoverAllowed()) setOpen(false) }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <div className="folder-shadow" aria-hidden="true" />
    <div className="folder-back" aria-hidden="true"><span>AI BUILDERS</span></div>
    <div className="folder-well" aria-hidden="true" />
    <div className="folder-papers" aria-hidden={!open} inert={!open}>{featuredProjects.map((project, index) =>
      <Link to="/projects" className="folder-paper" key={project.id} style={{ '--paper-index': index }} tabIndex={open ? 0 : -1}>
        <span>PROJECT / {project.id}</span><strong>{project.title || `Project ${project.id}`}</strong><small>{project.title ? project.category : 'DETAILS PENDING'}</small>
      </Link>)}</div>
    <button className="folder-front" type="button" aria-expanded={open} aria-label={open ? 'Close AI Builders project folder' : 'Open AI Builders project folder'}
      onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setOpen(true) }}
      onClick={() => setOpen(value => !value)}><span>AI BUILDERS / PROJECTS</span><ArrowUpRight aria-hidden="true" /></button>
    <p className="folder-hint">{open ? 'Select a project card' : 'Hover or tap to see projects'}</p>
  </div>
}
