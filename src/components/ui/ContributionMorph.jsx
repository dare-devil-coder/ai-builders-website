import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import './ContributionMorph.css'

const steps = [
  { id: 'fork', title: 'Fork', detail: 'Fork the repository you want to work on.' },
  { id: 'clone', title: 'Clone', detail: 'Clone it locally and follow the README to set up your environment.' },
  { id: 'issue', title: 'Pick an issue', detail: 'Look for a good-first-issue or help-wanted label.' },
  { id: 'pr', title: 'Open a PR', detail: 'Make your change, write a clear commit message, and open a pull request.' },
]

export default function ContributionMorph() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: .25 })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || reduced || !inView) return undefined
    const timer = window.setInterval(() => setActive(index => (index + 1) % steps.length), 3800)
    return () => window.clearInterval(timer)
  }, [inView, paused, reduced])

  const current = steps[active]
  const progress = (active + 1) * 100 / steps.length

  return <div ref={ref} className="contribution-morph" aria-label="Contribution guide">
    <div className="contribution-morph-display">
      <span className="eyebrow">YOUR FIRST CONTRIBUTION / 0{active + 1}</span>
      <div className="contribution-kinetic-frame" aria-live="polite"><h3 key={current.id}>{current.title}</h3><span className="contribution-kinetic-index" aria-hidden="true">0{active + 1} / 0{steps.length}</span></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={current.id} initial={reduced ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduced ? undefined : { opacity: 0, y: -6, filter: 'blur(4px)' }} transition={{ duration: reduced ? 0 : .3, ease: [.23, 1, .32, 1] }}>{current.detail}</motion.p>
      </AnimatePresence>
    </div>
    <div className="contribution-morph-progress"><span>THE BUILD SEQUENCE</span><strong>{progress}%</strong><div className="contribution-morph-track"><span style={{ transform: `scaleX(${progress / 100})` }} /></div></div>
    <div className="contribution-morph-controls"><div className="contribution-morph-steps" role="group" aria-label="Contribution steps">{steps.map((step, index) => <button type="button" key={step.id} aria-pressed={index === active} className={index === active ? 'is-active' : ''} onClick={() => { setActive(index); setPaused(true) }}>{step.title}</button>)}</div><button type="button" className="contribution-morph-play" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play contribution guide' : 'Pause contribution guide'}>{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? 'Play' : 'Pause'}</button></div>
  </div>
}
