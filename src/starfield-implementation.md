
# Starfield Implementation Details

## Component Files

### ParticleEffect.tsx
```typescript
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  brightness: number;
  twinkleSpeed: number;
}

const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const particles: Particle[] = [];

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        life: 1,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    };

    // Create initial particles
    for (let i = 0; i < 200; i++) {
      createParticle();
    }

    const animate = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        const twinkle = Math.sin(Date.now() * particle.twinkleSpeed) * 0.5 + 0.5;
        const alpha = particle.brightness * twinkle;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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
      }}
    />
  );
};

export default ParticleEffect;
```

### Index.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleEffect from '../components/ParticleEffect';

const Index = () => {
  const [answer, setAnswer] = useState('');
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInput(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      navigate('/agents/rasputin', { state: { answer } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <ParticleEffect />
      
      <div className="relative z-[1] max-w-2xl mx-auto px-4 text-center">
        <h1 className="mystical-text text-2xl md:text-3xl lg:text-4xl mb-8 fade-in text-white">
          "You are already dead and waiting to die—whoever hath, to him shall be given, and for he who hath not, all shall be taken away."
        </h1>

        {showInput && (
          <form onSubmit={handleSubmit} className="fade-in">
            <div className="relative mt-12">
              <label htmlFor="answer" className="mystical-text block mb-4 text-xl text-white">
                Are you a have or a have not?
              </label>
              <input
                type="text"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-transparent border-b-2 border-white/20 focus:border-white/60 outline-none px-4 py-2 text-center mystical-text text-lg transition-colors text-white"
                autoFocus
              />
              <div className="typing-cursor" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;
```

## Technical Implementation Description

1. **Objective**: Create an animated starfield effect using HTML5 Canvas as a background layer behind text content.

2. **Implementation Structure**:
   - **Canvas Setup**:
     * Fixed position canvas element covering viewport (100% width/height)
     * zIndex: 0 for background positioning
     * Black background color (#000000)
     * Canvas sizing matches window dimensions with resize handling

   - **Particle System**:
     * Each star is a particle with properties:
       - Position (x, y)
       - Size (0.5-2.5px)
       - Movement speed (small random values for x/y)
       - Brightness (0.5-1.0)
       - Twinkle speed (0.01-0.03)
     * 200 particles created initially
     * Particles wrap around screen edges

   - **Rendering Process**:
     * Clear canvas with semi-transparent black (creates trail effect)
     * Update particle positions
     * Draw particles as white circles with varying opacity
     * Use requestAnimationFrame for smooth animation

3. **Layout Structure**:
   - Root div with black background
   - Canvas as first child (fixed position, z-index: 0)
   - Content div above canvas (z-index: 1)

4. **Current Issue**:
   - Canvas is not visible despite being properly positioned
   - Possible causes:
     * Z-index stacking context issues
     * Canvas clearing/drawing process not working
     * Style conflicts with parent elements

