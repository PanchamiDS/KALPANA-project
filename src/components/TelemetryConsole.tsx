import React, { useState } from 'react';
import { Radio, Compass, Gauge, Activity, Navigation, Zap } from 'lucide-react';

export const TelemetryConsole: React.FC = () => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<number>(2);

  const waypoints = [
    {
      id: 0,
      name: 'Pad 02 Liftoff (SDSC SHAR)',
      time: 'T+00:00',
      alt: 0,
      vel: 0,
      q: 0,
      status: 'IGNITION',
      desc: 'All 9 solid booster engines fire simultaneously from the upgraded second launch pad at Sriharikota.'
    },
    {
      id: 1,
      name: 'Max Q (Aerodynamic Peak)',
      time: 'T+02:30',
      alt: 14.8,
      vel: 2200,
      q: 42.1,
      status: 'PEAK STRESS',
      desc: 'Vehicle encounters maximum atmospheric dynamic pressure. Guidance throttle profile mitigates mechanical buffeting.'
    },
    {
      id: 2,
      name: 'Stage Separation',
      time: 'T+02:45',
      alt: 70.4,
      vel: 6840,
      q: 3.2,
      status: 'SEPARATION',
      desc: 'Pneumatic push collets cleanly separate Stage 1 at ~70 km. Cold gas RCS thrusters orient the booster.'
    },
    {
      id: 3,
      name: 'Booster Drone Ship Landing',
      time: 'T+06:15',
      alt: 0.1,
      vel: 24,
      q: 0.1,
      status: 'TOUCHDOWN',
      desc: '3 engines reignite for final deceleration onto the autonomous barge in the Bay of Bengal.'
    },
    {
      id: 4,
      name: 'Stage 2 SSO Orbit Insertion',
      time: 'T+09:40',
      alt: 500.0,
      vel: 27400,
      q: 0.0,
      status: 'IN ORBIT',
      desc: 'Hybrid HTPB + liquid N₂O engine cutoff. Dispenser releases 3–6 CubeSats for university climate observation.'
    }
  ];

  const currentWp = waypoints[selectedWaypoint];

  return (
    <section id="telemetry" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>FLIGHT DYNAMICS</span>
            <span aria-hidden="true">·</span>
            <span>SHAR GROUND TRACK & ORBIT</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            Mission Telemetry & Orbital Profile
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl">
            Real-time trajectory kinematics from Satish Dhawan Space Centre (13.72° N, 80.23° E) across the Bay of Bengal into a 97.4° Sun-Synchronous Orbit.
          </p>
        </div>

        {/* Global Calibration Indicator */}
        <div className="flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            TELEMETRY: NOMINAL
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">RTK-BEACON: LOCKED</span>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trajectory Flight Profile SVG */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>ORBITAL TRAJECTORY ARC (ALTITUDE VS DOWNRANGE)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">CLICK WAYPOINT TO INSPECT</span>
          </div>

          {/* Trajectory Canvas SVG */}
          <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-lg border border-slate-800/80 p-4 overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Grid Lines */}
              <defs>
                <linearGradient id="orbitGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Coordinate Grid lines */}
              {[100, 200, 300].map((y) => (
                <line key={y} x1="50" y1={y} x2="750" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
              ))}
              {[150, 300, 450, 600].map((x) => (
                <line key={x} x1={x} y1="50" x2={x} y2="350" stroke="#1e293b" strokeDasharray="3 3" />
              ))}

              {/* Y-Axis Labels (Altitude) */}
              <text x="45" y="105" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">500 km</text>
              <text x="45" y="205" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">250 km</text>
              <text x="45" y="305" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">70 km</text>
              <text x="45" y="355" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">0 km</text>

              {/* Surface & Sea */}
              <line x1="50" y1="350" x2="750" y2="350" stroke="#334155" strokeWidth="2" />
              <rect x="50" y="352" width="700" height="20" fill="#0f172a" />

              {/* Sriharikota Launch Pad marker */}
              <text x="80" y="375" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">SHAR Pad 02</text>

              {/* Bay of Bengal Drone Ship marker */}
              <text x="360" y="375" fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono">Drone Ship (Bay of Bengal)</text>

              {/* Stage 2 Ascent Path to 500km SSO */}
              <path
                d="M 80 350 Q 250 290 320 280 T 520 180 T 720 100"
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="3"
              />

              {/* Stage 1 Booster Return Path to Drone Ship */}
              <path
                d="M 320 280 Q 360 270 410 350"
                fill="none"
                stroke="url(#returnGrad)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Waypoint Clickable Nodes */}
              {[
                { x: 80, y: 350, id: 0 },
                { x: 200, y: 305, id: 1 },
                { x: 320, y: 280, id: 2 },
                { x: 410, y: 350, id: 3 },
                { x: 720, y: 100, id: 4 }
              ].map((pt) => {
                const isSelected = selectedWaypoint === pt.id;
                return (
                  <g
                    key={pt.id}
                    onClick={() => setSelectedWaypoint(pt.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 9 : 6}
                      fill={isSelected ? '#38bdf8' : '#0f172a'}
                      stroke={isSelected ? '#ffffff' : '#38bdf8'}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="16"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        opacity="0.4"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Waypoint Selector Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {waypoints.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setSelectedWaypoint(wp.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  selectedWaypoint === wp.id
                    ? 'bg-slate-900 border-cyan-500 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-cyan-400 font-semibold">{wp.time}</span>
                  <span className="text-slate-500">WP 0{wp.id + 1}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">{wp.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Precision Kinematics HUD */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Waypoint Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
              <span className="text-cyan-400 uppercase font-semibold">WAYPOINT TELEMETRY</span>
              <span className="text-amber-400">{currentWp.status}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">{currentWp.name}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentWp.desc}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">ALTITUDE</div>
                <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                  {currentWp.alt.toFixed(1)} <span className="text-xs text-slate-400 uppercase">km</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">INERTIAL VELOCITY</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                  {currentWp.vel.toLocaleString()} <span className="text-xs text-slate-400 uppercase">km/h</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">AERODYNAMIC PRESSURE (Q)</div>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {currentWp.q.toFixed(1)} <span className="text-xs text-slate-400 uppercase">kPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsystem Health Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase">SUBSYSTEM STATUS</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 bg-slate-950/60 rounded">
                <span className="text-slate-300">STAGE 1 ENGINES (9x)</span>
                <span className="text-emerald-400 font-semibold">● CALIBRATED</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/60 rounded">
                <span className="text-slate-300">GRID FIN ACTUATORS</span>
                <span className="text-emerald-400 font-semibold">● CALIBRATED</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/60 rounded">
                <span className="text-slate-300">HYBRID HTPB / N₂O MANIFOLD</span>
                <span className="text-emerald-400 font-semibold">● ARMED</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-950/60 rounded">
                <span className="text-slate-300">CUBESAT DISPENSER INTERFACE</span>
                <span className="text-emerald-400 font-semibold">● READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
