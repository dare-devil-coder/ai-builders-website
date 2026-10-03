import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { pageMeta } from '../data/pages'
import { EmptyState, PageHero, Reveal, SectionIntro } from '../components/ui/Sections'

export default function Team() { return <><PageHero meta={pageMeta.team} />
  <section className="section shell"><SectionIntro index="01" label="THE BUILDERS" title={<>People are the<br /><em>real architecture.</em></>} description="Students lead projects, run sessions, contribute code, write documentation, and help one another grow." /><EmptyState label="TEAM DIRECTORY" title="Meet the team soon." text="The club documents do not provide confirmed member names, roles, photos, faculty advisor details, or public profiles. Those will appear here once approved." /></section>
  <section className="section section-alt"><div className="shell"><SectionIntro index="02" label="WAYS TO CONTRIBUTE" title={<>There is a place<br /><em>for your skills.</em></>} /><div className="direction-grid">{[{n:'01',title:'Build',text:'Create AI systems, prototypes, interfaces, and complete products.'},{n:'02',title:'Share',text:'Document work, write tutorials, and explain what you learned.'},{n:'03',title:'Lead',text:'Help run workshops, guide projects, and grow the community.'}].map(item => <Reveal key={item.n} className="direction-card"><span className="eyebrow">{item.n} / CONTRIBUTE</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></div></section>
  <section className="section shell"><div className="inline-cta" data-watermark="LEAD"><div><span className="eyebrow">JOIN THE TEAM</span><h2>Want to help lead<br /><em>the next build?</em></h2><p>We’re looking for passionate people to help lead workshops, manage projects, and grow the community.</p></div><Link className="button button-primary" to="/join">Explore joining <ArrowUpRight size={18} /></Link></div></section>
</> }
