
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  brightness: number;
  connections: number[];
  isPartOfConstellation: boolean;
  color: string;
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
    const MAX_DISTANCE = 150;
    const MIN_DISTANCE = 30;
    const BASE_CONNECTION_PROBABILITY = 0.15;

    // Sepia/gold color palette
    const starColors = [
      'rgba(255, 214, 170, 1)',  // Warm gold
      'rgba(255, 198, 145, 1)',  // Light amber
      'rgba(255, 225, 185, 1)',  // Pale gold
      'rgba(255, 235, 205, 1)',  // Blanched almond
    ];

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.3 + 0.1, // Even smaller stars (0.1-0.4)
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        brightness: Math.random() * 0.7 + 0.1, // More variation (0.1-0.8)
        connections: [],
        isPartOfConstellation: false,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    };

    // Create initial particles
    for (let i = 0; i < 150; i++) {
      createParticle();
    }

    // Create constellation connections with improved logic
    const createConstellations = () => {
      const seedPoints = particles
        .map((_, index) => index)
        .filter(() => Math.random() < 0.1);

      seedPoints.forEach(seedIndex => {
        let currentPoint = seedIndex;
        const constellationSize = Math.floor(Math.random() * 4) + 2;
        const usedPoints = new Set([currentPoint]);
        
        for (let i = 0; i < constellationSize; i++) {
          const currentParticle = particles[currentPoint];
          if (!currentParticle) continue;

          currentParticle.isPartOfConstellation = true;
          
          const possibleConnections = particles
            .map((particle, index) => {
              if (usedPoints.has(index)) return null;

              const dx = particle.x - currentParticle.x;
              const dy = particle.y - currentParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < MIN_DISTANCE || distance > MAX_DISTANCE) return null;

              const distanceFactor = 1 - (distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE);
              const constellationFactor = particle.isPartOfConstellation ? 1.5 : 1;
              
              return {
                index,
                probability: distanceFactor * constellationFactor * BASE_CONNECTION_PROBABILITY
              };
            })
            .filter((connection): connection is { index: number; probability: number } => 
              connection !== null
            );

          const totalProbability = possibleConnections.reduce((sum, conn) => sum + conn.probability, 0);
          let random = Math.random() * totalProbability;
          
          for (const connection of possibleConnections) {
            random -= connection.probability;
            if (random <= 0) {
              currentParticle.connections.push(connection.index);
              usedPoints.add(connection.index);
              currentPoint = connection.index;
              break;
            }
          }
        }
      });
    };

    createConstellations();

    const animate = () => {
      // Create sepia-toned background effect
      ctx.fillStyle = 'rgba(28, 23, 30, 0.05)'; // Dark sepia background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines
      ctx.strokeStyle = 'rgba(255, 198, 145, 0.08)'; // Subtle gold color
      ctx.lineWidth = 0.2;

      particles.forEach(particle => {
        particle.connections.forEach(connectedIndex => {
          const connectedParticle = particles[connectedIndex];
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(connectedParticle.x, connectedParticle.y);
          ctx.stroke();
        });
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

        // Draw particle with color and glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Create glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color.replace('1)', `${particle.brightness})`));
        gradient.addColorStop(1, 'rgba(28, 23, 30, 0)');
        
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
        backgroundColor: '#1C171E', // Dark sepia background
      }}
    />
  );
};

export default ParticleEffect;
