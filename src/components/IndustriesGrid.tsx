import React, { useState } from 'react';
import {
  Factory,
  Pickaxe,
  Flame,
  Zap,
  Building2,
  HardHat,
  Warehouse,
  Anchor,
  Train,
  ShieldAlert,
  Building,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const IndustriesGrid: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(0);

  const industries = [
    {
      title: 'Manufacturing',
      icon: Factory,
      useCase: 'Automated assembly line inspection, bin picking, & welding defect detection using 6-DOF robotic arms.',
      impact: '35% Higher Output Quality',
      robots: 'Aegis Arm 900, Vulcan Humanoid'
    },
    {
      title: 'Mining',
      icon: Pickaxe,
      useCase: 'Underground tunnel structural scanning, explosive gas sniffing, & autonomous heavy ore hauling.',
      impact: '100% Elimination of Human Tunnel Risk',
      robots: 'CyberRover-V4, Titan-X1'
    },
    {
      title: 'Oil & Gas',
      icon: Flame,
      useCase: 'Refinery high-temperature pipe thermal scanning, offshore rig perimeter patrol & gas leak triage.',
      impact: '92% Reduction in Unplanned Shutdowns',
      robots: 'Titan-X1 Quadruped, SkyScout Drone'
    },
    {
      title: 'Power Plants',
      icon: Zap,
      useCase: 'Nuclear reactor valve calibration, solar panel array thermal inspection & high-voltage line monitoring.',
      impact: '24/7 Continuous Thermal Patrol',
      robots: 'SkyScout Drone, Titan-X1'
    },
    {
      title: 'Infrastructure',
      icon: Building2,
      useCase: 'Bridge stress point laser scanning, tunnel crack mapping, & dam concrete structural analysis.',
      impact: 'Sub-millimeter Crack Detection',
      robots: 'SkyScout VTOL, CyberRover'
    },
    {
      title: 'Construction',
      icon: HardHat,
      useCase: 'Building progress 3D SLAM digital twin mapping, heavy material transport & worker safety compliance.',
      impact: '40% Faster Progress Audits',
      robots: 'ExoCore-G2, CyberRover-V4'
    },
    {
      title: 'Warehouses',
      icon: Warehouse,
      useCase: 'Autonomous pallet sorting, high-shelf inventory auditing, & fleet material handling.',
      impact: '3x Sorting Speed Boost',
      robots: 'Vulcan Humanoid, Aegis Arm'
    },
    {
      title: 'Ports & Logistics',
      icon: Anchor,
      useCase: 'Container terminal perimeter surveillance, automated crane alignment & cargo seal verification.',
      impact: '24/7 Autonomous Cargo Flow',
      robots: 'CyberRover-V4, SkyScout'
    },
    {
      title: 'Railways',
      icon: Train,
      useCase: 'Track geometry thermal laser alignment, pantograph spark detection & tunnel clearance sweeps.',
      impact: 'Zero Track Derailments',
      robots: 'Titan-X1, CyberRover'
    },
    {
      title: 'Defense Support',
      icon: ShieldAlert,
      useCase: 'Hazardous EOD ordinance removal, border fence autonomous patrol & unmapped area reconnaissance.',
      impact: 'Maximum Security Perimeter',
      robots: 'Titan-X1, SkyScout VTOL'
    },
    {
      title: 'Smart Cities',
      icon: Building,
      useCase: 'Municipal sewer pipeline inspection, traffic camera calibration & emergency responder drone support.',
      impact: 'Clean & Safe Urban Infrastructure',
      robots: 'SkyScout Drone, Titan-X1'
    },
    {
      title: 'Security',
      icon: Lock,
      useCase: 'Industrial park night patrols, perimeter breach alerts & real-time intruder thermal tracking.',
      impact: 'Instant Incident Alarm',
      robots: 'CyberRover-V4, Titan-X1'
    }
  ];

  const current = industries[selectedIndustry];
  const CurrentIcon = current.icon;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#0EA5E9] text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERTICAL APPLICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#22C55E]">12 Heavy Industries</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm">
            Purpose-built AI models and autonomous robotic hardware configurations engineered for extreme environments.
          </p>
        </div>

        {/* 12-Grid Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            const isSelected = selectedIndustry === idx;
            return (
              <button
                key={ind.title}
                onClick={() => setSelectedIndustry(idx)}
                className={`p-4 rounded-2xl border text-center transition-all backdrop-blur-md ${
                  isSelected
                    ? 'bg-white/15 border-white/30 text-white shadow-xl ring-1 ring-[#0EA5E9]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-[#0EA5E9]' : 'text-slate-400'}`} />
                <span className="text-xs font-mono font-bold block">{ind.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Detail Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-4 rounded-2xl bg-white/10 text-[#0EA5E9] border border-white/10 backdrop-blur-md">
              <CurrentIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white">{current.title} Sector</h3>
                <span className="px-3 py-1 text-[10px] font-mono font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded-full backdrop-blur-md">
                  Industry 4.0 Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
                {current.useCase}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">Deployed Fleet: <strong className="text-[#0EA5E9]">{current.robots}</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto bg-black/40 p-4 rounded-2xl border border-white/10 text-center min-w-[200px] backdrop-blur-md">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Operational Impact</p>
            <p className="text-base font-mono font-bold text-[#22C55E] mt-1">{current.impact}</p>
          </div>
        </div>

      </div>
    </section>
  );
};
