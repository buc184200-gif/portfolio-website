import React from 'react';
import { motion } from 'motion/react';
import { FadingVideo } from './FadingVideo';
import { BlurText } from './BlurText';

export const HeroSection: React.FC = () => {
  // Common motion settings
  const transitionConfig = (delay: number) => ({
    duration: 0.8,
    ease: 'easeOut',
    delay: delay,
  });

  const animProps = (delay: number) => ({
    initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
    animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
    transition: transitionConfig(delay),
  });

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-between">
      {/* Background video - focal point centered top-aligned, scaled 120% */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: '120%', height: '120%' }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center max-w-4xl mx-auto">
        
        {/* Badge */}
        <motion.div
          {...animProps(0.4)}
          className="inline-flex items-center gap-1.5 p-1 rounded-full liquid-glass mb-6"
        >
          <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full font-body">
            New
          </span>
          <span className="text-sm font-medium text-white/90 font-body pr-3 pl-1">
            Maiden Crewed Voyage to Mars Arrives 2026
          </span>
        </motion.div>

        {/* Headline (using BlurText) */}
        <div className="mb-4">
          <BlurText
            text="Venture Past Our Sky Across the Universe"
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] max-w-2xl justify-center tracking-[-4px]"
          />
        </div>

        {/* Subheading */}
        <motion.p
          {...animProps(0.8)}
          className="text-sm md:text-base text-white max-w-xl font-body font-light leading-tight mt-4"
        >
          Discover the universe in ways once unimaginable. Our pioneering vessels and breakthrough engineering bring deep-space exploration within reach—secure and extraordinary.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...animProps(1.1)}
          className="flex items-center gap-6 mt-8"
        >
          <button className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
            <span>Start Your Voyage</span>
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </button>
          
          <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium cursor-pointer font-body">
            <span>View Liftoff</span>
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white"
              fill="currentColor"
            >
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          {...animProps(1.3)}
          className="flex flex-row flex-wrap items-stretch justify-center gap-4 mt-10 w-full"
        >
          {/* Card 1 */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
            <div>
              {/* Clock outline SVG */}
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="mt-4">
              <span className="font-heading italic text-white text-4xl tracking-[-1px] leading-none block">
                34.5 Min
              </span>
              <span className="text-xs text-white/70 font-body font-light mt-2 block leading-none">
                Average Videos Watch Time
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
            <div>
              {/* Globe outline SVG */}
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="mt-4">
              <span className="font-heading italic text-white text-4xl tracking-[-1px] leading-none block">
                2.8B+
              </span>
              <span className="text-xs text-white/70 font-body font-light mt-2 block leading-none">
                Users Across the Globe
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Partners */}
      <motion.div
        {...animProps(1.4)}
        className="relative z-10 flex flex-col items-center gap-4 pb-8 w-full text-center px-4"
      >
        <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white/95 font-body">
          Collaborating with top aerospace pioneers globally
        </div>
        <div className="flex items-center justify-center gap-8 md:gap-16 font-heading italic text-2xl md:text-3xl tracking-tight text-white/90">
          <span>Aeon</span>
          <span>·</span>
          <span>Vela</span>
          <span>·</span>
          <span>Apex</span>
          <span>·</span>
          <span>Orbit</span>
          <span>·</span>
          <span>Zeno</span>
        </div>
      </motion.div>
    </section>
  );
};
