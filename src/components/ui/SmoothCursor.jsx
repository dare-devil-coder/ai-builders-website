import { useEffect, useRef } from 'react'

export default function SmoothCursor() {
  const ref = useRef(null)
  useEffect(() => {
    const element = ref.current
    const fine = window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return undefined
    let x = -100; let y = -100; let targetX = -100; let targetY = -100; let frame
    let pressed = false
    const move = event => {
      if (event.pointerType === 'touch') return
      targetX = event.clientX; targetY = event.clientY
      element.classList.add('is-visible')
    }
    const down = event => {
      if (event.pointerType === 'touch') { element.classList.remove('is-visible'); return }
      pressed = true
      targetX = event.clientX; targetY = event.clientY
      element.classList.add('is-visible')
    }
    const up = () => { pressed = false }
    const hide = () => { if (!pressed) element.classList.remove('is-visible') }
    const blur = () => { pressed = false; element.classList.remove('is-visible') }
    const tick = () => {
      x += (targetX - x) * .24; y += (targetY - y) * .24
      element.style.transform = `translate3d(${x - 9}px,${y - 5}px,0)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', blur)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); document.removeEventListener('pointerleave', hide); window.removeEventListener('blur', blur); element.classList.remove('is-visible') }
  }, [])
  return <div ref={ref} className="smooth-cursor" aria-hidden="true"><svg viewBox="0 0 30 32"><path d="M4 3 25 18l-10 1-4 10L4 3Z" /></svg></div>
}
