import { useEffect, useRef } from 'react'
import { animate, svg, stagger } from 'animejs'
import { buildGlyphs } from './buildGlyphs'

const desktopTopics = [
  { label: 'APIs', x: 102, y: 75, rx: 43, ry: 25 },
  { label: 'RAG', x: 250, y: 75, rx: 43, ry: 25 },
  { label: 'Embeddings', x: 445, y: 75, rx: 45, ry: 25 },
  { label: 'LLMs', x: 650, y: 75, rx: 35, ry: 25 },
  { label: 'Hackathons', x: 120, y: 175, rx: 45, ry: 20 },
  { label: 'Hugging Face', x: 365, y: 175, rx: 45, ry: 20 },
  { label: 'Fine-tuning', x: 615, y: 175, rx: 50, ry: 20 },
  { label: 'Open source', x: 79, y: 290, rx: 9, ry: 45 },
  { label: 'AI agents', x: 662, y: 290, rx: 12, ry: 45 },
  { label: 'Vector DB', x: 118, y: 403, rx: 43, ry: 17 },
  { label: 'Prompting', x: 470, y: 403, rx: 50, ry: 17 },
  { label: 'Workshops', x: 265, y: 470, rx: 50, ry: 15 },
  { label: 'Deployment', x: 623, y: 470, rx: 48, ry: 15 },
  { label: 'GitHub', x: 260, y: 532, rx: 40, ry: 12 },
  { label: 'FastAPI', x: 445, y: 532, rx: 40, ry: 12 },
]

// Each region is disjoint from its neighbours and from the central word.
const mobileTopics = [
  { label: 'APIs', x: 55, y: 70, rx: 20, ry: 25 },
  { label: 'RAG', x: 162, y: 70, rx: 23, ry: 25 },
  { label: 'Embeddings', x: 284, y: 70, rx: 14, ry: 25 },
  { label: 'Hugging Face', x: 85, y: 156, rx: 12, ry: 15 },
  { label: 'LLMs', x: 300, y: 156, rx: 22, ry: 15 },
  { label: 'Hackathons', x: 80, y: 224, rx: 13, ry: 15 },
  { label: 'Fine-tuning', x: 282, y: 224, rx: 11, ry: 15 },
  { label: 'Open source', x: 80, y: 292, rx: 10, ry: 17 },
  { label: 'AI agents', x: 290, y: 292, rx: 10, ry: 17 },
  { label: 'Vector DB', x: 77, y: 452, rx: 12, ry: 20 },
  { label: 'Deployment', x: 282, y: 452, rx: 12, ry: 20 },
  { label: 'Workshops', x: 85, y: 535, rx: 16, ry: 20 },
  { label: 'Prompting', x: 282, y: 535, rx: 15, ry: 20 },
  { label: 'GitHub', x: 125, y: 615, rx: 15, ry: 20 },
  { label: 'FastAPI', x: 240, y: 615, rx: 15, ry: 20 },
]

function BuildWord({ x, baseline, scale }) {
  const totalWidth = buildGlyphs.reduce((width, glyph) => width + glyph.advance, 0) * scale

  return <g className="build-word">
    {buildGlyphs.map((glyph, index) => {
      const precedingWidth = buildGlyphs.slice(0, index).reduce((width, previous) => width + previous.advance, 0)
      return <g key={glyph.letter} transform={`translate(${x - totalWidth / 2 + precedingWidth * scale} ${baseline}) scale(${scale} ${-scale})`}>
        <path className="build-letter-fill" d={glyph.d} />
        <path className="build-letter-outline" d={glyph.d} />
      </g>
    })}
  </g>
}

function Scene({ topics, mobile = false }) {
  const suffix = mobile ? 'mobile' : 'desktop'
  return <svg className={`constellation-${suffix}`} viewBox={mobile ? '0 0 360 685' : '0 0 740 570'} aria-hidden="true">
    <defs>
      <radialGradient id={`build-glow-${suffix}`}>
        <stop stopColor="#8193ff" stopOpacity=".3" />
        <stop offset=".55" stopColor="#697ce8" stopOpacity=".12" />
        <stop offset="1" stopColor="#697ce8" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={mobile ? 180 : 370} cy={mobile ? 375 : 290} rx={mobile ? 155 : 233} ry={mobile ? 142 : 164} fill={`url(#build-glow-${suffix})`} />
    {topics.map(topic => <g key={topic.label} transform={`translate(${topic.x} ${topic.y})`}>
      <g className="floating-topic" data-range-x={topic.rx} data-range-y={topic.ry}>
        <text textAnchor="middle" dominantBaseline="middle">{topic.label}</text>
      </g>
    </g>)}
    <BuildWord x={mobile ? 180 : 370} baseline={mobile ? 398 : 333} scale={mobile ? .075 : .125} />
  </svg>
}

export default function BuildConstellation() {
  const root = useRef(null)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobilePreference = window.matchMedia('(max-width: 640px)')
    let drawing
    let stopFloating = []

    const updateMotion = () => {
      drawing?.revert()
      stopFloating.forEach(stop => stop())
      stopFloating = []
      if (motionPreference.matches) return

      const scene = root.current.querySelector(mobilePreference.matches ? '.constellation-mobile' : '.constellation-desktop')
      const sceneBounds = scene.getBoundingClientRect()
      const sceneScale = Math.min(
        sceneBounds.width / scene.viewBox.baseVal.width,
        sceneBounds.height / scene.viewBox.baseVal.height,
      )

      drawing = animate(svg.createDrawable(scene.querySelectorAll('.build-letter-outline')), {
        draw: ['0 0', '0 1', '1 1'],
        ease: 'inOutQuad',
        duration: 2000,
        delay: stagger(100),
        loop: true,
      })

      scene.querySelectorAll('.floating-topic').forEach((element, index) => {
        const rangeX = Number(element.dataset.rangeX) * sceneScale
        const rangeY = Number(element.dataset.rangeY) * sceneScale
        let current = { x: 0, y: 0 }
        let animation
        let stopped = false

        const move = () => {
          if (stopped) return
          let next
          let distance
          // Pick a fresh waypoint inside this label's collision-free region.
          for (let attempt = 0; attempt < 12; attempt += 1) {
            next = { x: (Math.random() * 2 - 1) * rangeX, y: (Math.random() * 2 - 1) * rangeY }
            distance = Math.hypot(next.x - current.x, next.y - current.y)
            if (distance > Math.max(12, (rangeX + rangeY) * .35)) break
          }
          const transform = point => `translate(${point.x}px, ${point.y}px)`
          animation = element.animate([{ transform: transform(current) }, { transform: transform(next) }], {
            duration: 2300 + distance * 22 + Math.random() * 700,
            easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
            fill: 'forwards',
          })
          animation.onfinish = () => {
            element.style.transform = transform(next)
            animation.cancel()
            current = next
            move()
          }
        }

        const timer = window.setTimeout(move, 80 + Math.random() * 400 + index * 15)
        stopFloating.push(() => {
          stopped = true
          window.clearTimeout(timer)
          animation?.cancel()
          element.style.transform = ''
        })
      })
    }

    updateMotion()
    const resizeObserver = new ResizeObserver(updateMotion)
    resizeObserver.observe(root.current)
    motionPreference.addEventListener('change', updateMotion)
    mobilePreference.addEventListener('change', updateMotion)
    return () => {
      resizeObserver.disconnect()
      motionPreference.removeEventListener('change', updateMotion)
      mobilePreference.removeEventListener('change', updateMotion)
      drawing?.revert()
      stopFloating.forEach(stop => stop())
    }
  }, [])

  return <div ref={root} className="build-constellation" role="img" aria-label={`BUILD surrounded by floating topics: ${desktopTopics.map(topic => topic.label).join(', ')}`}>
    <Scene topics={desktopTopics} />
    <Scene topics={mobileTopics} mobile />
  </div>
}
