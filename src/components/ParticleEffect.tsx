
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  brightness: number;
  nextConnections: number[];
  hasIncomingConnection: boolean;
  isMainStar: boolean;
  color: string;
  intensity: number;
  constellationId?: number;
  centerX?: number;
  centerY?: number;
  constellationExpiry?: number;
  isZodiac?: boolean;
}

interface ZodiacConstellation {
  name: string;
  points: { x: number; y: number; connections: number[] }[];
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

    // Zodiac constellations data (simplified versions)
    const zodiacData: ZodiacConstellation[] = [
      { name: 'Aries', points: [
        { x: 0.2, y: 0.2, connections: [1] },
        { x: 0.25, y: 0.22, connections: [2] },
        { x: 0.28, y: 0.25, connections: [] }
      ]},
      // ... Add other zodiac constellations similarly
    ];

    const particles: Particle[] = [];
    const CLUSTER_CENTERS = 20;
    const BACKGROUND_STARS = 3000; // Increased for Milky Way effect
    const MAX_DISTANCE = Math.min(window.innerWidth / 5, 150);
    let constellationCounter = 0;

    const starColors = [
      'rgba(255, 255, 255, 0.8)',
      'rgba(30, 30, 200, 0.8)',
      'rgba(200, 30, 30, 0.8)',
      'rgba(200, 200, 255, 0.8)', // Added blue-white for Milky Way
    ];

    // Create zodiac constellations
    zodiacData.forEach(constellation => {
      const baseX = Math.random() * (canvas.width - 200) + 100;
      const baseY = Math.random() * (canvas.height - 200) + 100;
      
      constellation.points.forEach((point, index) => {
        particles.push({
          x: baseX + point.x * 100,
          y: baseY + point.y * 100,
          size: 1.2,
          speedX: (Math.random() - 0.5) * 0.08,
          speedY: (Math.random() - 0.5) * 0.08,
          brightness: 0.8,
          nextConnections: point.connections,
          hasIncomingConnection: false,
          isMainStar: true,
          color: 'rgba(255, 255, 255, 0.9)',
          intensity: 0.9,
          isZodiac: true
        });
      });
    });

    // Create main stars
    for (let i = 0; i < CLUSTER_CENTERS; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.8,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        brightness: Math.random() * 0.2 + 0.6,
        nextConnections: [],
        hasIncomingConnection: false,
        isMainStar: true,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        intensity: Math.random() * 0.3 + 0.6
      });
    }

    // Create background stars with varying brightness for Milky Way effect
    for (let i = 0; i < BACKGROUND_STARS; i++) {
      const isMilkyWay = Math.random() < 0.4; // 40% chance of being in Milky Way band
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const brightness = isMilkyWay ? 
        Math.random() * 0.4 + 0.4 : // Brighter for Milky Way
        Math.random() * 0.2 + 0.1;  // Dimmer for background

      particles.push({
        x,
        y,
        size: isMilkyWay ? 0.4 : 0.2,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        brightness,
        nextConnections: [],
        hasIncomingConnection: false,
        isMainStar: false,
        color: isMilkyWay ? 
          'rgba(200, 220, 255, ' + brightness + ')' :
          'rgba(255, 255, 255, ' + brightness + ')',
        intensity: brightness
      });
    }

    const handleCollision = (p1: Particle, p2: Particle) => {
      if (Math.random() < 0.1) { // 10% chance of splitting
        const angle = Math.random() * Math.PI * 2;
        const newSpeed = 0.15;
        
        particles.push({
          x: p1.x,
          y: p1.y,
          size: p1.size * 0.8,
          speedX: Math.cos(angle) * newSpeed,
          speedY: Math.sin(angle) * newSpeed,
          brightness: p1.brightness,
          nextConnections: [],
          hasIncomingConnection: false,
          isMainStar: p1.isMainStar,
          color: p1.color,
          intensity: p1.intensity
        });
      }
    };

    const createConstellations = () => {
      const now = Date.now();
      
      // Reset expired non-zodiac constellations
      particles.forEach(particle => {
        if (!particle.isZodiac && particle.constellationExpiry && now > particle.constellationExpiry) {
          particle.nextConnections = [];
          particle.hasIncomingConnection = false;
          particle.constellationId = undefined;
          particle.centerX = undefined;
          particle.centerY = undefined;
          particle.constellationExpiry = undefined;
        }
      });

      // Create new constellations
      particles.forEach((particle, index) => {
        if (particle.isZodiac || particle.hasIncomingConnection) return;
        
        const nearbyStars = particles
          .map((p, i) => {
            if (i === index || p.isZodiac) return null;
            const dx = p.x - particle.x;
            const dy = p.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < MAX_DISTANCE ? { index: i, distance } : null;
          })
          .filter((p): p is { index: number; distance: number } => p !== null)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3); // Allow up to 3 connections per star

        nearbyStars.forEach(star => {
          if (Math.random() < 0.3) { // 30% chance to form connection
            particle.nextConnections.push(star.index);
            particles[star.index].hasIncomingConnection = true;
          }
        });
      });
    };

    const animate = () => {
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Check for new constellation formation
      createConstellations();

      // Draw connections
      particles.forEach(particle => {
        particle.nextConnections.forEach(targetIndex => {
          const target = particles[targetIndex];
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(target.x, target.y);
          
          if (particle.isZodiac) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 0.8;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.4;
          }
          
          ctx.stroke();
        });
      });

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Check collisions
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < (particle.size + other.size)) {
            handleCollision(particle, other);
          }
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Apply drag
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        // Screen wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw star
        if (particle.isMainStar || particle.isZodiac) {
          const glowSize = particle.isZodiac ? 15 : 10;
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
      }

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
