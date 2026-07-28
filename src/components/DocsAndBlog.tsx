import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Terminal,
  Copy,
  ExternalLink,
  Search,
  Check,
  FileCode,
  Sparkles
} from 'lucide-react';

export const DocsAndBlog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'API Reference' | 'ROS2 Bridge' | 'Case Studies'>('API Reference');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/ai/plan-mission',
      desc: 'Dispatches mission coordinates and sector prompts to Gemini 3.6 Flash for autonomous path generation.',
      bodyExample: '{\n  "sectorPrompt": "Patrol Sector 4 Valve B for high thermal anomalies",\n  "robotType": "Titan-X1 Quadruped",\n  "urgency": "HIGH"\n}'
    },
    {
      method: 'POST',
      path: '/api/ai/analyze-incident',
      desc: 'Parses meeting transcripts from Google Meet/Zoom and returns extracted facts, hypotheses, and action items.',
      bodyExample: '{\n  "incidentTitle": "Primary Bearing Thermal Spike",\n  "platform": "Google Meet",\n  "transcriptText": "[Engineer] High temperature registered on bearing B2..."\n}'
    },
    {
      method: 'POST',
      path: '/api/ai/generate-docs',
      desc: 'Auto-generates production README, API docs, or Architecture diagrams for robotics projects.',
      bodyExample: '{\n  "projectName": "Titan Thermal Patrol",\n  "robotType": "Quadruped",\n  "docType": "README"\n}'
    }
  ];

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopiedEndpoint(str);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center space-x-2">
              <span>DOCUMENTATION & ROS2 SDK</span>
              <span className="px-2.5 py-0.5 text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-sans">
                Swagger Open API 3.0
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Complete REST API specification, ROS2 colcon bridge setup, & industrial deployment guides.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {(['API Reference', 'ROS2 Bridge', 'Case Studies'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeTab === tab
                  ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: API REFERENCE */}
      {activeTab === 'API Reference' && (
        <div className="space-y-6">
          {endpoints.map((ep) => (
            <div key={ep.path} className="bg-slate-900/90 border border-sky-500/20 p-6 rounded-2xl space-y-4 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold">
                    {ep.method}
                  </span>
                  <span className="text-base font-bold text-white">{ep.path}</span>
                </div>
                <button
                  onClick={() => handleCopy(ep.path)}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedEndpoint === ep.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEndpoint === ep.path ? 'Copied' : 'Copy Endpoint'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans">{ep.desc}</p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-sky-400 block mb-1">JSON Request Body Example:</span>
                <pre className="text-xs text-slate-200">{ep.bodyExample}</pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ROS2 BRIDGE */}
      {activeTab === 'ROS2 Bridge' && (
        <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-2xl space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white">ROS2 Humble / Iron Colcon Package Setup</h3>
          <p className="text-slate-300 font-sans">
            Install the official <code>roboassist_ros2_bridge</code> package in your ROS2 workspace to map sensors and motor actuators to our cloud edge platform.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-emerald-400">
            <p className="text-slate-500"># 1. Clone into your ros2_ws/src directory</p>
            <p>cd ~/ros2_ws/src</p>
            <p>git clone https://github.com/roboassist/roboassist_ros2_bridge.git</p>
            <p className="text-slate-500 pt-2"># 2. Build via colcon</p>
            <p>cd ~/ros2_ws && colcon build --packages-select roboassist_ros2_bridge</p>
            <p className="text-slate-500 pt-2"># 3. Source environment & run bridge node</p>
            <p>source install/setup.bash</p>
            <p>ros2 run roboassist_ros2_bridge telemetry_publisher --ros-args -p api_key:="rb_live_90a8..."</p>
          </div>
        </div>
      )}

      {/* TAB 3: CASE STUDIES */}
      {activeTab === 'Case Studies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          <div className="bg-slate-900/90 border border-sky-500/20 p-6 rounded-2xl space-y-3">
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 rounded">OIL & GAS CASE STUDY</span>
            <h3 className="text-lg font-bold font-mono text-white">Reliance Jamnagar Refinery</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deployed 12 quadruped robots with FLIR thermal cameras to inspect 4,000 high-pressure steam valves daily, avoiding an estimated $14M in unplanned plant downtime.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-sky-500/20 p-6 rounded-2xl space-y-3">
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-sky-500/20 text-sky-400 rounded">SMART MINING</span>
            <h3 className="text-lg font-bold font-mono text-white">Tata Steel Underground Mining</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Implemented 3D LiDAR SLAM autonomous rovers to scan dangerous unmapped mine shafts before human entry, maintaining zero casualties across 18 months.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
