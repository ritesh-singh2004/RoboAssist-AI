import React, { useState } from 'react';
import {
  LogIn,
  Bot,
  Brain,
  Video,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Cpu,
  BarChart3,
  Download,
  Play
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedRobot, setSelectedRobot] = useState('Titan-X1 Quadruped');
  const [selectedMissionType, setSelectedMissionType] = useState('Inspection');
  const [isSimulatingStep2, setIsSimulatingStep2] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Login & Mission Creation',
      subtitle: 'Select Autonomous Robot & Mission Objectives',
      icon: LogIn,
      description: 'Log into RoboAssistAI, choose from quadrupeds, bipedal humanoids, robotic arms, or drones, and define mission targets.'
    },
    {
      num: 2,
      title: 'AI Command Execution & Live Telemetry',
      subtitle: 'Computer Vision, SLAM Navigation & Realtime Stream',
      icon: Brain,
      description: 'The AI Command Engine computes optimal path planning, handles obstacle avoidance, and streams video, sensors, & GPS.'
    },
    {
      num: 3,
      title: 'Mission Complete & AI PDF Report',
      subtitle: 'Analytics, Timeline & Performance Insights',
      icon: FileCheck,
      description: 'Automated synthesis of anomalies, thermal hotspots, gas readings, and safety timeline into instant PDF & executive summaries.'
    }
  ];

  return (
    <section className="py-16 relative text-white overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0EA5E9]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#0EA5E9] text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTONOMOUS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#22C55E]">RoboAssistAI</span> Works
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            From command initiation to autonomous AI deployment and instant executive reporting in 3 simple steps.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`cursor-pointer p-6 rounded-3xl border transition-all backdrop-blur-xl ${
                  isActive
                    ? 'bg-white/10 border-white/20 shadow-2xl ring-1 ring-[#0EA5E9]/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm backdrop-blur-md ${
                      isActive
                        ? 'bg-[#0EA5E9] text-white shadow-lg shadow-sky-500/30'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    0{step.num}
                  </span>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-[#0EA5E9]' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs font-mono text-[#0EA5E9] mb-2">{step.subtitle}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Simulator Window */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* STEP 1 SIMULATOR */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                    <LogIn className="w-5 h-5 text-[#0EA5E9]" />
                    <span>STEP 1: SELECT ROBOT & MISSION CONFIGURATION</span>
                  </h4>
                  <p className="text-xs text-slate-400">Authenticated Session: Dr. Rajesh Subramanian (Organization Admin)</p>
                </div>
                <span className="px-3 py-1 text-xs font-mono bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded-full backdrop-blur-md">
                  System Auth OK
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">1. Select Autonomous Robot Unit:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Titan-X1 Quadruped', 'Vulcan Humanoid', 'CyberRover V4', 'SkyScout Drone'].map((robot) => (
                      <button
                        key={robot}
                        onClick={() => setSelectedRobot(robot)}
                        className={`p-3 rounded-2xl border text-left text-xs font-medium transition-all backdrop-blur-md ${
                          selectedRobot === robot
                            ? 'bg-[#0EA5E9]/20 border-[#0EA5E9] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <Bot className="w-4 h-4 text-[#0EA5E9] mb-1" />
                        <span>{robot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">2. Choose Mission Protocol:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Inspection', 'Surveillance', 'Emergency Response', 'Material Handling'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedMissionType(type)}
                        className={`p-3 rounded-2xl border text-left text-xs font-medium transition-all backdrop-blur-md ${
                          selectedMissionType === type
                            ? 'bg-[#22C55E]/20 border-[#22C55E] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <Cpu className="w-4 h-4 text-[#22C55E] mb-1" />
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-black text-xs font-bold font-mono shadow-xl hover:scale-105 transition-all"
                >
                  <span>INITIALIZE AI COMMAND & DISPATCH</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 SIMULATOR */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>STEP 2: AI COMMAND ENGINE EXECUTING MISSION</span>
                  </h4>
                  <p className="text-xs text-slate-400">Unit: {selectedRobot} | Protocol: {selectedMissionType}</p>
                </div>
                <span className="px-3 py-1 text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full animate-pulse backdrop-blur-md">
                  SLAM + Vision Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#0EA5E9]">
                    <span>PATH PLANNING</span>
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <p className="text-xs text-slate-300">Generating 3D SLAM spatial map with Nav2 obstacles re-routing.</p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#22C55E]">
                    <span>LIVE VISION STREAM</span>
                    <Video className="w-4 h-4 text-[#22C55E] animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-300">YOLOv11 neural inference running at 120 FPS on NVIDIA Orin.</p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                    <span>TELEMETRY SYNC</span>
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-300">Sensors: Thermal 58°C | Gas 12 PPM | GPS 19.076N, 72.877E</p>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Step 1
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-black text-xs font-bold font-mono shadow-xl hover:scale-105 transition-all"
                >
                  <span>COMPLETE MISSION & GENERATE AI REPORT</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 SIMULATOR */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-[#22C55E]" />
                    <span>STEP 3: MISSION REPORT GENERATED</span>
                  </h4>
                  <p className="text-xs text-slate-400">Unit: {selectedRobot} | Protocol: {selectedMissionType} | Status: Success</p>
                </div>
                <button
                  onClick={() => alert('Downloading official PDF Mission Report...')}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 rounded-xl text-xs font-mono hover:bg-[#22C55E]/30 transition-all backdrop-blur-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </button>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">SAFETY SCORE</p>
                    <p className="text-xl font-mono font-bold text-[#22C55E]">98 / 100</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">ANOMALIES FOUND</p>
                    <p className="text-xl font-mono font-bold text-amber-400">1 Hotspot</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">MISSION DURATION</p>
                    <p className="text-xl font-mono font-bold text-white">18m 42s</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">DATA RECORDED</p>
                    <p className="text-xl font-mono font-bold text-[#0EA5E9]">2.4 GB</p>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-mono font-bold text-[#0EA5E9] mb-2">AI EXECUTIVE SUMMARY</h5>
                  <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/10">
                    Mission executed with zero safety violations. Minor thermal elevation detected at Valve J-12 (58.4°C). Recommended preventative inspection within 72 hours.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Step 2
                </button>
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-mono border border-white/10 backdrop-blur-md transition-all"
                >
                  Create New Mission
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
