import { Particle } from './types';
import { zodiacConstellations } from './zodiacData';
import { MILKY_WAY_STARS, BACKGROUND_STARS, ZODIAC_DRIFT_SPEED, STAR_DRIFT_SPEED } from './constants';

export const createZodiacParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];
  
  zodiacConstellations.forEach(constellation => {
    let baseX, baseY;
    
    if (constellation.name === 'Alexa') {
      baseX = canvasWidth * 0.2;
      baseY = canvasHeight * 0.2;
    } else if (constellation.name === 'Rasputin') {
      baseX = canvasWidth * 0.8;
      baseY = canvasHeight * 0.8;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 0.3 + 0.2;
      baseX = canvasWidth * (0.5 + Math.cos(angle) * distance);
      baseY = canvasHeight * (0.5 + Math.sin(angle) * distance);
    }
    
    const scale = Math.min(canvasWidth, canvasHeight) * 0.2;
    
    constellation.points.forEach((point, index) => {
      particles.push({
        x: baseX + (point.x - 0.5) * scale,
        y: baseY + (point.y - 0.5) * scale,
        size: 1.2,
        speedX: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
        speedY: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
        brightness: 1,
        nextConnections: point.connections.map(i => particles.length + i),
        hasIncomingConnection: false,
        isMainStar: true,
        color: point.color || 'rgba(255, 255, 255, 1)',
        intensity: 1.2,
        isZodiac: true,
        zodiacName: index === 0 ? constellation.name : undefined,
        customColor: point.color
      });
    });
  });

  return particles;
};

export const createMilkyWayParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];
  const bandCenterY = canvasHeight * 0.5;
  const bandWidth = canvasHeight * 0.6;
  
  for (let i = 0; i < MILKY_WAY_STARS; i++) {
    const x = Math.random() * canvasWidth;
    const distFromCenter = Math.random() * bandWidth - bandWidth/2;
    const y = bandCenterY + distFromCenter + Math.sin(x/canvasWidth * Math.PI * 2) * bandWidth/4;
    
    const distanceFromBandCenter = Math.abs(y - bandCenterY) / (bandWidth/2);
    const brightnessMultiplier = Math.max(0, 1 - distanceFromBandCenter);
    const brightness = Math.random() * 0.5 * brightnessMultiplier + 0.2;

    particles.push({
      x,
      y,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      speedY: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      brightness,
      nextConnections: [],
      hasIncomingConnection: false,
      isMainStar: false,
      color: `rgba(255, 255, 255, ${brightness})`,
      intensity: brightness
    });
  }

  return particles;
};

export const createBackgroundParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < BACKGROUND_STARS; i++) {
    const brightness = Math.random() * 0.3 + 0.1;
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 1 + 0.5,
      speedX: (Math.random() - 0.5) * STAR_DRIFT_SPEED * 0.5,
      speedY: (Math.random() - 0.5) * STAR_DRIFT_SPEED * 0.5,
      brightness,
      nextConnections: [],
      hasIncomingConnection: false,
      isMainStar: false,
      color: `rgba(255, 255, 255, ${brightness})`,
      intensity: brightness
    });
  }

  return particles;
};

export const drawParticle = (
  ctx: CanvasRenderingContext2D,
  particle: Particle
) => {
  if (particle.isZodiac && particle.nextConnections.length > 0) {
    particle.nextConnections.forEach(targetIndex => {
      const target = particles[targetIndex];
      if (target) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = 'rgba(180, 80, 20, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  }

  if (particle.isZodiac) {
    const glowSize = 8;
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, glowSize
    );
    
    const color = particle.customColor || 'rgba(255, 255, 255, 0.8)';
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.4, color.replace('1)', '0.1)'));
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

  const buffer = 50;
  if (particle.x < -buffer) particle.x = canvasWidth + buffer;
  if (particle.x > canvasWidth + buffer) particle.x = -buffer;
  if (particle.y < -buffer) particle.y = canvasHeight + buffer;
  if (particle.y > canvasHeight + buffer) particle.y = -buffer;
};
