import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { RotateCw, X } from 'lucide-react'
import './MemberBadgeModal.css'

const EventBadge3D = lazy(() => import('../spectrumui/event_badge-3d'))

class BadgeRenderBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export default function MemberBadgeModal({ member, onClose }) {
  const closeRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduceMotion(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const root = document.getElementById('root')
    const previousOverflow = document.body.style.overflow
    const previouslyInert = root?.inert
    document.body.style.overflow = 'hidden'
    if (root) root.inert = true
    closeRef.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const controls = [...document.querySelectorAll('.member-badge-dialog button')]
      const current = controls.indexOf(document.activeElement)
      const next = event.shiftKey ? (current <= 0 ? controls.length - 1 : current - 1) : (current === controls.length - 1 ? 0 : current + 1)
      event.preventDefault()
      controls[next]?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (root) root.inert = previouslyInert
    }
  }, [onClose])

  return createPortal(<div className="member-badge-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="member-badge-dialog" role="dialog" aria-modal="true" aria-labelledby="member-badge-title" aria-describedby="member-badge-description">
      <div className="member-badge-topbar">
        <span className="eyebrow">AI BUILDERS / {member.illustrative ? 'SAMPLE MEMBER BADGE' : 'MEMBER BADGE'}</span>
        <button ref={closeRef} className="member-badge-close" type="button" onClick={onClose} aria-label="Close member details"><X size={22} /></button>
      </div>
      <h2 id="member-badge-title" className="sr-only">{member.name} member badge</h2>
      <p id="member-badge-description" className="sr-only">{member.role}. {member.description}{member.illustrative ? ' This is an illustrative member profile.' : ''}</p>
      <div className="member-badge-stage">
        {reduceMotion ? <img className="member-badge-static" src={flipped ? member.badgeBack : member.badgeFront} alt={flipped ? 'AI Builders club artwork on the back of the member badge' : `Badge front for ${member.name}`} /> :
          <BadgeRenderBoundary fallback={<img className="member-badge-static" src={flipped ? member.badgeBack : member.badgeFront} alt="Member badge artwork" />}>
            <Suspense fallback={<img className="member-badge-static" src={member.badgeFront} alt="Loading member badge" />}><EventBadge3D flipped={flipped} frontImage={member.badgeFront} backImage={member.badgeBack} /></Suspense>
          </BadgeRenderBoundary>}
      </div>
      <div className="member-badge-actions">
        <span>{flipped ? '02 / BACK' : '01 / FRONT'}</span>
        <button className="button member-badge-flip" type="button" onClick={() => setFlipped(value => !value)}><RotateCw size={18} />{flipped ? 'Show front' : 'Show back'}</button>
        <span className="member-badge-hint">DRAG THE CARD · ESC TO CLOSE</span>
      </div>
    </div>
  </div>, document.body)
}
