import React, { useState } from 'react';
import {
  Brain, Bot, Activity, Layers, Compass, Eye, Shield, Zap,
  Globe, Radio, MapPin, Clock, Bell, FileText, BarChart2,
  Mic, AlertOctagon, Lock, Users, FileCheck2, Sparkles, ChevronRight
} from 'lucide-react';

type Category = 'All' | 'AI & Vision' | 'Control & Nav' | 'Security & Enterprise';

const allFeatures = [
  { title: 'AI Mission Planning',       category: 'AI & Vision',           icon: Brain,        desc: 'Automated path & sensor sampling optimization using Gemini 3.6 Flash.',                    color: 'sky' },
  { title: 'Robot Fleet Management',    category: 'Control & Nav',         icon: Bot,          desc: 'Centralized multi-robot orchestration across global industrial facilities.',                color: 'emerald' },
  { title: 'Real-time Telemetry',       category: 'Control & Nav',         icon: Activity,     desc: 'Sub-50ms latency battery, CPU, GPU, torque & thermal metrics in real time.',               color: 'sky' },
  { title: 'Digital Twin Sync',         category: 'AI & Vision',           icon: Layers,       desc: 'Bi-directional NVIDIA Isaac Sim & Omniverse 3D spatial digital twin.',                    color: 'violet' },
  { title: '3D SLAM Navigation',        category: 'Control & Nav',         icon: Compass,      desc: 'GPS-denied indoor & underground spatial mapping with LiDAR point clouds.',                  color: 'emerald' },
  { title: 'YOLOv11 Computer Vision',   category: 'AI & Vision',           icon: Eye,          desc: '120 FPS visual crack, gas leak and worker safety helmet detection.',                        color: 'sky' },
  { title: 'Predictive Maintenance',    category: 'AI & Vision',           icon: Zap,          desc: 'Machine learning motor wear prediction to prevent costly plant downtime.',                  color: 'amber' },
  { title: 'Cloud Robotics Platform',   category: 'Security & Enterprise', icon: Globe,        desc: 'Scalable Kubernetes & Docker edge deployment pipeline for any cloud.',                     color: 'violet' },
  { title: 'ROS2 Native Bridge',        category: 'Control & Nav',         icon: Radio,        desc: 'Direct pub/sub topic integration with colcon build support and DDS.',                      color: 'emerald' },
  { title: 'Live GIS GPS Maps',         category: 'Control & Nav',         icon: MapPin,       desc: 'Interactive floorplan overlays with real-time robot waypoints and geofences.',              color: 'sky' },
  { title: 'AI Incident Commander',     category: 'AI & Vision',           icon: Bell,         desc: 'War-room transcription and automatic Jira/Slack action item generation.',                  color: 'rose' },
  { title: 'Voice Mission Dispatch',    category: 'AI & Vision',           icon: Mic,          desc: 'Natural voice commands — "Dispatch Titan-X1 to Sector 4" — processed instantly.',         color: 'violet' },
  { title: 'Emergency Stop Protocol',   category: 'Control & Nav',         icon: AlertOctagon, desc: 'Hardware-level fail-safe kill switch with zero signal propagation delay.',                 color: 'rose' },
  { title: 'Cybersecurity Dashboard',   category: 'Security & Enterprise', icon: Lock,         desc: 'AES-256 encrypted video streams, OAuth2 & JWT token security hardened.',                  color: 'violet' },
  { title: 'Role-Based Access (RBAC)',  category: 'Security & Enterprise', icon: Users,        desc: 'Super Admin, Engineer, Operator & Viewer permission scopes with MFA.',                    color: 'sky' },
  { title: 'Immutable Audit Logs',      category: 'Security & Enterprise', icon: FileCheck2,   desc: 'Compliance audit trail tracking every manual override and robot dispatch event.',           color: 'emerald' },
] as const;

const ICON_COLORS: Record<string, string> = {
  sky:     'text-sky-400     bg-sky-500/15     border-sky-500/25',
  emerald: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25',
  violet:  'text-violet-400  bg-violet-500/15  border-violet-500/25',
  amber:   'text-amber-400   bg-amber-500/15   border-amber-500/25',
  rose:    'text-rose-400    bg-rose-500/15    border-rose-500/25',
};

export const FeaturesShowcase: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category>('All');

  const filtered = activeFilter === 'All'
    ? allFeatures
    : allFeatures.filter(f => f.category === activeFilter);

  const filters: Category[] = ['All', 'AI & Vision', 'Control & Nav', 'Security & Enterprise'];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="section-label mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-violet-400/80">ENTERPRISE CAPABILITIES</span>
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Full Industrial{' '}
            <span className="text-gradient-sky-emerald">Feature Matrix</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Everything required to operate, monitor, and scale enterprise autonomous robot fleets securely.
          </p>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'glass-light text-slate-400 hover:text-white border border-white/8 hover:border-white/15'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(feat => {
            const Icon = feat.icon;
            const colorCls = ICON_COLORS[feat.color];
            return (
              <div
                key={feat.title}
                className="group glass-light rounded-3xl p-5 border border-white/6 hover:border-white/12 card-hover cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl border mb-4 ${colorCls} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{feat.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{feat.desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-[10px] font-mono ${colorCls.split(' ')[0]} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <span>Learn more</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom count badge */}
        <div className="flex items-center justify-center mt-10">
          <div className="glass rounded-full px-6 py-2.5 border border-white/8 text-xs font-mono text-slate-400">
            Showing <span className="text-white font-bold">{filtered.length}</span> of{' '}
            <span className="text-white font-bold">{allFeatures.length}</span> enterprise capabilities
          </div>
        </div>

      </div>
    </section>
  );
};
