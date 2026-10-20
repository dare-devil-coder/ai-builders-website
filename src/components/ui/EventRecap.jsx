import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './EventRecap.css'

const sampleThemes = ['Prompt engineering', 'Prototyping', 'Creative AI', 'Ideation', 'Collaboration']
const sampleExplored = [
  'How to move from a raw idea to a working prototype using AI tools',
  'Crafting prompts that unlock creative possibilities beyond the obvious',
  'Collaboration workflows between human creativity and AI generation',
  'Building with first prompts — no prior ML or coding experience required',
]

export default function EventRecap({ name, onDismiss }) {
  const dialogRef = useRef(null)
  const closeTimer = useRef(null)
  const [closing, setClosing] = useState(false)
  const isSample = name === 'After the Prompt'

  useEffect(() => {
    if (!name) return undefined
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    dialog.querySelector('.event-recap-back')?.focus({ preventScroll: true })
    return () => {
      window.clearTimeout(closeTimer.current)
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [name])

  function close() {
    if (closing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDismiss()
      return
    }
    setClosing(true)
    closeTimer.current = window.setTimeout(onDismiss, 210)
  }

  const content = <dialog ref={dialogRef} className={`event-recap${closing ? ' is-closing' : ''}`} aria-labelledby="event-recap-title" onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }}>
    {name && <div className="event-recap-sheet">
      <header className="event-recap-hero">
        <div className="event-recap-toolbar"><button type="button" className="event-recap-back" onClick={close}>‹ <span>Back to archive</span></button><span className="event-recap-topic">{isSample ? 'Creative AI' : 'Sample event'}</span></div>
        <div className="event-recap-hero-copy"><span>{isSample ? 'WORKSHOP / RECAP   14 SEP 2026*' : 'ARCHIVE / SAMPLE   DATE TO CONFIRM'}</span><h2 id="event-recap-title">{name}</h2></div>
      </header>
      <div className="event-recap-section event-recap-about"><span className="event-recap-label">ABOUT THIS EVENT</span><p>{isSample ? 'AI Builders is Universal AI University’s AI and development club. From first prompts to working prototypes, we explore creative AI together. This session — After the Prompt — dived into what happens after your idea lands: turning a raw concept into something real.' : 'This is an illustrative archive card. The club will add the event overview after its details are confirmed.'}</p><small>*ILLUSTRATIVE CONTENT &amp; DATE — SAMPLE EVENT</small></div>
      <div className="event-recap-section"><span className="event-recap-label">EVENT DETAILS</span><dl className="event-recap-facts"><div><dt>FORMAT</dt><dd>{isSample ? 'WORKSHOP / RECAP' : 'TO BE CONFIRMED'}</dd></div><div><dt>TOPIC</dt><dd>{isSample ? 'CREATIVE AI' : 'TO BE CONFIRMED'}</dd></div><div><dt>HOSTED BY</dt><dd>{isSample ? 'AI BUILDERS — UAI UNIV.*' : 'TO BE CONFIRMED'}</dd></div><div><dt>DATE</dt><dd>{isSample ? '14 SEP 2026*' : 'TO BE CONFIRMED'}</dd></div></dl></div>
      <div className="event-recap-section"><span className="event-recap-label">KEY THEMES</span>{isSample ? <div className="event-recap-themes">{sampleThemes.map(theme => <span key={theme}>{theme}</span>)}</div> : <p className="event-recap-pending">Themes will be added when the club confirms this event.</p>}</div>
      <div className="event-recap-section"><span className="event-recap-label">WHAT WE EXPLORED</span>{isSample ? <ul className="event-recap-explored">{sampleExplored.map(point => <li key={point}>{point}</li>)}</ul> : <p className="event-recap-pending">Session notes have not been provided yet.</p>}<small>*ILLUSTRATIVE CONTENT — SAMPLE EVENT</small></div>
      <div className="event-recap-section"><span className="event-recap-label">RESOURCES</span><p className="event-recap-pending">Placeholder entries for event materials and links. Actual resources will be added when available.</p><div className="event-recap-resource"><div><span>PRESENTATION SLIDES</span><span>PENDING</span></div><p>Slides and speaker notes will appear here when provided.</p></div><div className="event-recap-resource"><div><span>PROJECT / CODE MATERIALS</span><span>PENDING</span></div><p>Project references and code materials will appear here when provided.</p></div><small>*ILLUSTRATIVE CONTENT — SAMPLE EVENT</small></div>
      <footer className="event-recap-foot"><span>*ILLUSTRATIVE CONTENT &amp; DATE — CLUB ARCHIVE</span><span className="archive-barcode" aria-hidden="true" /></footer>
    </div>}
  </dialog>

  return createPortal(content, document.body)
}
