
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
    const CLUSTER_CENTERS = 8; // Number of dense star regions
    const MAX_DISTANCE = 80; // Shorter maximum distance for connections
    const MIN_DISTANCE = 20;
    const BASE_CONNECTION_PROBABILITY = 0.3; // Higher base probability for denser patterns

    // Create clusters of stars
    const createClusters = () => {
      const clusters = [];
      for (let i = 0; i < CLUSTER_CENTERS; i++) {
        clusters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 200 + 100 // Cluster size
        });
      }
      return clusters;
    };

    const clusters = createClusters();

    // Sepia-toned star colors with more variation
    const starColors = [
      'rgba(255, 214, 170, 1)',  // Warm gold
      'rgba(255, 198, 145, 1)',  // Light amber
      'rgba(255, 225, 185, 1)',  // Pale gold
      'rgba(255, 235, 205, 1)',  // Blanched almond
      'rgba(245, 245, 220, 1)',  // Beige
    ];

    const calculateStarDensity = (x: number, y: number) => {
      let density = 0;
      clusters.forEach(cluster => {
        const dx = x - cluster.x;
        const dy = y - cluster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        density += Math.max(0, 1 - distance / cluster.radius);
      });
      return Math.min(1, density);
    };

    const createParticle = () => {
      // Bias towards cluster centers
      let x = 0, y = 0, density = 0;
      
      if (Math.random() < 0.7) { // 70% of stars appear in clusters
        const cluster = clusters[Math.floor(Math.random() * clusters.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * cluster.radius;
        x = cluster.x + Math.cos(angle) * distance;
        y = cluster.y + Math.sin(angle) * distance;
        density = calculateStarDensity(x, y);
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        density = calculateStarDensity(x, y);
      }

      const intensity = Math.random() * 0.5 + 0.5; // Base star brightness
      const size = Math.random() * 0.3 + (density * 0.3); // Larger stars in denser areas

      particles.push({
        x,
        y,
        size,
        speedX: (Math.random() - 0.5) * 0.05, // Slower movement
        speedY: (Math.random() - 0.5) * 0.05,
        brightness: Math.min(1, intensity + (density * 0.3)),
        connections: [],
        isPartOfConstellation: false,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: intensity
      });
    };

    // Create initial particles
    for (let i = 0; i < 200; i++) {
      createParticle();
    }

    const createConstellations = () => {
      particles.forEach((particle, index) => {
        const nearbyParticles = particles
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
          .slice(0, 2); // Connect to at most 2 closest stars

        nearbyParticles.forEach(nearby => {
          if (Math.random() < BASE_CONNECTION_PROBABILITY * 
              (1 - nearby.distance / MAX_DISTANCE)) {
            particle.connections.push(nearby.index);
          }
        });
      });
    };

    createConstellations();

    const animate = () => {
      // Create sepia background effect with density-based illumination
      ctx.fillStyle = 'rgba(28, 23, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines
      ctx.strokeStyle = 'rgba(255, 198, 145, 0.04)';
      ctx.lineWidth = 0.3;

      particles.forEach(particle => {
        particle.connections.forEach(connectedIndex => {
          const connectedParticle = particles[connectedIndex];
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(connectedParticle.x, connectedParticle.y);
          ctx.stroke();
        });
      });

      // Draw particles with density-based effects
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const density = calculateStarDensity(particle.x, particle.y);
        const adjustedBrightness = particle.brightness * (1 + density * 0.3);

        // Draw particle with enhanced glow in dense regions
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * (2 + density)
        );
        gradient.addColorStop(0, particle.color.replace('1)', `${adjustedBrightness})`));
        gradient.addColorStop(1, 'rgba(28, 23, 30, 0)');
        
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
        backgroundColor: '#1C171E',
      }}
    />
  );
};

export default ParticleEffect;
