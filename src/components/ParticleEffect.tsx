
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
    const CLUSTER_CENTERS = 8; // Reduced max cluster size to 8
    const MAX_DISTANCE = Math.min(window.innerWidth / 5, 150);
    const MIN_DISTANCE = 20;

    // Limited color palette: white, blue, and red
    const starColors = [
      'rgba(255, 255, 255, 0.4)',  // White
      'rgba(30, 30, 200, 0.4)',    // Deep Blue
      'rgba(200, 30, 30, 0.4)',    // Deep Red
    ];

    // Create major stars first (fewer of them)
    for (let i = 0; i < CLUSTER_CENTERS; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        size: 0.8, // Even smaller main stars
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        brightness: Math.random() * 0.2 + 0.2, // Lower brightness
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: true,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: Math.random() * 0.3 + 0.2 // Lower intensity
      });
    }

    // Create many more smaller stars
    for (let i = 0; i < 1000; i++) { // Increased to 1000 stars
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      particles.push({
        x,
        y,
        size: 0.4, // Even smaller background stars
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        brightness: Math.random() * 0.15 + 0.05, // Much lower brightness
        nextConnection: null,
        hasIncomingConnection: false,
        isMainStar: false,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: Math.random() * 0.15 + 0.05 // Much lower intensity
      });
    }

    // Create sequential constellation connections
    const createConstellations = () => {
      let currentClusterSize = 0;
      let lastConnectedIndex = null;

      particles.forEach((particle, index) => {
        if (currentClusterSize >= 8) { // Reset after 8 connections
          currentClusterSize = 0;
          lastConnectedIndex = null;
        }

        if (lastConnectedIndex === null) {
          // Start a new cluster
          if (!particle.hasIncomingConnection) {
            currentClusterSize = 1;
            lastConnectedIndex = index;
          }
        } else if (currentClusterSize < 8) { // Limit cluster size
          // Find closest unconnected star
          const sourceParticle = particles[lastConnectedIndex];
          let closestStar = particles
            .map((p, i) => {
              if (i === lastConnectedIndex) return null;
              if (p.hasIncomingConnection) return null;
              const dx = p.x - sourceParticle.x;
              const dy = p.y - sourceParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < MAX_DISTANCE && distance > MIN_DISTANCE ? { index: i, distance } : null;
            })
            .filter((p): p is { index: number; distance: number } => p !== null)
            .sort((a, b) => a.distance - b.distance)[0];

          if (closestStar) {
            particles[lastConnectedIndex].nextConnection = closestStar.index;
            particles[closestStar.index].hasIncomingConnection = true;
            lastConnectedIndex = closestStar.index;
            currentClusterSize++;
          } else {
            currentClusterSize = 0;
            lastConnectedIndex = null;
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.2;

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

        if (particle.isMainStar) {
          // Reduced glow effect for main stars
          const glowSize = 10; // Reduced from 20
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

        // Draw the actual star point
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
