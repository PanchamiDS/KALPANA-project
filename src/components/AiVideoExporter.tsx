import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Video, Sparkles, RefreshCw, Volume2, VolumeX, Film, Layers, CheckCircle2, Copy } from 'lucide-react';
import { ASSET_PATHS } from '../types/mission';
import { normalizeForSpeech } from '../utils/audioEffects';

interface SceneKeyframe {
  title: string;
  subtitle: string;
  duration: number; // in seconds
  imageKey: keyof typeof ASSET_PATHS;
  voiceText: string;
  overlayBadge?: string;
  effect: 'pan-up' | 'zoom-in' | 'shake-thrust' | 'orbit-pan' | 'fade-glow';
}

const VIDEO_SCRIPT: SceneKeyframe[] = [
  {
    title: "TEAM ASTRYX-K4",
    subtitle: "Dreaming beyond limits, building beyond boundaries!",
    duration: 4,
    imageKey: 'patch',
    voiceText: "We are Team ASTRYX-K4! Led by Srishti, with Vivek Matade, Sriharsha, and Panchami.",
    overlayBadge: "MISSION PRESENTATION",
    effect: 'fade-glow',
  },
  {
    title: "CREW & ROSTER",
    subtitle: "Srishti (Lead) · Vivek Matade · Sriharsha · Panchami",
    duration: 4.5,
    imageKey: 'patch',
    voiceText: "United in aerospace engineering to bring affordable orbital access to the next generation.",
    overlayBadge: "TEAM CREDENTIALS",
    effect: 'zoom-in',
  },
  {
    title: "VYOM-1: INDIA'S REUSABLE GREEN MICROLAUNCHER",
    subtitle: "Satish Dhawan Space Centre · Sriharikota Pad 02",
    duration: 5,
    imageKey: 'launchpad',
    voiceText: "VYOM-1 is India's step toward affordable, reusable, eco-friendly space access.",
    overlayBadge: "50 KG TO 500 KM SSO",
    effect: 'pan-up',
  },
  {
    title: "STAGE 1: 9-ENGINE BOOSTER LIFTOFF",
    subtitle: "All 9 solid engines ignite · Max Q at T+2m 30s",
    duration: 4.5,
    imageKey: 'separation',
    voiceText: "Liftoff begins with all nine first stage engines burning to breach the lower atmosphere.",
    overlayBadge: "LIFTOFF · T+00:00",
    effect: 'shake-thrust',
  },
  {
    title: "STAGE SEPARATION & GREEN HYBRID",
    subtitle: "HTPB grain + liquid N₂O vacuum engine ignite at 70 km",
    duration: 5,
    imageKey: 'separation',
    voiceText: "Stage separation occurs at seventy kilometers altitude, igniting the non-toxic green hybrid upper stage.",
    overlayBadge: "ALTITUDE: 70 KM",
    effect: 'orbit-pan',
  },
  {
    title: "AUTONOMOUS DRONESHIP LANDING",
    subtitle: "Titanium grid fins & 3-engine landing burn · Bay of Bengal",
    duration: 5,
    imageKey: 'landing',
    voiceText: "After burnout, stage one flips and lands propulsively on an autonomous drone ship in the Bay of Bengal.",
    overlayBadge: "REUSABLE RECOVERY",
    effect: 'shake-thrust',
  },
  {
    title: "ORBITAL CUBESAT DEPLOYMENT",
    subtitle: "500 km Sun-Synchronous Orbit · 60% Launch Cost Cut",
    duration: 5,
    imageKey: 'landing',
    voiceText: "At 500 kilometers orbit, VYOM-1 deploys CubeSats for university climate and disaster monitoring.",
    overlayBadge: "500 KM SSO · DEPLOYED",
    effect: 'zoom-in',
  },
  {
    title: "ASTRYX-K4 — LET'S REACH BEYOND!",
    subtitle: "Developed with AI tools · Empowering Indian NewSpace",
    duration: 5,
    imageKey: 'patch',
    voiceText: "We also acknowledge the use of AI tools in developing our work. ASTRYX-K4 — Let's reach beyond!",
    overlayBadge: "TEAM ASTRYX-K4 CREED",
    effect: 'fade-glow',
  },
];

export const AiVideoExporter: React.FC = () => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'prompts'>('generator');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const imagesCache = useRef<Record<string, HTMLImageElement>>({});

  // Preload images into memory
  useEffect(() => {
    Object.entries(ASSET_PATHS).forEach(([key, url]) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        imagesCache.current[key] = img;
      };
    });
  }, []);

  // Web Audio synthesizer for space sounds
  const createAudioTracks = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const destination = ctx.createMediaStreamDestination();

      // Low rumble for rocket engines
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      if (!audioMuted) {
        gain.connect(ctx.destination);
      }
      osc.start();

      return { ctx, destination, osc, gain };
    } catch {
      return null;
    }
  };

  // Render a specific frame on canvas
  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    scene: SceneKeyframe,
    progress: number, // 0 to 1 inside current scene
    globalTime: number
  ) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Clear background
    ctx.fillStyle = '#06080d';
    ctx.fillRect(0, 0, width, height);

    // Draw background image if loaded
    const img = imagesCache.current[scene.imageKey];
    if (img && img.complete) {
      ctx.save();

      // Apply camera effects based on scene.effect
      let scale = 1.0;
      let offsetX = 0;
      let offsetY = 0;

      if (scene.effect === 'zoom-in') {
        scale = 1.0 + progress * 0.12;
      } else if (scene.effect === 'pan-up') {
        scale = 1.08;
        offsetY = (1 - progress) * -40;
      } else if (scene.effect === 'shake-thrust') {
        scale = 1.05;
        offsetX = Math.sin(globalTime * 35) * 4;
        offsetY = Math.cos(globalTime * 40) * 3;
      } else if (scene.effect === 'orbit-pan') {
        scale = 1.1;
        offsetX = Math.sin(progress * Math.PI) * 25;
      }

      ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();

      // Dark cinematic vignette & sci-fi gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(6, 8, 13, 0.7)');
      gradient.addColorStop(0.4, 'rgba(6, 8, 13, 0.35)');
      gradient.addColorStop(0.7, 'rgba(6, 8, 13, 0.6)');
      gradient.addColorStop(1, 'rgba(6, 8, 13, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Rocket thruster particles simulation
    if (scene.effect === 'shake-thrust') {
      ctx.save();
      for (let i = 0; i < 25; i++) {
        const pX = width / 2 + (Math.random() - 0.5) * 80;
        const pY = height * 0.7 + Math.random() * 250;
        const radius = Math.random() * 8 + 2;
        ctx.fillStyle = `rgba(255, ${Math.floor(100 + Math.random() * 120)}, 40, ${Math.random() * 0.8})`;
        ctx.beginPath();
        ctx.arc(pX, pY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // HUD Grid & Frame lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Crosshairs
    const chSize = 15;
    ctx.beginPath();
    ctx.moveTo(width / 2 - chSize, height / 2);
    ctx.lineTo(width / 2 + chSize, height / 2);
    ctx.moveTo(width / 2, height / 2 - chSize);
    ctx.lineTo(width / 2, height / 2 + chSize);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.stroke();

    // Top Header: Team Branding & Live REC indicator
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(65, 65, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('● AI VIDEO REC', 80, 71);

    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('TEAM ASTRYX-K4 · MISSION VYOM-1', width - 360, 71);

    // Badge Overlay
    if (scene.overlayBadge) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.fillRect(width / 2 - 140, 80, 280, 32);
      ctx.strokeStyle = '#06b6d4';
      ctx.strokeRect(width / 2 - 140, 80, 280, 32);

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText(`[ ${scene.overlayBadge} ]`, width / 2, 101);
      ctx.textAlign = 'left';
    }

    // Main Typography
    ctx.save();
    // Scene Title
    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
    ctx.shadowBlur = 18;
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, width / 2, height - 190);

    // Scene Subtitle
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 8;
    ctx.fillText(scene.subtitle, width / 2, height - 145);

    // Narration Subtitle Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(80, height - 110, width - 160, 56);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.strokeRect(80, height - 110, width - 160, 56);

    ctx.font = 'italic 18px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`"${scene.voiceText}"`, width / 2, height - 74);
    ctx.restore();

    // AI Tools Badge in Bottom Left
    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.fillText('ASTRYX-K4 CREED: REACH BEYOND · AI-ASSISTED PRODUCTION', 60, height - 20);

    // Progress Bar on bottom
    ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.fillRect(0, height - 6, width, 6);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, height - 6, width * (progress * 0.125 + (VIDEO_SCRIPT.indexOf(scene) / VIDEO_SCRIPT.length)), 6);
  };

  // Speaks scene narration if speech synthesis is available
  const speakText = (text: string) => {
    if (audioMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const spokenText = normalizeForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback
    }
  };

  // Preview Mode
  useEffect(() => {
    if (!isPlayingPreview) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let sceneIdx = 0;
    let sceneStartTime = performance.now();
    speakText(VIDEO_SCRIPT[0].voiceText);

    const renderLoop = (now: number) => {
      const currentScene = VIDEO_SCRIPT[sceneIdx];
      const elapsed = (now - sceneStartTime) / 1000;
      const progress = Math.min(elapsed / currentScene.duration, 1.0);

      drawFrame(ctx, currentScene, progress, now / 1000);

      if (elapsed >= currentScene.duration) {
        sceneIdx++;
        if (sceneIdx >= VIDEO_SCRIPT.length) {
          setIsPlayingPreview(false);
          setActiveSceneIndex(0);
          return;
        }
        setActiveSceneIndex(sceneIdx);
        sceneStartTime = now;
        speakText(VIDEO_SCRIPT[sceneIdx].voiceText);
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingPreview, audioMuted]);

  // Generate & Record complete AI Video file
  const handleGenerateAndExportVideo = async () => {
    setIsRendering(true);
    setRenderProgress(0);
    setExportedVideoUrl(null);
    setIsPlayingPreview(false);

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsRendering(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsRendering(false);
      return;
    }

    // Set high resolution for rendering (1280x720)
    canvas.width = 1280;
    canvas.height = 720;

    const audioSetup = createAudioTracks();
    const canvasStream = canvas.captureStream(30);

    // Combine audio tracks if available
    let combinedStream: MediaStream = canvasStream;
    if (audioSetup?.destination?.stream) {
      const audioTracks = audioSetup.destination.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...audioTracks,
        ]);
      }
    }

    // Select supported MIME type
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 4000000, // 4 Mbps crisp video
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setExportedVideoUrl(url);
      setIsRendering(false);
      setRenderProgress(100);

      // Clean up audio
      if (audioSetup?.osc) {
        try {
          audioSetup.osc.stop();
        } catch {
          // ignore
        }
      }

      // Automatically trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Team_ASTRYX_K4_VYOM1_AI_Video.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    recorder.start();

    // Render frame-by-frame across all scenes
    const totalDuration = VIDEO_SCRIPT.reduce((acc, s) => acc + s.duration, 0);
    let currentGlobalTime = 0;
    const fps = 30;
    const frameInterval = 1 / fps;

    let sceneIndex = 0;
    let sceneTime = 0;

    // Frame generation timer
    const interval = setInterval(() => {
      const currentScene = VIDEO_SCRIPT[sceneIndex];
      const progress = sceneTime / currentScene.duration;

      drawFrame(ctx, currentScene, progress, currentGlobalTime);

      sceneTime += frameInterval;
      currentGlobalTime += frameInterval;

      const totalProgress = Math.min(Math.floor((currentGlobalTime / totalDuration) * 100), 99);
      setRenderProgress(totalProgress);

      if (sceneTime >= currentScene.duration) {
        sceneIndex++;
        sceneTime = 0;
        if (sceneIndex >= VIDEO_SCRIPT.length) {
          clearInterval(interval);
          recorder.stop();
        }
      }
    }, 1000 / fps);
  };

  const copyFullAiPrompt = () => {
    const promptText = `Generate a cinematic aerospace video: "Team ASTRYX-K4 presents VYOM-1: India's Reusable Green Microlauncher". 
Key details:
- Team: Led by Srishti, with Vivek Matade, Sriharsha, and Panchami.
- Credo: "Dreaming beyond limits, building beyond boundaries! ASTRYX-K4 — Let's reach beyond!"
- Spacecraft: VYOM-1, two-stage microlauncher, 9 solid first-stage booster engines, stage 2 green hybrid HTPB + liquid N2O engine.
- Launch site: Satish Dhawan Space Centre Sriharikota Pad 02.
- Recovery: Stage 1 guided descent with titanium grid fins, propulsive vertical landing on autonomous drone ship in the Bay of Bengal.
- Payload: 50 kg CubeSats to 500 km Sun-Synchronous Orbit for university climate and disaster monitoring.
- Tone: Hyper-realistic 4K, Christopher Nolan / Interstellar cinematic lighting, telemetry HUD overlay, dramatic orchestral score with rocket rumble.`;

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header with Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Film className="w-4 h-4" />
            <span>AI Video Production Studio</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white mt-1">
            Generate & Download Team ASTRYX-K4 Video
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Render and export the complete cinematic mission video with motion graphics, audio narration, and team branding directly to your device.
          </p>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'generator'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Generator & Exporter
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'prompts'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Video Prompts (Runway/Fliki)
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="space-y-6">
          {/* Main Video Canvas Screen */}
          <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-slate-700 shadow-inner group">
            {/* Real Canvas element for rendering */}
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-contain"
            />

            {/* In-Video Watermark Badge */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>TEAM ASTRYX-K4 OFFICIAL RENDER</span>
            </div>

            {/* Rendering Progress Overlay */}
            {isRendering && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Rendering AI Video ({renderProgress}%)
                </h3>
                <p className="text-slate-400 text-sm max-w-md mb-6">
                  Compositing 8 high-definition scenes, synthesising telemetry HUD, audio rumble, and team credos...
                </p>
                <div className="w-full max-w-md bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-150"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-cyan-400 mt-3">
                  Exporting to MP4/WebM format · Auto-downloading on completion
                </span>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {/* Left Controls: Preview Play / Pause & Sound */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                disabled={isRendering}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-colors disabled:opacity-50"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    Pause Preview
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Preview Video
                  </>
                )}
              </button>

              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                title={audioMuted ? "Unmute AI Voice & Audio" : "Mute AI Voice & Audio"}
              >
                {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>

              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Scene {activeSceneIndex + 1} of {VIDEO_SCRIPT.length}: {VIDEO_SCRIPT[activeSceneIndex].title}
              </span>
            </div>

            {/* Primary Action: Render and Download Video */}
            <div className="flex items-center gap-3">
              {exportedVideoUrl && (
                <a
                  href={exportedVideoUrl}
                  download="Team_ASTRYX_K4_VYOM1_AI_Video.webm"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Save Video File (.webm)
                </a>
              )}

              <button
                onClick={handleGenerateAndExportVideo}
                disabled={isRendering}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Film className="w-4 h-4" />
                {isRendering ? 'Rendering Video...' : 'Render & Download AI Video'}
              </button>
            </div>
          </div>

          {/* Storyboard Frame Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>MISSION VIDEO STORYBOARD (8 SEQUENCES)</span>
              <span>TOTAL RUNTIME: ~38 SECONDS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {VIDEO_SCRIPT.map((scene, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) drawFrame(ctx, scene, 0, 0);
                    }
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    activeSceneIndex === idx
                      ? 'bg-cyan-950/60 border-cyan-400 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">
                    Shot 0{idx + 1}
                  </div>
                  <div className="text-xs font-semibold truncate mt-0.5 text-slate-200">
                    {scene.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {scene.duration}s · {scene.effect}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: AI Video Prompts Generator (for Runway, Fliki, Kling, Luma) */
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  Master Prompt for AI Video Tools (Fliki.ai / Runway Gen-3 / Luma Dream Machine)
                </h3>
              </div>
              <button
                onClick={copyFullAiPrompt}
                className="px-3.5 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Master Prompt
                  </>
                )}
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              If you wish to re-render in external text-to-video tools (like <strong className="text-cyan-300">Fliki.ai</strong> as used in your initial upload, or <strong className="text-cyan-300">Runway Gen-3 / Kling / Sora</strong>), you can paste this exact prompt into their video generator:
            </p>

            <div className="bg-[#07090e] p-4 rounded-lg border border-slate-800 font-mono text-xs text-cyan-200/90 leading-relaxed overflow-x-auto whitespace-pre-line">
              {`Title: Team ASTRYX-K4 — VYOM-1: India's Reusable Green Microlauncher
Aspect Ratio: 16:9 HD
Voiceover Narration:
"We are Team ASTRYX-K4! Led by Srishti, with Vivek Matade, Sriharsha, and Panchami. Dreaming beyond limits, building beyond boundaries! VYOM-1 is India's step toward affordable, reusable space access. Powered by 9 first-stage engines and a clean HTPB hybrid upper stage, cutting orbital launch costs by 60%. We also acknowledge the use of AI tools in developing our work. ASTRYX-K4 — Let’s reach beyond!"

Visual Shotlist:
1. [00:00 - 00:05] Team ASTRYX-K4 official mission patch with glowing golden stars, aerospace typography.
2. [00:05 - 00:10] Launchpad Sriharikota Pad 02 sunrise, VYOM-1 standing tall with umbilical tower.
3. [00:10 - 00:18] Violent 9-engine ignition, acoustic shockwaves, booster lifting off into high blue sky.
4. [00:18 - 00:25] Stage separation at 70km, green hybrid plume expanding in vacuum.
5. [00:25 - 00:32] First stage booster vertical propulsive touchdown on autonomous drone ship in Bay of Bengal.
6. [00:32 - 00:38] CubeSats floating into 500km Sun-Synchronous Orbit above Earth's limb, with ASTRYX-K4 insignia.`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
