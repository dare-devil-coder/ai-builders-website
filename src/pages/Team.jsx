import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { pageMeta } from '../data/pages'
import { PageHero, Reveal, SectionIntro } from '../components/ui/Sections'
import { BackgroundWord } from '../components/ui/SiteEffects'
import MemberBadgeModal from '../components/ui/MemberBadgeModal'
import GridPattern from '../components/ui/GridPattern'

// This entry demonstrates the approved layout. Replace it with confirmed club data.
const members = [{
  id: 'sample',
  name: 'Alex Morgan',
  role: 'AI Engineer · Community member',
  description: 'Turning ideas into useful AI tools. Building open-source agents and sharing what I learn.',
  image: '/team-badge-front.png',
  badgeFront: '/team-badge-front.png',
  badgeBack: '/team-badge-back.png',
  illustrative: true,
}]

export default function Team() {
  const [activeMember, setActiveMember] = useState(null)
  const lastTrigger = useRef(null)
  const closeDetails = () => {
    setActiveMember(null)
    requestAnimationFrame(() => lastTrigger.current?.focus())
  }

  return <>
    <PageHero meta={pageMeta.team} mascot />
    <section className="section shell">
      <SectionIntro className="team-intro-builders" index="01" label="THE BUILDERS" title={<>People are the<br /><em>real architecture.</em></>} description="Students lead projects, run sessions, contribute code, write documentation, and help one another grow." />
      <div className="team-member-list" aria-label="Member profiles">
        {members.map(member => <article className="team-member-card" key={member.id}>
          <div className={`team-member-photo${member.illustrative ? ' team-member-photo--sample' : ''}`} role="img" aria-label={`${member.illustrative ? 'Illustrative portrait for' : 'Portrait of'} ${member.name}`} style={{ backgroundImage: `url('${member.image}')` }} />
          <div className="team-member-copy">
            <span className="eyebrow">{member.illustrative ? 'SAMPLE PROFILE / LAYOUT PREVIEW' : 'CLUB MEMBER'}</span>
            <h3>{member.name}</h3>
            <strong className="team-member-role">{member.role}</strong>
            <p>{member.description}</p>
            <button className="team-member-open" type="button" onClick={event => { lastTrigger.current = event.currentTarget; setActiveMember(member) }}>Show more details <ArrowUpRight size={18} /></button>
            {member.illustrative && <span className="team-member-note">Illustrative member. Real names, roles, and photos will appear after confirmation.</span>}
          </div>
        </article>)}
      </div>
    </section>
    <section className="section section-alt has-section-grid"><GridPattern animated className="section-grid--quiet" /><div className="shell"><SectionIntro className="team-intro-contribute" index="02" label="WAYS TO CONTRIBUTE" title={<>There is a place<br /><em>for your skills.</em></>} /><div className="direction-grid">{[{ n: '01', title: 'Build', text: 'Create AI systems, prototypes, interfaces, and complete products.' }, { n: '02', title: 'Share', text: 'Document work, write tutorials, and explain what you learned.' }, { n: '03', title: 'Lead', text: 'Help run workshops, guide projects, and grow the community.' }].map(item => <Reveal key={item.n} className="direction-card"><span className="eyebrow">{item.n} / CONTRIBUTE</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></div></section>
    <section className="section shell"><div className="inline-cta has-inline-watermark"><BackgroundWord text="LEAD" /><div><span className="eyebrow">JOIN THE TEAM</span><h2>Want to help lead<br /><em>the next build?</em></h2><p>We’re looking for passionate people to help lead workshops, manage projects, and grow the community.</p></div><Link className="button button-primary" to="/join">Explore joining <ArrowUpRight size={18} /></Link></div></section>
    {activeMember && <MemberBadgeModal member={activeMember} onClose={closeDetails} />}
  </>
}
