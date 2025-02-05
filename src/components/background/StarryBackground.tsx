import { useEffect, useRef } from 'react'

const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    const stars: Array<{
      x: number
      y: number
      z: number
      radius: number
      color: string
    }> = []

    // Create more stars for a denser effect
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        radius: Math.random() * 2,
        color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
      })
    }

    let animationFrameId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(24, 24, 27, 0.2)' // Darker, more sophisticated background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.z -= 0.5 // Slower movement for a more elegant effect
        if (star.z <= 0) {
          star.z = 1000
          star.x = Math.random() * canvas.width
          star.y = Math.random() * canvas.height
        }

        const x = (star.x - canvas.width / 2) * (1000 / star.z) + canvas.width / 2
        const y = (star.y - canvas.height / 2) * (1000 / star.z) + canvas.height / 2
        const radius = star.radius * (1000 / star.z)

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-orange-900/20 to-zinc-900 pointer-events-none"
      />
    </div>
  )
}

export default StarryBackground