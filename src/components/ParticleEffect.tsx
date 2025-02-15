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
  constellationId?: number;
  centerX?: number;
  centerY?: number;
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
    const CLUSTER_CENTERS = 8;
    const MAX_DISTANCE = Math.min(window.innerWidth / 5, 150);
    const MIN_DISTANCE = 20;
    let constellationCounter = 0;

    const starColors = [
      'rgba(255, 255, 255, 0.8)',
      'rgba(30, 30, 200, 0.8)',
      'rgba(200, 30, 30, 0.8)',
    ];

    for (let i = 0; i < CLUSTER_CENTERS; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        size: 0.8,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        brightness: Math.random() * 0.2 + 0.6,
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: true,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: Math.random() * 0.3 + 0.6
      });
    }

    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        size: 0.4,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        brightness: Math.random() * 0.15 + 0.55,
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: false,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: Math.random() * 0.15 + 0.55
      });
    }

    const createConstellations = () => {
      let currentParticle = null;
      let constellationSize = 0;

      particles.forEach((particle, index) => {
        if (particle.hasIncomingConnection || particle.nextConnection !== null) return;

        if (currentParticle === null) {
          currentParticle = index;
          constellationSize = 1;
          constellationCounter++;
          particle.constellationId = constellationCounter;
          
          particle.centerX = particle.x;
          particle.centerY = particle.y;
        } else if (constellationSize < 5) {
          const sourceParticle = particles[currentParticle];
          let closestStar = particles
            .map((p, i) => {
              if (i === currentParticle) return null;
              if (p.hasIncomingConnection) return null;
              if (p.nextConnection !== null) return null;
              const dx = p.x - sourceParticle.x;
              const dy = p.y - sourceParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < MAX_DISTANCE ? { index: i, distance } : null;
            })
            .filter((p): p is { index: number; distance: number } => p !== null)
            .sort((a, b) => a.distance - b.distance)[0];

          if (closestStar) {
            particles[currentParticle].nextConnection = closestStar.index;
            particles[closestStar.index].hasIncomingConnection = true;
            particles[closestStar.index].constellationId = constellationCounter;
            particles[closestStar.index].centerX = sourceParticle.centerX;
            particles[closestStar.index].centerY = sourceParticle.centerY;
            currentParticle = closestStar.index;
            constellationSize++;
          } else {
            currentParticle = null;
            constellationSize = 0;
          }
        } else {
          currentParticle = null;
          constellationSize = 0;
        }
      });
    };

    createConstellations();

    const animate = () => {
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 0.5;

      particles.forEach(particle => {
        if (particle.nextConnection !== null) {
          const nextParticle = particles[particle.nextConnection];
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(nextParticle.x, nextParticle.y);
          ctx.stroke();
        }
      });

      particles.forEach((particle) => {
        if (particle.constellationId && particle.centerX && particle.centerY) {
          const dx = particle.centerX - particle.x;
          const dy = particle.centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const gravity = 0.001;
            particle.speedX += (dx / distance) * gravity;
            particle.speedY += (dy / distance) * gravity;
          }
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        if (particle.isMainStar) {
          const glowSize = 10;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowSize
          );
          
          const color = particle.color.replace(/[\d.]+\)$/g, `${particle.intensity})`);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.4, color.replace(/[\d.]+\)$/g, '0.03)'));
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

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
