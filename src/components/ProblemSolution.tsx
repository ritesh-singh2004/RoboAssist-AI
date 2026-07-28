import React from 'react';
import {
  AlertTriangle,
  Flame,
  Clock,
  UserX,
  ShieldCheck,
  Brain,
  Eye,
  Radio,
  BarChart,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Worker Injuries & Severe Hazards',
      desc: 'Manual inspection in nuclear, oil refining, and deep mining environments puts human lives at risk.'
    },
    {
      icon: Clock,
      title: 'Unplanned Facility Downtime',
      desc: 'Undetected micro-cracks and thermal spikes cause catastrophic plant shutdowns costing millions/day.'
    },
    {
      icon: UserX,
      title: 'Critical Labor Shortages',
      desc: 'Shortage of specialized robotics engineers and technicians to perform 24/7 high-frequency patrols.'
    },
    {
      icon: Flame,
      title: 'Slow Manual Inspections',
      desc: 'Paper logs and manual thermal gun readings leave blind spots and delay safety intervention.'
    }
  ];

  const solutions = [
    {
      icon: Brain,
      title: 'AI Navigation & SLAM',
      desc: '3D spatial point-cloud mapping allows autonomous quadrupeds to navigate unmapped hazard zones.'
    },
    {
      icon: Eye,
      title: 'YOLOv11 Computer Vision',
      desc: 'Sub-millimeter visual crack detection, gas leak identification, and thermal anomaly scanning.'
    },
    {
      icon: Radio,
      title: 'Remote Robot Control & ROS2',
      desc: 'Low-latency WebRTC streaming with full telemetry dashboard and voice mission dispatch.'
    },
    {
      icon: BarChart,
      title: 'Predictive Maintenance Analytics',
      desc: 'Machine learning algorithms predict mechanical wear and schedule preventative servicing.'
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono mb-3 backdrop-blur-md">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>INDUSTRY CHALLENGES VS SOLUTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Legacy Operations Fail & How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#22C55E]">RoboAssistAI</span> Wins
          </h2>
          <p className="mt-3 text-slate-300 text-sm">
            Transitioning industrial sites from dangerous manual checks to autonomous AI-driven robotic operations.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Problem Column */}
          <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 backdrop-blur-md">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">THE PROBLEM</h3>
                  <p className="text-xs text-rose-400">Manual & Hazardous Legacy Operations</p>
                </div>
              </div>
              <span className="px-3 py-1 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                HIGH RISK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problems.map((prob, i) => {
                const Icon = prob.icon;
                return (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all space-y-2">
                    <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
                      <Icon className="w-4 h-4" />
                      <span>{prob.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{prob.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solution Column */}
          <div className="rounded-3xl border border-[#22C55E]/30 bg-[#22C55E]/10 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22C55E]/20 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 backdrop-blur-md">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">THE SOLUTION</h3>
                  <p className="text-xs text-[#22C55E]">RoboAssistAI Autonomous Platform</p>
                </div>
              </div>
              <span className="px-3 py-1 text-[10px] font-mono font-bold bg-[#22C55E]/20 text-[#22C55E] rounded-full border border-[#22C55E]/30">
                ZERO DOWNTIME
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solutions.map((sol, i) => {
                const Icon = sol.icon;
                return (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all space-y-2">
                    <div className="flex items-center space-x-2 text-[#22C55E] text-xs font-bold">
                      <Icon className="w-4 h-4" />
                      <span>{sol.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{sol.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
