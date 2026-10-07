import { ArrowUpRight } from 'lucide-react'
import { pageMeta } from '../data/pages'
import { resourceTools } from '../data/site'
import { EmptyState, PageHero, Reveal, SectionIntro } from '../components/ui/Sections'
import GridPattern from '../components/ui/GridPattern'

export default function Blog() { return <><PageHero meta={pageMeta.blog} mascot />
  <section className="section shell"><SectionIntro className="resources-intro-tutorials" index="01" label="ARTICLES & TUTORIALS" title={<>Learn in public.<br /><em>Write it down.</em></>} description="Articles will include real authors, dates, and project context when club writing is published." /><EmptyState label="EDITORIAL SPACE" title="The first article is still to come." text="The documents provide an article template but no finished article or author attribution. We’ll publish only confirmed writing." /></section>
  <section className="section section-alt has-section-grid"><GridPattern animated className="section-grid--quiet" /><div className="shell"><SectionIntro className="resources-intro-frameworks" index="02" label="TOOLS & FRAMEWORKS" title={<>A starting point<br /><em>for curious builders.</em></>} description="Tools named in the club’s resource plan. Explore their official documentation." /><div className="resource-list">{resourceTools.map((tool, i) => <Reveal key={tool.name}><a href={tool.url} target="_blank" rel="noreferrer" className="resource-row"><span>{String(i + 1).padStart(2, '0')}</span><strong>{tool.name}</strong><span>{tool.detail}</span><ArrowUpRight size={20} /></a></Reveal>)}</div></div></section>
</> }
