import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Sections'
import { BackgroundWord } from './SiteEffects'
import EventRecap from './EventRecap'
import './EventArchive.css'

const events = ['After the Prompt', 'Beyond the Prompt', 'Before the Prompt']
const clamp = (n) => Math.max(0, Math.min(1, n))
const mix = (a, b, t) => a + (b - a) * t
const out = (t) => 1 - (1 - t) ** 3
const inOut = (t) => t * t * (3 - 2 * t)
const dealStart = .07
const dealStep = .09
const dealEnd = dealStart + events.length * dealStep
const gatherEnd = .45
const feedStart = .15
const feedEnd = .7
const aimAngles = [38, 0, -38]

function playDealSound(context) {
  const now = context.currentTime
  const oscillator = context.createOscillator()
  const tone = context.createGain()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(180, now)
  oscillator.frequency.exponentialRampToValueAtTime(72, now + .085)
  tone.gain.setValueAtTime(.0001, now)
  tone.gain.exponentialRampToValueAtTime(.075, now + .008)
  tone.gain.exponentialRampToValueAtTime(.0001, now + .09)
  oscillator.connect(tone).connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + .095)

  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * .12), context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const paper = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const noise = context.createGain()
  paper.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = 1500
  filter.Q.value = .7
  noise.gain.setValueAtTime(.0001, now)
  noise.gain.exponentialRampToValueAtTime(.055, now + .012)
  noise.gain.exponentialRampToValueAtTime(.0001, now + .12)
  paper.connect(filter).connect(noise).connect(context.destination)
  paper.start(now)
  paper.stop(now + .12)
}

function Orbit() {
  return <svg className="archive-orbit" viewBox="0 0 360 360" aria-hidden="true">
    <circle cx="180" cy="180" r="151" className="archive-orbit-dots" />
    <circle cx="180" cy="180" r="129" />
    <ellipse cx="180" cy="180" rx="153" ry="84" transform="rotate(-31 180 180)" />
    <ellipse cx="180" cy="180" rx="153" ry="84" transform="rotate(54 180 180)" />
    <ellipse cx="180" cy="180" rx="100" ry="153" transform="rotate(-21 180 180)" />
    <path className="archive-orbit-highlight" d="M 40 104 A 151 151 0 0 1 121 41" />
    <path className="archive-orbit-highlight" d="M 320 256 A 151 151 0 0 1 239 319" />
    <path className="archive-orbit-tick" d="M180 13v14M180 333v14M13 180h14M333 180h14" />
  </svg>
}

function ArchiveCard({ name, index, onExplore }) {
  return <article className="archive-card" data-archive-card aria-label={`${name}, illustrative event card`}>
    <div className="archive-card-inner" data-archive-inner>
      <div className="archive-card-back archive-card-face">
        <div className="archive-card-frame">
          <div className="archive-card-top"><span>Collective memory</span><span>Past events</span></div>
          <span className="archive-card-category">Club activities / AI development</span>
          <Orbit />
          <div className="archive-card-back-title"><span className="archive-diamond" aria-hidden="true" /><strong><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M2 26 12 2 22 26" /></svg> I BUILDERS</strong><span>{name}</span></div>
          <div className="archive-card-bottom"><span>Club / memory / culture</span><span>Archive ↗</span></div>
        </div>
        <div className="archive-card-rail"><span>● &nbsp; CLUB ARCHIVE</span><span>REVERSE / B</span></div>
        <div className="archive-card-foot"><span>PAST EVENT COLLECTION</span><span className="archive-barcode" aria-hidden="true" /></div>
      </div>
      <div className="archive-card-front archive-card-face">
        <div className="archive-card-front-frame">
          <div className="archive-card-top"><span>● &nbsp; SAMPLE EVENT</span><span>CLUB ARCHIVE ↗</span></div>
          <div className={`archive-card-art archive-card-art--${index}`} role="img" aria-label="Illustrative orbital AI artwork">
            <span className="archive-card-art-tag">CREATIVE AI</span><span className="archive-card-art-caption">IDEAS BECOME POSSIBILITIES.</span>
          </div>
          <h3>{name}</h3>
          <p>From first prompts to working prototypes. Explore creative AI together.</p>
          <button type="button" className="archive-card-action" data-archive-action onClick={() => onExplore(name)}>Explore the recap <span aria-hidden="true">↗</span></button>
          <div className="archive-card-front-foot"><span>*ILLUSTRATIVE CONTENT</span><span className="archive-barcode" aria-hidden="true" /></div>
        </div>
      </div>
    </div>
  </article>
}

export default function EventArchive() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const machineRef = useRef(null)
  const rotorRef = useRef(null)
  const audioRef = useRef(null)
  const soundEnabledRef = useRef(false)
  const openerRef = useRef(null)
  const browseIndexRef = useRef(1)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [browseIndex, setBrowseIndex] = useState(1)

  function browse(direction) {
    const next = Math.max(0, Math.min(events.length - 1, browseIndexRef.current + direction))
    browseIndexRef.current = next
    setBrowseIndex(next)
  }

  function openRecap(name) {
    openerRef.current = document.activeElement
    setSelectedEvent(name)
  }

  function closeRecap() {
    setSelectedEvent(null)
    window.requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }))
  }

  async function toggleSound() {
    if (soundEnabledRef.current) {
      soundEnabledRef.current = false
      setSoundEnabled(false)
      await audioRef.current?.suspend()
      return
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    try {
      audioRef.current ||= new AudioContextClass()
      await audioRef.current.resume()
      soundEnabledRef.current = true
      setSoundEnabled(true)
    } catch {
      soundEnabledRef.current = false
      setSoundEnabled(false)
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const cards = [...canvas.querySelectorAll('[data-archive-card]')]
    const inners = cards.map((card) => card.querySelector('[data-archive-inner]'))
    const actions = cards.map((card) => card.querySelector('[data-archive-action]'))
    const machine = machineRef.current
    const rotor = rotorRef.current
    const rollers = [...rotor.querySelectorAll('[data-archive-roller]')]
    const loadLights = [...rotor.querySelectorAll('[data-archive-load]')]
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let lastProgress = -1
    let lastWidth = 0
    let lastHeight = 0
    let lastBrowseIndex = -1

    function render() {
      if (motionQuery.matches) {
        section.classList.remove('is-browse-ready')
        cards.forEach((card, i) => {
          card.style.transform = ''
          card.style.opacity = ''
          card.style.zIndex = ''
          card.style.clipPath = ''
          inners[i].style.transform = ''
          actions[i].disabled = false
          actions[i].tabIndex = 0
        })
        machine.style.opacity = ''
        rotor.style.transform = ''
        rollers.forEach((roller) => { roller.style.transform = '' })
        loadLights.forEach((light) => { light.style.opacity = '' })
        return
      }

      const box = section.getBoundingClientRect()
      const scrollY = window.scrollY
      const sectionTop = box.top + scrollY
      const sectionHeight = Math.max(1, section.offsetHeight - window.innerHeight)
      const t = clamp((scrollY - sectionTop) / sectionHeight)
      if (soundEnabledRef.current && audioRef.current?.state === 'running' && t > lastProgress && t < dealEnd) {
        const released = events.some((_, i) => {
          const release = dealStart + (i + feedStart) * dealStep
          return lastProgress < release && t >= release
        })
        if (released) playDealSound(audioRef.current)
      }
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (t === lastProgress && width === lastWidth && height === lastHeight && browseIndexRef.current === lastBrowseIndex) {
        frame = requestAnimationFrame(render)
        return
      }
      lastProgress = t
      lastWidth = width
      lastHeight = height
      lastBrowseIndex = browseIndexRef.current
      section.classList.toggle('is-browse-ready', t >= .995)

      const baseWidth = 360
      const compact = width < 760
      const baseHeight = compact ? 460 : 540
      const machineScale = compact ? .72 : 1
      const machineY = height / 2
      const scale = Math.min(1, (width - (compact ? 10 : 30)) / (baseWidth * (width >= 1150 ? 3.35 : compact ? 1.13 : 2.2)), compact ? (height - 75) / (baseHeight * 1.03) : (height - 24) / baseHeight)
      const step = Math.min(baseWidth + 45, Math.max(baseWidth * .73, (width / scale - baseWidth) / 2))
      const centerX = width / 2
      const centerY = height / 2 - 4
      const rowCenter = compact && t >= .995 ? browseIndexRef.current : 1
      const row = events.map((_, i) => ({ x: centerX + (i - rowCenter) * step * scale, y: centerY }))
      const fan = events.map((_, i) => ({ x: centerX + (i - 1) * Math.min(width * .31, step * scale * .82), y: centerY + (i === 1 ? 12 : 16) * scale, rotation: (i - 1) * 18 }))
      const aimIndex = Math.min(events.length - 1, Math.max(0, Math.floor((t - dealStart) / dealStep)))
      const slotLocal = clamp((t - dealStart - aimIndex * dealStep) / dealStep)
      const previousAim = aimIndex === 0 ? 0 : aimAngles[aimIndex - 1]
      const aim = t < dealStart ? 0 : mix(previousAim, aimAngles[aimIndex], inOut(clamp(slotLocal / feedStart)))
      const rollerTurns = t < dealStart ? 0 : t >= dealEnd ? events.length : aimIndex + clamp((slotLocal - feedStart) / (feedEnd - feedStart))
      machine.style.opacity = String(1 - inOut(clamp((t - dealEnd) / (gatherEnd - dealEnd))))
      rotor.style.transform = `translate(-50%, -50%) rotate(${aim}deg)`
      rollers.forEach((roller, i) => { roller.style.transform = `rotate(${(i ? -1 : 1) * rollerTurns * 360}deg)` })
      loadLights.forEach((light, i) => { light.style.opacity = t >= dealStart + (i + feedEnd) * dealStep ? '.25' : '1' })

      cards.forEach((card, i) => {
        let x = centerX
        let y = centerY + 20 * scale
        let cardScale = .12 * scale
        let rotation = 0
        let opacity = 0
        let flip = 0
        let clip = 0
        let active = false

        if (t >= dealStart && t < dealEnd) {
          const local = clamp((t - dealStart - i * dealStep) / dealStep)
          if (local > feedStart) {
            const angle = aimAngles[i] * Math.PI / 180
            const normalX = -Math.sin(angle)
            const normalY = Math.cos(angle)
            const feedScale = Math.min(scale * .38, (compact ? 78 : 100) / baseWidth)
            const exitRadius = 150 * machineScale
            const exitX = centerX + normalX * exitRadius
            const exitY = machineY + normalY * exitRadius
            if (local < feedEnd) {
              const feed = clamp((local - feedStart) / (feedEnd - feedStart))
              const radius = mix(8 * machineScale, exitRadius, feed)
              x = centerX + normalX * radius
              y = machineY + normalY * radius
              cardScale = feedScale
              rotation = aimAngles[i]
              clip = (1 - feed) * 100
            } else {
              const flight = clamp((local - feedEnd) / (1 - feedEnd))
              const travel = out(flight)
              x = mix(exitX, fan[i].x, travel)
              y = mix(exitY, fan[i].y, travel) - Math.sin(Math.PI * travel) * 12 * scale
              cardScale = mix(feedScale, .88 * scale, travel)
              rotation = mix(aimAngles[i], fan[i].rotation, inOut(flight))
            }
            opacity = 1
          }
        } else if (t >= dealEnd && t < gatherEnd) {
          const e = inOut(clamp((t - dealEnd) / (gatherEnd - dealEnd)))
          x = mix(fan[i].x, row[i].x, e)
          y = mix(fan[i].y, row[i].y, e)
          cardScale = mix(.88 * scale, scale, e)
          rotation = mix(fan[i].rotation, 0, e)
          opacity = 1
        } else if (t >= gatherEnd) {
          x = row[i].x
          y = row[i].y
          cardScale = scale
          opacity = 1
          const slot = (1 - gatherEnd) / events.length
          const local = (t - gatherEnd - i * slot) / slot
          if (local >= 1) flip = 180
          else if (local > 0) {
            active = true
            const lift = local < .22 ? out(local / .22) : local < .72 ? 1 : 1 - inOut((local - .72) / .28)
            if (width < 760) x = mix(row[i].x, centerX, lift)
            y -= (compact ? 40 : Math.min(66, height * .09)) * scale * lift
            cardScale *= 1 + (compact ? .13 : Math.min(.13, height * .0002)) * lift
            flip = 180 * inOut(clamp((local - .22) / .24))
          }
        }

        card.style.transform = `translate3d(${x - baseWidth / 2}px, ${y - baseHeight / 2}px, 0) scale(${cardScale}) rotate(${rotation}deg)`
        card.style.transition = compact && t >= .995 ? 'transform .32s cubic-bezier(.16,1,.3,1)' : 'none'
        card.style.opacity = String(opacity)
        card.style.clipPath = clip > 0 ? `inset(${clip}% 0 0 0)` : ''
        card.style.zIndex = active ? '4' : String(i + 1)
        inners[i].style.transform = `rotateY(${flip}deg)`
        actions[i].disabled = flip < 170
        actions[i].tabIndex = flip >= 170 ? 0 : -1
      })
      frame = requestAnimationFrame(render)
    }

    function onMotionChange() {
      lastProgress = -1
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(render)
    }
    motionQuery.addEventListener('change', onMotionChange)
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      motionQuery.removeEventListener('change', onMotionChange)
      audioRef.current?.close()
    }
  }, [])

  return <section className="event-archive" ref={sectionRef} aria-labelledby="event-archive-title">
    <div className="event-archive-sticky"><div className="event-archive-shell shell">
      <Reveal className="event-archive-heading"><span className="eyebrow">03 &nbsp; PAST EVENTS</span><h2 id="event-archive-title">A record of<br /><em>what we done.</em></h2><BackgroundWord text="EVENTS" /></Reveal>
      <div className="event-archive-meta"><span>IN THE ARCHIVE</span><span>*ILLUSTRATIVE CONTENT</span></div>
      <div className="event-archive-canvas" ref={canvasRef}>
        {events.map((name, index) => <ArchiveCard key={name} name={name} index={index} onExplore={openRecap} />)}
        <div className="event-archive-machine" ref={machineRef} aria-hidden="true">
          <div className="event-archive-machine-ring" />
          <div className="event-archive-machine-body" ref={rotorRef}>
            <span className="event-archive-machine-magazine"><i /><i /><i /><b>AI BUILDERS</b></span>
            <span className="event-archive-machine-rails"><i /><i /></span>
            <span className="event-archive-machine-face"><b>AI BUILDERS / AUTO SHUFFLER</b><small>DECK DISPENSER — ARCHIVE SERIES</small><span className="event-archive-machine-load"><i data-archive-load /><i data-archive-load /><i data-archive-load /></span><span className="event-archive-machine-rollers"><i data-archive-roller /><i data-archive-roller /></span></span>
            <span className="event-archive-machine-chute" />
            <span className="event-archive-machine-slot" />
            <span className="event-archive-machine-feet"><i /><i /></span>
          </div>
        </div>
        <div className="event-archive-browse" role="group" aria-label="Browse revealed event cards"><button type="button" aria-label="Previous event card" disabled={browseIndex === 0} onClick={() => browse(-1)}>←</button><span>{String(browseIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}</span><button type="button" aria-label="Next event card" disabled={browseIndex === events.length - 1} onClick={() => browse(1)}>→</button></div>
      </div>
      <div className="event-archive-footer"><span>Recaps will live here. Past events, slides, recordings, and speaker information will be added when the club provides verified details.</span><div className="event-archive-controls"><button type="button" className="event-archive-sound" aria-label={soundEnabled ? 'Mute card distribution sounds' : 'Enable card distribution sounds'} aria-pressed={soundEnabled} onClick={toggleSound}>{soundEnabled ? 'SOUND ON' : 'SOUND OFF'}</button><span>SCROLL TO REVEAL ↓</span></div></div>
    </div></div>
    <EventRecap key={selectedEvent || 'closed'} name={selectedEvent} onDismiss={closeRecap} />
  </section>
}
