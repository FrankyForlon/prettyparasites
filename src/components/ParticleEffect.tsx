
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  brightness: number;
  connections: number[];
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
    const CLUSTER_CENTERS = 12; // Number of major stars
    const MAX_DISTANCE = 150; // Longer lines for constellations
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
        size: Math.random() * 3 + 2, // Larger size for main stars
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        brightness: Math.random() * 0.3 + 0.7,
        connections: [],
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
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        brightness: Math.random() * 0.5 + 0.3,
        connections: [],
        isMainStar: false,
        color: smallStarColors[Math.floor(Math.random() * smallStarColors.length)],
        intensity: Math.random() * 0.3 + 0.2
      });
    }

    // Create constellation connections
    particles.forEach((particle, index) => {
      if (particle.isMainStar) {
        const nearbyStars = particles
          .map((p, i) => {
            if (i === index) return null;
            const dx = p.x - particle.x;
            const dy = p.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return { index: i, distance };
          })
          .filter((p): p is { index: number; distance: number } => 
            p !== null && p.distance < MAX_DISTANCE && p.distance > MIN_DISTANCE
          )
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        nearbyStars.forEach(nearby => {
          particle.connections.push(nearby.index);
        });
      }
    });

    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 20, 40, 0.1)');    // Dark blue
      gradient.addColorStop(1, 'rgba(40, 40, 20, 0.1)');   // Dark gold
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;

      particles.forEach(particle => {
        if (particle.isMainStar) {
          particle.connections.forEach(connectedIndex => {
            const connectedParticle = particles[connectedIndex];
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(connectedParticle.x, connectedParticle.y);
            ctx.stroke();
          });
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
        backgroundColor: '#001428', // Deep blue background
      }}
    />
  );
};

export default ParticleEffect;
