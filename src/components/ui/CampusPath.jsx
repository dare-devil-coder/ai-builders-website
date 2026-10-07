import { useReducedMotion } from 'motion/react'

export default function CampusPath() {
  const reduceMotion = useReducedMotion()
  const phrase = 'LEARN · BUILD · SHIP · CONTRIBUTE ·'
  return <svg className="campus-path" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <defs><path id="campus-motion-curve" d="M 510 500 C 565 440 620 365 700 305 C 780 245 840 215 885 228 C 910 238 895 260 870 281 C 833 314 855 343 884 340 C 914 340 930 310 973 309 C 1015 308 1040 275 1090 245 C 1140 215 1170 195 1200 182" /></defs>
    <use href="#campus-motion-curve" fill="none" stroke="#8fa3f58c" strokeWidth="1" />
    {(reduceMotion ? ['8%'] : ['0%', '-100%']).map((offset, index) =>
      <text key={offset} fill="#c5ceff" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="3">
        <textPath href="#campus-motion-curve" startOffset={offset}>
          {phrase}
          {!reduceMotion && <animate attributeName="startOffset" from={offset} to={index === 0 ? '100%' : '0%'} dur="16s" repeatCount="indefinite" />}
        </textPath>
      </text>,
    )}
  </svg>
}
