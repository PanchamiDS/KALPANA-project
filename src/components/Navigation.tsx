import React from 'react';
import { Rocket } from 'lucide-react';

interface NavigationProps {
  onLaunchClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onLaunchClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg md:text-xl font-bold font-display tracking-tight text-slate-100 hover:text-cyan-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Team ASTRYX-K4
        </a>

        {/* Zone 2: 4-6 clean text navigation links with subtle hover */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#video-theater" className="hover:text-slate-100 transition-colors">
            Mission Video
          </a>
          <a href="#telemetry" className="hover:text-slate-100 transition-colors">
            Telemetry
          </a>
          <a href="#specs" className="hover:text-slate-100 transition-colors">
            Propulsion & Specs
          </a>
          <a href="#team" className="hover:text-slate-100 transition-colors">
            Team
          </a>
          <a href="#copilot" className="hover:text-slate-100 transition-colors">
            AI Copilot
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-md shadow-cyan-600/20 whitespace-nowrap flex items-center gap-1.5"
          >
            <Rocket className="w-3.5 h-3.5" />
            Launch Video
          </button>
        </div>
      </div>
    </header>
  );
};
