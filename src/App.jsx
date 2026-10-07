import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { flushSync } from 'react-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Events from './pages/Events'
import Team from './pages/Team'
import Blog from './pages/Blog'
import OpenSource from './pages/OpenSource'
import Join from './pages/Join'
import useSiteMotion from './hooks/useSiteMotion'
import { PagePreloader } from './components/ui/MotionPieces'
import { TracingBeam } from './components/ui/SiteEffects'
import SmoothCursor from './components/ui/SmoothCursor'
import './components/ui/RequestedMotion.css'

function Site() {
  const location = useLocation()
  const navigate = useNavigate()
  useSiteMotion(location.pathname)
  useEffect(() => {
    const onLink = event => {
      if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest('a[href]')
      if (!link || link.origin !== window.location.origin || link.target || link.hasAttribute('download')) return
      const next = new URL(link.href)
      if (next.pathname === location.pathname || next.hash) return
      event.preventDefault()
      document.startViewTransition(() => flushSync(() => navigate(next.pathname + next.search)))
    }
    document.addEventListener('click', onLink, true)
    return () => document.removeEventListener('click', onLink, true)
  }, [location.pathname, navigate])
  useEffect(() => {
    const titles = { '/': 'AI Builders | Universal AI University', '/about': 'About | AI Builders', '/projects': 'Projects | AI Builders', '/events': 'Events | AI Builders', '/team': 'Team | AI Builders', '/blog': 'Resources | AI Builders', '/open-source': 'Open Source | AI Builders', '/join': 'Join Us | AI Builders' }
    document.title = titles[location.pathname] || 'Page not found | AI Builders'
  }, [location.pathname])
  return <><SmoothCursor /><PagePreloader /><TracingBeam /><Navbar /><main id="main-content"><Routes>
    <Route path="/" element={<Home />} /><Route path="/about" element={<About />} />
    <Route path="/projects" element={<Projects />} /><Route path="/events" element={<Events />} />
    <Route path="/team" element={<Team />} /><Route path="/blog" element={<Blog />} />
    <Route path="/open-source" element={<OpenSource />} /><Route path="/join" element={<Join />} />
    <Route path="*" element={<section className="shell page-hero"><span className="eyebrow">404 / LOST SIGNAL</span><h1>That page isn’t here.</h1><Link className="button button-primary" to="/">Back home</Link></section>} />
  </Routes></main><Footer /></>
}
export default function App() { return <BrowserRouter><Site /></BrowserRouter> }
