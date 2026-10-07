import { useEffect, useRef, useState } from 'react'
import './RobotMascot.css'

// Sprite positioning follows the 3×3 atlas convention used by nilbuild/page-mascot (MIT).
const directions = ['up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right']
const reactionCells = [1, 2, 3, 4, 5, 6, 7, 8]
const directionCell = { 'up-left': 0, up: 1, 'up-right': 2, left: 3, center: 4, right: 5, 'down-left': 6, down: 7, 'down-right': 8 }

function cellStyle(index) {
  return { backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%` }
}

export default function RobotMascot({ className = '' }) {
  const button = useRef(null)
  const reactionTimer = useRef(null)
  const [direction, setDirection] = useState('center')
  const [reaction, setReaction] = useState(null)
  const [boops, setBoops] = useState(0)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    let frame = null
    let pointer = null
    const update = () => {
      frame = null
      if (!button.current || !pointer) return
      const box = button.current.getBoundingClientRect()
      const dx = pointer.x - box.left - box.width / 2
      const dy = pointer.y - box.top - box.height / 2
      if (Math.hypot(dx, dy) < 65) { setDirection('center'); return }
      const x = dx > 50 ? 1 : dx < -50 ? -1 : 0
      const y = dy > 50 ? 1 : dy < -50 ? -1 : 0
      setDirection(directions[(y + 1) * 3 + x + 1])
    }
    const move = event => {
      pointer = { x: event.clientX, y: event.clientY }
      if (frame === null) frame = requestAnimationFrame(update)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', update, { passive: true })
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('scroll', update); if (frame !== null) cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => () => window.clearTimeout(reactionTimer.current), [])

  const react = () => {
    window.clearTimeout(reactionTimer.current)
    setReaction(reactionCells[boops % reactionCells.length])
    setBoops(value => value + 1)
    reactionTimer.current = window.setTimeout(() => setReaction(null), 700)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) button.current?.animate([
      { transform: 'scale(1)' }, { transform: 'scale(1.06,.94)', offset: .35 }, { transform: 'scale(1)' },
    ], { duration: 340, easing: 'cubic-bezier(.23,1,.32,1)' })
  }

  return <button ref={button} className={`robot-mascot ${className}`} type="button" onClick={react} aria-label="Greet the AI Builders robot">
    <span className="robot-mascot-direction" style={{ ...cellStyle(directionCell[direction]), opacity: reaction === null ? 1 : 0 }} />
    <span className="robot-mascot-reaction" style={{ ...cellStyle(reaction ?? 0), opacity: reaction === null ? 0 : 1 }} />
  </button>
}
