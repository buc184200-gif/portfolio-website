import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  onClick,
  id,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Springs configuration for elastic, high-fps feel
  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic pull distance cap (max 20px offset)
    const pullX = (clientX - centerX) * 0.25;
    const pullY = (clientY - centerY) * 0.25;

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: springX,
        y: springY,
      }}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-shadow duration-300 ${className}`}
    >
      <motion.span 
        animate={{ scale: isHovered ? 1.03 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full flex items-center justify-center gap-2"
      >
        {children}
      </motion.span>
      {/* Subtle outer active border glow */}
      <span className="absolute inset-0 rounded-full border border-white/0 opacity-0 group-hover:opacity-100 group-hover:border-white/10 transition-all duration-300 pointer-events-none" />
    </motion.button>
  );
};
