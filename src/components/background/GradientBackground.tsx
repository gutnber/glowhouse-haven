
import { useEffect, useRef } from 'react';

interface GradientBackgroundProps {
  colors: Array<{ r: number; g: number; b: number; a?: number }>;
  className?: string;
}

const GradientBackground = ({ colors, className = '' }: GradientBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let colorIndex = 0;
    let nextColorIndex = 1;
    let colorTransitionProgress = 0;
    const colorTransitionSpeed = 0.003; // Slightly faster than the starry background

    let animationFrameId: number;
    
    // Create spot objects for the gradient spot effects
    const spots = Array.from({ length: 4 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 150,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3
    }));

    const animate = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Current color blend based on transition progress
      const currentColor = colors[colorIndex];
      const nextColor = colors[nextColorIndex];
      
      const r = Math.floor(currentColor.r + (nextColor.r - currentColor.r) * colorTransitionProgress);
      const g = Math.floor(currentColor.g + (nextColor.g - currentColor.g) * colorTransitionProgress);
      const b = Math.floor(currentColor.b + (nextColor.b - currentColor.b) * colorTransitionProgress);
      
      // Draw gradient spots
      spots.forEach(spot => {
        // Move spots slowly
        spot.x += spot.speedX;
        spot.y += spot.speedY;
        
        // Wrap around edges
        if (spot.x < -spot.radius) spot.x = canvas.width + spot.radius;
        if (spot.x > canvas.width + spot.radius) spot.x = -spot.radius;
        if (spot.y < -spot.radius) spot.y = canvas.height + spot.radius;
        if (spot.y > canvas.height + spot.radius) spot.y = -spot.radius;
        
        // Create radial gradient for each spot
        const gradient = ctx.createRadialGradient(
          spot.x, spot.y, 0,
          spot.x, spot.y, spot.radius
        );
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.2)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update color transition progress
      colorTransitionProgress += colorTransitionSpeed;
      
      // Move to next color when transition completes
      if (colorTransitionProgress >= 1) {
        colorTransitionProgress = 0;
        colorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % colors.length;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};

export default GradientBackground;
