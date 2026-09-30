import React, { useRef, useState } from 'react';
import { Navigation } from './components/Navigation';
import { MissionVideoPlayer } from './components/MissionVideoPlayer';
import { AiVideoExporter } from './components/AiVideoExporter';
import { TeamSection } from './components/TeamSection';
import { PropulsionBreakdown } from './components/PropulsionBreakdown';
import { TelemetryConsole } from './components/TelemetryConsole';
import { AiMissionCopilot } from './components/AiMissionCopilot';
import { Footer } from './components/Footer';
import { ASSET_PATHS } from './types/mission';
import { Play, ArrowDown, Video, Download, Film, Sparkles, Layout } from 'lucide-react';

export default function App() {
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const exporterSectionRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'video-first' | 'full-mission'>('video-first');

  const scrollToExporter = () => {
    exporterSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navigation onLaunchClick={scrollToExporter} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={ASSET_PATHS.launchpad}
            alt="VYOM-1 on the launch pad at Satish Dhawan Space Centre Sriharikota"
            className="w-full h-full object-cover object-center filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-[#07090e]/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#07090e]/60 to-[#07090e]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center">
          {/* Editorial Clean Kicker */}
          <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-cyan-400 mb-4 tracking-wider uppercase">
            <span>TEAM ASTRYX-K4</span>
            <span aria-hidden="true">·</span>
            <span>AI VIDEO PRODUCTION & MISSION SHOWCASE</span>
            <span aria-hidden="true">·</span>
            <span>VYOM-1</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-white max-w-4xl text-balance">
            Team ASTRYX-K4 AI Video & Mission
          </h1>

          {/* Subtitle with Team Credo */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed">
            “Dreaming beyond limits, building beyond boundaries! Led by Srishti, with Vivek Matade, Sriharsha, and Panchami. ASTRYX-K4 — Let’s reach beyond!”
          </p>

          {/* Mode Switcher Pill Banner */}
          <div className="mt-8 flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-700/80 backdrop-blur shadow-2xl">
            <button
              onClick={() => {
                setViewMode('video-first');
                scrollToExporter();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'video-first'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              AI Video Generator & Downloader
            </button>
            <button
              onClick={() => setViewMode('full-mission')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'full-mission'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-4 h-4" />
              Full Mission Platform & Telemetry
            </button>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToExporter}
              className="px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl transition-all shadow-xl shadow-cyan-600/30 flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Render & Download Video File
            </button>

            <button
              onClick={scrollToVideo}
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-colors hover:text-white flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Interactive Telemetry Player
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="mt-12 text-slate-500 flex flex-col items-center gap-2 text-xs font-mono">
            <span>AI VIDEO ENGINE READY</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* 00. AI Video Generator & Exporter Studio */}
        <section id="ai-video-studio" ref={exporterSectionRef} className="space-y-6 scroll-mt-20">
          <AiVideoExporter />
        </section>

        {/* 01. Mission Video Theater Section */}
        <section id="video-theater" ref={videoSectionRef} className="space-y-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span>01. CINEMATIC FLIGHT PRESENTATION</span>
                <span aria-hidden="true">·</span>
                <span>INTERACTIVE MISSION VIDEO</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-100">
                VYOM-1 Flight Storyboard & Telemetry Player
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Experience the 16-scene flight profile of VYOM-1: from ignition of the 9-engine solid booster cluster, through Max Q and stage separation at 70 km, to drone ship landing in the Bay of Bengal and 500 km SSO CubeSat release.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYNCED NARRATION & AUDIO EFFECTS ACTIVE</span>
            </div>
          </div>

          <MissionVideoPlayer />
        </section>

        {/* 02. Mission Telemetry & Orbital Profile */}
        <TelemetryConsole />

        {/* 03. Propulsion Breakdown & 60% Reusability Economics */}
        <PropulsionBreakdown />

        {/* 04. Team ASTRYX-K4 & AI Tools Acknowledgment */}
        <TeamSection />

        {/* 05. AI Mission Copilot (Gemini 3.8 Flash) */}
        <AiMissionCopilot />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
