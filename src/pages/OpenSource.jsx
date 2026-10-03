import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { pageMeta } from '../data/pages'
import { EmptyState, PageHero, Reveal, SectionIntro } from '../components/ui/Sections'

const steps = [
  { number: '01', title: 'Fork', text: 'Fork the repository you want to work on.' },
  { number: '02', title: 'Clone', text: 'Clone it locally and follow the README to set up your environment.' },
  { number: '03', title: 'Pick an issue', text: 'Look for a good-first-issue or help-wanted label.' },
  { number: '04', title: 'Open a PR', text: 'Make your change, write a clear commit message, and open a pull request.' },
]
export default function OpenSource() { return <><PageHero meta={pageMeta.openSource} />
  <section className="section shell"><SectionIntro index="01" label="WHY OPEN SOURCE" title={<>Build it.<br /><em>Make it useful to others.</em></>} /><Reveal className="wide-statement"><p>We believe in building in public. Our projects are open source, our code is on GitHub, and we contribute to the broader open-source AI ecosystem.</p></Reveal></section>
  <section className="section section-alt"><div className="shell"><SectionIntro index="02" label="CONTRIBUTION GUIDE" title={<>Your first pull request<br /><em>starts here.</em></>} /><div className="approach-grid">{steps.map(step => <Reveal key={step.number} className="approach-item"><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div></div></section>
  <section className="section shell"><SectionIntro index="03" label="CLUB REPOSITORIES" title={<>Find the right<br /><em>place to begin.</em></>} /><EmptyState label="REPOSITORIES & GOOD FIRST ISSUES" title="Links are being prepared." text="The club’s GitHub organization, repository links, issues, and contributor names are placeholders in the source document. Verified links will be added here." to="/join" action="Connect with the club" /></section>
  <section className="section section-alt"><div className="shell inline-cta"><div><span className="eyebrow">CONTRIBUTOR COMMUNITY</span><h2>Small changes.<br /><em>Shared progress.</em></h2><p>Questions, documentation, fixes, and code all help a project move forward.</p></div><Link className="button button-primary" to="/join">Join the community <ArrowUpRight size={18} /></Link></div></section>
</> }
