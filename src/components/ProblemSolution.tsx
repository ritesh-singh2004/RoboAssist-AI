import React from 'react';
import {
  AlertTriangle,
  Flame,
  Clock,
  UserX,
  Brain,
  Eye,
  Radio,
  BarChart,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

const problems = [
  { icon: AlertTriangle, title: 'Worker Injuries & Hazards',   desc: 'Manual inspection in nuclear, oil refining and deep mining environments puts human lives at critical risk every day.' },
  { icon: Clock,         title: 'Unplanned Downtime',          desc: 'Undetected micro-cracks and thermal spikes cause catastrophic plant shutdowns costing millions per day of lost production.' },
  { icon: UserX,         title: 'Critical Labor Shortages',    desc: 'Shortage of specialized engineers to perform 24/7 high-frequency patrols across hazardous industrial zones.' },
  { icon: Flame,         title: 'Slow Manual Inspections',     desc: 'Paper logs and manual thermal readings create blind spots and dangerously delay critical safety intervention windows.' },
];

const solutions = [
  { icon: Brain,   title: 'AI Navigation & SLAM',          desc: '3D spatial point-cloud mapping allows autonomous quadrupeds to navigate unmapped hazard zones without GPS.' },
  { icon: Eye,     title: 'YOLOv11 Computer Vision',       desc: 'Sub-millimeter visual crack detection, gas leak identification and thermal anomaly scanning at 120 FPS.' },
  { icon: Radio,   title: 'Remote Robot Control & ROS2',   desc: 'Low-latency WebRTC streaming with full telemetry dashboard and natural voice mission dispatch.' },
  { icon: BarChart,title: 'Predictive Maintenance AI',     desc: 'Machine learning algorithms predict mechanical wear weeks in advance and schedule preventative servicing automatically.' },
];

export const ProblemSolution: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">

      {/* Subtle ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-label mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-400/80">INDUSTRY CHALLENGES VS SOLUTION</span>
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 leading-tight tracking-tight">
            Why Legacy Operations Fail &<br />
            How <span className="text-gradient-sky-emerald">RoboAssistAI</span> Wins
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Transitioning industrial sites from dangerous manual checks to autonomous AI-driven robotic operations.
          </p>
        </div>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Problems ── */}
          <div className="relative rounded-3xl overflow-hidden border border-rose-500/20 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-rose-500/15 bg-rose-950/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">THE PROBLEM</h3>
                  <p className="text-[11px] text-rose-400/80">Manual & Hazardous Legacy Operations</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full tracking-wider">
                HIGH RISK
              </span>
            </div>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 bg-rose-950/10 backdrop-blur-xl">
              {problems.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-rose-500/8 border border-white/6 hover:border-rose-500/25 transition-all duration-200 card-hover">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                      <h4 className="text-xs font-bold text-white leading-tight">{p.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Solutions ── */}
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/15 bg-emerald-950/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">THE SOLUTION</h3>
                  <p className="text-[11px] text-emerald-400/80">RoboAssistAI Autonomous Platform</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full tracking-wider">
                ZERO DOWNTIME
              </span>
            </div>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 bg-emerald-950/10 backdrop-blur-xl">
              {solutions.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/8 border border-white/6 hover:border-emerald-500/25 transition-all duration-200 card-hover">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="text-xs font-bold text-white leading-tight">{s.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom bridge line */}
        <div className="flex items-center justify-center mt-10 gap-4">
          <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-rose-500/30" />
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/8 text-xs font-mono text-slate-400">
            <span className="text-rose-400">Manual Risk</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-emerald-400">AI Autonomy</span>
          </div>
          <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-emerald-500/30" />
        </div>

      </div>
    </section>
  );
};
