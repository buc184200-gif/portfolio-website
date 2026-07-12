import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-4 left-0 right-0 max-w-7xl mx-auto px-8 lg:px-16 z-50 flex justify-between items-center">
      {/* Left: 48x48 liquid-glass circle */}
      <div className="w-12 h-12 rounded-full flex items-center justify-center liquid-glass">
        <span className="font-heading italic font-normal text-2xl text-white lowercase">a</span>
      </div>

      {/* Center (desktop only): liquid-glass pill */}
      <div className="hidden md:flex items-center gap-2 p-1.5 rounded-full liquid-glass">
        {['Home', 'Voyages', 'Worlds', 'Innovation', 'Plan Launch'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(' ', '-')}`}
            className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
          >
            {link}
          </a>
        ))}
        
        {/* Claim a spot button */}
        <button className="flex items-center gap-1.5 bg-white text-black text-sm font-medium font-body px-4 py-2 rounded-full hover:bg-white/90 transition-colors whitespace-nowrap">
          Claim a Spot
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </button>
      </div>

      {/* Right: 48x48 invisible spacer to balance logo */}
      <div className="w-12 h-12 pointer-events-none opacity-0" aria-hidden="true" />
    </nav>
  );
};
