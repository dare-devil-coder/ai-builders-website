import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import './InfiniteRibbon.css'

export default function InfiniteRibbon({ items, duration = 35 }) {
  const [paused, setPaused] = useState(false)
  return <div className="ticker infinite-ribbon" role="group" aria-label="Our focus areas">
    <span className="sr-only">{items.join(', ')}</span>
    <div className="ticker-track infinite-ribbon-track" aria-hidden="true" style={{ '--ribbon-duration': `${duration}s`, animationPlayState: paused ? 'paused' : 'running' }}>
      {[0, 1].map(copy => <div key={copy} className="ticker-set">{items.map(item => <span key={item}>{item}<b aria-hidden="true">✳</b></span>)}</div>)}
    </div>
    <button className="infinite-ribbon-toggle" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play focus area ribbon' : 'Pause focus area ribbon'}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
  </div>
}
