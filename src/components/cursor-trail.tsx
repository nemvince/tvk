'use client'
import type { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

interface MousePosition {
  x: number
  y: number
}

interface AnimatedDivElement extends HTMLDivElement {
  animationId?: number
}

const regex = {
  x: /translateX\(([^)]+)\)/,
  y: /translateY\(([^)]+)\)/,
}

export const CursorTrail = (): h.JSX.Element => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const cursorRef = useRef<AnimatedDivElement>(null)
  const dotRef = useRef<AnimatedDivElement>(null)
  const trailRef = useRef<AnimatedDivElement>(null)

  const animateWithSpring = (
    element: AnimatedDivElement | null,
    targetX: number,
    targetY: number,
    damping: number,
    stiffness: number
  ): void => {
    if (!element) {
      return
    }

    let currentX = 0
    let currentY = 0

    if (element.style.transform) {
      const transformX = element.style.transform.match(regex.x)
      const transformY = element.style.transform.match(regex.y)
      currentX = transformX ? Number.parseFloat(transformX[1]) : 0
      currentY = transformY ? Number.parseFloat(transformY[1]) : 0
    }

    let vx = 0
    let vy = 0

    const animate = () => {
      const forceX = (targetX - currentX) * (stiffness / 1000)
      const forceY = (targetY - currentY) * (stiffness / 1000)

      vx = vx * (1 - damping / 100) + forceX
      vy = vy * (1 - damping / 100) + forceY

      currentX += vx
      currentY += vy

      element.style.transform = `translateX(${currentX}px) translateY(${currentY}px)`
      element.animationId = requestAnimationFrame(animate)
    }

    if (element.animationId) {
      cancelAnimationFrame(element.animationId)
    }
    element.animationId = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = (): void => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (cursorRef.current) {
      animateWithSpring(
        cursorRef.current,
        mousePosition.x - 12,
        mousePosition.y - 12,
        25,
        300
      )
      cursorRef.current.style.opacity = isVisible ? '1' : '0'
    }

    if (dotRef.current) {
      animateWithSpring(
        dotRef.current,
        mousePosition.x - 4,
        mousePosition.y - 4,
        50,
        500
      )
      dotRef.current.style.opacity = isVisible ? '1' : '0'
    }

    if (trailRef.current) {
      animateWithSpring(
        trailRef.current,
        mousePosition.x - 24,
        mousePosition.y - 24,
        15,
        150
      )
      trailRef.current.style.opacity = isVisible ? '0.3' : '0'
    }

    return () => {
      if (cursorRef.current?.animationId) {
        cancelAnimationFrame(cursorRef.current.animationId)
      }
      if (dotRef.current?.animationId) {
        cancelAnimationFrame(dotRef.current.animationId)
      }
      if (trailRef.current?.animationId) {
        cancelAnimationFrame(trailRef.current.animationId)
      }
    }
  }, [mousePosition, isVisible])

  return (
    <>
      <div
        ref={cursorRef}
        class='fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-neon-pink pointer-events-none z-50 mix-blend-difference'
        style={{
          transform: `translateX(${mousePosition.x - 12}px) translateY(${mousePosition.y - 12}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      <div
        ref={dotRef}
        class='fixed top-0 left-0 w-2 h-2 rounded-full bg-neon-blue pointer-events-none z-50 mix-blend-difference'
        style={{
          transform: `translateX(${mousePosition.x - 4}px) translateY(${mousePosition.y - 4}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      <div
        ref={trailRef}
        class='fixed top-0 left-0 w-12 h-12 rounded-full border border-neon-blue/30 pointer-events-none z-50 mix-blend-difference'
        style={{
          transform: `translateX(${mousePosition.x - 24}px) translateY(${mousePosition.y - 24}px)`,
          opacity: isVisible ? 0.3 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />
    </>
  )
}
