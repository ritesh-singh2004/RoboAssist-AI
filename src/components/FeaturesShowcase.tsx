import React, { useState } from 'react';
import {
  Brain,
  Bot,
  Activity,
  Layers,
  Compass,
  Eye,
  Shield,
  Zap,
  Globe,
  Radio,
  MapPin,
  Clock,
  Bell,
  FileText,
  BarChart2,
  Mic,
  AlertOctagon,
  Lock,
  Users,
  FileCheck2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const FeaturesShowcase: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<'All' | 'AI & Vision' | 'Control & Nav' | 'Security & Enterprise'>('All');

  const allFeatures = [
    { title: 'AI Mission Planning', category: 'AI & Vision', icon: Brain, desc: 'Automated path & sensor sampling optimization using Gemini 3.6 Flash.' },
    { title: 'Robot Fleet Management', category: 'Control & Nav', icon: Bot, desc: 'Centralized multi-robot orchestration across global facilities.' },
    { title: 'Real-time Telemetry', category: 'Control & Nav', icon: Activity, desc: 'Sub-50ms latency battery, CPU, GPU, torque, & thermal metrics.' },
    { title: 'Digital Twin Sync', category: 'AI & Vision', icon: Layers, desc: 'Bi-directional NVIDIA Isaac Sim & Omniverse 3D spatial twin.' },
    { title: '3D SLAM Navigation', category: 'Control & Nav', icon: Compass, desc: 'GPS-denied indoor & underground spatial mapping with LiDAR.' },
    { title: 'YOLOv11 Computer Vision', category: 'AI & Vision', icon: Eye, desc: '120 FPS visual crack, gas leak, and worker safety helmet detection.' },
    { title: 'Predictive Maintenance', category: 'AI & Vision', icon: Zap, desc: 'Machine learning motor wear prediction to prevent plant downtime.' },
    { title: 'Cloud Robotics Platform', category: 'Security & Enterprise', icon: Globe, desc: 'Scalable Kubernetes & Docker edge deployment pipeline.' },
    { title: 'ROS2 Native Bridge', category: 'Control & Nav', icon: Radio, desc: 'Direct pub/sub topic integration with colcon build support.' },
    { title: 'Live GIS GPS Maps', category: 'Control & Nav', icon: MapPin, desc: 'Interactive floorplan overlays with real-time robot waypoints.' },
    { title: 'AI Incident Commander', category: 'AI & Vision', icon: Bell, desc: 'War-room meeting transcription and automatic Jira/Slack action items.' },
    { title: 'Voice Mission Dispatch', category: 'AI & Vision', icon: Mic, desc: 'Natural voice commands ("Dispatch Titan-X1 to Sector 4").' },
    { title: 'Emergency Stop Protocol', category: 'Control & Nav', icon: AlertOctagon, desc: 'Hardware-level fail-safe kill switch with zero signal delay.' },
    { title: 'Cybersecurity Dashboard', category: 'Security & Enterprise', icon: Lock, desc: 'AES-256 encrypted video streams, OAuth2 & JWT token security.' },
    { title: 'Role-Based Access (RBAC)', category: 'Security & Enterprise', icon: Users, desc: 'Super Admin, Engineer, Operator, & Viewer permission scopes.' },
    { title: 'Immutable Audit Logs', category: 'Security & Enterprise', icon: FileCheck2, desc: 'Compliance audit trail tracking every manual override and dispatch.' }
  ];

  const filtered = filterCategory === 'All'
    ? allFeatures
    : allFeatures.filter((f) => f.category === filterCategory);

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#22C55E] text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Full Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#22C55E]">Feature Matrix</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm">
            Everything required to operate, monitor, and scale enterprise autonomous robot fleets securely.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {['All', 'AI & Vision', 'Control & Nav', 'Security & Enterprise'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat as any)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-mono transition-all backdrop-blur-md ${
                  filterCategory === cat
                    ? 'bg-white text-black font-bold shadow-xl'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl hover:border-white/20 hover:bg-white/10 transition-all group shadow-xl"
              >
                <div className="p-3.5 rounded-2xl bg-white/10 text-[#0EA5E9] border border-white/10 backdrop-blur-md w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
