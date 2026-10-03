import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) { el.classList.add('in-view'); return undefined }
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { el.classList.add('in-view'); observer.disconnect() }
    }, { threshold: 0.08 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export function SectionIntro({ index, label, title, description, action }) {
  return <Reveal className="section-intro"><div><span className="eyebrow"><span className="eyebrow-index">{index}</span> {label}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <Link className="text-link" to={action.to}>{action.label} <ArrowUpRight size={18} /></Link>}</Reveal>
}

export function PageHero({ meta }) {
  return <section className="page-hero"><div className="shell"><span className="eyebrow">{meta.kicker}</span><h1>{meta.title}</h1><p>{meta.description}</p><span className="page-orbit" aria-hidden="true">✳</span></div></section>
}

// Adapted to this project after evaluating Spectrum UI's 3D Tilt Card through its MCP catalog.
export function TiltCard({ children, className = '' }) {
  const move = event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(hover: none)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty('--rx', `${-y * 5}deg`)
    event.currentTarget.style.setProperty('--ry', `${x * 5}deg`)
    event.currentTarget.style.setProperty('--glow-x', `${(x + .5) * 100}%`)
    event.currentTarget.style.setProperty('--glow-y', `${(y + .5) * 100}%`)
  }
  const reset = event => { for (const name of ['--rx', '--ry', '--glow-x', '--glow-y']) event.currentTarget.style.removeProperty(name) }
  return <article className={`tilt-card ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</article>
}

export function EmptyState({ label, title, text, to, action }) {
  return <div className="empty-state"><div className="empty-mark" aria-hidden="true"><span>+</span></div><div><span className="eyebrow">{label}</span><h3>{title}</h3><p>{text}</p></div>{to && <Link className="button button-outline" to={to}>{action} <ArrowUpRight size={17} /></Link>}</div>
}
