import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { pageMeta } from '../data/pages'
import ProjectDossier from '../components/ui/ProjectDossier'
import { PageHero, Reveal, SectionIntro } from '../components/ui/Sections'
import { BackgroundWord } from '../components/ui/SiteEffects'
import GridPattern from '../components/ui/GridPattern'

export default function Projects() { return <><PageHero meta={pageMeta.projects} mascot />
  <ProjectDossier />
  <section className="section section-alt has-section-grid"><GridPattern animated className="section-grid--quiet" /><div className="shell"><SectionIntro className="projects-intro-directions" index="02" label="BUILD DIRECTIONS" title={<>Where ideas<br /><em>can go.</em></>} /><div className="direction-grid">{[{n:'01',title:'AI Agents',text:'Systems that can reason, plan, and work with tools.'},{n:'02',title:'LLMs & RAG',text:'Useful applications grounded in relevant knowledge.'},{n:'03',title:'APIs & Products',text:'Connected, deployable software around real problems.'}].map(item => <Reveal key={item.n} className="direction-card"><span className="eyebrow">{item.n} / DIRECTION</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></div></section>
  <section className="section shell"><div className="inline-cta has-inline-watermark"><BackgroundWord text="OPEN" /><div><span className="eyebrow">OPEN SOURCE</span><h2>See something you<br /><em>want to improve?</em></h2><p>Fork a repo, pick up an issue, and send a pull request when club repositories are published.</p></div><Link className="button button-primary" to="/open-source">How to contribute <ArrowUpRight size={18} /></Link></div></section>
</> }
