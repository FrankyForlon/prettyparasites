
import React, { useEffect, useRef } from 'react';
import { Particle } from './starfield/types';
import { 
  createZodiacParticles,
  createMilkyWayParticles,
  createBackgroundParticles,
  drawParticle,
  updateParticlePosition
} from './starfield/particleUtils';

const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const particles: Particle[] = [
      ...createZodiacParticles(canvas.width, canvas.height),
      ...createMilkyWayParticles(canvas.width, canvas.height),
      ...createBackgroundParticles(canvas.width, canvas.height)
    ];

    const animate = () => {
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections for zodiac constellations
      particles.forEach(particle => {
        if (particle.isZodiac) {
          particle.nextConnections.forEach(targetIndex => {
            const target = particles[targetIndex];
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });

          // Draw constellation name if this particle has one
          if (particle.zodiacName) {
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.textAlign = 'center';
            ctx.fillText(particle.zodiacName, particle.x, particle.y - 15);
          }
        }
      });

      // Update and draw particles
      particles.forEach(particle => {
        updateParticlePosition(particle, canvas.width, canvas.height);
        drawParticle(ctx, particle);
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundColor: '#000000',
      }}
    />
  );
};

export default ParticleEffect;
