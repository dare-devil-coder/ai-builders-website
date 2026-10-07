import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { pillars } from '../data/site'
import { pageMeta } from '../data/pages'
import { PageFlow, PageHero, Reveal, SectionIntro, TiltCard } from '../components/ui/Sections'
import { ApproachMorph, ShineText, SoftBlurText } from '../components/ui/MotionPieces'
import { BackgroundWord } from '../components/ui/SiteEffects'
import CampusPath from '../components/ui/CampusPath'
import DotPattern from '../components/ui/DotPattern'

export default function About() {
  return (
    <PageFlow>
      <PageHero meta={pageMeta.about} />
      <section className="section shell">
        <SectionIntro
          index="01"
          label="OUR STORY"
          title={<><SoftBlurText text="The best way to learn AI" /><br /><em><SoftBlurText text="is to build with it." /></em></>}
          motionManaged
          watermark="STORY"
          className="about-intro-story"
        />
        <div className="story-copy">
          <div>
            <p><SoftBlurText text="AI Builders was founded at Universal AI University with one belief: the best way to learn AI is to build with it. We started as a small group of students who wanted to go beyond textbooks — to work with real models, real APIs, and real problems." /></p>
            <p><SoftBlurText text="Today, we are a growing community of developers, researchers, and open-source contributors who collaborate on projects that matter. From intelligent agents to RAG pipelines, every project we ship is a step toward making AI more accessible, more useful, and more open." /></p>
          </div>
          <Reveal className="story-quote">
            <ShineText>“Go beyond textbooks. Work with real models, real APIs, and real problems.”</ShineText>
            <span>AI BUILDERS / UNIVERSAL AI UNIVERSITY</span>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="shell">
          <SectionIntro index="02" label="WHY WE EXIST" title={<>A mission with<br /><em>room to grow.</em></>} />
          <div className="statement-grid">
            <Reveal className="statement-card">
              <DotPattern />
              <span className="statement-corners" aria-hidden="true"><i /><i /><i /><i /></span>
              <span className="eyebrow">MISSION / TODAY</span>
              <h3><strong>Empower students</strong> to design, build, and ship AI-driven systems.</h3>
              <p>Through hands-on projects, collaborative development, and open-source contribution.</p>
            </Reveal>
            <Reveal className="statement-card">
              <DotPattern />
              <span className="statement-corners" aria-hidden="true"><i /><i /><i /><i /></span>
              <span className="eyebrow">VISION / TOMORROW</span>
              <h3><strong>Become the most impactful</strong> student AI community in India.</h3>
              <p>A community that produces real contributors to the global AI ecosystem.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionIntro index="03" label="OUR PILLARS" title={<>The work has<br /><em>many dimensions.</em></>} className="about-intro-pillars" />
        <div className="pillar-grid">
          {pillars.map(pillar => (
            <Reveal key={pillar.id}>
              <TiltCard className="pillar-card">
                <div className="pillar-top">
                  <span>{pillar.id} / PILLAR</span>
                  <span className="pillar-icon">{pillar.icon}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="shell">
          <SectionIntro index="04" label="OUR APPROACH" title={<>Learn. Build. Ship.<br /><em>Contribute.</em></>} className="about-intro-approach" />
          <ApproachMorph />
        </div>
      </section>

      <section className="section shell compact-section">
        <div className="university-panel has-inline-watermark"><BackgroundWord text="UAI" /><CampusPath />
          <span className="eyebrow">ROOTED AT UAI</span>
          <h2>Built on campus.<br /><em>Open to the world.</em></h2>
          <p>AI Builders is a student club at Universal AI University, Mumbai — an institution dedicated to shaping the next generation of AI practitioners and researchers.</p>
          <Link className="text-link" to="/team">Meet the people <ArrowUpRight size={18} /></Link>
        </div>
      </section>
    </PageFlow>
  )
}
