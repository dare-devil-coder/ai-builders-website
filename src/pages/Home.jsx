import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clubStats, pillars } from '../data/site'
import { Reveal, SectionIntro, TiltCard } from '../components/ui/Sections'
import BuildConstellation from '../components/ui/BuildConstellation'
import EventPassport from '../components/ui/EventPassport'
import { ApproachMorph, FolderReveal, KineticType } from '../components/ui/MotionPieces'
import { BackgroundRipple, BackgroundWord, HeroKineticBuild, TextFlippingBoard, WaveText, WordGenerate } from '../components/ui/SiteEffects'
import InfiniteRibbon from '../components/ui/InfiniteRibbon'

function ScrollPanel({ children, tone = '' }) {
  return <div className={`scroll-panel ${tone}`}><div className="section-stage"><div className="section-inner">{children}</div></div></div>
}

export default function Home() {
  return <div className="home-page">
    <ScrollPanel>
      <section className="hero"><div className="hero-noise" aria-hidden="true" /><BackgroundRipple /><div className="shell hero-grid"><div className="hero-copy"><span className="eyebrow hero-kicker"><span className="status-dot" /> THE OFFICIAL AI & DEVELOPMENT CLUB OF UAI</span><HeroKineticBuild /><WordGenerate text="AI Builders is the official AI & development club of Universal AI University — where students ship real projects, contribute to open source, and push the boundaries of what’s possible with artificial intelligence." /><div className="hero-actions"><Link to="/projects" className="button button-primary">Explore our work <ArrowUpRight size={18} /></Link><Link to="/join" className="button button-outline">Join the club <ArrowUpRight size={18} /></Link></div><a href="#what-we-do" className="scroll-cue">SCROLL TO EXPLORE <ArrowDown size={16} /></a></div><BuildConstellation /></div><div className="hero-bottom shell"><span>UNIVERSAL AI UNIVERSITY / MUMBAI</span><div className="hero-wave-words"><WaveText>LEARN</WaveText><WaveText>BUILD</WaveText><WaveText>GROW</WaveText><WaveText>CONTRIBUTE</WaveText></div></div></section>
      <InfiniteRibbon items={['AI PROJECTS','AI AGENTS','LLMs','RAG PIPELINES','API INTEGRATION','OPEN SOURCE','WORKSHOPS','DEVELOPMENT']} />
    </ScrollPanel>

    <ScrollPanel>
      <section id="what-we-do" className="section shell"><SectionIntro index="01" label="WHO WE ARE" title={<>A community of people<br />who <em>make things real.</em></>} watermark="WHO" className="home-intro-who" /><div className="about-snapshot"><Reveal><KineticType text="We are a student-led community of builders, researchers, and contributors at Universal AI University. We build AI systems that solve real problems — from intelligent agents to retrieval-augmented pipelines — and we do it in the open." /><Link to="/about" className="text-link">More about the club <ArrowUpRight size={18} /></Link></Reveal><TextFlippingBoard stats={clubStats} /></div></section>
    </ScrollPanel>

    <ScrollPanel tone="alt-panel">
      <section className="section section-alt"><div className="shell"><SectionIntro index="02" label="WHAT WE EXPLORE" title={<>Eight ways to<br /><em>keep building.</em></>} description="From models and agents to complete products, our work crosses disciplines." action={{ label: 'Explore our approach', to: '/about' }} className="home-intro-explore" /><div className="pillar-grid">{pillars.map(pillar => <Reveal key={pillar.id}><TiltCard className="pillar-card"><div className="pillar-top"><span>{pillar.id} / FOCUS</span><span className="pillar-icon">{pillar.icon}</span></div><h3>{pillar.title}</h3><p>{pillar.text}</p><MoveUpRight size={19} className="pillar-arrow" /></TiltCard></Reveal>)}</div></div></section>
    </ScrollPanel>

    <ScrollPanel>
      <section className="section shell"><SectionIntro index="03" label="HOW WE WORK" title={<>A simple loop.<br /><em>Real momentum.</em></>} description="Our approach moves ideas beyond the classroom." watermark="WORK" className="home-intro-how" /><ApproachMorph /></section>
    </ScrollPanel>

    <ScrollPanel tone="proof-panel-bg">
      <section className="section proof-section"><BackgroundWord text="WORK" /><div className="shell work-showcase"><div><SectionIntro index="04" label="THE WORK" title={<>Work worth<br /><em>sharing.</em></>} description="Each project will have its own story, team, technology, and public source link." watermark={false} motionManaged /><Link className="button button-primary work-gallery-button" to="/projects">See project gallery <ArrowUpRight size={18} /></Link></div><FolderReveal /></div></section>
    </ScrollPanel>

    <ScrollPanel tone="event-panel">
      <EventPassport />
    </ScrollPanel>

    <section className="join-banner"><BackgroundWord text="JOIN" /><div className="shell"><span className="eyebrow">YOUR NEXT BUILD STARTS HERE</span><h2>Ready to build<br /><em>something real?</em></h2><p>Whether you’re just starting out or already shipping projects, there’s a place for you in AI Builders.</p><Link className="button button-light" to="/join">Join AI Builders <ArrowUpRight size={18} /></Link></div></section>
  </div>
}
