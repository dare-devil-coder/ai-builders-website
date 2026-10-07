import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import './InfiniteRibbon.css'

export default function InfiniteRibbon({ items, duration = 35 }) {
  const [paused, setPaused] = useState(false)
  const renderRail = (direction) => <div className={`infinite-ribbon-rail infinite-ribbon-rail-${direction}`} aria-hidden="true">
    <div className="ticker-track infinite-ribbon-track" style={{ '--ribbon-duration': `${duration}s`, animationPlayState: paused ? 'paused' : 'running' }}>
      {[0, 1].map(copy => <div key={copy} className="ticker-set">{items.map(item => <span key={item}>{item}<b aria-hidden="true">✳</b></span>)}</div>)}
    </div>
  </div>
  return <div className="ticker infinite-ribbon" role="group" aria-label="Our focus areas">
    <span className="sr-only">{items.join(', ')}</span>
    {renderRail('forward')}
    {renderRail('reverse')}
    <button className="infinite-ribbon-toggle" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play focus area ribbon' : 'Pause focus area ribbon'}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
  </div>
}
