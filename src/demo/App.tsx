import React, { useState, useEffect, useRef, Suspense, memo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

// Lazy load non-critical sections
const ParallaxGallery = React.lazy(() => Promise.resolve({ default: memo(ParallaxGalleryComponent) }));
const Stats = React.lazy(() => Promise.resolve({ default: memo(StatsComponent) }));
const Footer = React.lazy(() => Promise.resolve({ default: memo(FooterComponent) }));

const demoCategories = {
  gym: [
    { name: "Gym Demo 1", category: "Gym", preview: "/demo-previews/gym-demo-1.webp", liveUrl: "https://buc-gym-demo-1.netlify.app" },
    { name: "Gym Demo 2", category: "Gym", preview: "/demo-previews/gym-demo-2.webp", liveUrl: "https://buc-gym-demo-2.netlify.app" },
    { name: "Gym Demo 3", category: "Gym", preview: "/demo-previews/gym-demo-3.webp", liveUrl: "https://buc-gym-demo-3.netlify.app" },
    { name: "Venom Gym", category: "Gym", preview: "/demo-previews/venom-gym.webp", liveUrl: "https://buc-venom-gym.netlify.app" }
  ],
  clinic: [
    { name: "Clinic Demo 1", category: "Clinic", preview: "/demo-previews/clinic-demo-1.webp", liveUrl: "https://buc-clinic-demo-1.netlify.app" },
    { name: "Clinic Demo 2", category: "Clinic", preview: "/demo-previews/clinic-demo-2.webp", liveUrl: "https://buc-clinic-demo-2.netlify.app" },
    { name: "Clinic Demo 3", category: "Clinic", preview: "/demo-previews/clinic-demo-3.webp", liveUrl: "https://buc-clinic-demo-3.netlify.app" },
    { name: "Clinic Demo 4", category: "Clinic", preview: "/demo-previews/clinic-demo-4.webp", liveUrl: "https://buc-clinic-demo-4.netlify.app" }
  ],
  restaurant: [
    { name: "Restaurant Demo 1", category: "Restaurant", preview: "/demo-previews/restaurant-demo-1.webp", liveUrl: "https://buc-restaurant-demo-1.netlify.app" },
    { name: "Restaurant Demo 2", category: "Restaurant", preview: "/demo-previews/restaurant-demo-2.webp", liveUrl: "https://buc-restaurant-demo-2.netlify.app" },
    { name: "Restaurant Demo 3", category: "Restaurant", preview: "/demo-previews/restaurant-demo-3.webp", liveUrl: "https://buc-restaurant-demo-3.netlify.app" },
    { name: "Restaurant Demo 4", category: "Restaurant", preview: "/demo-previews/restaurant-demo-4.webp", liveUrl: "https://buc-restaurant-demo-4.netlify.app" }
  ],
  coaching: [
    { name: "Coaching Demo 1", category: "Coaching", preview: "/demo-previews/coaching-demo-1.webp", liveUrl: "https://buc-coaching-demo-1.netlify.app" },
    { name: "Coaching Demo 2", category: "Coaching", preview: "/demo-previews/coaching-demo-2.webp", liveUrl: "https://buc-coaching-demo-2.netlify.app" },
    { name: "Coaching Demo 3", category: "Coaching", preview: "/demo-previews/coaching-demo-3.webp", liveUrl: "https://buc-coaching-demo-3.netlify.app" },
    { name: "Coaching Demo 4", category: "Coaching", preview: "/demo-previews/coaching-demo-4.webp", liveUrl: "https://buc-coaching-demo-4.netlify.app" }
  ],
  ecommerce: [
    { name: "E-commerce Demo 1", category: "E-commerce", preview: "/demo-previews/ecommerce-demo-1.webp", liveUrl: "https://sarthak-ecommerce-demo-1-app.netlify.app" },
    { name: "E-commerce Demo 2", category: "E-commerce", preview: "/demo-previews/ecommerce-demo-2.webp", liveUrl: "https://sarthak-ecommerce-demo-2-app.netlify.app" },
    { name: "E-commerce Demo 3", category: "E-commerce", preview: "/demo-previews/ecommerce-demo-3.webp", liveUrl: "https://sarthak-ecommerce-demo-3-app.netlify.app" },
    { name: "E-commerce Demo 4", category: "E-commerce", preview: "/demo-previews/ecommerce-demo-4.webp", liveUrl: "https://sarthak-ecommerce-demo-4-app.netlify.app" }
  ]
};

const CategoryNav = memo(({ activeCategory }: { activeCategory: string }) => {
  const categories = [
    { id: "gym", label: "GYM", href: "/demo.html" },
    { id: "clinic", label: "CLINIC", href: "/clinic-demos.html" },
    { id: "restaurant", label: "RESTAURANT", href: "/restaurant-demos.html" },
    { id: "coaching", label: "COACHING", href: "/coaching-demos.html" },
    { id: "ecommerce", label: "E-COMMERCE", href: "/ecommerce-demos.html" }
  ];

  return (
    <div className="flex justify-center mt-12 mb-8 px-6">
      <div className="inline-flex flex-wrap justify-center gap-2 md:gap-3 rounded-full backdrop-blur-sm border border-stroke bg-surface p-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <a 
              key={cat.id} 
              href={cat.href}
              className={`text-xs sm:text-sm rounded-full px-5 py-2 transition-all duration-300 ${isActive ? 'bg-text-primary text-bg font-medium shadow-md scale-105' : 'text-muted hover:text-text-primary hover:bg-stroke/50'}`}
            >
              {cat.label}
            </a>
          );
        })}
      </div>
    </div>
  );
});

export default function App() {
  const [activeCategory, setActiveCategory] = useState("gym");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("clinic")) setActiveCategory("clinic");
    else if (path.includes("restaurant")) setActiveCategory("restaurant");
    else if (path.includes("coaching")) setActiveCategory("coaching");
    else if (path.includes("ecommerce")) setActiveCategory("ecommerce");
    else setActiveCategory("gym");
  }, []);

  const currentDemos = demoCategories[activeCategory as keyof typeof demoCategories] || demoCategories.gym;

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Hero />
        <CategoryNav activeCategory={activeCategory} />
        <Suspense fallback={null}>
          <ParallaxGallery demos={currentDemos} categoryName={activeCategory} />
          <Stats />
          <Footer />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}


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
        
        <a href="/" className="group relative w-9 h-9 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300" title="Crestiva Web Studio">
          <img 
            src="/crestiva-logo.svg" 
            alt="Crestiva Web Studio Logo" 
            className="w-full h-full object-contain block" 
            referrerPolicy="no-referrer"
          />
        </a>

        <div className="hidden md:block w-px h-5 bg-stroke mx-1" />

        <div className="flex items-center px-2">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors text-muted hover:text-text-primary hover:bg-stroke/50 bg-transparent border-0 outline-none cursor-pointer"
          >
            Back
          </button>
          {["Home", "Work"].map((item, i) => {
            const isHome = item === "Home";
            return (
              <a 
                key={item} 
                href={isHome ? "/" : "#work"}
                onClick={(e) => {
                  if (!isHome) {
                    e.preventDefault();
                    const element = document.getElementById('work');
                    if (element) {
                      const navbarHeight = 80;
                      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                      const offsetPosition = elementPosition - navbarHeight;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                    }
                  }
                }}
                className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors ${isHome ? 'text-text-primary bg-stroke/50' : 'text-muted hover:text-text-primary hover:bg-stroke/50'}`}
              >
                {item}
              </a>
            );
          })}
        </div>

        <div className="w-px h-5 bg-stroke mx-1" />

        <div 
          onClick={() => {
            const trigger = document.getElementById('ai-concierge-orb-wrapper');
            if (trigger) {
              trigger.click();
            } else {
              console.warn("AI Concierge orb trigger (#ai-concierge-orb-wrapper) not found.");
            }
          }}
          className="group relative ml-2 cursor-pointer"
        >
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





const ParallaxGalleryComponent = ({ demos, categoryName }: { demos: any[], categoryName: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (!containerRef.current || !gridRef.current || isMobile) return;
    
    const cols = gsap.utils.toArray('.parallax-col');
    cols.forEach((col: any, i) => {
      gsap.to(col, {
        yPercent: i % 2 === 0 ? -10 : -25, // Gentle parallax that won't overlap heading or footer
        ease: "none",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }, [isMobile]);

  const leftDemos = demos.filter((_, i) => i % 2 === 0);
  const rightDemos = demos.filter((_, i) => i % 2 !== 0);

  const titleMap: Record<string, string> = {
    gym: "Gym Websites",
    clinic: "Clinic Websites",
    restaurant: "Restaurant Websites",
    coaching: "Coaching Websites",
    ecommerce: "E-Commerce Websites"
  };

  const title = titleMap[categoryName] || "Project demos";

  return (
    <section ref={containerRef} className="relative bg-bg overflow-hidden" id="work">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center px-4 pt-16 pb-12 md:pt-24 md:pb-24 z-10 relative"
      >
        <div className="text-xs text-muted uppercase tracking-[0.3em] mb-4">Recent Work</div>
        <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
          {title}
        </h2>
        <p className="text-muted max-w-md mx-auto pointer-events-auto">
          A curated collection of our recent web projects and interactive experiences.
        </p>
      </motion.div>

      <div ref={gridRef} className="relative z-20 pb-24 md:pb-40">
        <div className="hidden md:grid max-w-[1400px] mx-auto grid-cols-2 gap-12 md:gap-24 lg:gap-40 px-6">
          <div className="parallax-col flex flex-col justify-start gap-24 lg:gap-32 items-end pointer-events-auto">
            {leftDemos.map((p, i) => (
              <a key={i} href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="block w-full max-w-[500px] lg:max-w-[600px] aspect-video bg-surface border border-stroke rounded-3xl transform rotate-[-2deg] hover:rotate-0 transition-transform cursor-pointer overflow-hidden group">
                <img src={p.preview} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-neutral-800/10 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
              </a>
            ))}
          </div>
          <div className="parallax-col flex flex-col justify-start gap-24 lg:gap-32 pt-16 lg:pt-32 items-start pointer-events-auto">
            {rightDemos.map((p, i) => (
              <a key={i} href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="block w-full max-w-[500px] lg:max-w-[600px] aspect-video bg-surface border border-stroke rounded-3xl transform rotate-[2deg] hover:rotate-0 transition-transform cursor-pointer overflow-hidden group">
                <img src={p.preview} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-neutral-800/10 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
              </a>
            ))}
          </div>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-8 px-6 pointer-events-auto max-w-[500px] mx-auto">
           {demos.map((p, i) => (
              <a key={i} href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="block w-full aspect-video bg-surface border border-stroke rounded-3xl overflow-hidden group relative transform transition-transform cursor-pointer">
                <img src={p.preview} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-neutral-800/10 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
              </a>
           ))}
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


