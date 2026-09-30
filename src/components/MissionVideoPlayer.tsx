import React, { useState, useEffect, useRef } from 'react';
import { MISSION_SCENES, MissionScene, ASSET_PATHS } from '../types/mission';
import { FlightCanvas } from './FlightCanvas';
import { soundEngine } from '../utils/audioEffects';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Upload,
  Gauge,
  Compass,
  Radio,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const MissionVideoPlayer: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'simulation' | 'customVideo'>('simulation');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const totalDuration = 180; // ~3m 00s
  const currentScene: MissionScene = MISSION_SCENES[currentSceneIndex] || MISSION_SCENES[0];

  // Sync soundEngine mute state
  useEffect(() => {
    soundEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Handle scene change effects (audio & speech)
  const prevSceneRef = useRef<number>(-1);
  useEffect(() => {
    if (prevSceneRef.current !== currentSceneIndex) {
      prevSceneRef.current = currentSceneIndex;
      soundEngine.playTelemetryBeep(1200, 0.06);

      if (currentScene.visualTheme === 'team' || currentScene.visualTheme === 'intro') {
        soundEngine.stopRumble();
        soundEngine.playTelemetryBeep(880, 0.15);
      } else if (currentScene.visualTheme === 'ascent' || currentScene.visualTheme === 'maxq') {
        soundEngine.playEngineRumble(0.2);
      } else if (currentScene.visualTheme === 'separation' || currentScene.visualTheme === 'descent') {
        soundEngine.stopRumble();
        soundEngine.playRcsBurst();
      } else {
        soundEngine.stopRumble();
      }

      if (voiceEnabled && isPlaying && viewMode === 'simulation') {
        soundEngine.speak(currentScene.transcript);
      }
    }
  }, [currentSceneIndex, voiceEnabled, isPlaying, viewMode, currentScene]);

  // Main playback timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && viewMode === 'simulation') {
      interval = setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 0.5 * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            soundEngine.stopRumble();
            return 0;
          }

          // Check which scene we belong to
          let activeIdx = 0;
          for (let i = MISSION_SCENES.length - 1; i >= 0; i--) {
            if (next >= MISSION_SCENES[i].seconds) {
              activeIdx = i;
              break;
            }
          }
          if (activeIdx !== currentSceneIndex) {
            setCurrentSceneIndex(activeIdx);
          }

          return next;
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, viewMode, currentSceneIndex, totalDuration]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      soundEngine.stopRumble();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      if (voiceEnabled && viewMode === 'simulation') {
        soundEngine.speak(currentScene.transcript);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSec(0);
    setCurrentSceneIndex(0);
    soundEngine.stopRumble();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSeek = (seconds: number) => {
    setElapsedSec(seconds);
    let activeIdx = 0;
    for (let i = MISSION_SCENES.length - 1; i >= 0; i--) {
      if (seconds >= MISSION_SCENES[i].seconds) {
        activeIdx = i;
        break;
      }
    }
    setCurrentSceneIndex(activeIdx);
    if (isPlaying && voiceEnabled && viewMode === 'simulation') {
      soundEngine.speak(MISSION_SCENES[activeIdx].transcript);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setViewMode('customVideo');
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `T+${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine which background image or canvas to show
  const currentImage = currentScene.imageKey ? ASSET_PATHS[currentScene.imageKey] : null;

  return (
    <div
      ref={containerRef}
      className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative"
    >
      {/* Top Telemetry Header Ribbon */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            MISSION VIDEO // VYOM-1
          </span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-300">
            {formatTime(elapsedSec)}
          </span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-400 truncate max-w-[200px]">
            {currentScene.phase}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setViewMode('simulation')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'simulation'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Telemetry
            </button>
            <button
              onClick={() => {
                if (!customVideoUrl) {
                  fileInputRef.current?.click();
                } else {
                  setViewMode('customVideo');
                }
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                viewMode === 'customVideo'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3 h-3" />
              {customVideoUrl ? 'Custom Video' : 'Load Video File'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
            />
          </div>

          {/* Sound & Voice Toggles */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded border ${
              soundEnabled
                ? 'bg-slate-800 text-cyan-400 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-2 py-1 rounded text-xs border font-mono ${
              voiceEnabled
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Mission Flight Voiceover"
          >
            {voiceEnabled ? 'AI VOICE ON' : 'AI VOICE OFF'}
          </button>
        </div>
      </div>

      {/* Main Video & Canvas Stage */}
      <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
        {viewMode === 'simulation' ? (
          <>
            {/* Visual Canvas */}
            <div className="absolute inset-0">
              <FlightCanvas scene={currentScene} isPlaying={isPlaying} timeSec={elapsedSec} />
            </div>

            {/* Inset Photo Asset Picture-in-Picture (when available) */}
            {currentImage && (
              <div className="absolute top-4 right-4 z-20 w-44 md:w-56 aspect-video rounded-lg overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
                <img
                  src={currentImage}
                  alt={currentScene.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono text-slate-300 truncate">
                  CAM 01 · {currentScene.phase}
                </div>
              </div>
            )}

            {/* Flight HUD Overlay (Telemetry data) */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
              <div className="bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">ALTITUDE</span>
                  <span className="text-slate-100 font-bold tabular-nums">
                    {currentScene.altitudeKm.toFixed(1)} km
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">VELOCITY</span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    {currentScene.speedKmph.toLocaleString()} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">MACH</span>
                  <span className="text-slate-200 tabular-nums">
                    M {currentScene.mach.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">DYN PRESSURE (Q)</span>
                  <span className="text-amber-400 tabular-nums">
                    {currentScene.dynamicPressureKPa.toFixed(1)} kPa
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800">
                  <span className="text-slate-400">BOOSTER STAGE 1</span>
                  <span className="text-emerald-400 tabular-nums">{currentScene.stage1Fuel}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">HYBRID STAGE 2</span>
                  <span className="text-emerald-400 tabular-nums">{currentScene.stage2Fuel}%</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-slate-900/90 px-2.5 py-1 rounded border border-cyan-800/60 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {currentScene.statusText}
              </div>
            </div>

            {/* Subtitle / Narration Closed Caption Overlay */}
            <div className="absolute bottom-5 inset-x-4 md:inset-x-12 z-20 pointer-events-none">
              <div className="bg-slate-950/85 backdrop-blur-md px-4 py-3 rounded-lg border border-slate-800/90 text-center shadow-2xl">
                <div className="text-[11px] font-mono text-cyan-400 tracking-wide uppercase mb-1">
                  SCENE {currentSceneIndex + 1} OF {MISSION_SCENES.length} · {currentScene.title}
                </div>
                <p className="text-slate-100 text-sm md:text-base font-medium leading-relaxed max-w-3xl mx-auto">
                  "{currentScene.transcript}"
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Custom Video Player Mode */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            {customVideoUrl ? (
              <video
                ref={videoElementRef}
                src={customVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8 text-slate-400">
                <Upload className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                <p className="text-base text-slate-200 font-semibold mb-1">Upload Team Video MP4</p>
                <p className="text-xs text-slate-400 mb-4 max-w-sm">
                  Load your exported video file to play it directly within the VYOM-1 Mission Theater.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-md"
                >
                  Select File
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scrub Bar & Timeline Controller */}
      <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 space-y-2">
        {/* Progress Bar with Scene Markers */}
        <div className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer group">
          <div
            className="absolute top-0 left-0 h-full bg-cyan-500 rounded-full pointer-events-none"
            style={{ width: `${(elapsedSec / totalDuration) * 100}%` }}
          />
          {/* Keyframe tick marks */}
          {MISSION_SCENES.map((sc, i) => {
            const pct = (sc.seconds / totalDuration) * 100;
            return (
              <div
                key={sc.id}
                onClick={() => handleSeek(sc.seconds)}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full cursor-pointer transition-transform hover:scale-150 ${
                  i === currentSceneIndex ? 'bg-amber-400 ring-2 ring-amber-400/30' : 'bg-slate-600 hover:bg-slate-400'
                }`}
                style={{ left: `${pct}%` }}
                title={`${sc.timestamp} - ${sc.title}`}
              />
            );
          })}
          <input
            type="range"
            min="0"
            max={totalDuration}
            value={elapsedSec}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-cyan-600/20"
              title={isPlaying ? 'Pause' : 'Play Mission Flight'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
              title="Restart Mission Video"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono text-slate-400">
              <span className="text-slate-100 font-bold tabular-nums">
                {Math.floor(elapsedSec / 60)}:{(Math.floor(elapsedSec % 60)).toString().padStart(2, '0')}
              </span>
              <span className="mx-1">/</span>
              <span>2:40</span>
            </div>
          </div>

          {/* Center: Current Phase Pill */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-500">STAGE:</span>
            <span className="text-cyan-300 font-medium">{currentScene.title}</span>
          </div>

          {/* Right Controls: Speed & Fullscreen */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 rounded border border-slate-800 p-0.5 text-[11px] font-mono">
              {[0.5, 1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackSpeed(rate)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    playbackSpeed === rate
                      ? 'bg-slate-800 text-cyan-400 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mission Scene Chapters Strip */}
      <div className="bg-slate-950/95 border-t border-slate-800 p-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {MISSION_SCENES.map((sc, i) => {
            const isActive = i === currentSceneIndex;
            return (
              <button
                key={sc.id}
                onClick={() => handleSeek(sc.seconds)}
                className={`px-3 py-1.5 text-xs rounded border text-left transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className={isActive ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    {sc.timestamp}
                  </span>
                  <span>·</span>
                  <span className="truncate max-w-[140px]">{sc.phase}</span>
                </div>
                <div className="font-medium text-slate-200 text-[11px] truncate max-w-[150px]">
                  {sc.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
