import { pageMeta } from '../data/pages'
import { workshopTopics } from '../data/site'
import { PageHero, Reveal, SectionIntro } from '../components/ui/Sections'
import EventPassport from '../components/ui/EventPassport'
import EventArchive from '../components/ui/EventArchive'
import GridPattern from '../components/ui/GridPattern'

export default function Events() { return <><PageHero meta={pageMeta.events} mascot />
  <EventPassport />
  <section className="section section-alt has-section-grid"><GridPattern animated className="section-grid--quiet" /><div className="shell"><SectionIntro className="events-intro-topics" index="02" label="WORKSHOP TOPICS" title={<>Things we want<br /><em>to explore together.</em></>} description="Topics from the club’s content plan, designed for different experience levels." /><div className="topic-list">{workshopTopics.map((topic, i) => <Reveal key={topic} className="topic-row"><span>{String(i + 1).padStart(2, '0')}</span><h3>{topic}</h3><span className="topic-star" aria-hidden="true">✳</span></Reveal>)}</div></div></section>
  <EventArchive />
</> }
