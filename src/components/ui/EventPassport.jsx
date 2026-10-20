import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, CalendarDays, Clock3, CodeXml, MapPin, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { nextEvent } from '../../data/site'
import CardFlip from '../kokonutui/card-flip'
import Flashlight from './Flashlight'
import './EventPassport.css'
import './TorchReveal.css'

const bars = [2, 1, 1, 3, 2, 1, 4, 1, 2, 2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 1, 4, 2, 2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1, 1, 4]
const barcode = bars.reduce((items, width, index) => {
  const x = index === 0 ? 0 : items[index - 1].x + items[index - 1].width + 2
  items.push({ x, width })
  return items
}, [])

function remaining(startsAt, now) {
  if (!startsAt) return null
  const milliseconds = new Date(startsAt).getTime() - now
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return null
  const seconds = Math.floor(milliseconds / 1000)
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
}

export default function EventPassport({ immediateOnEnter = false }) {
  const [now, setNow] = useState(() => Date.now())
  const [flipped, setFlipped] = useState(false)
  const [cardHeight, setCardHeight] = useState(660)
  const frontFace = useRef(null)
  const backFace = useRef(null)
  const [isLit, setIsLit] = useState(false)
  const [isTorchOn, setIsTorchOn] = useState(true)
  const [isTorchReady, setIsTorchReady] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (immediateOnEnter || entry.intersectionRatio >= 0.35)) setIsLit(true)
        if (!entry.isIntersecting) {
          setIsLit(false)
          setIsTorchReady(false)
          setIsTorchOn(true)
          setFlipped(false)
        }
      },
      { threshold: [0, 0.35] },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [immediateOnEnter])

  useEffect(() => {
    if (!isLit) return undefined
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setIsTorchReady(true), prefersReducedMotion ? 0 : 1700)
    return () => window.clearTimeout(timer)
  }, [isLit])

  useEffect(() => {
    if (!nextEvent.startsAt) return undefined
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const measure = () => {
      const front = frontFace.current
      const back = backFace.current
      if (!front || !back) return
      const frontContent = front.querySelector('.event-card-bottom')
      const backContent = back.querySelector('.event-card-details')
      const padding = window.innerWidth <= 600 ? 50 : 82
      const backNeeded = back.querySelector('.event-card-top').scrollHeight + backContent.scrollHeight + padding + 65
      const frontNeeded = front.querySelector('.event-card-top').scrollHeight + frontContent.scrollHeight + padding + 155
      setCardHeight(Math.ceil(Math.max(600, frontNeeded, backNeeded)))
    }
    const frame = requestAnimationFrame(measure)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    for (const element of [frontFace.current?.querySelector('.event-card-bottom'), backFace.current?.querySelector('.event-card-details'), frontFace.current?.querySelector('.event-card-top'), backFace.current?.querySelector('.event-card-top')]) {
      if (element) observer?.observe(element)
    }
    window.addEventListener('resize', measure)
    document.fonts.ready.then(measure)
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  const countdown = remaining(nextEvent.startsAt, now)
  const dateLabel = nextEvent.startsAt && Number.isFinite(new Date(nextEvent.startsAt).getTime())
    ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(nextEvent.startsAt))
    : 'Date to be announced'
  const venueLabel = nextEvent.venue || 'Venue to be announced'
  const formatLabel = nextEvent.type || 'Workshop / Talk / Hackathon'
  const title = nextEvent.title || 'The next build session'
  return <section ref={sectionRef} className={`upcoming-event event-section ${isLit ? 'is-lit' : ''} ${isTorchReady ? 'torch-ready' : ''} ${isTorchOn ? '' : 'light-off'}`} aria-labelledby="upcoming-event-title">
    <div className="event-access-head"><div className="event-access-brand"><CodeXml aria-hidden="true" /><span>AI BUILDERS / EVENT ACCESS</span></div><span className="event-access-admit"><i aria-hidden="true" /> ADMIT CURIOSITY</span></div>
    <div className="event-access-main">
      <div className="event-access-copy">
        <div className="event-access-kicker"><span aria-hidden="true" /> <strong>UPCOMING EVENTS</strong><span className="event-access-crumb">/ NEXT EVENT / PREVIEW</span></div>
        <h2 id="upcoming-event-title">{nextEvent.title || <>The next<br /><em>build session.</em></>}</h2>
        <p>{nextEvent.description || 'The topic, date, and registration details will be published once the next event is confirmed.'}</p>
        <div className="event-access-facts"><span><CalendarDays aria-hidden="true" />{dateLabel}</span><span><MapPin aria-hidden="true" />{venueLabel}</span></div>
        <div className="event-access-tags">{(nextEvent.type ? [nextEvent.type] : ['Workshop', 'Talk', 'Hackathon']).map(type => <span key={type}>{type}</span>)}</div>
        {nextEvent.registrationUrl
          ? <a className="event-access-link" href={nextEvent.registrationUrl} target="_blank" rel="noreferrer">Register now <ArrowUpRight aria-hidden="true" /></a>
          : <Link className="event-access-link" to="/events">Explore events <ArrowUpRight aria-hidden="true" /></Link>}
      </div>
      <div className="visual-stage"><div className="darkness-label"><span className="darkness-dot" /> WAITING FOR LIGHT</div><div className="ticket-wrap" inert={!isTorchReady || !isTorchOn} aria-hidden={!isTorchReady || !isTorchOn}><div className="ticket-glow" aria-hidden="true" /><CardFlip className="event-flip-card" style={{ height: cardHeight }} flipped={flipped} onFlippedChange={setFlipped} label="AI Builders event pass" front={
          <div ref={frontFace} className="event-card-face event-card-front">
            <div className="event-card-top"><span>COUNTDOWN / IST</span><Ticket aria-hidden="true" /></div>
            <div className="event-card-center">{countdown
              ? <div className="event-countdown">{countdown.map((value, index) => <div key={['days', 'hours', 'minutes', 'seconds'][index]}><strong>{String(value).padStart(2, '0')}</strong><span>{['DAYS', 'HRS', 'MIN', 'SEC'][index]}</span></div>)}</div>
              : <strong className="event-tba">TBA</strong>}</div>
            <div className="event-card-bottom"><svg viewBox="0 0 158 44" preserveAspectRatio="none" aria-hidden="true">{barcode.map((bar, index) => <rect key={index} x={bar.x} y={index % 7 === 0 ? 5 : 0} width={bar.width} height={index % 5 === 0 ? 31 : 38} />)}</svg><div className="event-barcode-caption"><span>AI BUILDERS / EVENT PASS</span><span>{nextEvent.startsAt ? 'ACCESS PREVIEW' : 'DETAILS PENDING'}</span></div><div className="event-card-divider" /><p className="event-countdown-note"><Clock3 aria-hidden="true" />{nextEvent.startsAt ? 'Until the next event begins' : 'Countdown starts when the date is announced'}</p><span className="event-flip-hint" aria-hidden="true">TAP OR DRAG TO REVEAL DETAILS <span>↗</span></span></div>
          </div>
        } back={
          <div ref={backFace} className="event-card-face event-card-back">
            <div className="event-card-top"><span>EVENT DETAILS / IST</span><Ticket aria-hidden="true" /></div>
            <div className="event-card-details"><div className="event-detail-title"><span>EVENT TITLE</span><h3>{title}</h3></div><dl><div><dt>DATE</dt><dd>{dateLabel}</dd></div><div><dt>VENUE</dt><dd>{venueLabel}</dd></div><div><dt>FORMAT</dt><dd>{formatLabel}</dd></div><div><dt>TOPIC</dt><dd>{nextEvent.description || 'Topic to be published once the next event is confirmed'}</dd></div><div><dt>REGISTRATION</dt><dd>{nextEvent.registrationUrl ? <a href={nextEvent.registrationUrl} target="_blank" rel="noreferrer">Registration is open ↗</a> : 'Registration details will be published once the next event is confirmed'}</dd></div></dl></div>
            <span className="event-flip-hint event-flip-back" aria-hidden="true">TAP OR DRAG TO RETURN <span>↗</span></span>
          </div>
        } /></div></div>
    </div>
    <Flashlight isOn={isTorchOn} isReady={isTorchReady} onToggle={() => setIsTorchOn(current => !current)} />
    <div className="light-beam" aria-hidden="true" /><div className="ground-line" aria-hidden="true" />
    <div className="event-access-foot"><span>WORKSHOP / TALK / HACKATHON</span><span><i aria-hidden="true" /> THE NEXT CHAPTER IS LOADING</span></div>
  </section>
}
