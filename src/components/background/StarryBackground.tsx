
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

    // Colors for the gradient animation
    const colors = [
      { r: 255, g: 255, b: 255 }, // White
      { r: 14, g: 165, b: 233 }, // Navy Blue
      { r: 254, g: 215, b: 170 }, // Light orange
      { r: 249, g: 115, b: 22 },  // Orange (primary)
      { r: 0, g: 0, b: 0 },       // Black
      { r: 14, g: 165, b: 233 },  // Navy Blue again
      { r: 249, g: 115, b: 22 },  // Orange (primary)
      { r: 254, g: 215, b: 170 }, // Light orange
      { r: 255, g: 255, b: 255 }, // Back to white
    ]

    let colorIndex = 0
    let nextColorIndex = 1
    let colorTransitionProgress = 0
    const colorTransitionSpeed = 0.003 // Lower for slower transitions

    let animationFrameId: number
    
    const animate = () => {
      // Clear the canvas with a soft gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      
      // Current color blend based on transition progress
      const currentColor = colors[colorIndex]
      const nextColor = colors[nextColorIndex]
      
      const r = Math.floor(currentColor.r + (nextColor.r - currentColor.r) * colorTransitionProgress)
      const g = Math.floor(currentColor.g + (nextColor.g - currentColor.g) * colorTransitionProgress)
      const b = Math.floor(currentColor.b + (nextColor.b - currentColor.b) * colorTransitionProgress)
      
      // Create gradient with the blended colors
      gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.7)`)
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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
