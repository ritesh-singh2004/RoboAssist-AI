import React from 'react';
import { Compass, Target, Activity, Zap, Cpu } from 'lucide-react';

const missionTemplates = [
  { title: 'Thermal Inspection Sweep', subtitle: 'Autonomous anomaly scan for refinery burners.', status: 'Ready' },
  { title: 'Warehouse Logistics Shuttle', subtitle: 'Optimize pallet transfer routes with adaptive scheduling.', status: 'In Review' },
  { title: 'Emergency Response Dispatch', subtitle: 'Auto-assign responder robots to high-priority zones.', status: 'Deployed' },
];

export const AIMissions: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AI MISSION OPERATIONS</p>
            <h2 className="text-3xl font-extrabold text-white">RoboAssist AI Mission Control</h2>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Create mission templates, validate workflows, and deploy safe autonomous operations to robots in the field.
            </p>
          </div>
          <button className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition">
            New Mission Template
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {missionTemplates.map((template) => (
          <div key={template.title} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Template</p>
                <h3 className="text-xl font-semibold text-white">{template.title}</h3>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] rounded-full bg-slate-800/90 px-3 py-2 text-slate-300 border border-white/10">
                {template.status}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{template.subtitle}</p>
            <div className="mt-5 grid gap-3 text-slate-400 text-xs">
              <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 flex items-center gap-3">
                <Compass className="w-4 h-4 text-sky-300" /> Validate mission rules
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 flex items-center gap-3">
                <Target className="w-4 h-4 text-emerald-300" /> Map safety zones
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 flex items-center gap-3">
                <Activity className="w-4 h-4 text-violet-300" /> Assign fleets
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Mission Health</h3>
          <div className="mt-5 grid gap-3 text-slate-300 text-sm">
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Safety Validation</p>
              <p className="mt-2">All templates pass policy checks.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Operational Readiness</p>
              <p className="mt-2">Fleet ready in 4 regions.</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">AI Optimization</h3>
          <div className="mt-5 grid gap-3 text-slate-300 text-sm">
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-300" /> Real-time mission replanning
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-sky-300" /> Adaptive compute scaling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
