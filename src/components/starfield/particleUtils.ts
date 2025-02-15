
import { Particle } from './types';
import { zodiacConstellations } from './zodiacData';
import { MILKY_WAY_STARS, BACKGROUND_STARS, ZODIAC_DRIFT_SPEED, STAR_DRIFT_SPEED } from './constants';

export const createZodiacParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];
  
  zodiacConstellations.forEach(constellation => {
    const baseX = Math.random() * (canvasWidth - 200) + 100;
    const baseY = Math.random() * (canvasHeight - 200) + 100;
    
    constellation.points.forEach((point, index) => {
      particles.push({
        x: baseX + point.x * 100,
        y: baseY + point.y * 100,
        size: 1.2,
        speedX: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
        speedY: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
        brightness: 0.8,
        nextConnections: point.connections,
        hasIncomingConnection: false,
        isMainStar: true,
        color: 'rgba(255, 255, 255, 0.9)',
        intensity: 0.9,
        isZodiac: true,
        zodiacName: index === 0 ? constellation.name : undefined
      });
    });
  });

  return particles;
};

export const createMilkyWayParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];
  const bandCenterY = canvasHeight * 0.5;
  const bandWidth = canvasHeight * 0.4;
  
  for (let i = 0; i < MILKY_WAY_STARS; i++) {
    const x = Math.random() * canvasWidth;
    const distFromCenter = Math.random() * bandWidth - bandWidth/2;
    const y = bandCenterY + distFromCenter + Math.sin(x/canvasWidth * Math.PI * 2) * bandWidth/3;
    
    const distanceFromBandCenter = Math.abs(y - bandCenterY) / bandWidth;
    const brightnessMultiplier = Math.max(0, 1 - distanceFromBandCenter * 2);
    const brightness = Math.random() * 0.3 * brightnessMultiplier + 0.05;

    particles.push({
      x,
      y,
      size: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      speedY: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      brightness,
      nextConnections: [],
      hasIncomingConnection: false,
      isMainStar: false,
      color: `rgba(200, 220, 255, ${brightness})`,
      intensity: brightness
    });
  }

  return particles;
};

export const createBackgroundParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < BACKGROUND_STARS; i++) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 0.2 + 0.1,
      speedX: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      speedY: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      brightness: Math.random() * 0.15 + 0.05,
      nextConnections: [],
      hasIncomingConnection: false,
      isMainStar: false,
      color: 'rgba(255, 255, 255, 0.1)',
      intensity: Math.random() * 0.1 + 0.05
    });
  }

  return particles;
};

export const drawParticle = (
  ctx: CanvasRenderingContext2D,
  particle: Particle
) => {
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
};

export const updateParticlePosition = (
  particle: Particle,
  canvasWidth: number,
  canvasHeight: number
) => {
  particle.x += particle.speedX;
  particle.y += particle.speedY;

  if (particle.x < 0) particle.x = canvasWidth;
  if (particle.x > canvasWidth) particle.x = 0;
  if (particle.y < 0) particle.y = canvasHeight;
  if (particle.y > canvasHeight) particle.y = 0;
};
