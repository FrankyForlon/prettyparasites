
import { ZodiacConstellation } from './types';

export const zodiacConstellations: ZodiacConstellation[] = [
  { 
    name: 'Aries', 
    points: [
      { x: 0.2, y: 0.2, connections: [1] },
      { x: 0.25, y: 0.22, connections: [2] },
      { x: 0.28, y: 0.25, connections: [] }
    ]
  },
  { 
    name: 'Taurus', 
    points: [
      { x: 0.3, y: 0.3, connections: [1, 2] },
      { x: 0.35, y: 0.32, connections: [] },
      { x: 0.32, y: 0.35, connections: [] }
    ]
  }
  // ... Add other zodiac constellations similarly
];
