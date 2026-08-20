import React, { useState, useEffect } from 'react'
import appIconSrc from '@/imports/AppIcon.jpg'
import ClassroomViewer from './ClassroomViewer'

type Screen =
  | 'splash'
  | 'login'
  | 'classSelect'
  | 'password'
  | 'applianceSelect'
  | 'applianceControl'
  | 'success'
  | 'feedback'

type ApplianceId = 'projector' | 'light' | 'fan' | 'aircon'
type Mode = 'Cool' | 'Fan' | 'Heat' | 'Dry'
type FanSpeed = 'Auto' | 'Low' | 'High'
type FanPower = 0 | 1 | 2 | 3

const CLASSES = [
  { id: 'ห้องหัวหน้าแผนก', building: 'อาคาร 110 ปี', floor: '1st Floor' },
  { id: 'ห้องกิจการนักเรียน', building: 'อาคาร 110 ปี', floor: '1st Floor' },
  { id: 'ห้องพักครูวิทย์ 1', building: 'อาคาร 110 ปี', floor: '1st Floor' },
  { id: 'ห้องพักครูวิทย์ 2', building: 'อาคาร 110 ปี', floor: '1st Floor' },
  { id: 'ห้องพักครูภาษาไทย', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: 'ห้องพักครูแนะแนว', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: 'ห้องพักครูสังคม', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: 'ห้องเรียน SEEK', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: 'Lab 1', building: 'อาคาร 110 ปี', floor: '1st Floor' },
  { id: 'Lab 2', building: 'อาคาร 110 ปี', floor: '1st Floor' },
  { id: '601', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: '602', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: '603', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: '604', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: '605', building: 'อาคาร 110 ปี', floor: '2nd Floor' },
  { id: '606', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: '607', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: '608', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: '609', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: '610', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: '611', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: '612', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
  { id: '613', building: 'อาคาร 110 ปี', floor: '3rd Floor' },
]

const ROOM_MODELS: Record<string, string> = {
  '606': '/models/classroom.glb',
  '609': '/models/609.glb',
  '610': '/models/610.glb',

}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4l6 6-6 6" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4l-6 6 6 6" />
    </svg>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full transition-colors duration-200 flex items-center px-1"
      style={{ backgroundColor: on ? '#E53E3E' : '#D1D5DB' }}
    >
      <div
        className="w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: on ? 'translateX(28px)' : 'translateX(0)' }}
      />
    </button>
  )
}

function ProjectorIcon({ color = '#9CA3AF' }: { color?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <rect x="4" y="10" width="30" height="18" rx="4" />
      <rect x="9" y="15" width="10" height="7" rx="2" />
      <circle cx="27" cy="18" r="3.5" />
      <line x1="15" y1="28" x2="13" y2="34" />
      <line x1="23" y1="28" x2="25" y2="34" />
    </svg>
  )
}

function LightIcon({ color = '#9CA3AF' }: { color?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <path d="M19 5C14.03 5 10 9.03 10 14c0 3.3 1.7 6.2 4.3 7.9V25h9.4v-3.1C26.3 20.2 28 17.3 28 14c0-4.97-4.03-9-9-9z" />
      <line x1="14" y1="28" x2="24" y2="28" />
      <line x1="15" y1="31" x2="23" y2="31" />
    </svg>
  )
}

function FanIcon({ color = '#9CA3AF' }: { color?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <circle cx="19" cy="19" r="3" />
      <path d="M19 16C19 10 16 5 12.5 5S8 8.5 10 12s7 4 9 4z" />
      <path d="M22 19C28 19 33 16 33 12.5S29.5 8 26 10s-4 7-4 9z" />
      <path d="M19 22C19 28 22 33 25.5 33S30 29.5 28 26s-7-4-9-4z" />
      <path d="M16 19C10 19 5 22 5 25.5S8.5 30 12 28s4-7 4-9z" />
    </svg>
  )
}

function AirconIcon({ color = '#9CA3AF' }: { color?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <rect x="4" y="8" width="30" height="14" rx="5" />
      <line x1="8" y1="13" x2="26" y2="13" />
      <rect x="26" y="10" width="5" height="8" rx="2" />
      <path d="M9 22L8 30M19 22V30M29 22L30 30" />
    </svg>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill={filled ? '#E53E3E' : 'none'} stroke={filled ? '#E53E3E' : '#D1D5DB'} strokeWidth="1.5">
      <path d="M18 3l3.7 11.3H33l-9.5 6.9 3.6 11.2L18 25.5l-9.1 6.9 3.6-11.2L3 14.3h11.3z" />
    </svg>
  )
}

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute text-[#E53E3E] font-bold" style={style}>✦</div>
  )
}

const WRAPPER = "min-h-screen bg-[#FFD6D6] flex items-center justify-center p-0"
const PHONE = "w-full max-w-[420px] min-h-screen bg-gradient-to-b from-[#fff5f5] to-[#fffafa] flex flex-col overflow-hidden"
const RED = '#E53E3E'

const VALID_USERS = [
  { id: 'Luke', password: '123' },
  { id: 'BoomBoom', password: '281051' },
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [userId, setUserId] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [selectedClass, setSelectedClass] = useState(CLASSES[0])
  const [classPin, setClassPin] = useState('')
  const [appliances, setAppliances] = useState<Record<Exclude<ApplianceId, 'fan'>, boolean>>({
    projector: true,
    light: true,
    aircon: false,
  })
  const [loginError, setLoginError] = useState('')
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceId>('aircon')
  const [temperature, setTemperature] = useState(25)
  const [acMode, setAcMode] = useState<Mode>('Cool')
  const [acFanSpeed, setAcFanSpeed] = useState<FanSpeed>('Auto')
  const [fanSpeed, setFanSpeed] = useState<FanPower>(1)
  const [rating, setRating] = useState(4)
  const [feedbackText, setFeedbackText] = useState('')
  const [hasSpunOnce, setHasSpunOnce] = useState(false)

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('login'), 2800)
      return () => clearTimeout(t)
    }
  }, [screen])

  const handleLogin = () => {
    /*const matched = VALID_USERS.find(
      (u) => u.id === userId.trim() && u.password === loginPass.trim()
    )*/
    if (true) {
      setLoginError('')
      setScreen('classSelect')
    } else {
      setLoginError('Invalid User ID or password')
    }
  }

  const handleClassSelect = (cls: (typeof CLASSES)[0]) => {
    setSelectedClass(cls)
    setClassPin('')
    setScreen('password')
  }

  const handlePinKey = (key: string) => {
    if (key === 'del') setClassPin((p) => p.slice(0, -1))
    else if (classPin.length < 4) setClassPin((p) => p + key)
  }

  const handleApplianceControl = (id: ApplianceId) => {
    setSelectedAppliance(id)
    setScreen('applianceControl')
  }

  const toggleAppliance = (id: Exclude<ApplianceId, 'fan'>) =>
    setAppliances((prev) => ({ ...prev, [id]: !prev[id] }))

  const applianceList: { id: ApplianceId; name: string; Icon: (p: { color?: string }) => React.ReactElement }[] = [
    { id: 'projector', name: 'Projector', Icon: ProjectorIcon },
    { id: 'light', name: 'Light', Icon: LightIcon },
    { id: 'fan', name: 'Fan', Icon: FanIcon },
    { id: 'aircon', name: 'Air-con', Icon: AirconIcon },
  ]

  const appName: Record<ApplianceId, string> = {
    projector: 'Projector',
    light: 'Light',
    fan: 'Fan',
    aircon: 'Air Conditioner',
  }

  // ——— SPLASH ———
  if (screen === 'splash') {
    return (
      <div className={WRAPPER}>
        <div
          className="w-full max-w-[420px] min-h-screen flex flex-col items-center justify-center gap-5"
          style={{ background: 'linear-gradient(160deg, #ff8080 0%, #ffb3b3 50%, #ffe4e4 100%)' }}
        >
          <div className="w-28 h-28 rounded-[28px] shadow-xl overflow-hidden flex items-center justify-center">
            <img 
              src={appIconSrc} 
              alt="Smart Class" 
              className="w-full h-full object-cover scale-220" 
            />
            <div
              className="absolute inset-0 rounded-[36px] opacity-20"
              style={{ background: 'radial-gradient(circle at 40% 35%, white, transparent)' }}
            />
          </div>
          <div className="text-center mt-2">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-sm">Smart Class</h1>
            <p className="text-white/80 text-sm mt-1 font-medium">Classroom Appliance Control</p>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="w-8 h-2.5 rounded-full bg-white" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    )
  }

  // ——— LOGIN ———
  if (screen === 'login') {
    return (
      <div className={WRAPPER}>
        <div className={PHONE}>
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
            <div className="w-28 h-28 rounded-[28px] shadow-xl overflow-hidden flex items-center justify-center">
            <img 
              src={appIconSrc} 
              alt="Smart Class" 
              className="w-full h-full object-cover scale-220" 
            />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: RED }}>
              Smart Class
            </h1>
            <div className="w-full flex flex-col gap-3 mt-2">
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#ffc9c9] bg-white text-gray-700 placeholder-gray-400 text-sm outline-none transition-colors focus:border-[#E53E3E]"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#ffc9c9] bg-white text-gray-700 placeholder-gray-400 text-sm outline-none transition-colors focus:border-[#E53E3E]"
              />
              {loginError && (
                <p className="text-sm font-medium text-center transition-transform duration-300 hover:scale-100" style={{ color: RED }}>
                  {loginError}
                </p>
              )}
              <button
                onClick={handleLogin}
                className="w-full py-4 rounded-2xl font-bold text-white text-base mt-1 active:scale-95 transition-transform shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: RED, boxShadow: '0 4px 20px #E53E3E55' }}
              >
                Login
              </button>
              <button className="text-sm font-medium text-center mt-1" style={{ color: RED }}>
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ——— CLASS SELECT ———
  if (screen === 'classSelect') {
    return (
      <div className={WRAPPER}>
        <div className={PHONE}>
          {/* Header */}
          <div className="px-5 pt-14 pb-4">
            <h2 className="text-xl font-bold text-center" style={{ color: RED }}>
              Select Classroom
            </h2>
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-3">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => handleClassSelect(cls)}
                className="w-full bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm active:scale-95 transition-transform"
              >
                <div className="text-left">
                  <p className="text-3xl font-extrabold leading-none" style={{ color: RED }}>
                    {cls.id}
                  </p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-xs text-gray-400">{cls.building}</span>
                    <span className="text-xs text-gray-400">{cls.floor}</span>
                  </div>
                </div>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ——— PASSWORD ———
  if (screen === 'password') {
    return (
      <div className={WRAPPER}>
        <div className={PHONE}>
          {/* Header */}
          <div className="flex items-center px-5 pt-12 pb-4">
            <button
              onClick={() => setScreen('classSelect')}
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
            >
              <ChevronLeft />
            </button>
            <h2 className="flex-1 text-center font-bold pr-9 text-base leading-tight" style={{ color: RED }}>
              Enter Password for{'\n'}Room {selectedClass.id}
            </h2>
          </div>

          <div className="flex-1 flex flex-col px-6 gap-5">
            {/* Class display + PIN dots */}
            <div className="bg-white rounded-2xl py-6 px-5 flex flex-col items-center gap-5 shadow-sm">
              <p className="text-5xl font-extrabold" style={{ color: RED }}>
                {selectedClass.id}
              </p>
              <div className="flex gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-150"
                    style={{
                      borderColor: i < classPin.length ? RED : '#ffc9c9',
                      backgroundColor: i < classPin.length ? '#fff0f0' : 'white',
                    }}
                  >
                    {i < classPin.length ? (
                      <span style={{ color: RED }}>●</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={() => classPin.length >= 4 && setScreen('applianceSelect')}
              disabled={classPin.length < 4}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-opacity shadow-lg"
              style={{
                backgroundColor: RED,
                opacity: classPin.length < 4 ? 0.5 : 1,
                boxShadow: classPin.length >= 4 ? '0 4px 20px #E53E3E55' : 'none',
              }}
            >
              Confirm
            </button>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, i) => {
                if (key === '') return <div key={i} />
                return (
                  <button
                    key={i}
                    onClick={() => handlePinKey(key)}
                    className="h-14 rounded-2xl font-semibold text-xl flex items-center justify-center active:scale-90 transition-transform"
                    style={{
                      backgroundColor: key === 'del' ? '#ffe4e4' : 'white',
                      color: RED,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    {key === 'del' ? (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 3H6L2 11l4 8h8l5.5-8z" />
                        <line x1="10" y1="8" x2="15" y2="13" />
                        <line x1="15" y1="8" x2="10" y2="13" />
                      </svg>
                    ) : (
                      key
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ——— APPLIANCE SELECT ———
  if (screen === 'applianceSelect') {
    return (
      <div className={WRAPPER}>
        <div className={PHONE}>
          {/* Header */}
        <div className="flex items-center px-5 pt-12 pb-4">
          <button
            onClick={() => setScreen('classSelect')}
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ChevronLeft />
          </button>
          <h2 className="flex-1 text-center font-bold pr-9 text-base" style={{ color: RED }}>
            Control Room {selectedClass.id}
          </h2>
        </div>

          {ROOM_MODELS[selectedClass.id] ? (
            <ClassroomViewer
              modelPath={ROOM_MODELS[selectedClass.id]}
              onApplianceClick={handleApplianceControl}
              applianceStates={{
                projector: appliances.projector,
                light: appliances.light,
                aircon: appliances.aircon,
                fan: fanSpeed > 0,
              }}
            />
          ) : (
          // Original button grid for every other room
        <div className="flex-1 overflow-y-auto px-5 pb-4 grid grid-cols-2 gap-4">
          {applianceList.map(({ id, name, Icon }) => {
            const isOn = id === 'fan' ? fanSpeed > 0 : appliances[id]
            return (
              <button
                key={id}
                onClick={() => handleApplianceControl(id)}
                className="bg-white rounded-2xl p-5 flex flex-col items-start gap-3 shadow-sm active:scale-95 transition-transform"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center p-2.5"
                  style={{ backgroundColor: isOn ? '#ffe4e4' : '#F3F4F6' }}
                >
                  <Icon color={isOn ? RED : '#9CA3AF'} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isOn ? RED : '#D1D5DB' }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isOn ? RED : '#9CA3AF' }}
                    >
                      {isOn ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
        </div>
      </div>
    )
  }

  // ——— APPLIANCE CONTROL ———
  if (screen === 'applianceControl') {
    const isOn = selectedAppliance === 'fan' ? fanSpeed > 0 : appliances[selectedAppliance]

    return (
      <div className={WRAPPER}>
        <div className={PHONE}>
          {/* Header */}
          <div className="flex items-center px-5 pt-12 pb-4">
            <button
              onClick={() => setScreen('applianceSelect')}
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
            >
              <ChevronLeft />
            </button>
            <h2 className="flex-1 text-center font-bold pr-9 text-sm leading-snug" style={{ color: RED }}>
              {appName[selectedAppliance]} — Room {selectedClass.id}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-4">

            {/* AIR CONDITIONER */}
            {selectedAppliance === 'aircon' && (
              <>
                {/* Visual */}
                <div className="bg-white rounded-2xl py-7 flex flex-col items-center gap-3 shadow-sm">
                  {/* AC illustration */}
                  <svg width="220" height="80" viewBox="0 0 220 80" fill="none">
                    <rect x="10" y="10" width="200" height="45" rx="12" fill="#ffe4e4" stroke={RED} strokeWidth="2" />
                    <rect x="22" y="22" width="90" height="6" rx="3" fill={RED} opacity="0.3" />
                    <rect x="22" y="34" width="70" height="4" rx="2" fill={RED} opacity="0.2" />
                    <rect x="168" y="14" width="18" height="32" rx="5" fill={RED} opacity="0.5" />
                    <rect x="155" y="17" width="11" height="26" rx="4" fill={RED} opacity="0.3" />
                    <rect x="10" y="55" width="200" height="6" rx="3" fill="#ffe4e4" stroke={RED} strokeWidth="1" opacity="0.5" />
                    <path d="M30 68 Q55 78 80 68" stroke={RED} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
                    <path d="M75 72 Q100 82 125 72" stroke={RED} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
                    <path d="M120 68 Q145 78 170 68" stroke={RED} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
                  </svg>
                  <div className="text-center">
                    <p className="text-5xl font-extrabold" style={{ color: RED }}>{temperature}°C</p>
                    <span className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: RED }}>
                      {acMode}
                    </span>
                  </div>
                </div>

                {/* Temperature */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 mb-4">Temperature</p>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => setTemperature((t) => Math.max(16, t - 1))}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform"
                      style={{ backgroundColor: '#ffe4e4', color: RED }}
                    >
                      −
                    </button>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-gray-800">{temperature}</span>
                      <span className="text-xl text-gray-400 ml-1">°C</span>
                    </div>
                    <button
                      onClick={() => setTemperature((t) => Math.min(30, t + 1))}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform"
                      style={{ backgroundColor: '#ffe4e4', color: RED }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Mode */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 mb-3">Mode</p>
                  <div className="flex gap-2">
                    {(['Cool', 'Fan', 'Heat', 'Dry'] as Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setAcMode(m)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors active:scale-95"
                        style={{
                          backgroundColor: acMode === m ? RED : '#fff0f0',
                          color: acMode === m ? 'white' : RED,
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fan Speed */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 mb-3">Fan Speed</p>
                  <div className="flex gap-2">
                    {(['Auto', 'Low', 'High'] as FanSpeed[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setAcFanSpeed(s)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors active:scale-95"
                        style={{
                          backgroundColor: acFanSpeed === s ? RED : '#fff0f0',
                          color: acFanSpeed === s ? 'white' : RED,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power */}
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Power</p>
                    <p className="text-xs text-gray-400 mt-0.5">{isOn ? 'Working...' : 'Standby'}</p>
                  </div>
                  <Toggle on={isOn} onToggle={() => toggleAppliance('aircon')} />
                </div>
              </>
            )}

            {/* FAN */}
            {selectedAppliance === 'fan' && (
              <>
                <div className="bg-white rounded-2xl py-8 flex flex-col items-center gap-4 shadow-sm">
                  <div
                    className="w-32 h-32 rounded-full border-4 flex items-center justify-center"
                    style={{ borderColor: isOn ? '#ffe4e4' : '#F3F4F6' }}
                  >
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" stroke={isOn ? RED : '#D1D5DB'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="36" cy="36" r="6" />
                      <path d="M36 30C36 19 30 10 24 10s-10 7-6 14 14 8 18 6z" />
                      <path d="M42 36C53 36 62 30 62 24s-7-10-14-6-8 14-6 18z" />
                      <path d="M36 42C36 53 42 62 48 62s10-7 6-14-14-8-18-6z" />
                      <path d="M30 36C19 36 10 42 10 48s7 10 14 6 8-14 6-18z" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold" style={{ color: isOn ? RED : '#9CA3AF' }}>
                    {isOn ? 'Running' : 'Stopped'}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 mb-3">Power Level</p>
                  <div className="flex gap-2">
                    {([0, 1, 2, 3] as FanPower[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setFanSpeed(p)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors active:scale-95"
                        style={{
                          backgroundColor: fanSpeed === p ? RED : '#fff0f0',
                          color: fanSpeed === p ? 'white' : RED,
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* PROJECTOR */}
            {selectedAppliance === 'projector' && (
              <>
                <div className="bg-white rounded-2xl py-8 flex flex-col items-center gap-4 shadow-sm">
                  <div
                    className="w-32 h-32 rounded-full border-4 flex items-center justify-center"
                    style={{ borderColor: isOn ? '#ffe4e4' : '#F3F4F6' }}
                  >
                    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke={isOn ? RED : '#D1D5DB'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="8" y="18" width="54" height="32" rx="8" />
                      <rect x="16" y="26" width="20" height="14" rx="3" />
                      <circle cx="52" cy="33" r="7" />
                      <line x1="26" y1="50" x2="23" y2="60" />
                      <line x1="44" y1="50" x2="47" y2="60" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold" style={{ color: isOn ? RED : '#9CA3AF' }}>
                    {isOn ? 'Projecting' : 'Standby'}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Power</p>
                    <p className="text-xs text-gray-400 mt-0.5">{isOn ? 'On' : 'Off'}</p>
                  </div>
                  <Toggle on={isOn} onToggle={() => toggleAppliance('projector')} />
                </div>
              </>
            )}

            {/* LIGHT */}
            {selectedAppliance === 'light' && (
              <>
                <div className="bg-white rounded-2xl py-8 flex flex-col items-center gap-4 shadow-sm">
                  <div
                    className="w-32 h-32 rounded-full border-4 flex items-center justify-center"
                    style={{
                      borderColor: isOn ? '#ffe4e4' : '#F3F4F6',
                      boxShadow: isOn ? '0 0 40px #ffb3b380' : 'none',
                    }}
                  >
                    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke={isOn ? RED : '#D1D5DB'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M35 8C26 8 19 15 19 24c0 6 3 11.2 7.7 14.2V42h16.6v-3.8C47 35.2 51 30 51 24c0-9-7-16-16-16z" fill={isOn ? '#ffe4e4' : 'none'} />
                      <line x1="27" y1="46" x2="43" y2="46" />
                      <line x1="29" y1="51" x2="41" y2="51" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold" style={{ color: isOn ? RED : '#9CA3AF' }}>
                    {isOn ? 'Light On' : 'Light Off'}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Power</p>
                    <p className="text-xs text-gray-400 mt-0.5">{isOn ? 'On' : 'Off'}</p>
                  </div>
                  <Toggle on={isOn} onToggle={() => toggleAppliance('light')} />
                </div>
              </>
            )}

            {/* Send Command */}
            <button
              onClick={() => setScreen('success')}
              className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform shadow-lg"
              style={{ backgroundColor: RED, boxShadow: '0 4px 20px #E53E3E55' }}
            >
              Send Command
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ——— SUCCESS ———
  if (screen === 'success') {
    return (
      <div className={WRAPPER}>
        <div className={PHONE}>
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
            {/* Sparkle checkmark */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <Sparkle style={{ top: '8%', left: '50%', fontSize: 18 }} />
              <Sparkle style={{ top: '20%', right: '10%', fontSize: 14 }} />
              <Sparkle style={{ top: '20%', left: '10%', fontSize: 12 }} />
              <Sparkle style={{ bottom: '15%', right: '12%', fontSize: 16 }} />
              <Sparkle style={{ bottom: '15%', left: '12%', fontSize: 14 }} />
              <Sparkle style={{ bottom: '8%', left: '50%', fontSize: 10 }} />
              {/* Outer ring */}
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#ffe4e4' }}
              >
                {/* Inner circle */}
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#ffc9c9' }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-white"
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke={RED} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 20l8 9 16-17" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-extrabold" style={{ color: RED }}>Success!</h2>
              <p className="text-gray-500 text-sm mt-2 font-medium">Command sent successfully</p>
            </div>

            <button
              onClick={() => setScreen('feedback')}
              className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform shadow-lg"
              style={{ backgroundColor: RED, boxShadow: '0 4px 20px #E53E3E55' }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ——— FEEDBACK ———
  if (screen === 'feedback') {
    return (
      <div className={WRAPPER}>
        <div className={PHONE}>
          {/* Header */}
          <div className="flex items-center px-5 pt-12 pb-4">
            <button
              onClick={() => setScreen('applianceSelect')}
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
            >
              <ChevronLeft />
            </button>
            <h2 className="flex-1 text-center font-bold pr-9 text-base" style={{ color: RED }}>
              Send Feedback
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-4">
            {/* Feedback text */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500 mb-3">Your feedback</p>
              <textarea
                placeholder="Please write your feedback here"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
                className="w-full border-2 border-[#ffc9c9] rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none transition-colors focus:border-[#E53E3E]"
              />
            </div>

            {/* Star rating */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500 mb-1">Overall satisfaction</p>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="active:scale-90 transition-transform"
                  >
                    <StarIcon filled={star <= rating} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {rating === 5
                  ? 'Excellent!'
                  : rating === 4
                  ? 'Very good'
                  : rating === 3
                  ? 'Good'
                  : rating === 2
                  ? 'Fair'
                  : 'Poor'}
              </p>
            </div>

            <button
              onClick={() => {
                setFeedbackText('')
                setRating(4)
                setScreen('applianceSelect')
              }}
              className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform shadow-lg"
              style={{ backgroundColor: RED, boxShadow: '0 4px 20px #E53E3E55' }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
