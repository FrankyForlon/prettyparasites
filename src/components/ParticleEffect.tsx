
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  brightness: number;
  nextConnection: number | null; // Store only the next connected star
  hasIncomingConnection: boolean; // Track if star is already connected to
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
    const MAX_DISTANCE = 100; // Shorter distance for closer connections
    const MIN_DISTANCE = 30;

    // Star colors matching the image
    const mainStarColors = [
      'rgba(0, 255, 255, 0.8)',  // Cyan
      'rgba(255, 215, 0, 0.8)',  // Gold
      'rgba(50, 205, 50, 0.8)',  // Green
    ];

    const smallStarColors = [
      'rgba(255, 255, 255, 0.7)', // White
      'rgba(173, 216, 230, 0.7)', // Light blue
      'rgba(240, 230, 140, 0.7)', // Light yellow
    ];

    // Create major stars first
    for (let i = 0; i < CLUSTER_CENTERS; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        size: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 0.01, // Slower movement
        speedY: (Math.random() - 0.5) * 0.01, // Slower movement
        brightness: Math.random() * 0.3 + 0.7,
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: true,
        color: mainStarColors[Math.floor(Math.random() * mainStarColors.length)],
        intensity: Math.random() * 0.5 + 0.5
      });
    }

    // Create smaller stars around major stars
    for (let i = 0; i < 300; i++) {
      const nearMainStar = Math.random() < 0.7;
      let x, y;

      if (nearMainStar && particles.length > 0) {
        const mainStar = particles[Math.floor(Math.random() * CLUSTER_CENTERS)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 20;
        x = mainStar.x + Math.cos(angle) * distance;
        y = mainStar.y + Math.sin(angle) * distance;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      }

      particles.push({
        x,
        y,
        size: Math.random() * 1 + 0.5,
        speedX: (Math.random() - 0.5) * 0.01, // Slower movement
        speedY: (Math.random() - 0.5) * 0.01, // Slower movement
        brightness: Math.random() * 0.5 + 0.3,
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: false,
        color: smallStarColors[Math.floor(Math.random() * smallStarColors.length)],
        intensity: Math.random() * 0.3 + 0.2
      });
    }

    // Create sequential constellation connections
    const createConstellations = () => {
      particles.forEach((particle, index) => {
        if (!particle.hasIncomingConnection && !particle.nextConnection) {
          // Find the closest star that hasn't been connected yet
          let closestStar = particles
            .map((p, i) => {
              if (i === index) return null;
              if (p.hasIncomingConnection) return null; // Skip if already connected to
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
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 20, 40, 0.1)');
      gradient.addColorStop(1, 'rgba(40, 40, 20, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;

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

      // Draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Create star glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * (particle.isMainStar ? 4 : 2)
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
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
        backgroundColor: '#001428',
      }}
    />
  );
};

export default ParticleEffect;
