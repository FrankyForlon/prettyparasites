
import { ZodiacConstellation } from './types';

export const zodiacConstellations: ZodiacConstellation[] = [
  { 
    name: 'Bokononism', 
    points: [
      { x: 0.4, y: 0.3, connections: [1, 2], color: 'rgba(234, 56, 76, 1)' },
      { x: 0.45, y: 0.32, connections: [2, 3] },
      { x: 0.5, y: 0.35, connections: [3] },
      { x: 0.52, y: 0.38, connections: [] }
    ]
  },
  { 
    name: 'Time', 
    points: [
      { x: 0.3, y: 0.2, connections: [1, 2, 3], color: 'rgba(14, 165, 233, 1)' },
      { x: 0.35, y: 0.22, connections: [2, 4] },
      { x: 0.32, y: 0.25, connections: [3, 5] },
      { x: 0.28, y: 0.23, connections: [5] },
      { x: 0.38, y: 0.26, connections: [6] },
      { x: 0.33, y: 0.28, connections: [6] },
      { x: 0.36, y: 0.3, connections: [] }
    ]
  },
  { 
    name: 'Homework Cat', 
    points: [
      { x: 0.6, y: 0.4, connections: [1, 2], color: 'rgba(234, 56, 76, 1)' },
      { x: 0.63, y: 0.45, connections: [3, 4] },
      { x: 0.58, y: 0.43, connections: [5] },
      { x: 0.65, y: 0.5, connections: [6] },
      { x: 0.61, y: 0.47, connections: [7] },
      { x: 0.56, y: 0.46, connections: [8] },
      { x: 0.67, y: 0.53, connections: [9] },
      { x: 0.59, y: 0.51, connections: [9] },
      { x: 0.54, y: 0.49, connections: [] },
      { x: 0.62, y: 0.55, connections: [] }
    ]
  },
  { 
    name: 'Death', 
    points: [
      { x: 0.7, y: 0.25, connections: [1, 2], color: 'rgba(14, 165, 233, 1)' },
      { x: 0.73, y: 0.28, connections: [3] },
      { x: 0.68, y: 0.27, connections: [4] },
      { x: 0.75, y: 0.3, connections: [5] },
      { x: 0.66, y: 0.29, connections: [5] },
      { x: 0.7, y: 0.32, connections: [] }
    ]
  },
  { 
    name: 'Sounds', 
    points: [
      { x: 0.2, y: 0.6, connections: [1, 2], color: 'rgba(234, 56, 76, 1)' },
      { x: 0.25, y: 0.62, connections: [3] },
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
      { x: 0.45, y: 0.7, connections: [1, 2], color: 'rgba(14, 165, 233, 1)' },
      { x: 0.48, y: 0.72, connections: [3] },
      { x: 0.43, y: 0.73, connections: [4, 5] },
      { x: 0.5, y: 0.75, connections: [6] },
      { x: 0.4, y: 0.76, connections: [7] },
      { x: 0.45, y: 0.78, connections: [8] },
      { x: 0.52, y: 0.77, connections: [9] },
      { x: 0.38, y: 0.79, connections: [9] },
      { x: 0.47, y: 0.81, connections: [] },
      { x: 0.43, y: 0.83, connections: [] }
    ]
  }
];
