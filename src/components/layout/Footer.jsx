import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { navLinks } from '../../data/site'

function FooterBrand({ className = '' }) {
  return <span className={`footer-brand ${className}`} aria-label="AI Builders">
    <span aria-hidden="true">A</span><span className="footer-brand-i" aria-hidden="true"><span className="footer-brand-stem">ı</span><span className="footer-brand-dot" /></span><span aria-hidden="true"> Builders</span>
  </span>
}

export default function Footer() {
  const footerRef = useRef(null)
  const watermarkRef = useRef(null)

  useEffect(() => {
    const updateDot = () => {
      const footer = footerRef.current
      const watermark = watermarkRef.current
      if (!footer || !watermark) return
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const startScroll = Math.max(0, footer.offsetTop - window.innerHeight * 0.72)
      const progress = Math.min(1, Math.max(0, (window.scrollY - startScroll) / Math.max(maxScroll - startScroll, 1)))
      const eased = 1 - Math.pow(1 - progress, 2.2)
      footer.style.setProperty('--footer-dot-rise', `${(-6.5 * (1 - eased)).toFixed(3)}em`)
      footer.style.setProperty('--footer-dot-scale', (28 - 27 * eased).toFixed(3))
      footer.style.setProperty('--footer-dot-opacity', progress > 0.04 ? '1' : '0')
    }

    updateDot()
    window.addEventListener('scroll', updateDot, { passive: true })
    window.addEventListener('resize', updateDot)
    return () => {
      window.removeEventListener('scroll', updateDot)
      window.removeEventListener('resize', updateDot)
    }
  }, [])

  return <footer ref={footerRef} className="site-footer">
    <div className="footer-art" aria-hidden="true">
      <img className="footer-art-top" src="/Footer_left_top.png" alt="" />
      <img className="footer-art-bottom" src="/Footer_bottom_right.png" alt="" />
    </div>
    <div className="shell">
    <div className="footer-main"><div><span className="eyebrow">AI BUILDERS / UNIVERSAL AI UNIVERSITY</span><h2>Make something<br /><em>that matters.</em></h2><p>A student-led AI and development club in Mumbai, India.</p><Link className="text-link" to="/join">Join AI Builders <ArrowUpRight size={18} /></Link></div><div className="footer-links"><span className="eyebrow">EXPLORE</span>{navLinks.map(link => <Link key={link.to} to={link.to}>{link.label}</Link>)}<Link to="/join">Join / Contact</Link></div></div>
    <div ref={watermarkRef} className="footer-watermark-band" aria-hidden="true"><FooterBrand className="footer-watermark" /></div>
    <div className="footer-bottom"><Link to="/" className="footer-wordmark"><FooterBrand className="footer-brand--static" /></Link><span>Learn · Build · Ship · Contribute</span><span>© {new Date().getFullYear()} AI Builders</span></div>
  </div></footer>
}
