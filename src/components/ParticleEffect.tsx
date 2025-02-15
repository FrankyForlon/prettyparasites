
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  brightness: number;
  connections: number[];
}

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

    const particles: Particle[] = [];
    const MAX_DISTANCE = 150; // Maximum distance for constellation lines
    const CONNECTION_PROBABILITY = 0.3; // Probability of forming a connection

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.8 + 0.2, // Smaller stars (0.2-1.0)
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        brightness: Math.random() * 0.3 + 0.7,
        connections: [], // Store indices of connected particles
      });
    };

    // Create initial particles
    for (let i = 0; i < 150; i++) {
      createParticle();
    }

    // Create constellation connections
    particles.forEach((particle, index) => {
      particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MAX_DISTANCE && Math.random() < CONNECTION_PROBABILITY) {
            particle.connections.push(otherIndex);
          }
        }
      });
    });

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines first
      ctx.strokeStyle = 'rgba(158, 158, 158, 0.15)'; // Subtle gray color for lines
      ctx.lineWidth = 0.2;

      particles.forEach((particle, index) => {
        particle.connections.forEach(connectedIndex => {
          const connectedParticle = particles[connectedIndex];
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(connectedParticle.x, connectedParticle.y);
          ctx.stroke();
        });
      });

      // Then draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.brightness})`;
        ctx.fill();
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
