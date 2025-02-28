
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface WavyBackgroundProps {
  className?: string;
  animate?: boolean;
  children: React.ReactNode;
}

const WavyBackground: React.FC<WavyBackgroundProps> = ({ className = "", animate = true, children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    let animationFrameId: number;
    let increment = 0;
    
    const draw = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Wave parameters
      const waveHeight = canvas.height * 0.1;
      const waveCount = 3;
      const waveSpacing = canvas.height / waveCount;
      
      // Colors for the waves
      const colors = [
        "rgba(155, 135, 245, 0.3)", // Primary brand color with opacity
        "rgba(155, 135, 245, 0.2)",
        "rgba(155, 135, 245, 0.1)",
      ];
      
      // Draw each wave
      for (let i = 0; i < waveCount; i++) {
        const y = canvas.height - (i * waveSpacing) - waveSpacing / 2;
        const amplitude = waveHeight * (1 - i / waveCount);
        const frequency = 0.01 + (i * 0.005);
        const speed = 0.05 - (i * 0.01);
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        // Draw wave path
        for (let x = 0; x < canvas.width; x++) {
          const angle = x * frequency + increment * speed;
          const sinValue = Math.sin(angle);
          
          ctx.lineTo(x, y + sinValue * amplitude);
        }
        
        // Complete the path for filling
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // Fill the wave
        ctx.fillStyle = colors[i] || "rgba(155, 135, 245, 0.1)";
        ctx.fill();
      }
      
      if (animate) {
        increment += 0.05;
        animationFrameId = requestAnimationFrame(draw);
      }
    };
    
    draw();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [animate]);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default WavyBackground;
