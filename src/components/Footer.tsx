import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-slate-200 font-display">
              Team ASTRYX-K4
            </div>
            <p className="text-slate-400 mt-1">
              VYOM-1: India's Reusable Green Microlauncher.
            </p>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-400">
            <a href="#video-theater" className="hover:text-slate-200 transition-colors">Mission Video</a>
            <a href="#telemetry" className="hover:text-slate-200 transition-colors">Telemetry</a>
            <a href="#specs" className="hover:text-slate-200 transition-colors">Propulsion</a>
            <a href="#team" className="hover:text-slate-200 transition-colors">Team</a>
            <a href="#copilot" className="hover:text-slate-200 transition-colors">AI Copilot</a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-600">
          <div>
            © {new Date().getFullYear()} Team ASTRYX-K4 (Srishti, Vivek Matadu, Sriharsha, Panchami). All rights reserved.
          </div>
          <div className="italic text-slate-500">
            "Dreaming beyond limits, building beyond boundaries! ASTRYX-K4 — Let’s reach beyond!"
          </div>
        </div>
      </div>
    </footer>
  );
};
