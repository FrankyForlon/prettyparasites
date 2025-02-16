
export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  brightness: number;
  nextConnections: number[];
  hasIncomingConnection: boolean;
  isMainStar: boolean;
  color: string;
  intensity: number;
  isZodiac?: boolean;
  zodiacName?: string;
  customColor?: string;
  worldX?: number; // Position in the infinite world
  worldY?: number;
}

export interface ViewportPosition {
  x: number;
  y: number;
}

export interface ZodiacConstellation {
  name: string;
  points: { 
    x: number; 
    y: number; 
    connections: number[];
    color?: string;
  }[];
}
