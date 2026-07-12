import React, { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

export const CursorGlow: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Smooth springs for high performance cursor follow
  const x = useSpring(0, { damping: 40, stiffness: 350 });
  const y = useSpring(0, { damping: 40, stiffness: 350 });

  useEffect(() => {
    setMounted(true);

    // Disable on touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half of the glow element's size (150px)
      x.set(e.clientX - 150);
      y.set(e.clientY - 150);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y, visible]);

  if (!mounted || !visible) return null;

  return (
    <motion.div
      style={{
        x,
        y,
      }}
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[1] opacity-35 filter blur-[80px] bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,rgba(6,182,212,0.1)_70%,transparent_100%)] mix-blend-screen transition-opacity duration-500"
    />
  );
};
