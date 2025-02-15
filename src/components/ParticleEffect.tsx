
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  brightness: number;
  nextConnection: number | null;
  hasIncomingConnection: boolean;
  isMainStar: boolean;
  color: string;
  intensity: number;
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
    const CLUSTER_CENTERS = 12;
    // Reduced to 1/5 of screen width
    const MAX_DISTANCE = Math.min(window.innerWidth / 5, 150);
    const MIN_DISTANCE = 20;

    // Deep, intense star colors
    const starColors = [
      'rgba(255, 255, 255, 0.9)',  // White
      'rgba(255, 50, 50, 0.9)',    // Deep Red
      'rgba(50, 50, 255, 0.9)',    // Deep Blue
      'rgba(255, 100, 0, 0.9)',    // Deep Orange
    ];

    // Create major stars first
    for (let i = 0; i < CLUSTER_CENTERS; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        size: 1.5, // Smaller fixed size
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01,
        brightness: Math.random() * 0.4 + 0.6, // Higher brightness
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: true,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: Math.random() * 0.6 + 0.4 // Higher intensity
      });
    }

    // Create smaller stars
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      particles.push({
        x,
        y,
        size: 0.8, // Smaller fixed size
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01,
        brightness: Math.random() * 0.3 + 0.2,
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: false,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: Math.random() * 0.3 + 0.2
      });
    }

    // Create sequential constellation connections
    const createConstellations = () => {
      particles.forEach((particle, index) => {
        if (!particle.hasIncomingConnection && !particle.nextConnection) {
          let closestStar = particles
            .map((p, i) => {
              if (i === index) return null;
              if (p.hasIncomingConnection) return null;
              const dx = p.x - particle.x;
              const dy = p.y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < MAX_DISTANCE && distance > MIN_DISTANCE ? { index: i, distance } : null;
            })
            .filter((p): p is { index: number; distance: number } => p !== null)
            .sort((a, b) => a.distance - b.distance)[0];

          if (closestStar) {
            particle.nextConnection = closestStar.index;
            particles[closestStar.index].hasIncomingConnection = true;
          }
        }
      });
    };

    createConstellations();

    const animate = () => {
      // Clear with pure black
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines (very subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.3;

      // Draw connections
      particles.forEach(particle => {
        if (particle.nextConnection !== null) {
          const nextParticle = particles[particle.nextConnection];
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(nextParticle.x, nextParticle.y);
          ctx.stroke();
        }
      });

      // Draw particles with deep glow
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Enhanced glow effect
        const glowSize = particle.isMainStar ? 30 : 15;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        // Create deep, intense glow
        const color = particle.color.replace(/[\d.]+\)$/g, `${particle.intensity})`);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.4, color.replace(/[\d.]+\)$/g, '0.1)'));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw the actual star point (small)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
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
