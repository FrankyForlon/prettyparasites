
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  brightness: number;
  twinkleSpeed: number;
}

const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    let animationFrameId: number;

    // Create a space-like gradient background
    const createSpaceBackground = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      gradient.addColorStop(0, '#0a0a12');
      gradient.addColorStop(0.5, '#0d0d1f');
      gradient.addColorStop(1, '#000000');
      return gradient;
    };

    const createParticle = () => {
      if (particles.length > 150) return;
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.2, // Varying star sizes
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        life: 1,
        brightness: Math.random() * 0.5 + 0.5, // Varying brightness
        twinkleSpeed: Math.random() * 0.02 + 0.01 // Individual twinkle speed
      });
    };

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number
    ) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      gradient.addColorStop(0.1, `rgba(255, 255, 255, ${alpha * 0.8})`);
      gradient.addColorStop(0.4, `rgba(200, 220, 255, ${alpha * 0.4})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = createSpaceBackground();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create new particles occasionally
      if (Math.random() < 0.2) createParticle();

      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap particles around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate twinkle effect
        const twinkle = Math.sin(Date.now() * particle.twinkleSpeed) * 0.3 + 0.7;
        const alpha = Math.max(0, particle.life * particle.brightness * twinkle);

        // Draw the star
        drawStar(ctx, particle.x, particle.y, particle.size, alpha);

        particle.life -= 0.001;

        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'black' }}
    />
  );
};

export default ParticleEffect;
