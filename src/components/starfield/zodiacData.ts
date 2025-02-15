
import { ZodiacConstellation } from './types';

export const zodiacConstellations: ZodiacConstellation[] = [
  { 
    name: 'Aries', 
    points: [
      { x: 0, y: 0, connections: [1, 2] },
      { x: 0.1, y: 0.05, connections: [2] },
      { x: 0.2, y: 0.1, connections: [] }
    ]
  },
  { 
    name: 'Taurus', 
    points: [
      { x: 0.5, y: 0.2, connections: [1, 2, 3] },
      { x: 0.6, y: 0.25, connections: [2] },
      { x: 0.55, y: 0.3, connections: [3] },
      { x: 0.45, y: 0.25, connections: [] }
    ]
  },
  { 
    name: 'Gemini', 
    points: [
      { x: 0.8, y: 0.4, connections: [1, 2] },
      { x: 0.85, y: 0.5, connections: [3] },
      { x: 0.75, y: 0.45, connections: [3] },
      { x: 0.8, y: 0.6, connections: [] }
    ]
  }
];
