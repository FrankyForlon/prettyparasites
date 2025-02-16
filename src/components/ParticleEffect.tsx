import React, { useEffect, useRef, useState } from 'react';
import { Particle, ViewportPosition } from './starfield/types';
import { 
  createMilkyWayParticles,
  createBackgroundParticles,
  drawParticle,
  updateParticlePosition,
  generateNewConstellation
} from './starfield/particleUtils';
import { VIEWPORT_MOVE_SPEED, INITIAL_CONSTELLATIONS } from './starfield/constants';

const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState<ViewportPosition>({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const keysPressed = useRef<Set<string>>(new Set());

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

    // Initialize particles
    particlesRef.current = [
      ...createMilkyWayParticles(canvas.width, canvas.height),
      ...createBackgroundParticles(canvas.width, canvas.height)
    ];

    // Generate initial constellations
    for (let i = 0; i < INITIAL_CONSTELLATIONS; i++) {
      const newConstellation = generateNewConstellation(
        viewport.x + Math.random() * canvas.width,
        viewport.y + Math.random() * canvas.height,
        particlesRef.current,
        i
      );
      particlesRef.current.push(...newConstellation);
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const updateViewport = () => {
      const speed = VIEWPORT_MOVE_SPEED;
      if (keysPressed.current.has('ArrowLeft')) setViewport(v => ({ ...v, x: v.x - speed }));
      if (keysPressed.current.has('ArrowRight')) setViewport(v => ({ ...v, x: v.x + speed }));
      if (keysPressed.current.has('ArrowUp')) setViewport(v => ({ ...v, y: v.y - speed }));
      if (keysPressed.current.has('ArrowDown')) setViewport(v => ({ ...v, y: v.y + speed }));
    };

    const animate = () => {
      updateViewport();
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles with viewport offset
      particlesRef.current.forEach(particle => {
        const screenX = particle.x - viewport.x;
        const screenY = particle.y - viewport.y;

        // Only draw particles that are on screen
        if (
          screenX >= -100 && screenX <= canvas.width + 100 &&
          screenY >= -100 && screenY <= canvas.height + 100
        ) {
          drawParticle(ctx, { ...particle, x: screenX, y: screenY }, particlesRef.current);
        }

        updateParticlePosition(particle, canvas.width * 3, canvas.height * 3); // Larger area for particles
      });

      // Generate new constellations occasionally
      if (Math.random() < 0.01) {
        const newConstellation = generateNewConstellation(
          viewport.x + Math.random() * canvas.width,
          viewport.y + Math.random() * canvas.height,
          particlesRef.current
        );
        particlesRef.current.push(...newConstellation);
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
