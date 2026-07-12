import React, { useState, useEffect, useRef, Suspense, memo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

// Lazy load non-critical sections
const SelectedWorks = React.lazy(() => Promise.resolve({ default: memo(SelectedWorksComponent) }));
const Journal = React.lazy(() => Promise.resolve({ default: memo(JournalComponent) }));
const ParallaxGallery = React.lazy(() => Promise.resolve({ default: memo(ParallaxGalleryComponent) }));
const Stats = React.lazy(() => Promise.resolve({ default: memo(StatsComponent) }));
const Footer = React.lazy(() => Promise.resolve({ default: memo(FooterComponent) }));

const LoadingScreen = memo(({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const words = ["Design", "Create", "Inspire"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let start: number;
    const duration = 2700;
    
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * 100));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(onComplete, 400);
      }
    };
    
    requestAnimationFrame(step);

    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    return () => clearInterval(wordInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 overflow-hidden">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-xs text-muted uppercase tracking-[0.3em]"
      >
        Portfolio
      </motion.div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-right text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums">
          {String(count).padStart(3, "0")}
        </div>
        <div className="w-full h-[3px] bg-stroke/50 relative overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 w-full accent-gradient origin-left"
            style={{ 
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)'
            }}
          />
        </div>
      </div>
    </div>
  );
});

const Navbar = memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Replace scroll event listener with Intersection Observer
    const topSentinel = document.createElement('div');
    topSentinel.style.position = 'absolute';
    topSentinel.style.top = '0';
    topSentinel.style.height = '100px';
    topSentinel.style.width = '100%';
    topSentinel.style.pointerEvents = 'none';
    document.body.prepend(topSentinel);

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observerRef.current.observe(topSentinel);

    return () => {
      observerRef.current?.disconnect();
      topSentinel.remove();
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className={`inline-flex items-center rounded-full backdrop-blur-sm border border-white/10 bg-surface px-2 py-2 transition-shadow duration-300 ${scrolled ? 'shadow-md shadow-black/10' : ''}`}>
        
        <div className="group relative w-9 h-9 rounded-full accent-gradient p-[1px] cursor-pointer hover:scale-110 transition-transform">
          <div className="absolute inset-0 rounded-full accent-gradient [background-size:200%_200%] group-hover:animate-gradient-shift" />
          <div className="relative w-full h-full bg-bg rounded-full flex items-center justify-center">
            <span className="font-display italic text-[13px] text-text-primary">JA</span>
          </div>
        </div>

        <div className="hidden md:block w-px h-5 bg-stroke mx-1" />

        <div className="flex items-center px-2">
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors text-muted hover:text-text-primary hover:bg-stroke/50"
          >
            Back
          </a>
          {["Home", "Work", "Resume"].map((item, i) => (
            <a 
              key={item} 
              href="#"
              className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors ${i === 0 ? 'text-text-primary bg-stroke/50' : 'text-muted hover:text-text-primary hover:bg-stroke/50'}`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="w-px h-5 bg-stroke mx-1" />

        <div className="group relative ml-2 cursor-pointer">
          <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-surface rounded-full backdrop-blur-sm text-xs sm:text-sm text-text-primary px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2">
            Say hi <span className="text-[10px]">↗</span>
          </div>
        </div>
      </div>
    </nav>
  );
});

const Hero = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Digital", "Creative", "Development", "Design"];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (videoRef.current) {
      const videoSrc = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
      }
    }

    const roleInterval = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % roles.length);
    }, 2000);

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to('.name-reveal', { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
      .to('.blur-in', { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.9");

    return () => clearInterval(roleInterval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
        <div className="blur-in opacity-0 translate-y-5 blur-[5px] text-xs text-muted uppercase tracking-[0.3em] mb-8" style={{ willChange: 'transform, opacity, filter' }}>
          COLLECTION '26
        </div>
        
        <h1 className="name-reveal opacity-0 translate-y-[50px] text-5xl md:text-7xl lg:text-8xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6" style={{ willChange: 'transform, opacity' }}>
          Crestiva Web Studio
        </h1>
        
        <div className="blur-in opacity-0 translate-y-5 blur-[5px] text-lg md:text-2xl text-text-primary mb-8 font-light" style={{ willChange: 'transform, opacity, filter' }}>
          A <span key={roleIndex} className="font-display italic text-text-primary animate-role-fade-in inline-block">{roles[roleIndex]}</span> studio crafting elegant digital experiences.
        </div>
        
        <p className="blur-in opacity-0 translate-y-5 blur-[5px] text-sm md:text-base text-muted max-w-md mb-12" style={{ willChange: 'transform, opacity, filter' }}>
          We blend creativity with technology to build websites that not only look stunning but drive real business results.
        </p>
        
        <div className="blur-in opacity-0 translate-y-5 blur-[5px] flex flex-wrap justify-center gap-4" style={{ willChange: 'transform, opacity, filter' }}>
          <button className="group relative rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg hover:bg-bg hover:text-text-primary hover:scale-105 transition-all overflow-hidden">
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            <div className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            See Works
          </button>
          
          <button className="group relative rounded-full text-sm px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary hover:border-transparent hover:scale-105 transition-all">
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            <div className="absolute inset-0 bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            Reach out...
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10" style={{ transform: 'translateZ(0)' }}>
        <span className="text-xs text-muted uppercase tracking-[0.2em]">SCROLL</span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-text-primary animate-scroll-down" />
        </div>
      </div>
    </section>
  );
});

const SelectedWorksComponent = () => {
  const projects = [
    { title: "Automotive Motion", span: "md:col-span-7" },
    { title: "Urban Architecture", span: "md:col-span-5" },
    { title: "Human Perspective", span: "md:col-span-5" },
    { title: "Brand Identity", span: "md:col-span-7" }
  ];

  return (
    <section className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Recent <span className="font-display italic">projects</span>
            </h2>
            <p className="text-muted max-w-sm">
              A showcase of our recent digital creations, from concept to launch.
            </p>
          </div>
          
          <button className="hidden md:inline-flex group relative items-center gap-2 rounded-full px-6 py-3 border border-stroke text-sm hover:border-transparent transition-all">
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            <div className="absolute inset-0 bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            View all work <span>→</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {projects.map((p, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-3xl bg-surface border border-stroke aspect-[4/3] md:aspect-auto md:min-h-[400px] ${p.span}`}>
              <div className="absolute inset-0 bg-neutral-800 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
              
              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-opacity duration-500 flex items-center justify-center">
                <div className="relative rounded-full bg-white text-bg px-6 py-3 flex items-center gap-2">
                  <span className="absolute -inset-[2px] rounded-full accent-gradient -z-10 animate-gradient-shift" />
                  <span className="text-sm font-medium">View — <span className="font-display italic text-lg">{p.title}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const JournalComponent = () => {
  const entries = [
    { title: "The Future of Interaction Design", readTime: "5 min read", date: "Oct 12, 2026" },
    { title: "Building Scalable Design Systems", readTime: "8 min read", date: "Sep 28, 2026" },
    { title: "Motion as Meaning", readTime: "4 min read", date: "Sep 15, 2026" },
    { title: "Typography in Digital Spaces", readTime: "6 min read", date: "Aug 30, 2026" }
  ];

  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Journal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Studio <span className="font-display italic">insights</span>
            </h2>
            <p className="text-muted max-w-sm">
              Exploring web development, creative design, and digital strategies.
            </p>
          </div>
          <button className="hidden md:inline-flex group relative items-center gap-2 rounded-full px-6 py-3 border border-stroke text-sm hover:border-transparent transition-all">
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            <div className="absolute inset-0 bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            View all <span>→</span>
          </button>
        </motion.div>

        <div className="flex flex-col gap-4">
          {entries.map((entry, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[40px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-neutral-800 shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-medium group-hover:text-white transition-colors">{entry.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted mt-1">
                  <span>{entry.readTime}</span>
                  <span className="w-1 h-1 rounded-full bg-stroke" />
                  <span>{entry.date}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center sm:opacity-0 group-hover:opacity-100 transition-opacity">
                ↗
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ParallaxGalleryComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || isMobile) return;
    
    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: contentRef.current,
      pinSpacing: false,
    });

    const cols = gsap.utils.toArray('.parallax-col');
    cols.forEach((col: any, i) => {
      gsap.to(col, {
        yPercent: i % 2 === 0 ? -30 : -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => pinTrigger.kill();
  }, [isMobile]);

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-bg overflow-hidden">
      <div ref={contentRef} className="absolute inset-0 h-screen z-10 pointer-events-none flex items-center justify-center text-center px-4">
        <div>
          <div className="text-xs text-muted uppercase tracking-[0.3em] mb-4">Recent Work</div>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            Project <span className="font-display italic">demos</span>
          </h2>
          <p className="text-muted max-w-md mx-auto mb-8 pointer-events-auto">
            A curated collection of our recent web projects and interactive experiences.
          </p>
          <button className="pointer-events-auto rounded-full px-8 py-4 bg-text-primary text-bg font-medium hover:scale-105 transition-transform">
            Follow on Dribbble
          </button>
        </div>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="max-w-[1400px] mx-auto h-full grid grid-cols-2 gap-12 md:gap-40 px-6">
          <div className="parallax-col flex flex-col justify-start gap-32 pt-[20vh] items-end pointer-events-auto">
            {[1,2,3].map(i => (
              <div key={i} className="w-full max-w-[320px] aspect-square bg-surface border border-stroke rounded-3xl transform rotate-[-2deg] hover:rotate-0 transition-transform cursor-pointer" />
            ))}
          </div>
          <div className="parallax-col flex flex-col justify-start gap-32 pt-[60vh] items-start pointer-events-auto">
            {[4,5,6].map(i => (
              <div key={i} className="w-full max-w-[320px] aspect-square bg-surface border border-stroke rounded-3xl transform rotate-[2deg] hover:rotate-0 transition-transform cursor-pointer" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsComponent = () => {
  return (
    <section className="bg-bg py-16 md:py-24 relative z-30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="text-5xl md:text-7xl font-display italic text-text-primary mb-4">2+</div>
          <div className="text-sm text-muted uppercase tracking-widest">Years Experience</div>
        </div>
        <div>
          <div className="text-5xl md:text-7xl font-display italic text-text-primary mb-4">50+</div>
          <div className="text-sm text-muted uppercase tracking-widest">Projects Done</div>
        </div>
        <div>
          <div className="text-5xl md:text-7xl font-display italic text-text-primary mb-4">175%</div>
          <div className="text-sm text-muted uppercase tracking-widest">Satisfied Clients</div>
        </div>
      </div>
    </section>
  );
};

const FooterComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const videoSrc = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
      }
    }

    gsap.to('.marquee-inner', {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1
    });
  }, []);

  return (
    <footer className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden z-30">
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 flex flex-col items-center mb-16">
        <div className="w-full overflow-hidden mb-12">
          <div className="marquee-inner whitespace-nowrap flex text-4xl md:text-7xl font-display italic text-text-primary/20">
            {Array(10).fill("CRESTIVA WEB STUDIO • ").map((text, i) => (
              <span key={i} className="px-4">{text}</span>
            ))}
            {Array(10).fill("CRESTIVA WEB STUDIO • ").map((text, i) => (
              <span key={i+10} className="px-4">{text}</span>
            ))}
          </div>
        </div>
        
        <a href="mailto:crestivawebstudio@gmail.com" className="group relative rounded-full px-12 py-6 bg-surface border border-stroke text-xl md:text-2xl hover:border-transparent transition-all">
          <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          <div className="absolute inset-0 bg-surface rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          crestivawebstudio@gmail.com
        </a>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-8 border-t border-stroke/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6 text-sm text-muted">
          {["Twitter", "LinkedIn", "Dribbble", "GitHub"].map(link => (
            <a key={link} href="#" className="hover:text-text-primary transition-colors">{link}</a>
          ))}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-text-primary bg-surface/50 px-4 py-2 rounded-full border border-stroke">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for projects
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <Navbar />
        <Hero />
        <Suspense fallback={null}>
          <SelectedWorks />
          <Journal />
          <ParallaxGallery />
          <Stats />
          <Footer />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
