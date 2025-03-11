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

    // Colors for the gradient animation - matching footer gradient (gray-900, gray-800, gray-900)
    const colors = [
      { r: 17, g: 24, b: 39 },      // gray-900
      { r: 31, g: 41, b: 55 },      // gray-800
      { r: 17, g: 24, b: 39 },      // gray-900
    ]

    let colorIndex = 0
    let nextColorIndex = 1
    let colorTransitionProgress = 0
    const colorTransitionSpeed = 0.002 // Lower for slower transitions

    let animationFrameId: number
    
    // Create spot objects for the gradient spot effects
    const spots = Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 400 + 200,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2
    }))

    const animate = () => {
      // Fill the canvas with dark gray background (matching footer)
      ctx.fillStyle = 'rgb(17, 24, 39)' // gray-900
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Current color blend based on transition progress
      const currentColor = colors[colorIndex]
      const nextColor = colors[nextColorIndex]
      
      const r = Math.floor(currentColor.r + (nextColor.r - currentColor.r) * colorTransitionProgress)
      const g = Math.floor(currentColor.g + (nextColor.g - currentColor.g) * colorTransitionProgress)
      const b = Math.floor(currentColor.b + (nextColor.b - currentColor.b) * colorTransitionProgress)
      
      // Draw gradient spots
      spots.forEach(spot => {
        // Move spots slowly
        spot.x += spot.speedX
        spot.y += spot.speedY
        
        // Wrap around edges
        if (spot.x < -spot.radius) spot.x = canvas.width + spot.radius
        if (spot.x > canvas.width + spot.radius) spot.x = -spot.radius
        if (spot.y < -spot.radius) spot.y = canvas.height + spot.radius
        if (spot.y > canvas.height + spot.radius) spot.y = -spot.radius
        
        // Create radial gradient for each spot
        const gradient = ctx.createRadialGradient(
          spot.x, spot.y, 0,
          spot.x, spot.y, spot.radius
        )
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`)
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.1)`)
        gradient.addColorStop(1, 'rgba(17, 24, 39, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update color transition progress
      colorTransitionProgress += colorTransitionSpeed
      
      // Move to next color when transition completes
      if (colorTransitionProgress >= 1) {
        colorTransitionProgress = 0
        colorIndex = nextColorIndex
        nextColorIndex = (nextColorIndex + 1) % colors.length
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-50">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  )
}

export default StarryBackground
