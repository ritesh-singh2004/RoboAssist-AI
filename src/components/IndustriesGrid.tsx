import React, { useState } from 'react';
import {
  Factory, Pickaxe, Flame, Zap, Building2, HardHat,
  Warehouse, Anchor, Train, ShieldAlert, Building, Lock,
  Sparkles, ChevronRight, ArrowUpRight
} from 'lucide-react';

const industries = [
  { title: 'Manufacturing', icon: Factory,    impact: '35% Higher Output Quality',                 robots: 'Aegis Arm 900, Vulcan Humanoid',  useCase: 'Automated assembly line inspection, bin picking & welding defect detection using 6-DOF robotic arms.',         color: 'sky' },
  { title: 'Mining',        icon: Pickaxe,    impact: '100% Elimination of Human Tunnel Risk',     robots: 'CyberRover-V4, Titan-X1',         useCase: 'Underground tunnel structural scanning, explosive gas sniffing & autonomous heavy ore hauling.',                color: 'amber' },
  { title: 'Oil & Gas',     icon: Flame,      impact: '92% Reduction in Unplanned Shutdowns',      robots: 'Titan-X1 Quadruped, SkyScout',    useCase: 'Refinery high-temperature pipe thermal scanning, offshore rig patrol & gas leak triage.',                       color: 'rose' },
  { title: 'Power Plants',  icon: Zap,        impact: '24/7 Continuous Thermal Patrol',            robots: 'SkyScout Drone, Titan-X1',        useCase: 'Nuclear reactor valve calibration, solar panel thermal inspection & high-voltage line monitoring.',               color: 'amber' },
  { title: 'Infrastructure',icon: Building2,  impact: 'Sub-millimeter Crack Detection',            robots: 'SkyScout VTOL, CyberRover',       useCase: 'Bridge stress point laser scanning, tunnel crack mapping & dam concrete structural analysis.',                   color: 'sky' },
  { title: 'Construction',  icon: HardHat,    impact: '40% Faster Progress Audits',                robots: 'ExoCore-G2, CyberRover-V4',       useCase: 'Building progress 3D SLAM digital twin mapping, heavy material transport & worker safety compliance.',           color: 'emerald' },
  { title: 'Warehouses',    icon: Warehouse,  impact: '3× Sorting Speed Boost',                    robots: 'Vulcan Humanoid, Aegis Arm',      useCase: 'Autonomous pallet sorting, high-shelf inventory auditing & fleet material handling.',                           color: 'violet' },
  { title: 'Ports & Logistics', icon: Anchor, impact: '24/7 Autonomous Cargo Flow',                robots: 'CyberRover-V4, SkyScout',         useCase: 'Container terminal perimeter surveillance, automated crane alignment & cargo seal verification.',               color: 'sky' },
  { title: 'Railways',      icon: Train,      impact: 'Zero Track Derailments',                    robots: 'Titan-X1, CyberRover',            useCase: 'Track geometry thermal laser alignment, pantograph spark detection & tunnel clearance sweeps.',                  color: 'emerald' },
  { title: 'Defense',       icon: ShieldAlert,impact: 'Maximum Security Perimeter',                robots: 'Titan-X1, SkyScout VTOL',         useCase: 'Hazardous EOD ordinance removal, border fence autonomous patrol & unmapped area reconnaissance.',               color: 'rose' },
  { title: 'Smart Cities',  icon: Building,   impact: 'Clean & Safe Urban Infrastructure',         robots: 'SkyScout Drone, Titan-X1',        useCase: 'Municipal sewer inspection, traffic camera calibration & emergency responder drone support.',                   color: 'violet' },
  { title: 'Security',      icon: Lock,       impact: 'Instant Incident Alarm',                    robots: 'CyberRover-V4, Titan-X1',         useCase: 'Industrial park night patrols, perimeter breach alerts & real-time intruder thermal tracking.',                 color: 'sky' },
] as const;

const COLOR_MAP: Record<string, { pill: string; icon: string; glow: string; ring: string }> = {
  sky:     { pill: 'bg-sky-500/20 text-sky-300 border-sky-500/30',       icon: 'text-sky-400 bg-sky-500/15 border-sky-500/25',         glow: 'shadow-sky-500/15',     ring: 'ring-sky-500/40' },
  emerald: { pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25', glow: 'shadow-emerald-500/15', ring: 'ring-emerald-500/40' },
  violet:  { pill: 'bg-violet-500/20 text-violet-300 border-violet-500/30',   icon: 'text-violet-400 bg-violet-500/15 border-violet-500/25',   glow: 'shadow-violet-500/15',  ring: 'ring-violet-500/40' },
  amber:   { pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',       icon: 'text-amber-400 bg-amber-500/15 border-amber-500/25',       glow: 'shadow-amber-500/15',   ring: 'ring-amber-500/40' },
  rose:    { pill: 'bg-rose-500/20 text-rose-300 border-rose-500/30',         icon: 'text-rose-400 bg-rose-500/15 border-rose-500/25',           glow: 'shadow-rose-500/15',    ring: 'ring-rose-500/40' },
};

export const IndustriesGrid: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const current = industries[selected];
  const colors = COLOR_MAP[current.color];
  const CurrentIcon = current.icon;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-sky-500/3 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="section-label mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-sky-400/80">VERTICAL APPLICATION</span>
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Empowering{' '}
            <span className="text-gradient-sky-emerald">12 Heavy Industries</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Purpose-built AI models and autonomous robotic hardware configurations engineered for extreme environments.
          </p>
        </div>

        {/* Industry selector grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-8">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            const c = COLOR_MAP[ind.color];
            const isActive = selected === idx;
            return (
              <button
                key={ind.title}
                onClick={() => setSelected(idx)}
                className={`group relative p-3.5 rounded-2xl border text-center transition-all duration-200 card-hover ${
                  isActive
                    ? `glass border-white/15 ring-1 ${c.ring} shadow-xl ${c.glow}`
                    : 'glass-light border-white/6 hover:border-white/12'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 transition-colors ${
                  isActive ? c.icon.split(' ')[0] : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                <span className={`text-[10px] font-bold block leading-tight transition-colors ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                }`}>{ind.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detail card */}
        <div className={`relative rounded-3xl border border-white/8 overflow-hidden shadow-2xl transition-all duration-300 shadow-${current.color}-500/10`}>
          {/* Ambient inner glow matching the color */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 60% at 20% 50%, var(--${current.color === 'sky' ? 'sky' : current.color === 'emerald' ? 'emerald' : current.color === 'violet' ? 'violet' : current.color === 'amber' ? 'amber' : 'rose'}), transparent)` }}
          />

          <div className="relative glass p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Left content */}
            <div className="flex items-start gap-5 flex-1">
              <div className={`p-4 rounded-2xl border shrink-0 ${colors.icon}`}>
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-white">{current.title} Sector</h3>
                  <span className={`px-2.5 py-1 text-[9px] font-mono font-bold border rounded-full ${colors.pill}`}>
                    INDUSTRY 4.0 READY
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{current.useCase}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
                  <span>Deployed Fleet: <strong className="text-sky-400">{current.robots}</strong></span>
                </div>
              </div>
            </div>

            {/* Right impact badge */}
            <div className="glass rounded-2xl border border-white/8 p-5 text-center min-w-[180px] shrink-0">
              <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">Operational Impact</p>
              <p className={`text-sm font-black leading-tight ${colors.icon.split(' ')[0]}`}>{current.impact}</p>
              <button className="mt-3 flex items-center gap-1.5 mx-auto text-[10px] font-mono text-slate-400 hover:text-white transition-colors">
                View Case Study <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
