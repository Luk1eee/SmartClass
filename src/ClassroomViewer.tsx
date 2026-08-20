import { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

type ApplianceId = 'projector' | 'light' | 'fan' | 'aircon'

interface ApplianceStates {
  projector: boolean
  light: boolean
  fan: boolean
  aircon: boolean
}

interface Marker {
  id: ApplianceId
  key: string
  position: [number, number, number]
}

interface ClassroomModelProps {
  modelPath: string
  onApplianceClick: (id: ApplianceId) => void
  onMarkersFound: (markers: Marker[]) => void
}

function ClassroomModel({ modelPath, onApplianceClick, onMarkersFound }: ClassroomModelProps) {
  const { scene } = useGLTF(modelPath)
  const found = useRef(false)

  useEffect(() => {
    found.current = false
  }, [modelPath])

  useEffect(() => {
    if (found.current) return
    found.current = true

    scene.updateMatrixWorld(true)

    const box = new THREE.Box3()
    const markers: Marker[] = []
    let counter = 0

    scene.traverse((obj) => {
      const rawName = obj.name || ''
      if (!rawName.toLowerCase().startsWith('appliance_')) return

      const withoutPrefix = rawName.replace(/^appliance_/i, '')
      const cleanId = withoutPrefix.split('.')[0].trim().toLowerCase() as ApplianceId

      box.setFromObject(obj)
      const center = new THREE.Vector3()
      box.getCenter(center)

      markers.push({
        id: cleanId,
        key: `${cleanId}-${counter++}`,
        position: [center.x, box.max.y + 0.3, center.z],
      })
    })

    onMarkersFound(markers)
  }, [scene, onMarkersFound])

  return (
    <primitive
      object={scene}
      scale = {0.7}
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
  modelPath: string
  onApplianceClick: (id: ApplianceId) => void
  applianceStates: ApplianceStates
}

export default function ClassroomViewer({ modelPath, onApplianceClick, applianceStates }: ClassroomViewerProps) {
  const [markers, setMarkers] = useState<Marker[]>([])
  const handleMarkersFound = useCallback((m: Marker[]) => setMarkers(m), [])

  return (
    <div>
      <p style={{ textAlign: 'center', color: '#E53E3E', fontWeight: 700, fontSize: '15px', margin: '0 0 10px' }}>
        กรุณาเลือกเครื่องใช้ไฟฟ้า
      </p>
      <div style={{ width: '100%', height: '340px', borderRadius: '16px', overflow: 'hidden', background: '#fff0f0' }}>
        <Canvas camera={{ position: [0, 8, 20], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <hemisphereLight intensity={1} />

          <Suspense fallback={null}>
            <ClassroomModel
              modelPath={modelPath}
              onApplianceClick={onApplianceClick}
              onMarkersFound={handleMarkersFound}
            />
            {markers.map((m) => {
              const isOn = m.id === 'fan' ? applianceStates.fan : applianceStates[m.id]
              return (
                <Html key={m.key} position={m.position} center distanceFactor={12} occlude={false}>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isOn ? '#22c55e' : '#ef4444',
                      border: '2px solid white',
                      boxShadow: '0 0 6px rgba(0,0,0,0.4)',
                    }}
                  />
                </Html>
              )
            })}
          </Suspense>

          <OrbitControls
            enablePan={false}
            target={[0, 3, 0]}
            autoRotate
            autoRotateSpeed={1.2}
          />
        </Canvas>
      </div>
    </div>
  )
}
