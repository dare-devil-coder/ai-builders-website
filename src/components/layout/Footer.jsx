import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { navLinks } from '../../data/site'

export default function Footer() {
  const footerRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      gsap.fromTo('.footer-watermark', { yPercent: 25, opacity: .3 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: footerRef.current, start: 'top bottom', end: 'bottom bottom', scrub: .7 } })
      gsap.fromTo('.footer-main', { y: 60, opacity: .5 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: footerRef.current, start: 'top 85%', once: true } })
    }, footerRef)
    return () => context.revert()
  }, [])
  return <footer ref={footerRef} className="site-footer cinematic-footer"><div className="shell">
    <div className="footer-main"><div><span className="eyebrow">AI BUILDERS / UNIVERSAL AI UNIVERSITY</span><h2>Make something<br /><em>that matters.</em></h2><p>A student-led AI and development club in Mumbai, India.</p><Link className="text-link" to="/join">Join AI Builders <ArrowUpRight size={18} /></Link></div><div className="footer-links"><span className="eyebrow">EXPLORE</span>{navLinks.map(link => <Link key={link.to} to={link.to}>{link.label}</Link>)}<Link to="/join">Join / Contact</Link></div></div>
    <div className="footer-watermark-band" aria-hidden="true"><span className="footer-watermark">AI BUILDERS</span></div>
    <div className="footer-bottom"><Link to="/" className="footer-wordmark">AI  BUILDERS</Link><span>Learn · Build · Ship · Contribute</span><span>© {new Date().getFullYear()} AI Builders</span></div>
  </div></footer>
}
