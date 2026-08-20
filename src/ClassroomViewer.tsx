import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Bounds } from '@react-three/drei'
import * as THREE from 'three'

type ApplianceId = 'projector' | 'light' | 'fan' | 'aircon'

interface ClassroomModelProps {
  spinning: boolean
  onSpinDone: () => void
  onApplianceClick: (id: ApplianceId) => void
}

function ClassroomModel({ spinning, onSpinDone, onApplianceClick }: ClassroomModelProps) {
  const { scene } = useGLTF('/models/classroom.glb')
  const ref = useRef<THREE.Group>(null)
  const rotated = useRef(0)
  const done = useRef(false)

  useFrame((_, delta) => {
    if (spinning && !done.current && ref.current) {
      const step = delta * 1.5
      ref.current.rotation.y += step
      rotated.current += step
      if (rotated.current >= Math.PI * 0.6) { // ~110° instead of full 360°
        done.current = true
        onSpinDone()
      }
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.7}
      onClick={(e: any) => {
        e.stopPropagation()
        const rawName: string = e.object.name || ''
        if (rawName.toLowerCase().startsWith('appliance_')) {
          const withoutPrefix = rawName.replace(/^appliance_/i, '')
          const cleanId = withoutPrefix.split('.')[0].trim().toLowerCase() as ApplianceId
          onApplianceClick(cleanId)
        }
      }}
    />
  )
}

interface ClassroomViewerProps {
  onApplianceClick: (id: ApplianceId) => void
  shouldSpin: boolean
  onSpinComplete: () => void
}

export default function ClassroomViewer({ onApplianceClick, shouldSpin, onSpinComplete }: ClassroomViewerProps) {
  return (
    <div style={{ width: '100%', height: '340px', borderRadius: '16px', overflow: 'hidden', background: '#fff0f0' }}>
      <Canvas camera={{ position: [0, 8, 20], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={7.5} />
        <hemisphereLight intensity={1} />

        <Suspense fallback={null}>
          <ClassroomModel
            spinning={shouldSpin}
            onSpinDone={onSpinComplete}
            onApplianceClick={onApplianceClick}
          />
        </Suspense>

        <OrbitControls enablePan={false} enabled={!shouldSpin} target={[0, 3, 0]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/classroom.glb')