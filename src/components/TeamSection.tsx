import React, { useState } from 'react';
import { TEAM_MEMBERS, TeamMember, ASSET_PATHS } from '../types/mission';
import { Award, Cpu, ShieldCheck, Sparkles, Rocket, Quote, CheckCircle2 } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember>(TEAM_MEMBERS[0]);

  return (
    <section id="team" className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>FLIGHT CREW & ARCHITECTS</span>
            <span aria-hidden="true">·</span>
            <span>SATISH DHAWAN HERITAGE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            Team ASTRYX-K4
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl">
            Led by Srishti, alongside Vivek Matade, Sriharsha, and Panchami. A multidisciplinary student aerospace team pioneering India's reusable microlauncher revolution.
          </p>
        </div>

        {/* Team Creed Badge */}
        <div className="bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-800/60 p-4 rounded-xl max-w-md shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-semibold mb-1">
            <Rocket className="w-3.5 h-3.5" />
            TEAM CREED
          </div>
          <p className="text-slate-200 text-sm font-medium italic">
            "Dreaming beyond limits, building beyond boundaries! ASTRYX-K4 — Let’s reach beyond!"
          </p>
        </div>
      </div>

      {/* Team Insignia & Leadership Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Mission Patch Card */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4 rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/40 bg-slate-950">
            <img
              src={ASSET_PATHS.patch}
              alt="Team ASTRYX-K4 Official Mission Patch"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">ASTRYX-K4</h3>
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mt-0.5">
            VYOM-1 MICROLAUNCHER PROGRAM
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 w-full text-xs text-slate-400 text-left space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">PROGRAM:</span>
              <span className="text-slate-300">VYOM-1 Reusable</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PAYLOAD CAPACITY:</span>
              <span className="text-slate-300">50 kg @ 500 km SSO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">REUSABILITY:</span>
              <span className="text-emerald-400">Stage 1 Drone Ship</span>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEAM_MEMBERS.map((member) => {
            const isSelected = selectedMember.name === member.name;
            return (
              <div
                key={member.name}
                onClick={() => setSelectedMember(member)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 translate-y-[-2px]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 text-white font-bold flex items-center justify-center font-mono text-sm shadow-md">
                    {member.initials}
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                    {member.discipline.split('&')[0]}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-100">{member.name}</h4>
                <div className="text-xs text-slate-400 font-medium mb-3">{member.role}</div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{member.bio}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Member Focus Dossier */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>SPECIALIST DOSSIER</span>
              <span>·</span>
              <span>{selectedMember.role}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100">{selectedMember.name}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedMember.bio}</p>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{selectedMember.quote}"
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800/90 rounded-lg p-6 space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Core Engineering Responsibilities
            </h4>
            <ul className="space-y-3">
              {selectedMember.contributions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Tools Acknowledgment & Responsible Engineering Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400">ENGINEERING TRANSPARENCY</div>
            <h3 className="text-lg font-bold text-slate-100">
              Acknowledgment of AI Tools in Team ASTRYX-K4’s Workflow
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mb-6">
          Team ASTRYX-K4 proudly acknowledges the active, transparent use of Artificial Intelligence tools throughout the conception, simulation, and communication of the VYOM-1 project. As modern student engineers, embracing AI allows us to accelerate prototyping, optimize complex flight calculations, and visualize our aerospace vision with world-class quality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Trajectory Simulation
            </div>
            <p className="text-xs text-slate-400">
              Monte Carlo flight simulations for 70 km stage separation and grid-fin supersonic angle-of-attack profiles.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Propulsion Kinetics
            </div>
            <p className="text-xs text-slate-400">
              Computational modeling of HTPB fuel grain regression rates and liquid N₂O oxidizer flow efficiency.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              Drone Ship Navigation
            </div>
            <p className="text-xs text-slate-400">
              Sensor fusion algorithms predicting sea heave in the Bay of Bengal for millisecond-precision touchdown burns.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Mission Storytelling
            </div>
            <p className="text-xs text-slate-400">
              Generative visual tools and automated narration rendering to communicate the microlauncher roadmap clearly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
