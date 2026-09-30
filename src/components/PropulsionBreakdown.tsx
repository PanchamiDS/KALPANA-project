import React, { useState } from 'react';
import { ASSET_PATHS } from '../types/mission';
import {
  Flame,
  Shield,
  Layers,
  TrendingDown,
  RotateCcw,
  Zap,
  Globe2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const PropulsionBreakdown: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stage1' | 'stage2' | 'payload' | 'economics' | 'roadmap'>('stage1');
  const [payloadKg, setPayloadKg] = useState<number>(30);

  // Economic calculations
  const expendableCostPerKg = 42000; // $42k/kg standard smallsat market
  const vyom1CostPerKg = 16800; // 60% discount ($16.8k/kg)
  const totalExpendable = payloadKg * expendableCostPerKg;
  const totalVyom1 = payloadKg * vyom1CostPerKg;
  const savings = totalExpendable - totalVyom1;

  return (
    <section id="specs" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>AEROSPACE ARCHITECTURE</span>
            <span aria-hidden="true">·</span>
            <span>GREEN HYBRID PROPULSION</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            VYOM-1 Propulsion & Systems
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl">
            A two-stage micro-launch architecture engineered for sustainable orbital delivery, pairing a reusable 9-engine solid booster with a clean HTPB + liquid N₂O hybrid upper stage.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {[
            { id: 'stage1', label: 'Stage 1 Booster' },
            { id: 'stage2', label: 'Stage 2 Hybrid' },
            { id: 'payload', label: '50kg Payload' },
            { id: 'economics', label: '60% Cost Model' },
            { id: 'roadmap', label: 'Future Roadmap' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Stage 1 Reusable Booster */}
      {activeTab === 'stage1' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400">STAGE 1 SPECIFICATIONS</div>
              <h3 className="text-2xl font-bold text-slate-100">
                9-Engine Solid Booster Cluster & Ocean Recovery
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Stage 1 provides high-thrust liftoff from Sriharikota, accelerating the vehicle through Max Q (T+ 2m 30s) up to approximately 70 kilometers altitude. Following burnout and separation, the booster executes an autonomous exo-atmospheric flip and aerodynamically steered descent back to an unmanned sea platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">ENGINE CLUSTER</div>
                <div className="text-2xl font-bold font-mono text-slate-100 mt-1">9 Units</div>
                <div className="text-xs text-slate-400 mt-1">Simultaneous pad ignition</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">STAGE SEPARATION</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">~70 km</div>
                <div className="text-xs text-slate-400 mt-1">Pneumatic collet push</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">RE-ENTRY GUIDANCE</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">4 Grid Fins</div>
                <div className="text-xs text-slate-400 mt-1">High-temp titanium lattice</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">LANDING REIGNITION</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">3 Engines</div>
                <div className="text-xs text-slate-400 mt-1">Bay of Bengal drone ship</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                72-Hour Rapid Refurbishment Protocol
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upon ocean drone ship recovery, the booster is hoisted onto the Sriharikota dock, cleaned, avionics tested, and fitted with fresh solid grain modules within 72 hours, enabling unprecedented launch cadence for regional space programs.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <img
              src={ASSET_PATHS.landing}
              alt="VYOM-1 Drone ship propulsive landing in Bay of Bengal"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-xs font-mono text-amber-400 uppercase font-semibold">
                PROPULSIVE RETRO-BURN
              </div>
              <div className="text-sm font-bold text-white">
                Booster Touchdown on Autonomous Drone Ship (Bay of Bengal)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Stage 2 Green Hybrid Engine */}
      {activeTab === 'stage2' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400">STAGE 2 PROPULSION CHEMISTRY</div>
              <h3 className="text-2xl font-bold text-slate-100">
                Green Hybrid: Solid HTPB Grain + Liquid N₂O
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlike hazardous hypergolic fuels (hydrazine / NTO), VYOM-1’s upper stage employs a green hybrid architecture. The combustion of solid Hydroxyl-Terminated Polybutadiene (HTPB) with pressurized liquid Nitrous Oxide (N₂O) provides high specific impulse in vacuum while eliminating toxic risk during student university integration.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    Solid Fuel: HTPB Polymeric Matrix
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Hydroxyl-terminated polybutadiene elastomer grain with aluminum nano-additives for maximized regression rates and combustion stability.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    Liquid Oxidizer: Self-Pressurizing N₂O
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Liquid Nitrous Oxide maintains intrinsic vapor pressure (~50 bar at room temperature), eliminating heavy helium turbopump sub-assemblies.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    Zero-Hydrazine Green Safety
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Completely non-carcinogenic and non-corrosive. Enables university students to handle rocket integration directly on campus without Hazmat breathing suits.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <img
              src={ASSET_PATHS.separation}
              alt="VYOM-1 Stage Separation and Vacuum Stage 2 Ignition"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                VACUUM ACCELERATION
              </div>
              <div className="text-sm font-bold text-white">
                Stage 2 Insertion into 500 km Sun-Synchronous Orbit
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payload Capacity */}
      {activeTab === 'payload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400">ORBITAL TARGET & CAPACITY</div>
              <h3 className="text-2xl font-bold text-slate-100">
                50 kg Dedicated Rideshare to 500 km SSO
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Designed specifically for student CubeSats and disaster monitoring nanosats. Accommodates 3 to 6 modular CubeSats (1U, 2U, 3U, or 6U form factors) equipped with spring-loaded canisters for precise deployment intervals.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">TOTAL PAYLOAD MASS</div>
                <div className="text-3xl font-bold font-mono text-cyan-400 mt-1">50 kg</div>
                <div className="text-xs text-slate-400 mt-1">Net orbital delivery</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">TARGET ORBIT</div>
                <div className="text-3xl font-bold font-mono text-slate-100 mt-1">500 km</div>
                <div className="text-xs text-slate-400 mt-1">Sun-Synchronous (SSO)</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">DISPENSER CAPACITY</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">3–6 Sats</div>
                <div className="text-xs text-slate-400 mt-1">3U / 6U standard canisters</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">PRIMARY MISSIONS</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">Earth Obs</div>
                <div className="text-xs text-slate-400 mt-1">Crop, disaster, climate</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                Campus Ground Station Integration
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Universities receive an open-hardware UHF/S-band transceiver kit. Students track their own satellites directly from their college campus roof, collecting live telemetry and multispectral Earth imagery.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Standard Mission Configuration Matrix
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-slate-200 font-bold">Config Alpha (University Consortium)</div>
                  <div className="text-[11px] text-slate-400">6x 3U CubeSats (8 kg each)</div>
                </div>
                <span className="text-cyan-400 font-bold">48 kg Net</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-slate-200 font-bold">Config Beta (Disaster & Agriculture)</div>
                  <div className="text-[11px] text-slate-400">2x 6U Hyperspectral + 2x 3U Relays</div>
                </div>
                <span className="text-cyan-400 font-bold">46 kg Net</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-slate-200 font-bold">Config Gamma (Deep Tech Prototyping)</div>
                  <div className="text-[11px] text-slate-400">1x 12U Micro-Platform Host</div>
                </div>
                <span className="text-cyan-400 font-bold">50 kg Net</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Economics & 60% Cost Model */}
      {activeTab === 'economics' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono text-cyan-400">LAUNCH ECONOMICS & DEMOCRATIZATION</div>
            <h3 className="text-2xl font-bold text-slate-100">
              60% Launch Cost Reduction via Booster Reusability
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional expendable rockets discard their engines into the ocean on every single flight. By recovering Stage 1 on our Bay of Bengal drone ship and re-flying it within 72 hours, VYOM-1 slashes orbital delivery costs by 60%, unlocking space access for institutions across India and the Global South.
            </p>
          </div>

          {/* Interactive Calculator Slider */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase">
                  Adjust University Payload Mass (kg)
                </label>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {payloadKg} kg <span className="text-xs text-slate-500 font-normal">({Math.ceil(payloadKg / 8)} CubeSats)</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={payloadKg}
                onChange={(e) => setPayloadKg(Number(e.target.value))}
                className="w-full md:w-64 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/40">
                <div className="text-xs font-mono text-red-400">TRADITIONAL EXPENDABLE</div>
                <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                  ${(totalExpendable / 1000).toLocaleString()}k
                </div>
                <div className="text-[11px] text-slate-400 mt-1">$42,000 / kg standard</div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-800/50">
                <div className="text-xs font-mono text-emerald-400">REUSABLE VYOM-1</div>
                <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                  ${(totalVyom1 / 1000).toLocaleString()}k
                </div>
                <div className="text-[11px] text-slate-400 mt-1">$16,800 / kg (60% discount)</div>
              </div>

              <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-800/50">
                <div className="text-xs font-mono text-cyan-400">DIRECT CAPITAL SAVINGS</div>
                <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                  +${(savings / 1000).toLocaleString()}k
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Saved per student consortium launch</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-cyan-400">PHASE 01 · ACTIVE</div>
            <h4 className="text-lg font-bold text-slate-100">VYOM-1 Baseline</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard 2-stage reusable microlauncher delivering 50 kg to 500 km SSO. Ocean recovery in Bay of Bengal with 72h turnaround. Over 12 student launches booked.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono pt-2 border-t border-slate-800">
              <li>· 50 kg payload capacity</li>
              <li>· Single hybrid upper stage</li>
              <li>· Sriharikota Pad 02 operations</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-800/60 space-y-4">
            <div className="text-xs font-mono text-amber-400">PHASE 02 · R&D IN PROGRESS</div>
            <h4 className="text-lg font-bold text-slate-100">VYOM-Heavy Cluster</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tri-core configuration strapping three VYOM-1 Stage 1 boosters together with cross-feed capability. Scales payload to 160 kg for constellation deployments.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono pt-2 border-t border-slate-800">
              <li>· 3-core booster clustering</li>
              <li>· 160 kg to SSO capability</li>
              <li>· Dual drone ship synchronized landing</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-purple-400">PHASE 03 · ADVANCED ROADMAP</div>
            <h4 className="text-lg font-bold text-slate-100">Crew-Rated Suborbital</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Human-rated capsule integration utilizing the proven VYOM solid-booster heritage for high-G astronaut training and suborbital microgravity science.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono pt-2 border-t border-slate-800">
              <li>· Launch escape tower integration</li>
              <li>· Human-rated avionics redundancy</li>
              <li>· Microgravity bioscience research</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
