import { useEffect, useRef } from 'preact/hooks'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

export const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150)

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 200,
        })
      }
    }

    const updateAndDrawParticle = (particle: Particle) => {
      particle.x += particle.speedX
      particle.y += particle.speedY

      if (particle.x < 0) {
        particle.x = canvas.width
      }
      if (particle.x > canvas.width) {
        particle.x = 0
      }
      if (particle.y < 0) {
        particle.y = canvas.height
      }
      if (particle.y > canvas.height) {
        particle.y = 0
      }

      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`
      ctx.fill()
    }

    const drawConnections = () => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 100) {
            continue
          }

          ctx.beginPath()
          ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
          ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
          ctx.stroke()
        }
      }
      ctx.closePath()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particlesRef.current) {
        updateAndDrawParticle(particle)
      }

      ctx.strokeStyle = document.documentElement.classList.contains('dark')
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.2)'
      ctx.lineWidth = 0.5

      drawConnections()

      animationRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div class='absolute inset-0 -z-9999 bg-gradient-to-br from-slate-900 to-blue-950'>
      <canvas ref={canvasRef} class='absolute inset-0' />
    </div>
  )
}
