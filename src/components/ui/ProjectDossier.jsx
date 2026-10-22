import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { featuredProjects } from '../../data/site'
import './ProjectDossier.css'

const projects = [...featuredProjects, { id: '04', title: null }]
const byId = id => projects.find(project => project.id === id)

export default function ProjectDossier() {
  const location = useLocation()
  const navigate = useNavigate()
  const linked = byId(new URLSearchParams(location.search).get('project'))
  const linkedId = linked?.id
  const [stage, setStage] = useState(linked ? 'detail' : 'closed')
  const [selected, setSelected] = useState(linked?.id || '01')
  const [turning, setTurning] = useState('')
  const [documentLocked, setDocumentLocked] = useState(false)
  const [mobilePage, setMobilePage] = useState('projects')
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const openerRef = useRef(null)
  const folderOpenerRef = useRef(null)
  const openedFromFolder = useRef(false)
  const rowsRef = useRef({})
  const timerRef = useRef(null)
  const initialLinkHandled = useRef(false)
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const updateUrl = id => navigate({ pathname: '/projects', search: id ? `?project=${id}` : '' }, { replace: true, preventScrollReset: true })
  const alignDossier = () => {
    const section = sectionRef.current
    if (!section) return
    window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top, behavior: 'instant' })
  }

  useLayoutEffect(() => {
    if (!documentLocked) return undefined
    const scrollY = window.scrollY
    const body = document.body
    const root = document.documentElement
    const restore = {
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      rootOverflow: root.style.overflow,
    }
    const scrollbarWidth = window.innerWidth - root.clientWidth

    body.style.overflow = 'hidden'
    body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : ''
    root.style.overflow = 'hidden'

    const reading = sectionRef.current?.querySelector('.dossier-reading')
    const keepBackgroundStill = () => {
      if (window.scrollY !== scrollY) window.scrollTo(0, scrollY)
    }
    const isInsideReading = target => target instanceof Node && reading?.contains(target)
    const preventOutsideScroll = event => {
      if (!isInsideReading(event.target)) event.preventDefault()
    }
    const capturePaging = event => {
      const scrollKeys = [' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']
      if (!scrollKeys.includes(event.key)) return
      if (!isInsideReading(event.target)) {
        event.preventDefault()
        return
      }
      if (event.key === ' ' && event.target instanceof Element && event.target.closest('button, a, input, select, textarea')) return

      event.preventDefault()
      const page = Math.max(240, reading.clientHeight * .82)
      const next = event.key === 'Home' ? 0
        : event.key === 'End' ? reading.scrollHeight
          : reading.scrollTop + (['ArrowUp', 'PageUp'].includes(event.key) ? -page : page)
      reading.scrollTo({ top: next, behavior: reduced() ? 'auto' : 'smooth' })
    }

    window.addEventListener('scroll', keepBackgroundStill, { passive: true })
    document.addEventListener('wheel', preventOutsideScroll, { passive: false })
    document.addEventListener('touchmove', preventOutsideScroll, { passive: false })
    document.addEventListener('keydown', capturePaging, true)

    return () => {
      window.removeEventListener('scroll', keepBackgroundStill)
      document.removeEventListener('wheel', preventOutsideScroll)
      document.removeEventListener('touchmove', preventOutsideScroll)
      document.removeEventListener('keydown', capturePaging, true)
      body.style.overflow = restore.bodyOverflow
      body.style.paddingRight = restore.bodyPaddingRight
      root.style.overflow = restore.rootOverflow
      window.scrollTo(0, scrollY)
    }
  }, [documentLocked])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])
  useEffect(() => {
    if (initialLinkHandled.current) return
    if (!linkedId) {
      initialLinkHandled.current = true
      return
    }
    const reveal = () => {
      initialLinkHandled.current = true
      requestAnimationFrame(() => {
        alignDossier()
        requestAnimationFrame(() => {
          setDocumentLocked(true)
          titleRef.current?.focus({ preventScroll: true })
        })
      })
    }
    if (document.documentElement.dataset.preloaderDone === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) reveal()
    else window.addEventListener('site-preloader-done', reveal, { once: true })
    return () => window.removeEventListener('site-preloader-done', reveal)
  }, [linkedId])

  const open = event => {
    if (stage !== 'closed') return
    openedFromFolder.current = event.currentTarget.classList.contains('dossier-folder-arrow')
    setStage('opening')
    timerRef.current = setTimeout(() => {
      alignDossier()
      setStage('index')
      setDocumentLocked(true)
      requestAnimationFrame(() => {
        titleRef.current?.focus({ preventScroll: true })
      })
    }, reduced() ? 0 : 900)
  }
  const select = id => {
    if (turning || stage !== 'index') return
    setSelected(id)
    setTurning('forward')
    timerRef.current = setTimeout(() => {
      setStage('detail')
      setTurning('')
      updateUrl(id)
      requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }))
    }, reduced() ? 0 : 760)
  }
  const back = () => {
    if (turning || stage !== 'detail') return
    setTurning('reverse')
    timerRef.current = setTimeout(() => {
      setStage('index')
      setTurning('')
      updateUrl(null)
      requestAnimationFrame(() => rowsRef.current[selected]?.focus({ preventScroll: true }))
    }, reduced() ? 0 : 680)
  }
  const close = () => {
    if (turning || stage === 'closed') return
    clearTimeout(timerRef.current)
    setStage('closing')
    timerRef.current = setTimeout(() => {
      setStage('closed')
      setDocumentLocked(false)
      updateUrl(null)
      requestAnimationFrame(() => (openedFromFolder.current ? folderOpenerRef.current : openerRef.current)?.focus({ preventScroll: true }))
    }, reduced() ? 0 : 820)
  }
  const closed = stage === 'closed'
  const detail = stage === 'detail' || turning === 'reverse'
  const project = byId(selected)

  return <section id="project-gallery" ref={sectionRef} data-mobile-page={mobilePage} className={`project-dossier section ${closed ? 'dossier-closed' : 'dossier-open'} stage-${stage}${turning ? ` is-turning-${turning}` : ''}`} aria-label="Project gallery">
    {!closed && <div className="dossier-backdrop" aria-hidden="true" />}
    <div className="shell">
      <div className="dossier-topline"><span><b>01 /</b> {closed ? 'PROJECT GALLERY' : 'CLUB PROJECTS'}</span>{!closed ? <><div className="dossier-mobile-pages" aria-label="File pages"><button type="button" aria-pressed={mobilePage === 'projects'} onClick={() => setMobilePage('projects')}>Projects</button><button type="button" aria-pressed={mobilePage === 'profile'} onClick={() => setMobilePage('profile')}>Club profile</button></div><button type="button" className="dossier-close" onClick={close} disabled={stage === 'opening'}><X size={17} /> Close file</button></> : <span>AI BUILDERS / UNIVERSAL AI UNIVERSITY</span>}</div>
      {closed ? <div className="dossier-intro">
        <div className="dossier-intro-copy"><span className="dossier-micro">■ &nbsp; AI BUILDERS / UNIVERSAL AI UNIVERSITY</span><h2>The proof is<br /><em>in the build.</em></h2><p>AI Builders brings students together to explore large language models, prompt engineering, and open-source technologies through workshops, collaborative projects, and hands-on development.</p><button ref={openerRef} className="dossier-explore" type="button" onClick={open}>EXPLORE CLUB PROJECTS <ArrowRight aria-hidden="true" /></button><span className="dossier-support">— &nbsp; AI BUILDERS / FUTURE PROJECTS</span></div>
        <div className="dossier-folder" aria-label="AI Builders project folder"><div className="dossier-folder-back" aria-hidden="true" /><div className="dossier-folder-tab" aria-hidden="true">AI BUILDERS / ARCHIVE</div><div className="dossier-folder-front"><span>■ &nbsp; AI BUILDERS / UNIVERSAL AI UNIVERSITY</span><strong>PROJECTS</strong><small>IDEAS, MADE TANGIBLE. PRACTICAL AI IN PROGRESS.</small><i aria-hidden="true">AI BUILDERS / ARCHIVE</i></div><div className="dossier-folder-paper"><span>C/P &nbsp; WORKSHOPS / PROMPT ENGINEERING / OPEN SOURCE</span><b>AI Builders <em>projects</em></b><small>A space for students to learn together, share ideas, develop skills, and turn AI concepts into working products.</small></div><button ref={folderOpenerRef} className="dossier-folder-arrow" type="button" onClick={open} aria-label="Open club projects dossier"><ArrowUpRight aria-hidden="true" /><span>OPEN THE FILE</span></button></div>
      </div> : <div className="dossier-reading" tabIndex={0} aria-label="Opened project file" aria-busy={stage === 'opening' || stage === 'closing' || Boolean(turning)}>
        <div className="dossier-spine" aria-hidden="true" />
        <aside className="dossier-profile"><div className="dossier-profile-top"><span>C/P — CLUB PROJECTS</span><span>{detail ? `FILE / ${selected}` : 'CLUB PROFILE / 01'}</span></div><h2>AI Builders</h2><span className="dossier-university">UNIVERSAL AI UNIVERSITY</span><p className="dossier-tagline">From theory to working AI.</p><p>Workshops, study sessions and collaborative projects help students turn AI concepts into working products.</p><span className="dossier-micro">AI &amp; DEVELOPMENT CLUB</span><div className="dossier-monogram" aria-hidden="true">C/P <span>＋</span></div>{detail ? <dl className="dossier-facts"><div><dt>PROJECT NO.</dt><dd>{selected}</dd></div><div><dt>PROJECT TITLE</dt><dd>{project.title || `Project ${selected}`}</dd></div><div><dt>STATUS</dt><dd>Coming soon</dd></div><div><dt>BUILT BY</dt><dd>To be confirmed</dd></div></dl> : <dl className="dossier-facts"><div><dt>LEARN</dt><dd>Workshops · study sessions</dd></div><div><dt>EXPLORE</dt><dd>LLMs · AI agents · RAG · APIs</dd></div><div><dt>VALUES</dt><dd>Teamwork · responsible experimentation</dd></div></dl>}<div className="dossier-profile-foot">CLUB PROJECTS / FILE <span>01</span></div></aside>
        <div className="dossier-pages"><div className="dossier-side-tab" aria-hidden="true">PROJECTS</div>
          <div className="dossier-sheet dossier-detail-sheet" inert={!detail || Boolean(turning)} aria-hidden={!detail || Boolean(turning)}><div className="dossier-detail-head"><button type="button" onClick={back} tabIndex={detail && !turning ? 0 : -1}><ArrowLeft aria-hidden="true" /> Back to project list</button><span>{selected} / PROJECT {selected}</span></div><span className="dossier-label">PROJECT {selected} / INDEX DETAIL</span><h2 ref={detail ? titleRef : null} tabIndex={-1}>{project.title || `Project ${selected}`}</h2><p className="dossier-status">Coming soon</p><div className="dossier-detail-grid"><div><span className="dossier-label">01 / OVERVIEW</span><p>Project {selected} will be documented here once its purpose, scope and goals are confirmed.</p></div><div><span className="dossier-label">02 / PROBLEM</span><p>The problem or opportunity this project will address will be documented here.</p></div></div><div className="dossier-approach"><span className="dossier-label">03 / APPROACH</span><div>{[['DISCOVER', 'Identify the opportunity'], ['PLAN', 'Define the approach'], ['BUILD', 'Deliver the outcome']].map(([name, copy], index) => <article key={name}><span className="dossier-label">0{index + 1} / {name}</span><p>{copy}</p></article>)}</div></div><div className="dossier-detail-grid"><div><span className="dossier-label">04 / TECHNOLOGY</span><p>To be confirmed</p></div><div><span className="dossier-label">05 / TEAM</span><p>To be confirmed</p></div></div><div className="dossier-resources"><div><span>REPOSITORY</span><small>To be confirmed</small></div><div><span>LIVE DEMO</span><small>To be confirmed</small></div></div><div className="dossier-page-foot">PROJECT {selected} / INDEX DETAIL <span>03</span></div></div>
          <div className="dossier-sheet dossier-index-sheet" inert={detail || Boolean(turning)} aria-hidden={detail || Boolean(turning)}><div className="dossier-index-meta"><span>PROJECT INDEX / 04 FILES</span><span>UPCOMING COLLECTION</span></div><h2 ref={!detail ? titleRef : null} tabIndex={-1}>Browse club projects.</h2><p>Explore upcoming club projects. Each file will collect the purpose, process, team, technology and links.</p><div className="dossier-project-list">{projects.map(item => <button key={item.id} ref={node => { rowsRef.current[item.id] = node }} type="button" className={selected === item.id ? 'is-selected' : ''} onClick={() => select(item.id)}><b>{item.id}</b><span><strong>{item.title || `Project ${item.id}`}</strong><small>Project details, team and links will be published when confirmed.</small><i>PROJECT FILE / P. {item.id} →</i></span><em>○ COMING SOON</em></button>)}</div><div className="dossier-index-bottom"><span>↑ PROJECT {selected} / SELECTED</span><span>OPEN FILE → PROJECT DETAIL</span></div><div className="dossier-page-foot">INDEX / CLUB PROJECTS <span>02</span></div></div>
          {turning && <div className={`dossier-turn-leaf ${turning}`} aria-hidden="true"><span>↑</span><small>{turning === 'forward' ? `INDEX / PROJECT ${selected} → DETAIL` : 'DETAIL → PROJECT INDEX'}</small></div>}
        </div>
      </div>}
      <div className="dossier-bottomline"><span>{closed ? 'Project details and links will be added when AI Builders confirms them.' : 'Explore the ideas, process and people behind each club project.'}</span><span>CLUB PROJECT COLLECTION</span></div>
    </div>
  </section>
}
