import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { pageMeta } from '../data/pages'
import { EmptyState, PageHero, Reveal, SectionIntro } from '../components/ui/Sections'
import { BackgroundWord } from '../components/ui/SiteEffects'
import ContributionMorph from '../components/ui/ContributionMorph'

export default function OpenSource() { return <><PageHero meta={pageMeta.openSource} />
  <section className="section shell"><SectionIntro className="open-source-intro-why" index="01" label="WHY OPEN SOURCE" title={<>Build it.<br /><em>Make it useful to others.</em></>} /><Reveal className="wide-statement"><p>We believe in building in public. Our projects are open source, our code is on GitHub, and we contribute to the broader open-source AI ecosystem.</p></Reveal></section>
  <section className="section section-alt"><div className="shell"><SectionIntro className="open-source-intro-guide" index="02" label="CONTRIBUTION GUIDE" title={<>Your first pull request<br /><em>starts here.</em></>} /><ContributionMorph /></div></section>
  <section className="section shell"><SectionIntro className="open-source-intro-repositories" index="03" label="CLUB REPOSITORIES" title={<>Find the right<br /><em>place to begin.</em></>} /><EmptyState label="REPOSITORIES & GOOD FIRST ISSUES" title="Links are being prepared." text="The club’s GitHub organization, repository links, issues, and contributor names are placeholders in the source document. Verified links will be added here." to="/join" action="Connect with the club" /></section>
  <section className="section section-alt"><div className="shell inline-cta has-inline-watermark"><BackgroundWord text="SHARE" /><div><span className="eyebrow">CONTRIBUTOR COMMUNITY</span><h2>Small changes.<br /><em>Shared progress.</em></h2><p>Questions, documentation, fixes, and code all help a project move forward.</p></div><Link className="button button-primary" to="/join">Join the community <ArrowUpRight size={18} /></Link></div></section>
</> }
