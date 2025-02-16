
import { Particle } from './types';
import { 
  MILKY_WAY_STARS, 
  BACKGROUND_STARS, 
  ZODIAC_DRIFT_SPEED, 
  STAR_DRIFT_SPEED,
  MAX_CONNECTION_DISTANCE,
  MIN_CONSTELLATION_STARS,
  MAX_CONSTELLATION_STARS,
  INITIAL_CONSTELLATION_NAMES
} from './constants';

export const generateNewConstellation = (
  baseX: number,
  baseY: number,
  existingParticles: Particle[],
  nameIndex?: number
): Particle[] => {
  const constellation: Particle[] = [];
  const numStars = Math.floor(Math.random() * (MAX_CONSTELLATION_STARS - MIN_CONSTELLATION_STARS + 1)) + MIN_CONSTELLATION_STARS;
  const spread = 200; // Maximum distance between stars in the constellation

  // Create first star
  const firstStar = {
    x: baseX + (Math.random() - 0.5) * spread,
    y: baseY + (Math.random() - 0.5) * spread,
    size: 1.2,
    speedX: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
    speedY: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
    brightness: 1,
    nextConnections: [1], // Will connect to the next star
    hasIncomingConnection: false,
    isMainStar: true,
    color: 'rgba(255, 255, 255, 1)',
    intensity: 1.2,
    isZodiac: true,
    zodiacName: nameIndex !== undefined ? INITIAL_CONSTELLATION_NAMES[nameIndex] : undefined
  };
  constellation.push(firstStar);

  // Create remaining stars
  for (let i = 1; i < numStars; i++) {
    // Get previous star as reference
    const prevStar = constellation[i - 1];
    
    // Create new star near the previous one
    const newStar = {
      x: prevStar.x + (Math.random() - 0.5) * MAX_CONNECTION_DISTANCE,
      y: prevStar.y + (Math.random() - 0.5) * MAX_CONNECTION_DISTANCE,
      size: 1.2,
      speedX: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
      speedY: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
      brightness: 1,
      nextConnections: i < numStars - 1 ? [i + 1] : [], // Connect to next star if not last
      hasIncomingConnection: true,
      isMainStar: true,
      color: 'rgba(255, 255, 255, 1)',
      intensity: 1.2,
      isZodiac: true
    };
    constellation.push(newStar);
  }

  return constellation;
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
  particle: Particle,
  allParticles: Particle[]
) => {
  if (particle.isZodiac && particle.nextConnections.length > 0) {
    particle.nextConnections.forEach(targetIndex => {
      const target = allParticles[targetIndex];
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

    // Draw constellation name
    if (particle.zodiacName) {
      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(particle.zodiacName, particle.x, particle.y - 15);
    }
  }

  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
};

export const updateParticlePosition = (
  particle: Particle,
  worldWidth: number,
  worldHeight: number
) => {
  particle.x += particle.speedX;
  particle.y += particle.speedY;

  // Wrap around in a larger world space
  if (particle.x < 0) particle.x = worldWidth;
  if (particle.x > worldWidth) particle.x = 0;
  if (particle.y < 0) particle.y = worldHeight;
  if (particle.y > worldHeight) particle.y = 0;
};
