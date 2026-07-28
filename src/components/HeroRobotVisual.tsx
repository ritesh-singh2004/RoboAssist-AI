import React, { useState, useEffect } from 'react';
import {
  Activity,
  Battery,
  Cpu,
  Wifi,
  Radio,
  Eye,
  ShieldCheck,
  Zap,
  Laptop,
  Flame,
  Gauge,
  Compass,
  Maximize2
} from 'lucide-react';

interface HeroRobotVisualProps {
  onBookDemo?: () => void;
  onWatchVideo?: () => void;
  onExploreFleet?: () => void;
}

export const HeroRobotVisual: React.FC<HeroRobotVisualProps> = ({
  onBookDemo,
  onWatchVideo,
  onExploreFleet,
}) => {
  const [thermalMode, setThermalMode] = useState(false);
  const [jointAngle, setJointAngle] = useState(45);
  const [armState, setArmState] = useState<'IDLE' | 'SCANNING' | 'ACTIVE'>('SCANNING');
  const [telemetry, setTelemetry] = useState({
    battery: 84,
    cpu: 32,
    gpu: 64,
    temp: 42,
    speed: 1.4,
    status: 'OPTIMAL NAV',
  });

  // Simulated live telemetry tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        cpu: Math.floor(30 + Math.random() * 20),
        gpu: Math.floor(55 + Math.random() * 25),
        temp: +(41 + Math.random() * 3).toFixed(1),
        speed: +(1.2 + Math.random() * 0.4).toFixed(2),
      }));
      setJointAngle((prev) => (prev > 80 ? 20 : prev + 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full gap-8 grid grid-cols-1 lg:grid-cols-12 items-center py-4">
      
      {/* Left Column: Hero Headline & Control */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-[#0EA5E9] tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] mr-2 animate-pulse" />
            SYSTEM STATUS: OPTIMAL
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
            Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#22C55E]">Robotics</span><br />
            Redefined.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
            Autonomous navigation, computer vision, and real-time path planning for smart manufacturing and hazardous environments.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={onExploreFleet}
            className="px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-white/10"
          >
            <span>Get Started</span>
            <Eye className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={onBookDemo}
            className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl font-bold text-white flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <span>Book Demo</span>
          </button>
        </div>

        {/* Interactive Architecture Mini-Map / Workflow */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mission Workflow</span>
            <span className="text-[10px] font-mono text-[#22C55E] px-2.5 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
              ACTIVE FLOW
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border border-[#0EA5E9] bg-[#0EA5E9]/10 backdrop-blur-md flex items-center justify-center text-[#0EA5E9] font-mono font-bold text-xs">
                01
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Mission</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] mx-3 opacity-60" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border border-[#22C55E] bg-[#22C55E]/10 backdrop-blur-md flex items-center justify-center text-[#22C55E] font-mono font-bold text-xs">
                02
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">AI Processing</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[#22C55E] to-white/20 mx-3 opacity-40" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-gray-400 font-mono font-bold text-xs">
                03
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Execution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Telemetry Dashboard */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Live Camera Feed Simulation */}
        <div className="relative bg-black/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-4 min-h-[300px] flex flex-col justify-between group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
          
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider animate-pulse">
                LIVE
              </span>
              <span className="bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-gray-300">
                CAM_04: SECTOR_G
              </span>
            </div>
            <button
              onClick={() => setThermalMode(!thermalMode)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono text-[#0EA5E9] transition-all"
            >
              {thermalMode ? 'FLIR THERMAL' : 'RGB CAM'}
            </button>
          </div>

          {/* Simulated HUD Overlay */}
          <div className="relative z-10 my-4 flex items-center justify-center">
            <div className="w-[85%] h-[150px] border-x border-white/20 relative flex items-center justify-center">
              <div className="w-4 h-4 border-t-2 border-l-2 border-[#22C55E] absolute top-0 left-0" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-[#22C55E] absolute top-0 right-0" />
              <div className="w-4 h-4 border-b-2 border-l-2 border-[#22C55E] absolute bottom-0 left-0" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-[#22C55E] absolute bottom-0 right-0" />
              
              <div className="text-center bg-black/50 backdrop-blur-md p-3 rounded-xl border border-[#22C55E]/40">
                <p className="text-[#22C55E] text-[10px] font-mono mb-1 tracking-widest uppercase">
                  YOLO V11 DETECTION
                </p>
                <div className="px-3 py-1 border border-[#22C55E] bg-[#22C55E]/20 text-xs font-bold text-white rounded">
                  OBJ_MANIPULATOR [98.2%]
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 flex justify-between items-end font-mono text-[10px] text-gray-300">
            <div className="space-y-0.5">
              <p>LAT: 28.6139° N</p>
              <p>LNG: 77.2090° E</p>
            </div>
            <div className="text-right">
              <p className="text-[#0EA5E9]">PITCH: 2.1°</p>
              <p className="text-[#0EA5E9]">ROLL: 0.4°</p>
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <p className="text-xs text-gray-400 font-bold mb-1">BATTERY LEVEL</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">{telemetry.battery}%</h3>
              <span className="text-[#22C55E] text-xs pb-0.5 font-medium">Charging</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22C55E] to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${telemetry.battery}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <p className="text-xs text-gray-400 font-bold mb-1">COMPUTE LOAD</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">{telemetry.cpu}%</h3>
              <span className="text-[#0EA5E9] text-xs pb-0.5 font-mono text-right italic leading-tight">
                RTX 6000<br />Ada Gen
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg col-span-2">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mission Timeline</p>
              <span className="text-[10px] text-gray-400 font-mono">V1.0.4-LTS</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] items-center">
                <span className="text-gray-400 font-mono">08:45:22 AM</span>
                <span className="text-white font-medium">Manual path calibration started</span>
                <span className="text-[#22C55E] font-bold font-mono">OK</span>
              </div>
              <div className="flex justify-between text-[11px] items-center opacity-60">
                <span className="text-gray-400 font-mono">08:42:10 AM</span>
                <span className="text-white font-medium">LiDAR mapping in progress</span>
                <span className="text-[#0EA5E9] font-bold font-mono">SYNC</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
