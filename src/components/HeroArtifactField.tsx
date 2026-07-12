import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { ArtifactOrb } from "./ArtifactOrb";
import { ArtifactBrowserFrame } from "./ArtifactBrowserFrame";
import { ArtifactPhoneFrame } from "./ArtifactPhoneFrame";
import { ArtifactWireCard } from "./ArtifactWireCard";

export const HeroArtifactField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse coordinate trackers for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring configuration
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        
        // Normalize mouse coordinates around center (-0.5 to 0.5)
        const normalizedX = (clientX - left - width / 2) / width;
        const normalizedY = (clientY - top - height / 2) / height;

        mouseX.set(normalizedX * 45); // Limit maximum parallax offset in pixels
        mouseY.set(normalizedY * 45);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-[1]"
      style={{ perspective: "1000px" }}
    >
      {/* Background Matrix Dotted Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" 
      />

      {/* Floating Ambient Glow Blobs */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] mix-blend-screen" />

      {/* Deep Layer: Central AI Conversion Orb (Z: -200) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateZ: "-200px",
        }}
        className="absolute top-[45%] right-[20%] lg:right-[25%]"
      >
        <ArtifactOrb />
      </motion.div>

      {/* Mid Layer: Float & Parallax Widgets (Z: -100) */}
      {!isMobile && (
        <>
          {/* 1. Website Browser Wireframe Fragment (Top Right) */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateZ: "-100px",
            }}
            className="absolute top-[15%] right-[10%]"
          >
            <motion.div
              animate={{
                y: [-6, 6, -6],
                rotate: [-1, 1, -1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArtifactBrowserFrame className="w-56" title="coaching-hero" />
            </motion.div>
          </motion.div>

          {/* 2. Phone Frame Layout Fragment (Center Left of Mockup) */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateZ: "-50px",
            }}
            className="absolute bottom-[20%] right-[40%]"
          >
            <motion.div
              animate={{
                y: [8, -8, 8],
                rotate: [1, -1, 1]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <ArtifactPhoneFrame className="scale-90" />
            </motion.div>
          </motion.div>

          {/* 3. SEO Ranking Card widget (Bottom Right) */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateZ: "-80px",
            }}
            className="absolute bottom-[10%] right-[12%]"
          >
            <motion.div
              animate={{
                y: [-4, 4, -4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <ArtifactWireCard type="seo" label="Local SEO Boost" />
            </motion.div>
          </motion.div>

          {/* 4. Speed Optimization Meter Card widget (Top Middle) */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateZ: "-120px",
            }}
            className="absolute top-[8%] right-[32%]"
          >
            <motion.div
              animate={{
                y: [4, -4, 4],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <ArtifactWireCard type="speed" label="GTMetrix Performance" />
            </motion.div>
          </motion.div>

          {/* 5. Active Enquiry Lead Badge (Middle Right) */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateZ: "-40px",
            }}
            className="absolute top-[48%] right-[8%]"
          >
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArtifactWireCard type="leads" label="Enquiry Flow" />
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Mobile background fallbacks: Just a couple of small floating indicators for responsive layout */}
      {isMobile && (
        <div className="absolute top-[20%] right-[5%] animate-pulse">
          <ArtifactWireCard type="speed" label="Mobile Ready" className="scale-75 opacity-60" />
        </div>
      )}
    </div>
  );
};
