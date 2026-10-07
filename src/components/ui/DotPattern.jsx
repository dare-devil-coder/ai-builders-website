import { useId } from 'react'

export default function DotPattern({ className = '' }) {
  const id = useId()
  return <svg className={`dot-pattern ${className}`} aria-hidden="true" focusable="false">
    <defs><pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.65" /></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
}
