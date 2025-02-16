
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();

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

    // Handle mouse/touch events for dragging
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      
      setViewport(v => ({
        x: v.x - dx,
        y: v.y - dy
      }));
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is on a constellation name
      particlesRef.current.forEach(particle => {
        if (particle.zodiacName) {
          const screenX = particle.x - viewport.x;
          const screenY = particle.y - viewport.y;
          
          if (Math.abs(x - screenX) < 50 && Math.abs(y - screenY) < 20) {
            const path = particle.zodiacName.toLowerCase().replace(/[^a-z0-9]/g, '');
            navigate(`/agents/${path}`);
          }
        }
      });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    const animate = () => {
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

        updateParticlePosition(particle, canvas.width * 3, canvas.height * 3);
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [navigate]);

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
        cursor: isDraggingRef.current ? 'grabbing' : 'grab'
      }}
    />
  );
};

export default ParticleEffect;
