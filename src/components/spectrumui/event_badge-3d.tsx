import * as THREE from 'three'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { RigidBodyType } from '@dimforge/rapier3d-compat'

// Adapted from Spectrum UI's Event Badge 3D for the supplied AI Builders artwork.
function HangingBadge({ flipped, frontImage, backImage, onReady }: { flipped: boolean; frontImage: string; backImage: string; onReady?: () => void }) {
  const { viewport } = useThree()
  const fixed = useRef<any>(null)
  const jointOne = useRef<any>(null)
  const jointTwo = useRef<any>(null)
  const jointThree = useRef<any>(null)
  const card = useRef<any>(null)
  const artwork = useRef<THREE.Group>(null)
  const dragOffset = useRef<THREE.Vector3 | null>(null)
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const ribbon = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(25 * 2 * 3)
    const uv = new Float32Array(25 * 2 * 2)
    const indices: number[] = []
    for (let i = 0; i < 25; i += 1) {
      const t = i / 24
      uv.set([0, t, 1, t], i * 4)
      if (i < 24) {
        const a = i * 2
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    geometry.setIndex(indices)
    return geometry
  }, [])
  const strapTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#26366d'
    ctx.fillRect(0, 0, 128, 1024)
    ctx.fillStyle = '#354985'
    for (let x = 1; x < 128; x += 4) ctx.fillRect(x, 0, 1, 1024)
    ctx.fillStyle = '#8798cf'
    ctx.fillRect(5, 0, 3, 1024)
    ctx.fillRect(120, 0, 3, 1024)
    ctx.font = '700 29px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#eef0ff'
    for (let y = 135; y < 1024; y += 270) {
      ctx.save()
      ctx.translate(64, y)
      ctx.rotate(Math.PI / 2)
      ctx.fillText('AI BUILDERS', 0, 0)
      ctx.restore()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return texture
  }, [])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(Array.from({ length: 5 }, () => new THREE.Vector3())), [])
  const [front, back] = useTexture([frontImage, backImage])

  for (const texture of [front, back]) {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }

  useRopeJoint(fixed, jointOne, [[0, 0, 0], [0, 0, 0], 0.7])
  useRopeJoint(jointOne, jointTwo, [[0, 0, 0], [0, 0, 0], 0.7])
  useRopeJoint(jointTwo, jointThree, [[0, 0, 0], [0, 0, 0], 0.7])
  useSphericalJoint(jointThree, card, [[0, 0, 0], [0, 1.73, 0]])

  useEffect(() => {
    onReady?.()
    const timer = window.setTimeout(() => card.current?.setBodyType(RigidBodyType.Dynamic, true), 760)
    return () => window.clearTimeout(timer)
  }, [onReady])
  useEffect(() => () => { ribbon.dispose(); strapTexture.dispose() }, [ribbon, strapTexture])

  const release = () => {
    if (!dragOffset.current || !card.current) return
    dragOffset.current = null
    card.current.setBodyType(RigidBodyType.Dynamic, true)
    card.current.wakeUp()
  }

  useEffect(() => {
    window.addEventListener('pointerup', release)
    return () => window.removeEventListener('pointerup', release)
  }, [])

  const startDrag = (event: any) => {
    event.stopPropagation()
    const position = card.current?.translation()
    if (!position) return
    const pointer = event.ray.intersectPlane(dragPlane, new THREE.Vector3())
    if (!pointer) return
    dragOffset.current = new THREE.Vector3(position.x - pointer.x, position.y - pointer.y, 0)
    card.current.setBodyType(RigidBodyType.KinematicPositionBased, true)
    event.target.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: any) => {
    if (!dragOffset.current || !card.current) return
    event.stopPropagation()
    const pointer = event.ray.intersectPlane(dragPlane, new THREE.Vector3())
    if (!pointer) return
    const horizontalRange = Math.max(.75, viewport.width / 2 - 1.8)
    const x = THREE.MathUtils.clamp(pointer.x + dragOffset.current.x, -horizontalRange, horizontalRange)
    const verticalRange = Math.max(.7, viewport.height / 2 - 1.75)
    const y = THREE.MathUtils.clamp(pointer.y + dragOffset.current.y, -verticalRange, verticalRange)
    card.current.setNextKinematicTranslation({ x, y, z: 0 })
  }

  useFrame((_, delta) => {
    if (!fixed.current || !jointOne.current || !jointTwo.current || !jointThree.current || !card.current) return
    const points = [fixed, jointOne, jointTwo, jointThree].map(ref => ref.current.translation())
    points.push({ x: card.current.translation().x, y: card.current.translation().y + 1.78, z: card.current.translation().z })
    points.forEach((point, index) => curve.points[index].set(point.x, point.y, point.z))
    const positions = ribbon.getAttribute('position') as THREE.BufferAttribute
    const samples = curve.getPoints(24)
    samples.forEach((point, index) => {
      const before = samples[Math.max(0, index - 1)]
      const after = samples[Math.min(24, index + 1)]
      const dx = after.x - before.x
      const dy = after.y - before.y
      const length = Math.hypot(dx, dy) || 1
      const sideX = dy / length * .135
      const sideY = -dx / length * .135
      positions.setXYZ(index * 2, point.x - sideX, point.y - sideY, point.z + .04)
      positions.setXYZ(index * 2 + 1, point.x + sideX, point.y + sideY, point.z + .04)
    })
    positions.needsUpdate = true
    ribbon.computeVertexNormals()
    if (artwork.current) artwork.current.rotation.y = THREE.MathUtils.damp(artwork.current.rotation.y, flipped ? Math.PI : 0, 9, delta)
  })

  const segment = { canSleep: true, colliders: false as const, angularDamping: 2, linearDamping: 2 }
  return <>
    <RigidBody ref={fixed} type="fixed" position={[0, 3.7, 0]} colliders={false} />
    <RigidBody ref={jointOne} position={[0, 3.1, 0]} {...segment}><BallCollider args={[0.065]} /></RigidBody>
    <RigidBody ref={jointTwo} position={[0, 2.5, 0]} {...segment}><BallCollider args={[0.065]} /></RigidBody>
    <RigidBody ref={jointThree} position={[0, 1.9, 0]} {...segment}><BallCollider args={[0.065]} /></RigidBody>
    <RigidBody ref={card} type="kinematicPosition" position={[0, 2, 0]} colliders={false} angularDamping={3} linearDamping={1.5}>
      <CuboidCollider args={[1.04, 1.68, 0.045]} />
      <group position={[0, 1.73, .09]}>
        <mesh><torusGeometry args={[.105, .026, 8, 24]} /><meshStandardMaterial color="#c5cce1" metalness={.78} roughness={.28} /></mesh>
        <mesh position={[0, -.09, 0]}><boxGeometry args={[.16, .14, .055]} /><meshStandardMaterial color="#8995b3" metalness={.72} roughness={.35} /></mesh>
      </group>
      <group ref={artwork} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={release} onPointerCancel={release}>
        <mesh position={[0, 0, 0.035]}><planeGeometry args={[2.12, 3.37]} /><meshBasicMaterial map={front} side={THREE.FrontSide} toneMapped={false} /></mesh>
        <mesh position={[0, 0, -0.035]} rotation={[0, Math.PI, 0]}><planeGeometry args={[2.12, 3.37]} /><meshBasicMaterial map={back} side={THREE.FrontSide} toneMapped={false} /></mesh>
      </group>
    </RigidBody>
    <mesh geometry={ribbon} frustumCulled={false}><meshStandardMaterial map={strapTexture} side={THREE.DoubleSide} metalness={.08} roughness={.86} /></mesh>
  </>
}

export default function EventBadge3D({ flipped = false, frontImage, backImage, onReady }: { flipped?: boolean; frontImage: string; backImage: string; onReady?: () => void }) {
  return <div className="team-badge-canvas" aria-hidden="true">
    <Canvas camera={{ position: [0, 0.9, 9.2], fov: 35 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 5, 6]} intensity={1.6} />
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -30, 0]} timeStep={1 / 60}>
          <HangingBadge flipped={flipped} frontImage={frontImage} backImage={backImage} onReady={onReady} />
        </Physics>
      </Suspense>
    </Canvas>
  </div>
}
