import React, { useState, useEffect } from 'react';
import {
  User,
  LayoutDashboard,
  BrainCircuit,
  Bot,
  Camera,
  Activity,
  FileSpreadsheet,
  ArrowRight,
  Radio,
  Zap
} from 'lucide-react';

export const FlowDiagram: React.FC = () => {
  const [activeNode, setActiveNode] = useState(0);

  // Auto step through architectural flow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 7);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const flowNodes = [
    {
      id: 0,
      title: 'User',
      sub: 'Engineer / Operator',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
      description: 'Initiates mission via Web/Mobile UI or API voice command.'
    },
    {
      id: 1,
      title: 'Web Dashboard',
      sub: 'RoboAssist Control OS',
      icon: LayoutDashboard,
      color: 'from-sky-500 to-cyan-600',
      textColor: 'text-sky-400',
      description: 'Authenticates user credentials, validates permissions & WebSocket connection.'
    },
    {
      id: 2,
      title: 'AI Command Engine',
      sub: 'Gemini 3.6 + ROS2 Bridge',
      icon: BrainCircuit,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400',
      description: 'Computes optimal path, 3D SLAM trajectory & YOLO vision model parameters.'
    },
    {
      id: 3,
      title: 'Industrial Robot',
      sub: 'Titan-X1 / Vulcan / Aegis',
      icon: Bot,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      description: 'Executes physical movement, motor torques, and obstacle re-routing.'
    },
    {
      id: 4,
      title: 'Camera + Sensors',
      sub: 'Thermal FLIR + 3D LiDAR',
      icon: Camera,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      description: 'Captures high-speed point clouds, gas levels, and RGB video at 120 FPS.'
    },
    {
      id: 5,
      title: 'Live Monitoring',
      sub: 'WebRTC Telemetry Hub',
      icon: Activity,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-400',
      description: 'Streams low-latency video and real-time telemetry back to cloud console.'
    },
    {
      id: 6,
      title: 'Mission Report',
      sub: 'AI Analytics & PDF Export',
      icon: FileSpreadsheet,
      color: 'from-emerald-400 to-cyan-500',
      textColor: 'text-emerald-300',
      description: 'Generates automated executive summary, safety scores, and audit log.'
    }
  ];

  return (
    <section className="py-16 relative bg-[#0B1220]/90 border-y border-sky-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            End-to-End <span className="text-sky-400">System Signal Flow</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Real-time bidirectionally synced cloud robotics architecture powering enterprise operations.
          </p>
        </div>

        {/* Desktop Pipeline Flow */}
        <div className="hidden lg:grid grid-cols-7 gap-2 relative z-10">
          {flowNodes.map((node, index) => {
            const Icon = node.icon;
            const isCurrent = activeNode === index;
            return (
              <div key={node.id} className="relative flex flex-col items-center">
                
                {/* Node Box */}
                <div
                  onClick={() => setActiveNode(index)}
                  className={`cursor-pointer w-full p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-slate-900 border-sky-400 shadow-lg shadow-sky-500/30 ring-2 ring-sky-500/50 scale-105'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-80'
                  }`}
                >
                  <div
                    className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center text-white mb-2 shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-white leading-tight font-mono">{node.title}</h3>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{node.sub}</p>
                </div>

                {/* Arrow Connector */}
                {index < flowNodes.length - 1 && (
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-20 pointer-events-none">
                    <ArrowRight
                      className={`w-4 h-4 ${
                        activeNode === index ? 'text-sky-400 animate-pulse' : 'text-slate-700'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Node Detail Card */}
        <div className="mt-8 bg-slate-900/90 border border-sky-500/30 p-5 rounded-2xl max-w-3xl mx-auto flex items-center space-x-4 shadow-xl">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <Zap className="w-6 h-6 text-sky-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-slate-400">STEP {activeNode + 1} OF 7:</span>
              <span className={`text-sm font-mono font-bold ${flowNodes[activeNode].textColor}`}>
                {flowNodes[activeNode].title} ({flowNodes[activeNode].sub})
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {flowNodes[activeNode].description}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
