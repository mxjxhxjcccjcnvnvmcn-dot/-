
import React, { useEffect, useRef } from 'react';

interface SnowEffectProps {
  duration?: number; // Time in ms before fading starts
}

const SnowEffect: React.FC<SnowEffectProps> = ({ duration = 5000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true }); // Optimized context
    if (!ctx) return;

    let animationFrameId: number;
    let opacity = 1;
    let fading = false;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Snowflake particles with rotation
    const particles: { 
      x: number; 
      y: number; 
      size: number; 
      speed: number; 
      drift: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];
    
    // Reduced particle count for performance (Critical fix for lag)
    const particleCount = width < 768 ? 25 : 50; 

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height, // Start above screen
        size: Math.random() * 10 + 6, // Size
        speed: Math.random() * 2 + 1,
        drift: Math.random() * 0.5 - 0.25,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Start fading out after duration
    const fadeTimeout = setTimeout(() => {
      fading = true;
    }, duration);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (fading) {
        opacity -= 0.02; // Faster fade out
      }

      if (opacity <= 0) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffff';
      // Removed shadowBlur in loop to increase FPS significantly
      // ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      // ctx.shadowBlur = 5; 

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        ctx.font = `${Math.floor(p.size)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("❄", 0, 0);
        
        ctx.restore();

        // Update position
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.rotationSpeed;

        // Reset if moves out of view (only if not fading)
        if (!fading && p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fadeTimeout);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none"
    />
  );
};

export default SnowEffect;
