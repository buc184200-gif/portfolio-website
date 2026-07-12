import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';

function App() {
  // Suppress benign Framer Motion console warnings if they occur
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        (args[0].includes('Framer Motion') || args[0].includes('React does not recognize the'))
      ) {
        return;
      }
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black w-full text-white overflow-x-hidden font-body selection:bg-white/20 selection:text-white">
      {/* Shared fixed Navbar */}
      <Navbar />

      {/* Hero Section (Section 1) */}
      <div id="home">
        <HeroSection />
      </div>

      {/* Capabilities Section (Section 2) */}
      <div id="voyages">
        <CapabilitiesSection />
      </div>
    </main>
  );
}

export default App;
