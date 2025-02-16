import { Particle } from './types';
import { 
  MILKY_WAY_STARS, 
  BACKGROUND_STARS, 
  ZODIAC_DRIFT_SPEED, 
  STAR_DRIFT_SPEED,
  MAX_CONNECTION_DISTANCE,
  MIN_CONSTELLATION_STARS,
  MAX_CONSTELLATION_STARS,
  INITIAL_CONSTELLATION_NAMES,
  STAR_COLORS,
  CONSTELLATION_STOP_PROBS,
  CONSTELLATION_NAME_COLORS
} from './constants';

export const generateNewConstellation = (
  baseX: number,
  baseY: number,
  existingParticles: Particle[],
  nameIndex?: number
): Particle[] => {
  const constellation: Particle[] = [];
  // Determine constellation size based on probabilities
  let numStars = 5; // Minimum 5 points
  const random = Math.random();
  if (random > CONSTELLATION_STOP_PROBS.AFTER_5_POINTS) {
    numStars = 6;
    if (random > CONSTELLATION_STOP_PROBS.AFTER_5_POINTS + CONSTELLATION_STOP_PROBS.AFTER_6_POINTS) {
      numStars = 7;
      if (random > 1 - CONSTELLATION_STOP_PROBS.CONTINUE) {
        numStars = Math.floor(Math.random() * 3) + 8; // 8-10 stars
      }
    }
  }

  // Create first star
  const firstStar = {
    x: baseX + (Math.random() - 0.5) * MAX_CONNECTION_DISTANCE,
    y: baseY + (Math.random() - 0.5) * MAX_CONNECTION_DISTANCE,
    size: 0.8,
    speedX: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
    speedY: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
    brightness: 0.8,
    nextConnections: [1],
    hasIncomingConnection: false,
    isMainStar: true,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    intensity: 0.8,
    isZodiac: true,
    zodiacName: nameIndex !== undefined ? INITIAL_CONSTELLATION_NAMES[nameIndex] : undefined
  };
  constellation.push(firstStar);

  // Create subsequent stars with sequential connections
  for (let i = 1; i < numStars; i++) {
    const prevStar = constellation[i - 1];
    
    // Find valid connection point near previous star
    let x, y;
    let attempts = 0;
    do {
      x = prevStar.x + (Math.random() - 0.5) * MAX_CONNECTION_DISTANCE;
      y = prevStar.y + (Math.random() - 0.5) * MAX_CONNECTION_DISTANCE;
      attempts++;
    } while (attempts < 10 && !isValidConnectionPoint(x, y, constellation));

    const newStar = {
      x,
      y,
      size: 0.8,
      speedX: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
      speedY: (Math.random() - 0.5) * ZODIAC_DRIFT_SPEED,
      brightness: 0.8,
      nextConnections: i < numStars - 1 ? [i + 1] : [],
      hasIncomingConnection: true,
      isMainStar: true,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      intensity: 0.8,
      isZodiac: true
    };
    constellation.push(newStar);
  }

  return constellation;
};

const isValidConnectionPoint = (x: number, y: number, constellation: Particle[]): boolean => {
  // Check if point would create too many connections
  const nearbyStars = constellation.filter(star => 
    Math.hypot(star.x - x, star.y - y) < MAX_CONNECTION_DISTANCE
  );
  return nearbyStars.length < 2; // Limit to maximum 2 connections
};

export const createMilkyWayParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];
  
  for (let i = 0; i < MILKY_WAY_STARS; i++) {
    const brightness = Math.random() * 0.3 + 0.2;
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 0.5 + Math.random() * 0.3,
      speedX: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      speedY: (Math.random() - 0.5) * STAR_DRIFT_SPEED,
      brightness,
      nextConnections: [],
      hasIncomingConnection: false,
      isMainStar: false,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      intensity: brightness
    });
  }

  return particles;
};

export const createBackgroundParticles = (canvasWidth: number, canvasHeight: number): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < BACKGROUND_STARS; i++) {
    const brightness = Math.random() * 0.2 + 0.1;
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 0.3 + Math.random() * 0.2,
      speedX: (Math.random() - 0.5) * STAR_DRIFT_SPEED * 0.5,
      speedY: (Math.random() - 0.5) * STAR_DRIFT_SPEED * 0.5,
      brightness,
      nextConnections: [],
      hasIncomingConnection: false,
      isMainStar: false,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
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

  if (particle.isZodiac && particle.zodiacName) {
    ctx.font = '16px "Cormorant Garamond", serif';
    ctx.fillStyle = CONSTELLATION_NAME_COLORS[
      Math.floor(Math.random() * CONSTELLATION_NAME_COLORS.length)
    ];
    ctx.textAlign = 'center';
    ctx.fillText(particle.zodiacName, particle.x, particle.y - 15);
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

  if (particle.x < 0) particle.x = worldWidth;
  if (particle.x > worldWidth) particle.x = 0;
  if (particle.y < 0) particle.y = worldHeight;
  if (particle.y > worldHeight) particle.y = 0;
};
