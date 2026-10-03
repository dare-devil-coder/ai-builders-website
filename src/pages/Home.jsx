import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { approach, clubStats, featuredProjects, pillars } from '../data/site'
import { Reveal, SectionIntro, TiltCard } from '../components/ui/Sections'
import BuildConstellation from '../components/ui/BuildConstellation'
import AnimatedCard from '../components/spectrumui/AnimatedCard'
import EventPassport from '../components/ui/EventPassport'

function ScrollPanel({ children, tone = '' }) {
  return <div className={`scroll-panel ${tone}`}><div className="section-stage"><div className="section-inner">{children}</div></div></div>
}

export default function Home() {
  return <div className="home-page">
    <ScrollPanel>
      <section className="hero"><div className="hero-noise" aria-hidden="true" /><div className="shell hero-grid"><div className="hero-copy"><span className="eyebrow hero-kicker"><span className="status-dot" /> THE OFFICIAL AI & DEVELOPMENT CLUB OF UAI</span><h1>We don’t just<br /><span className="hero-serif">study AI.</span><br /><strong>We build it<span className="period">.</span></strong></h1><p>AI Builders is the official AI & development club of Universal AI University — where students ship real projects, contribute to open source, and push the boundaries of what’s possible with artificial intelligence.</p><div className="hero-actions"><Link to="/projects" className="button button-primary">Explore our work <ArrowUpRight size={18} /></Link><Link to="/join" className="button button-outline">Join the club <ArrowUpRight size={18} /></Link></div><a href="#what-we-do" className="scroll-cue">SCROLL TO EXPLORE <ArrowDown size={16} /></a></div><BuildConstellation /></div><div className="hero-bottom shell"><span>UNIVERSAL AI UNIVERSITY / MUMBAI</span><span>LEARN · BUILD · SHIP · CONTRIBUTE</span></div></section>
      <div className="ticker" aria-label="Our focus areas"><div className="ticker-track">{[0, 1].map(copy => <div key={copy} aria-hidden={copy === 1} className="ticker-set">{['AI PROJECTS','AI AGENTS','LLMs','RAG PIPELINES','API INTEGRATION','OPEN SOURCE','WORKSHOPS','DEVELOPMENT'].map(item => <span key={item}>{item}<b>✳</b></span>)}</div>)}</div></div>
    </ScrollPanel>

    <ScrollPanel>
      <section id="what-we-do" className="section shell"><SectionIntro index="01" label="WHO WE ARE" title={<>A community of people<br />who <em>make things real.</em></>} /><div className="about-snapshot"><Reveal><p>We are a student-led community of builders, researchers, and contributors at Universal AI University. We build AI systems that solve real problems — from intelligent agents to retrieval-augmented pipelines — and we do it in the open.</p><Link to="/about" className="text-link">More about the club <ArrowUpRight size={18} /></Link></Reveal><div className="stats-grid" aria-label="Club statistics">{clubStats.map((stat, index) => <div className="stat-cell" key={stat.label}><span className="stat-index">0{index + 1} / CLUB</span><strong aria-label={stat.value == null ? `${stat.label} count not yet published` : undefined}>{stat.value ?? '—'}</strong><span>{stat.label}</span></div>)}<p className="stats-note">Verified totals will appear when the club provides them.</p></div></div></section>
    </ScrollPanel>

    <ScrollPanel tone="alt-panel">
      <section className="section section-alt"><div className="shell"><SectionIntro index="02" label="WHAT WE EXPLORE" title={<>Eight ways to<br /><em>keep building.</em></>} description="From models and agents to complete products, our work crosses disciplines." action={{ label: 'Explore our approach', to: '/about' }} /><div className="pillar-grid">{pillars.map(pillar => <Reveal key={pillar.id}><TiltCard className="pillar-card"><div className="pillar-top"><span>{pillar.id} / FOCUS</span><span className="pillar-icon">{pillar.icon}</span></div><h3>{pillar.title}</h3><p>{pillar.text}</p><MoveUpRight size={19} className="pillar-arrow" /></TiltCard></Reveal>)}</div></div></section>
    </ScrollPanel>

    <ScrollPanel>
      <section className="section shell"><SectionIntro index="03" label="HOW WE WORK" title={<>A simple loop.<br /><em>Real momentum.</em></>} description="Our approach moves ideas beyond the classroom." /><div className="approach-grid">{approach.map(step => <Reveal key={step.number} className="approach-item"><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div></section>
    </ScrollPanel>

    <ScrollPanel tone="proof-panel-bg">
      <section className="section proof-section"><div className="shell"><SectionIntro index="04" label="THE WORK" title={<>Work worth<br /><em>sharing.</em></>} description="Each project will have its own story, team, technology, and public source link." /><div className="featured-projects">{featuredProjects.map(project => <AnimatedCard key={project.id} project={project} />)}</div><div className="projects-footnote"><p>Project names and links are pending confirmation from the club.</p><Link className="text-link" to="/projects">See project gallery <ArrowUpRight size={18} /></Link></div></div></section>
    </ScrollPanel>

    <ScrollPanel>
      <EventPassport />
    </ScrollPanel>

    <section className="join-banner"><div className="shell"><span className="eyebrow">YOUR NEXT BUILD STARTS HERE</span><h2>Ready to build<br /><em>something real?</em></h2><p>Whether you’re just starting out or already shipping projects, there’s a place for you in AI Builders.</p><Link className="button button-light" to="/join">Join AI Builders <ArrowUpRight size={18} /></Link></div></section>
  </div>
}
