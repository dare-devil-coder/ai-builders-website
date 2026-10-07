import { useEffect, useId, useRef, useState } from 'react'
import './GridPattern.css'

const cells = [[4, 1], [8, 3], [11, 0], [15, 4], [19, 2]]
const animatedCells = Array.from({ length: 30 }, (_, index) => [
  (index * 11 + 3) % 32,
  (index * 7 + Math.floor(index / 4)) % 19,
])

export default function GridPattern({ className = '', size = 40, animated = false, maxOpacity = 0.07 }) {
  const id = useId()
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!animated) return undefined
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.01 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [animated])

  return <svg ref={ref} className={`site-grid-pattern${animated ? ` site-grid-pattern--animated${active ? ' is-active' : ''}` : ''} ${className}`} aria-hidden="true" focusable="false">
    <defs><pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse"><path d={`M .5 ${size} V .5 H ${size}`} fill="none" /></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
    {(animated ? animatedCells : cells).map(([x, y], index) => <rect key={`${x}-${y}`} className="site-grid-cell" x={x * size + 1} y={y * size + 1} width={size - 1} height={size - 1} style={{ '--cell-delay': animated ? `${(index * 0.17) % 4}s` : `${index * 90}ms`, '--cell-opacity': maxOpacity }} />)}
  </svg>
}
