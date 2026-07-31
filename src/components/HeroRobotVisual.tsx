import React, { useState, useEffect } from 'react';
import {
  Activity,
  Battery,
  Cpu,
  Eye,
  ShieldCheck,
  Zap,
  Gauge,
  ArrowRight,
  Play,
  TrendingUp,
  Wifi,
  Thermometer,
  Target,
  ChevronRight,
} from 'lucide-react';

interface HeroRobotVisualProps {
  onBookDemo?: () => void;
  onWatchVideo?: () => void;
  onExploreFleet?: () => void;
}

const STATS = [
  { label: 'Active Robots', value: '2,400+', suffix: '', color: 'text-sky-400' },
  { label: 'Uptime SLA',    value: '99.99',  suffix: '%', color: 'text-emerald-400' },
  { label: 'AI Models',     value: '180+',   suffix: '',  color: 'text-violet-400' },
  { label: 'Incidents Prevented', value: '14K+', suffix: '', color: 'text-amber-400' },
];

export const HeroRobotVisual: React.FC<HeroRobotVisualProps> = ({
  onBookDemo,
  onWatchVideo,
  onExploreFleet,
}) => {
  const [thermalMode, setThermalMode] = useState(false);
  const [telemetry, setTelemetry] = useState({
    battery: 84, cpu: 32, gpu: 64, temp: 42.1, speed: 1.4,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry(p => ({
        ...p,
        cpu:   Math.floor(28 + Math.random() * 22),
        gpu:   Math.floor(55 + Math.random() * 25),
        temp:  +(40 + Math.random() * 4).toFixed(1),
        speed: +(1.1 + Math.random() * 0.6).toFixed(2),
      }));
      setTick(t => t + 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const cpuBar = `${telemetry.cpu}%`;
  const gpuBar = `${telemetry.gpu}%`;

  return (
    <section className="relative min-h-[calc(100vh-60px)] flex flex-col justify-center overflow-hidden">

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      {/* Radial spot lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ══════════════════════════════════════════════
              LEFT — Headline & CTAs
          ══════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col gap-8">

            {/* Status pill */}
            <div className="flex items-center gap-2 w-fit">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-mono text-slate-300 border border-white/8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                SYSTEM STATUS: ALL NOMINAL
                <span className="w-px h-3 bg-white/15" />
                <span className="text-emerald-400 font-semibold">v4.2</span>
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-white">
                Industrial<br />
                <span className="text-gradient-sky-emerald">Robotics</span><br />
                Redefined.
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed font-light">
                Autonomous navigation, computer vision, and real-time AI planning for smart manufacturing and hazardous environments — at enterprise scale.
              </p>
            </div>

            {/* CTA Row */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onExploreFleet}
                className="btn-primary text-sm"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onBookDemo}
                className="btn-ghost text-sm"
              >
                <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                Book Demo
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              {[
                { icon: ShieldCheck, text: 'SOC 2 Type II' },
                { icon: Zap,         text: 'Sub-50ms Latency' },
                { icon: TrendingUp,  text: '99.99% Uptime SLA' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-sky-400/70" />
                  {text}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {STATS.map(s => (
                <div key={s.label} className="glass-light rounded-2xl p-3.5 card-hover">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}<span className="text-sm">{s.suffix}</span></p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT — Live Telemetry Dashboard Card
          ══════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col gap-4">

            {/* Main camera / HUD card */}
            <div className="relative glass rounded-3xl overflow-hidden border border-white/8 shadow-2xl min-h-[280px] flex flex-col">
              {/* header bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-rose-600/90 text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 glass-light px-2.5 py-1 rounded-md border border-white/8">
                    CAM_04 · SECTOR_G
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setThermalMode(!thermalMode)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border transition-all ${
                      thermalMode
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'glass-light border-white/8 text-slate-400 hover:text-white'
                    }`}
                  >
                    {thermalMode ? '🔥 FLIR' : '📷 RGB'}
                  </button>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* HUD viewport */}
              <div
                className={`flex-1 relative flex items-center justify-center py-8 transition-all duration-700 ${
                  thermalMode
                    ? 'bg-gradient-to-b from-orange-950/60 via-red-950/40 to-black/80'
                    : 'bg-gradient-to-b from-slate-900/60 via-slate-950/40 to-black/80'
                }`}
              >
                {/* corner brackets */}
                {[
                  'top-4 left-6 border-t-2 border-l-2',
                  'top-4 right-6 border-t-2 border-r-2',
                  'bottom-4 left-6 border-b-2 border-l-2',
                  'bottom-4 right-6 border-b-2 border-r-2',
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-5 h-5 ${cls} border-emerald-400/70`} />
                ))}

                {/* detection box */}
                <div className="relative border border-emerald-400/60 rounded-lg px-6 py-4 bg-black/30 backdrop-blur-sm text-center">
                  <div className="flex items-center gap-1.5 justify-center mb-1.5">
                    <Target className="w-3 h-3 text-emerald-400" />
                    <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
                      YOLOv11 Detection
                    </span>
                  </div>
                  <div className="px-3 py-1.5 border border-emerald-400/50 bg-emerald-500/15 rounded-md text-xs font-bold text-white font-mono">
                    OBJ_MANIPULATOR — 98.2%
                  </div>
                  {/* scanning line */}
                  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                    style={{ top: `${(tick % 10) * 10}%`, transition: 'top 0.4s linear' }}
                  />
                </div>

                {/* coords */}
                <div className="absolute bottom-4 left-6 font-mono text-[9px] text-slate-500 space-y-0.5">
                  <p>LAT 26.4499° N</p>
                  <p>LNG 80.3319° E</p>
                </div>
                <div className="absolute bottom-4 right-6 font-mono text-[9px] text-sky-400/70 text-right space-y-0.5">
                  <p>PITCH 2.1°</p>
                  <p>ROLL  0.4°</p>
                </div>
              </div>
            </div>

            {/* Telemetry cards row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Battery */}
              <div className="glass-light rounded-2xl p-4 border border-white/8 card-hover">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Battery</p>
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xl font-black text-white">{telemetry.battery}<span className="text-xs text-slate-400">%</span></p>
                <div className="w-full h-1 bg-white/8 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full transition-all duration-700"
                    style={{ width: `${telemetry.battery}%` }} />
                </div>
                <p className="text-[9px] text-emerald-400 mt-1 font-mono">Charging</p>
              </div>

              {/* CPU */}
              <div className="glass-light rounded-2xl p-4 border border-white/8 card-hover">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">CPU</p>
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <p className="text-xl font-black text-white">{telemetry.cpu}<span className="text-xs text-slate-400">%</span></p>
                <div className="w-full h-1 bg-white/8 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-violet-400 rounded-full transition-all duration-700"
                    style={{ width: cpuBar }} />
                </div>
                <p className="text-[9px] text-sky-400 mt-1 font-mono">RTX 6000 Ada</p>
              </div>

              {/* Temp */}
              <div className="glass-light rounded-2xl p-4 border border-white/8 card-hover">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Temp</p>
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xl font-black text-white">{telemetry.temp}<span className="text-xs text-slate-400">°C</span></p>
                <div className="w-full h-1 bg-white/8 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-rose-400 rounded-full transition-all duration-700"
                    style={{ width: `${(telemetry.temp / 85) * 100}%` }} />
                </div>
                <p className="text-[9px] text-amber-400 mt-1 font-mono">Nominal</p>
              </div>
            </div>

            {/* Mission timeline */}
            <div className="glass-light rounded-2xl border border-white/8 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Mission Timeline</p>
                <span className="text-[9px] font-mono text-sky-400/70">V1.0.4-LTS</span>
              </div>
              <div className="space-y-2">
                {[
                  { time: '08:45:22', label: 'Manual path calibration started', status: 'OK', color: 'text-emerald-400' },
                  { time: '08:42:10', label: 'LiDAR mapping in progress',        status: 'SYNC', color: 'text-sky-400', dim: true },
                  { time: '08:38:55', label: 'AI threat scan completed',          status: 'CLEAR', color: 'text-violet-400', dim: true },
                ].map((ev, i) => (
                  <div key={i} className={`flex items-center justify-between text-[11px] gap-3 ${ev.dim ? 'opacity-50' : ''}`}>
                    <span className="font-mono text-slate-500 shrink-0">{ev.time}</span>
                    <span className="text-slate-300 flex-1 truncate">{ev.label}</span>
                    <span className={`font-mono font-bold shrink-0 ${ev.color}`}>{ev.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050A14] to-transparent pointer-events-none" />
    </section>
  );
};
