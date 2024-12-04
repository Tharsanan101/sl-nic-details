'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CalendarDays, UserCircle2, Info, Clock } from 'lucide-react'
import { ExplanationPopup } from './explanation-popup'

export default function NICValidator() {
  const [nicNumber, setNicNumber] = useState('')
  const [birthDate, setBirthDate] = useState<string | null>(null)
  const [age, setAge] = useState<number | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const calculateBirthDate = (nic: string) => {
    setError(null)
    setBirthDate(null)
    setGender(null)
    setAge(null)

    const isOldFormat = nic.length === 10 && /^\d{9}[vVxX]$/.test(nic)
    const isNewFormat = nic.length === 12 && /^\d{12}$/.test(nic)

    if (!isOldFormat && !isNewFormat) {
      setError('Please enter a valid NIC number (12 digits or 9 digits)')
      return
    }

    try {
      let year: number
      let days: number

      if (isOldFormat) {
        year = parseInt(nic.substring(0, 2))
        year += year < 50 ? 2000 : 1900
        days = parseInt(nic.substring(2, 5))
      } else {
        year = parseInt(nic.substring(0, 4))
        days = parseInt(nic.substring(4, 7))
      }

      if (days > 500) {
        days -= 500
        setGender('Female')
      } else {
        setGender('Male')
      }

      const date = new Date(year, 0)
      date.setDate(days)
      
      setAge(calculateAge(date))

      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      setBirthDate(formattedDate)
    } catch (err) {
      setError('Invalid NIC number format')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase()
    
    if (value.length <= 10) {
      value = value.replace(/[^0-9VX]/g, '')
    } else {
      value = value.replace(/\D/g, '').slice(0, 12)
    }
    
    setNicNumber(value)
    if (value.length === 10 || value.length === 12) {
      calculateBirthDate(value)
    } else {
      setBirthDate(null)
      setGender(null)
      setAge(null)
      setError(null)
    }
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5
      })
    }

    let mouseX = 0
    let mouseY = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) particle.x = 0
        if (particle.y > canvas.height) particle.y = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y < 0) particle.y = canvas.height

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()

        // Connect particles close to the mouse
        const dx = mouseX - particle.x
        const dy = mouseY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mouseX, mouseY)
          ctx.stroke()
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'overlay' }}
      />
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              rgba(99, 102, 241, 0.15) 0%,
              rgba(99, 102, 241, 0.05) 20%,
              rgba(99, 102, 241, 0.01) 40%,
              transparent 60%),
              radial-gradient(circle at calc(100% - var(--mouse-x, 50%)) calc(100% - var(--mouse-y, 50%)), 
              rgba(79, 70, 229, 0.15) 0%,
              rgba(79, 70, 229, 0.05) 20%,
              rgba(79, 70, 229, 0.01) 40%,
              transparent 60%)
            `,
            transition: 'all 0.3s ease',
          }}
        />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(99,102,241,0.1)_50%,transparent_100%)] animate-[wave_8s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(79,70,229,0.1)_50%,transparent_100%)] animate-[wave_12s_ease-in-out_infinite_reverse]" />
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-lg bg-white/95 backdrop-blur-sm relative z-20">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl text-gray-800">Sri Lanka NIC Analyzer</CardTitle>
          <CardDescription className="text-gray-600 pb-4 border-b">
            Discover the birth date and gender from NIC number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nic" className="text-base font-medium">NIC Number</Label>
            <Input
              id="nic"
              placeholder="197419202757 or 996663272V"
              value={nicNumber}
              onChange={handleInputChange}
              maxLength={12}
              className="text-base bg-gray-50"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {birthDate && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg flex items-start space-x-3">
                <CalendarDays className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Date of Birth</div>
                  <div className="text-gray-900">{birthDate}</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Current Age</div>
                  <div className="text-gray-900">{age} years</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg flex items-start space-x-3">
                <UserCircle2 className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="text-gray-900">{gender}</div>
                </div>
              </div>
            </div>
          )}

          {birthDate && (
            <Button
              onClick={() => setShowPopup(true)}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Info className="w-4 h-4 mr-2" />
              How was this calculated?
            </Button>
          )}
          <div className="mt-6 text-xs text-gray-500 text-center">
            Disclaimer: This tool is for informational purposes only. No personal data is collected or stored.
          </div>
        </CardContent>
      </Card>

      <ExplanationPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        nicNumber={nicNumber}
        birthDate={birthDate}
        gender={gender}
        age={age}
      />
    </div>
  )
}

