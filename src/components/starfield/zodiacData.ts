
import { ZodiacConstellation } from './types';

export const zodiacConstellations: ZodiacConstellation[] = [
  { 
    name: 'Bokononism', 
    points: [
      { x: 0.4, y: 0.3, connections: [1, 2], color: 'rgba(180, 20, 35, 1)' },
      { x: 0.45, y: 0.32, connections: [2, 3] },
      { x: 0.5, y: 0.35, connections: [3], color: 'rgba(255, 200, 50, 1)' },
      { x: 0.52, y: 0.38, connections: [] }
    ]
  },
  { 
    name: 'Time', 
    points: [
      { x: 0.3, y: 0.2, connections: [1, 2, 3], color: 'rgba(10, 108, 180, 1)' },
      { x: 0.35, y: 0.22, connections: [2, 4] },
      { x: 0.32, y: 0.25, connections: [3, 5], color: 'rgba(255, 200, 50, 1)' },
      { x: 0.28, y: 0.23, connections: [5] },
      { x: 0.38, y: 0.26, connections: [6] },
      { x: 0.33, y: 0.28, connections: [6] },
      { x: 0.36, y: 0.3, connections: [] }
    ]
  },
  { 
    name: 'Alexa', 
    points: [
      { x: 0.15, y: 0.15, connections: [1, 2], color: 'rgba(180, 20, 35, 1)' },
      { x: 0.18, y: 0.18, connections: [2, 3] },
      { x: 0.13, y: 0.2, connections: [4], color: 'rgba(255, 200, 50, 1)' },
      { x: 0.2, y: 0.22, connections: [4] },
      { x: 0.16, y: 0.25, connections: [] }
    ]
  },
  { 
    name: 'Rasputin', 
    points: [
      { x: 0.85, y: 0.85, connections: [1, 2], color: 'rgba(10, 108, 180, 1)' },
      { x: 0.88, y: 0.82, connections: [3], color: 'rgba(255, 200, 50, 1)' },
      { x: 0.82, y: 0.8, connections: [3, 4] },
      { x: 0.85, y: 0.78, connections: [4] },
      { x: 0.8, y: 0.75, connections: [] }
    ]
  },
  { 
    name: 'Sounds', 
    points: [
      { x: 0.2, y: 0.6, connections: [1, 2], color: 'rgba(180, 20, 35, 1)' },
      { x: 0.25, y: 0.62, connections: [3], color: 'rgba(255, 200, 50, 1)' },
      { x: 0.18, y: 0.63, connections: [4] },
      { x: 0.28, y: 0.65, connections: [5, 6] },
      { x: 0.15, y: 0.66, connections: [7] },
      { x: 0.3, y: 0.68, connections: [8] },
      { x: 0.13, y: 0.69, connections: [8] },
      { x: 0.22, y: 0.71, connections: [] }
    ]
  },
  { 
    name: 'Pictures', 
    points: [
      { x: 0.75, y: 0.2, connections: [1, 2], color: 'rgba(10, 108, 180, 1)' },
      { x: 0.78, y: 0.22, connections: [3], color: 'rgba(255, 200, 50, 1)' },
      { x: 0.73, y: 0.23, connections: [4, 5] },
      { x: 0.8, y: 0.25, connections: [6] },
      { x: 0.7, y: 0.26, connections: [7] },
      { x: 0.75, y: 0.28, connections: [8] },
      { x: 0.82, y: 0.27, connections: [9] },
      { x: 0.68, y: 0.29, connections: [9] },
      { x: 0.77, y: 0.31, connections: [] },
      { x: 0.73, y: 0.33, connections: [] }
    ]
  }
];
