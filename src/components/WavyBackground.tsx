
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface WavyBackgroundProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  gradient?: boolean;
  waveWidth?: number;
  waveOpacity?: number;
}

const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className = "",
  animated = true,
  gradient = true,
  waveWidth = 50,
  waveOpacity = 0.3,
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  
  useEffect(() => {
    if (!animated || !pathRef.current) return;
    
    const updatePath = (time: number) => {
      const path = pathRef.current;
      if (!path) return;
      
      const randomA = 3 + Math.random() * 5;
      const randomB = 3 + Math.random() * 5;
      
      const height = 1000;
      const width = document.body.clientWidth;
      
      const sineWave = Array(width)
        .fill(0)
        .map((_, x) => {
          const randomOffset = Math.sin(x * 0.01 + time * 0.002) * randomA;
          const randomOffset2 = Math.sin(x * 0.02 + time * 0.001) * randomB;
          const randomOffset3 = Math.sin(x * 0.01 + time * 0.0005) * 10;
          
          const y = Math.sin(x * (waveWidth / 20000) + time * 0.0001) * 30 + 50 + randomOffset + randomOffset2 + randomOffset3;
          
          return [x, y];
        });
      
      const startPoint = `M 0 ${height} L 0 ${sineWave[0][1]}`;
      const sinePoints = sineWave.map((point) => `L ${point[0]} ${point[1]}`).join(" ");
      const endPoint = `L ${width} ${height} Z`;
      
      path.setAttribute("d", `${startPoint} ${sinePoints} L ${width} ${sineWave[sineWave.length - 1][1]} ${endPoint}`);
    };
    
    let animationId: number | null = null;
    let time = 0;
    
    const animate = () => {
      time += 1;
      updatePath(time);
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animated, waveWidth]);
  
  return (
    <div 
      className={`relative overflow-hidden flex flex-col items-center justify-center ${className}`}
      style={{ zIndex: 0 }}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-50/40 z-[-1]" />
      )}
      
      <motion.svg
        viewBox={`0 0 100% 1000`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-[-2] transform-gpu"
        initial={{ opacity: 0 }}
        animate={{ opacity: waveOpacity }}
        transition={{ duration: 1 }}
      >
        <path
          ref={pathRef}
          d="M0 1000 L0 50 L2000 50 L2000 1000 Z"
          className="fill-brand-200/50"
        />
      </motion.svg>
      
      <motion.svg
        viewBox={`0 0 100% 1000`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-[-3] transform-gpu"
        initial={{ opacity: 0 }}
        animate={{ opacity: waveOpacity / 2 }}
        transition={{ duration: 1.5 }}
      >
        <path
          d="M0 1000 L0 100 C500 150 1500 50 2000 100 L2000 1000 Z"
          className="fill-brand-100/50"
        />
      </motion.svg>
      
      {children}
    </div>
  );
};

export default WavyBackground;
