import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Activity,
  Battery,
  Cpu,
  Flame,
  Gauge,
  Wifi,
  Video,
  Mic,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  Compass,
  MapPin,
  CheckCircle2,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Radio,
  Terminal,
  Send
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Robot, Mission } from '../types';

interface FleetDashboardProps {
  robots: Robot[];
  missions: Mission[];
  selectedRobotId?: string;
  onSelectRobot?: (id: string) => void;
  onTriggerEmergencyStop: (robotId: string) => void;
  onDispatchMission: (robotId: string, commandText: string) => void;
}

export const FleetDashboard: React.FC<FleetDashboardProps> = ({
  robots,
  missions,
  selectedRobotId,
  onSelectRobot,
  onTriggerEmergencyStop,
  onDispatchMission,
}) => {
  const [localRobotId, setLocalRobotId] = useState<string>(selectedRobotId || robots[0]?.id || 'bot-01');
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [thermalVision, setThermalVision] = useState(false);
  const [eStopTriggered, setEStopTriggered] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (selectedRobotId) {
      setLocalRobotId(selectedRobotId);
    }
  }, [selectedRobotId]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const activeRobotId = localRobotId || robots[0]?.id || 'bot-01';
  const robot = robots.find((r) => r.id === activeRobotId) || robots[0];

  const handleSelectRobot = (id: string) => {
    setLocalRobotId(id);
    if (onSelectRobot) onSelectRobot(id);
  };

  // Recharts telemetry data series
  const telemetryData = [
    { time: '10:00', battery: 98, cpu: 28, temp: 38, torque: 82 },
    { time: '10:05', battery: 94, cpu: 34, temp: 41, torque: 88 },
    { time: '10:10', battery: 90, cpu: 42, temp: 45, torque: 94 },
    { time: '10:15', battery: 88, cpu: 39, temp: 48, torque: 90 },
    { time: '10:20', battery: 85, cpu: 46, temp: 51, torque: 96 },
    { time: '10:25', battery: 82, cpu: 41, temp: 47, torque: 91 },
  ];

  // Web Speech API Microphone Toggle
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechNotice('Web Speech API is not natively supported in this browser. You can type commands directly.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      setSpeechNotice(null);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechNotice('Microphone access requested. Please grant mic permissions or type commands.');
        } else {
          setSpeechNotice(`Speech Recognition notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      setIsListening(false);
      setSpeechNotice('Speech listener error. You can type commands directly.');
    }
  };

  // Text-To-Speech Confirmation
  const speakAudioConfirmation = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS output warning:', e);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3200);
  };

  const handleVoiceDispatch = (customCommand?: string) => {
    const commandToDispatch = customCommand || voiceCommand;
    if (!commandToDispatch.trim()) return;

    setDispatchStatus('AI Engine Analyzing Intent & Generating ROS2 Action Plan...');
    showToast(`Voice command received: ${commandToDispatch}`);
    
    setTimeout(() => {
      onDispatchMission(robot.id, commandToDispatch);
      const confirmMsg = `Mission Dispatched to ${robot.name}: "${commandToDispatch}"`;
      setDispatchStatus(`✓ ${confirmMsg}`);
      speakAudioConfirmation(`Mission dispatched to ${robot.name}. Deploying unit for ${commandToDispatch.slice(0, 40)}`);
      setVoiceCommand('');
      window.setTimeout(() => setDispatchStatus(null), 5000);
      showToast('Mission dispatched successfully. Monitoring robot telemetry.');
    }, 1000);
  };

  const presetVoiceCommands = [
    "Execute thermal leak scan on Sector 4 Valve B",
    "Inspect solar panel array section 12 for fractures",
    "Initiate hazardous gas sweep in chemical storage",
    "Return to charging dock and upload diagnostics"
  ];

  const coordinateBounds = React.useMemo(() => {
    const latitudes = robots.map((r) => r.coordinates.lat);
    const longitudes = robots.map((r) => r.coordinates.lng);
    const minLat = latitudes.length ? Math.min(...latitudes) : 0;
    const maxLat = latitudes.length ? Math.max(...latitudes) : 0;
    const minLng = longitudes.length ? Math.min(...longitudes) : 0;
    const maxLng = longitudes.length ? Math.max(...longitudes) : 0;
    return { minLat, maxLat, minLng, maxLng };
  }, [robots]);

  const calculateMapPosition = (coords: { lat: number; lng: number }) => {
    const vertical = coordinateBounds.maxLat === coordinateBounds.minLat
      ? 50
      : 10 + 80 * (coordinateBounds.maxLat - coords.lat) / (coordinateBounds.maxLat - coordinateBounds.minLat);
    const horizontal = coordinateBounds.maxLng === coordinateBounds.minLng
      ? 50
      : 10 + 80 * (coords.lng - coordinateBounds.minLng) / (coordinateBounds.maxLng - coordinateBounds.minLng);

    return { top: `${vertical}%`, left: `${horizontal}%` };
  };

  const handleEmergencyStop = () => {
    setEStopTriggered(true);
    showToast('Emergency stop initiated for selected robot.');
    onTriggerEmergencyStop(robot.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Robot Fleet Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-white/10 text-[#0EA5E9] border border-white/10 backdrop-blur-md">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>LIVE FLEET TELEMETRY & CONTROL</span>
              <span className="px-3 py-1 text-[10px] bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded-full font-mono font-bold backdrop-blur-md">
                5 UNITS ONLINE
              </span>
            </h2>
            <p className="text-xs text-slate-300">Sub-50ms latency WebSocket ROS2 telemetry stream</p>
          </div>
        </div>

        {/* Emergency Stop Switch */}
        <button
          onClick={handleEmergencyStop}
          className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-mono text-xs font-extrabold uppercase shadow-xl transition-all ${
            eStopTriggered
              ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-500/50'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-600 hover:text-white backdrop-blur-md'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{eStopTriggered ? 'E-STOP ENGAGED (KILLED)' : 'EMERGENCY STOP (KILL ALL)'}</span>
        </button>
      </div>

      {/* Robot Selector Pills */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {robots.map((r) => {
          const isSelected = r.id === activeRobotId;
          return (
            <button
              key={r.id}
              onClick={() => handleSelectRobot(r.id)}
              className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl border whitespace-nowrap transition-all backdrop-blur-md ${
                isSelected
                  ? 'bg-white/15 border-white/30 text-white shadow-xl ring-1 ring-[#0EA5E9]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bot className={`w-5 h-5 ${isSelected ? 'text-[#0EA5E9]' : 'text-slate-400'}`} />
              <div className="text-left">
                <p className="text-xs font-bold leading-none">{r.name}</p>
                <p className="text-[10px] text-slate-300 mt-1">{r.type} | {r.batteryPercent}% Batt</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Camera Stream with YOLO Vision */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-2xl">
            
            {/* Stream Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>LIVE CAM: {robot.name}</span>
              </div>

              <button
                onClick={() => setThermalVision(!thermalVision)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all backdrop-blur-md ${
                  thermalVision
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-black/60 text-slate-300 border border-white/10 hover:text-white'
                }`}
              >
                {thermalVision ? 'FLIR THERMAL ACTIVE' : 'TOGGLE FLIR THERMAL'}
              </button>
            </div>

            {/* Video Feed Simulation Container */}
            <div className="relative h-80 sm:h-96 w-full flex items-center justify-center bg-black/80">
              <img
                src={robot.cameraStreamUrl || 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=80'}
                alt="Robot Camera Feed"
                className={`w-full h-full object-cover transition-all ${
                  thermalVision ? 'hue-rotate-180 contrast-200 saturate-200' : ''
                }`}
              />

              {/* YOLO AI Object Detection Bounding Boxes Overlay */}
              <div className="absolute top-1/4 left-1/3 w-36 h-28 border-2 border-[#22C55E] bg-[#22C55E]/10 rounded-xl p-1.5 font-mono text-[10px] text-[#22C55E] shadow-lg pointer-events-none backdrop-blur-xs">
                <span className="bg-[#22C55E] text-black font-bold px-1.5 py-0.5 rounded text-[9px]">
                  VALVE_B4: 98.4%
                </span>
                <p className="mt-1 text-white font-bold">Status: Operational</p>
                <p className="text-gray-300">Temp: 48.2°C</p>
              </div>

              <div className="absolute bottom-1/3 right-1/4 w-32 h-20 border-2 border-amber-400 bg-amber-500/10 rounded-xl p-1.5 font-mono text-[10px] text-amber-300 shadow-lg pointer-events-none backdrop-blur-xs">
                <span className="bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded text-[9px]">
                  HOTSPOT DETECTED
                </span>
                <p className="mt-1 text-white font-bold">Temp: 62.1°C</p>
              </div>
            </div>

            {/* Bottom Stream Bar */}
            <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2">
              <div className="flex items-center space-x-4">
                <span>FPS: <strong className="text-[#22C55E]">120.0</strong></span>
                <span>Bitrate: <strong className="text-[#0EA5E9]">14.2 Mbps</strong></span>
                <span>Resolution: <strong className="text-white">4K 60FPS</strong></span>
              </div>
              <span className="text-slate-400">Sector: {robot.locationSector}</span>
            </div>

          </div>

          {/* AI VOICE & COMMAND DISPATCHER INTERFACE (Web Speech API Enabled) */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-white/15 backdrop-blur-2xl p-6 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Voice Pulse Overlay when Listening */}
            {isListening && (
              <div className="absolute inset-0 bg-rose-500/5 backdrop-blur-[1px] pointer-events-none animate-pulse border-2 border-rose-500/30 rounded-3xl" />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
                <span>AI VOICE & COMMAND DISPATCHER</span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                  WEB SPEECH API 2.0
                </span>
              </div>

              {/* TTS Audio Toggle */}
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono transition-all ${
                  ttsEnabled
                    ? 'bg-[#0EA5E9]/20 border-[#0EA5E9]/50 text-sky-300'
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}
                title="Toggle Text-To-Speech (TTS) Voice Feedback"
              >
                {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{ttsEnabled ? 'TTS Audio ON' : 'TTS Audio Muted'}</span>
              </button>
            </div>

            {/* Voice Command Input & Mic Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={voiceCommand}
                  onChange={(e) => setVoiceCommand(e.target.value)}
                  placeholder={`Speak or type mission command e.g. "Execute thermal scan on Sector 4 Valve B"`}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0EA5E9] backdrop-blur-md shadow-inner"
                />
                {isListening && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-3 bg-[#0EA5E9] rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleListening}
                  className={`flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl border transition-all font-mono text-xs font-bold ${
                    isListening
                      ? 'bg-rose-500/30 border-rose-500 text-rose-200 animate-pulse shadow-lg shadow-rose-500/30'
                      : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20 hover:text-white'
                  }`}
                  title={isListening ? 'Listening... Click to Stop' : 'Click to Speak Mission Command'}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'text-rose-400 animate-spin' : 'text-purple-400'}`} />
                  <span>{isListening ? 'LISTENING...' : 'SPEAK'}</span>
                </button>

                <button
                  onClick={() => handleVoiceDispatch()}
                  className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] text-white font-mono text-xs font-extrabold shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>DISPATCH</span>
                </button>
              </div>
            </div>

            {/* Real-time Listening Wave Status */}
            {isListening && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs font-mono text-rose-300 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>Real-time Speech Recognition active... Speak clearly into microphone.</span>
                </div>
                <span className="text-[10px] text-rose-400">EN-US</span>
              </div>
            )}

            {/* Speech Notice or Warning Banner */}
            {speechNotice && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs font-mono text-amber-300">
                ⚠️ {speechNotice}
              </div>
            )}

            {/* Dispatch Status Display */}
            {dispatchStatus && (
              <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl text-xs font-mono text-[#22C55E] flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{dispatchStatus}</span>
              </div>
            )}

            {/* Quick Natural Language Command Preset Chips */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Voice Command Presets (Click to dispatch):
              </p>
              <div className="flex flex-wrap gap-2">
                {presetVoiceCommands.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setVoiceCommand(preset);
                      handleVoiceDispatch(preset);
                    }}
                    className="text-[11px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#0EA5E9]/50 px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 group"
                  >
                    <Mic className="w-3 h-3 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="truncate max-w-xs">{preset}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Real-time Telemetry Charts */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-xs font-mono font-bold text-[#0EA5E9] flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>REAL-TIME TELEMETRY METRICS</span>
            </h3>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData}>
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#0EA5E9', fontSize: '11px', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#0EA5E9" fillOpacity={1} fill="url(#cpuGrad)" name="CPU %" />
                  <Area type="monotone" dataKey="temp" stroke="#F59E0B" fillOpacity={1} fill="url(#tempGrad)" name="Temp °C" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Robot Health Stats, Sensors & GIS Map */}
        <div className="space-y-6">
          
          {/* Hardware Health Widget */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase">{robot.name} Status</h3>
              <span className="px-3 py-1 text-[10px] font-mono bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30 rounded-full backdrop-blur-md">
                {robot.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-slate-400 text-[10px]">BATTERY</span>
                <p className="text-base font-bold text-[#22C55E] mt-1">{robot.batteryPercent}%</p>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-slate-400 text-[10px]">CPU / GPU</span>
                <p className="text-base font-bold text-[#0EA5E9] mt-1">{robot.cpuPercent}% / {robot.gpuPercent}%</p>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-slate-400 text-[10px]">TEMPERATURE</span>
                <p className="text-base font-bold text-amber-400 mt-1">{robot.tempCelsius}°C</p>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-slate-400 text-[10px]">3D LIDAR POINTS</span>
                <p className="text-base font-bold text-purple-400 mt-1">{robot.sensors.lidarPoints.toLocaleString()}</p>
              </div>
            </div>

            {/* IoT Gas & Ultrasonic Sensors */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gas Detection (Sniffer):</span>
                <span className="text-[#22C55E] font-bold">{robot.sensors.gasDetectionPpm} PPM (Nominal)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vibration Frequency:</span>
                <span className="text-[#0EA5E9] font-bold">{robot.sensors.vibrationHz} Hz</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ultrasonic Distance:</span>
                <span className="text-amber-400 font-bold">{robot.sensors.ultrasonicCm} cm</span>
              </div>
            </div>
          </div>

          {/* Interactive GIS Sector Map */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-3 shadow-2xl">
            <h3 className="text-xs font-mono font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#22C55E]" />
              <span>FACILITY GIS MAP & ROBOT WAYPOINTS</span>
            </h3>

            <div className="relative h-56 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center p-4 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#0EA5E9_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

              {/* Interactive Robot Grid Map */}
              <div className="absolute inset-0">
                {robots.map((fleetRobot) => {
                  const position = calculateMapPosition(fleetRobot.coordinates);
                  const isSelectedRobot = fleetRobot.id === activeRobotId;
                  return (
                    <button
                      key={fleetRobot.id}
                      type="button"
                      onClick={() => handleSelectRobot(fleetRobot.id)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={position}
                    >
                      <div className={`w-10 h-10 rounded-full border-2 ${isSelectedRobot ? 'border-[#0EA5E9] bg-[#0EA5E9]/70 shadow-xl shadow-cyan-500/30' : 'border-white/20 bg-white/10'} transition-all`}>
                        <Bot className={`w-5 h-5 m-auto text-white ${isSelectedRobot ? 'animate-pulse' : ''}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 12 75 Q 30 20 55 55 T 88 35" fill="none" stroke="#0EA5E9" strokeWidth="0.8" strokeDasharray="2 2" />
                <circle cx="55" cy="55" r="2" fill="#22C55E" className="animate-pulse" />
              </svg>

              <div className="relative z-10 bg-black/70 border border-white/10 backdrop-blur-md p-3 rounded-xl text-[11px] font-mono text-slate-200">
                <p className="text-[#0EA5E9] font-bold">ACTIVE WAYPOINT</p>
                <p>Robot: {robot.name}</p>
                <p className="truncate">Lat: {robot.coordinates.lat.toFixed(4)}</p>
                <p className="truncate">Lng: {robot.coordinates.lng.toFixed(4)}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-3xl border border-white/20 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-2xl shadow-slate-950/40 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between gap-3">
            <span className="flex-1 text-xs sm:text-sm">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
