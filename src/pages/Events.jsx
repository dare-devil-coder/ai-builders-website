import { pageMeta } from '../data/pages'
import { workshopTopics } from '../data/site'
import { EmptyState, PageHero, Reveal, SectionIntro } from '../components/ui/Sections'
import EventPassport from '../components/ui/EventPassport'

export default function Events() { return <><PageHero meta={pageMeta.events} />
  <EventPassport />
  <section className="section section-alt"><div className="shell"><SectionIntro className="events-intro-topics" index="02" label="WORKSHOP TOPICS" title={<>Things we want<br /><em>to explore together.</em></>} description="Topics from the club’s content plan, designed for different experience levels." /><div className="topic-list">{workshopTopics.map((topic, i) => <Reveal key={topic} className="topic-row"><span>{String(i + 1).padStart(2, '0')}</span><h3>{topic}</h3><span className="topic-star" aria-hidden="true">✳</span></Reveal>)}</div></div></section>
  <section className="section shell"><SectionIntro index="03" label="PAST EVENTS" title={<>A record of<br /><em>what we learned.</em></>} /><EmptyState label="ARCHIVE" title="Recaps will live here." text="Past events, slides, recordings, and speaker information will be added when the club provides verified details." /></section>
</> }
