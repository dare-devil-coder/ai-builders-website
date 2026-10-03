import { ArrowUpRight } from 'lucide-react'

// Adapted from Spectrum UI's Animated Card registry component for React/Vite.
// The upstream card uses next/image and Tailwind; this keeps its image/title/
// description structure and hover scale while using the site's CSS system.
// https://ui.spectrumhq.in/r/animated-card.json
export default function AnimatedCard({ project }) {
  const title = project.title || `Project ${project.id}`
  const description = project.description || 'The project story, team, and public source link will be added after the club confirms them.'

  return <article className="spectrum-animated-card">
    <div className="project-art">
      {project.image ? <img src={project.image} alt="" loading="lazy" /> : <div className="project-art-placeholder" aria-hidden="true"><span>AI / B</span><strong>{project.id}</strong><i /><i /></div>}
    </div>
    <div className="project-card-body"><div className="project-card-meta"><span>{project.category}</span><span>PROJECT / {project.id}</span></div><h3>{title}</h3><p>{description}</p><div className="project-card-bottom">{project.href ? <a href={project.href} target="_blank" rel="noreferrer">View project <ArrowUpRight size={17} /></a> : <span>DETAILS PENDING</span>}<ArrowUpRight size={19} aria-hidden="true" /></div></div>
  </article>
}
