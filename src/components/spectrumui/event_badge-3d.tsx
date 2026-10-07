import * as THREE from 'three'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { RigidBodyType } from '@dimforge/rapier3d-compat'

// Adapted from Spectrum UI's Event Badge 3D for the supplied AI Builders artwork.
extend({ MeshLineGeometry, MeshLineMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements { meshLineMaterial: any }
  }
}

function HangingBadge({ flipped, frontImage, backImage }: { flipped: boolean; frontImage: string; backImage: string }) {
  const { size } = useThree()
  const fixed = useRef<any>(null)
  const jointOne = useRef<any>(null)
  const jointTwo = useRef<any>(null)
  const jointThree = useRef<any>(null)
  const card = useRef<any>(null)
  const artwork = useRef<THREE.Group>(null)
  const dragOffset = useRef<THREE.Vector3 | null>(null)
  const line = useMemo(() => new MeshLineGeometry(), [])
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
    const timer = window.setTimeout(() => card.current?.setBodyType(RigidBodyType.Dynamic, true), 420)
    return () => window.clearTimeout(timer)
  }, [])

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
    dragOffset.current = new THREE.Vector3(position.x - event.point.x, position.y - event.point.y, 0)
    card.current.setBodyType(RigidBodyType.KinematicPositionBased, true)
    event.target.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: any) => {
    if (!dragOffset.current || !card.current) return
    event.stopPropagation()
    const horizontalLimit = Math.min(1.05, Math.max(.12, (5.8 * size.width / size.height - 2.12) / 2 - .05))
    card.current.setNextKinematicTranslation({ x: THREE.MathUtils.clamp(event.point.x + dragOffset.current.x, -horizontalLimit, horizontalLimit), y: THREE.MathUtils.clamp(event.point.y + dragOffset.current.y, -.05, 2.25), z: 0 })
  }

  useFrame((_, delta) => {
    if (!fixed.current || !jointOne.current || !jointTwo.current || !jointThree.current || !card.current) return
    const points = [fixed, jointOne, jointTwo, jointThree].map(ref => ref.current.translation())
    points.push({ x: card.current.translation().x, y: card.current.translation().y + 1.73, z: card.current.translation().z })
    points.forEach((point, index) => curve.points[index].set(point.x, point.y, point.z))
    line.setPoints(curve.getPoints(24))
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
      <group ref={artwork} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={release} onPointerCancel={release}>
        <mesh position={[0, 0, 0.035]}><planeGeometry args={[2.12, 3.37]} /><meshBasicMaterial map={front} side={THREE.FrontSide} toneMapped={false} /></mesh>
        <mesh position={[0, 0, -0.035]} rotation={[0, Math.PI, 0]}><planeGeometry args={[2.12, 3.37]} /><meshBasicMaterial map={back} side={THREE.FrontSide} toneMapped={false} /></mesh>
      </group>
    </RigidBody>
    <mesh geometry={line}><meshLineMaterial attach="material" color="#aab5ff" lineWidth={0.05} transparent opacity={0.88} depthTest={false} /></mesh>
  </>
}

export default function EventBadge3D({ flipped = false, frontImage, backImage }: { flipped?: boolean; frontImage: string; backImage: string }) {
  return <div className="team-badge-canvas" aria-hidden="true">
    <Canvas camera={{ position: [0, 0.9, 9.2], fov: 35 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -30, 0]} timeStep={1 / 60}>
          <HangingBadge flipped={flipped} frontImage={frontImage} backImage={backImage} />
        </Physics>
      </Suspense>
    </Canvas>
  </div>
}
