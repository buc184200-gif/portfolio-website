import React from "react";
import { motion } from "motion/react";

export const ArtifactOrb: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none select-none z-[-1]">
      {/* Central Glowing AI core */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-10 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 filter blur-[40px] opacity-40 mix-blend-screen"
      />

      {/* Central glass sphere overlay */}
      <motion.div 
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-20 rounded-full border border-white/20 bg-gradient-to-tr from-white/10 to-transparent backdrop-blur-[4px] flex items-center justify-center shadow-[inset_0_4px_24px_rgba(255,255,255,0.15)]"
      >
        {/* Core light spot */}
        <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
      </motion.div>

      {/* Primary Orbital Ring */}
      <motion.div
        animate={{
          rotate: 360,
          rotateX: [65, 65, 65],
          rotateY: [15, 15, 15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute inset-4 rounded-full border border-blue-500/30 border-dashed"
      />

      {/* Secondary Orbital Ring (reversed) */}
      <motion.div
        animate={{
          rotate: -360,
          rotateX: [25, 25, 25],
          rotateY: [-35, -35, -35],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute -inset-2 rounded-full border border-cyan-400/20 border-dotted"
      />

      {/* Orbit nodes */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"
      />
      <motion.div
        animate={{
          y: [10, -10, 10],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-10 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
      />
    </div>
  );
};
