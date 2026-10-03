import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { navLinks } from '../../data/site'

export default function Footer() {
  return <footer className="site-footer"><div className="footer-watermark" aria-hidden="true">AI BUILDERS</div><div className="shell">
    <div className="footer-main"><div><span className="eyebrow">AI BUILDERS / UNIVERSAL AI UNIVERSITY</span><h2>Make something<br /><em>that matters.</em></h2><p>A student-led AI and development club in Mumbai, India.</p><Link className="text-link" to="/join">Join AI Builders <ArrowUpRight size={18} /></Link></div><div className="footer-links"><span className="eyebrow">EXPLORE</span>{navLinks.map(link => <Link key={link.to} to={link.to}>{link.label}</Link>)}<Link to="/join">Join / Contact</Link></div></div>
    <div className="footer-bottom"><Link to="/" className="footer-wordmark">AI / BUILDERS</Link><span>Learn · Build · Ship · Contribute</span><span>© {new Date().getFullYear()} AI Builders</span></div>
  </div></footer>
}
