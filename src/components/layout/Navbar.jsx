import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navLinks } from '../../data/site'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { const id = setTimeout(() => setOpen(false), 0); return () => clearTimeout(id) }, [location.pathname])
  useEffect(() => {
    if (!open) return undefined
    const onKey = event => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <nav className="nav-wrap" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="AI Builders home"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span><span>AI<span className="brand-light">Builders</span></span></Link>
        <div className="desktop-links">{navLinks.map(link => <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>{link.label}</NavLink>)}</div>
        <Link className="nav-cta" to="/join">Join the club <ArrowUpRight size={16} /></Link>
        <button className="menu-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={23} /> : <Menu size={23} />}</button>
      </nav>
      {open && <div id="mobile-navigation" className="mobile-navigation">{navLinks.map(link => <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink>)}<NavLink to="/join" onClick={() => setOpen(false)}>Join the club <ArrowUpRight size={17} /></NavLink></div>}
    </header>
  </>
}
