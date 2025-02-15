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
  isZodiac?: boolean;
  zodiacName?: string;
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

    // Zodiac constellations data
    const zodiacData: ZodiacConstellation[] = [
      { name: 'Aries', points: [
        { x: 0.2, y: 0.2, connections: [1] },
        { x: 0.25, y: 0.22, connections: [2] },
        { x: 0.28, y: 0.25, connections: [] }
      ]},
      { name: 'Taurus', points: [
        { x: 0.3, y: 0.3, connections: [1, 2] },
        { x: 0.35, y: 0.32, connections: [] },
        { x: 0.32, y: 0.35, connections: [] }
      ]},
      // ... Add other zodiac constellations similarly
    ];

    const particles: Particle[] = [];
    const MILKY_WAY_STARS = 8000; // Increased for denser Milky Way
    const BACKGROUND_STARS = 2000;

    // Create zodiac constellations
    zodiacData.forEach(constellation => {
      const baseX = Math.random() * (canvas.width - 200) + 100;
      const baseY = Math.random() * (canvas.height - 200) + 100;
      
      constellation.points.forEach((point, index) => {
        particles.push({
          x: baseX + point.x * 100,
          y: baseY + point.y * 100,
          size: 1.2,
          speedX: (Math.random() - 0.5) * 0.04, // Slower drift for zodiac
          speedY: (Math.random() - 0.5) * 0.04,
          brightness: 0.8,
          nextConnections: point.connections,
          hasIncomingConnection: false,
          isMainStar: true,
          color: 'rgba(255, 255, 255, 0.9)',
          intensity: 0.9,
          isZodiac: true,
          zodiacName: index === 0 ? constellation.name : undefined // Only add name to first star
        });
      });
    });

    // Create Milky Way band stars
    const bandCenterY = canvas.height * 0.5;
    const bandWidth = canvas.height * 0.4;
    
    for (let i = 0; i < MILKY_WAY_STARS; i++) {
      const x = Math.random() * canvas.width;
      const distFromCenter = Math.random() * bandWidth - bandWidth/2;
      const y = bandCenterY + distFromCenter + Math.sin(x/canvas.width * Math.PI * 2) * bandWidth/3;
      
      const distanceFromBandCenter = Math.abs(y - bandCenterY) / bandWidth;
      const brightnessMultiplier = Math.max(0, 1 - distanceFromBandCenter * 2);
      const brightness = Math.random() * 0.3 * brightnessMultiplier + 0.05;

      particles.push({
        x,
        y,
        size: Math.random() * 0.3 + 0.1, // Very small stars
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: (Math.random() - 0.5) * 0.08,
        brightness,
        nextConnections: [],
        hasIncomingConnection: false,
        isMainStar: false,
        color: `rgba(200, 220, 255, ${brightness})`,
        intensity: brightness
      });
    }

    // Create background stars
    for (let i = 0; i < BACKGROUND_STARS; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.2 + 0.1, // Very small background stars
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: (Math.random() - 0.5) * 0.08,
        brightness: Math.random() * 0.15 + 0.05, // Very dim
        nextConnections: [],
        hasIncomingConnection: false,
        isMainStar: false,
        color: 'rgba(255, 255, 255, 0.1)',
        intensity: Math.random() * 0.1 + 0.05
      });
    }

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
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Screen wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw star
        if (particle.isMainStar || particle.isZodiac) {
          const glowSize = particle.isZodiac ? 12 : 8;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowSize
          );
          
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(0.4, particle.color.replace(/[\d.]+\)$/g, '0.03)'));
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
