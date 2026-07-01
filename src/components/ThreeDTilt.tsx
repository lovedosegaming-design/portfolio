import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface ThreeDTiltProps {
  children: React.ReactNode;
  className?: string;
  max?: number;         // Max tilt rotation in degrees
  perspective?: number; // Perspective value in pixels
  scale?: number;       // Card scale on hover
}

export default function ThreeDTilt({
  children,
  className = '',
  max = 12,
  perspective = 1000,
  scale = 1.03,
}: ThreeDTiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Normalized cursor coordinates (-0.5 to 0.5 relative to the center)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth physics spring configurations
  const springConfig = { damping: 22, stiffness: 200, mass: 0.6 };
  
  // Transform normalized mouse positions to tilt degrees
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), springConfig);
  const springScale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Position of cursor relative to element
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate normalized percentage (0 to 1)
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseEnter = () => {
    springScale.set(scale);
  };

  const handleMouseLeave = () => {
    springScale.set(1);
    x.set(0.5); // Reset to center
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale: springScale,
        transformStyle: 'preserve-3d',
        perspective: `${perspective}px`,
      }}
      className={`will-change-transform ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
