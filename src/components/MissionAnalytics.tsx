import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Calendar,
  Bot,
  Sparkles,
  Download,
  RefreshCw,
  Compass,
  Activity,
  Award,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Cpu,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Robot, Mission } from '../types';

interface MissionAnalyticsProps {
  robots: Robot[];
  missions: Mission[];
  onNavigateToFleet?: (robotId?: string) => void;
}

// Rich historical completed missions dataset for analytics visualization
interface CompletedMissionLog {
  id: string;
  title: string;
  robotName: string;
  robotType: string;
  type: 'Inspection' | 'Surveillance' | 'Emergency Response' | 'Material Handling';
  date: string;
  durationMins: number;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  energyKwh: number;
  batteryDrainPercent: number;
  navEfficiencyPercent: number; // Path optimization index
  safetyScore: number;
  anomaliesCount: number;
  avgSpeedMps: number;
}

const HISTORICAL_MISSION_LOGS: CompletedMissionLog[] = [
  {
    id: 'cm-201',
    title: 'Substation Perimeter Night Surveillance Sweep',
    robotName: 'CyberRover-V4',
    robotType: 'Autonomous Rover',
    type: 'Surveillance',
    date: '2026-07-27',
    durationMins: 105,
    plannedDistanceKm: 12.4,
    actualDistanceKm: 12.8,
    energyKwh: 3.82,
    batteryDrainPercent: 28,
    navEfficiencyPercent: 96.8,
    safetyScore: 100,
    anomaliesCount: 0,
    avgSpeedMps: 2.1,
  },
  {
    id: 'cm-202',
    title: 'Refinery Sector 2 Pressure Valve Ultrasonic Scan',
    robotName: 'Titan-X1 Dog',
    robotType: 'Quadruped',
    type: 'Inspection',
    date: '2026-07-26',
    durationMins: 78,
    plannedDistanceKm: 6.2,
    actualDistanceKm: 6.5,
    energyKwh: 2.15,
    batteryDrainPercent: 32,
    navEfficiencyPercent: 95.3,
    safetyScore: 98,
    anomaliesCount: 1,
    avgSpeedMps: 1.4,
  },
  {
    id: 'cm-203',
    title: 'Solar Farm Array Aerial Thermal Mapping',
    robotName: 'SkyScout Drone',
    robotType: 'Inspection Drone',
    type: 'Inspection',
    date: '2026-07-25',
    durationMins: 42,
    plannedDistanceKm: 18.0,
    actualDistanceKm: 18.2,
    energyKwh: 1.45,
    batteryDrainPercent: 55,
    navEfficiencyPercent: 98.9,
    safetyScore: 96,
    anomaliesCount: 2,
    avgSpeedMps: 7.2,
  },
  {
    id: 'cm-204',
    title: 'Assembly Bay Precision Joint Torque Testing',
    robotName: 'Vulcan-Humanoid Pro',
    robotType: 'Bipedal Humanoid',
    type: 'Material Handling',
    date: '2026-07-24',
    durationMins: 120,
    plannedDistanceKm: 3.1,
    actualDistanceKm: 3.3,
    energyKwh: 4.10,
    batteryDrainPercent: 41,
    navEfficiencyPercent: 93.9,
    safetyScore: 99,
    anomaliesCount: 0,
    avgSpeedMps: 0.8,
  },
  {
    id: 'cm-205',
    title: 'Chemical Storage Gas Sensor Calibration Grid',
    robotName: 'CyberRover-V4',
    robotType: 'Autonomous Rover',
    type: 'Inspection',
    date: '2026-07-23',
    durationMins: 90,
    plannedDistanceKm: 9.8,
    actualDistanceKm: 10.3,
    energyKwh: 3.10,
    batteryDrainPercent: 24,
    navEfficiencyPercent: 95.1,
    safetyScore: 94,
    anomaliesCount: 3,
    avgSpeedMps: 1.9,
  },
  {
    id: 'cm-206',
    title: 'Emergency Ammonia Containment Patrol',
    robotName: 'Titan-X1 Dog',
    robotType: 'Quadruped',
    type: 'Emergency Response',
    date: '2026-07-22',
    durationMins: 64,
    plannedDistanceKm: 5.0,
    actualDistanceKm: 5.7,
    energyKwh: 2.80,
    batteryDrainPercent: 39,
    navEfficiencyPercent: 87.7,
    safetyScore: 92,
    anomaliesCount: 4,
    avgSpeedMps: 1.6,
  },
  {
    id: 'cm-207',
    title: 'Pipeline Trench LiDAR Structure Mapping',
    robotName: 'SkyScout Drone',
    robotType: 'Inspection Drone',
    type: 'Surveillance',
    date: '2026-07-21',
    durationMins: 38,
    plannedDistanceKm: 14.5,
    actualDistanceKm: 14.8,
    energyKwh: 1.30,
    batteryDrainPercent: 50,
    navEfficiencyPercent: 98.0,
    safetyScore: 100,
    anomaliesCount: 0,
    avgSpeedMps: 6.8,
  },
];

// Time Trend Aggregated Data (Last 7 Days)
const TIME_SERIES_ANALYTICS = [
  { date: 'Jul 21', energyKwh: 14.2, navEfficiency: 92.4, distanceKm: 42.1, missions: 5, avgSafety: 96.2 },
  { date: 'Jul 22', energyKwh: 18.5, navEfficiency: 89.1, distanceKm: 51.3, missions: 7, avgSafety: 94.0 },
  { date: 'Jul 23', energyKwh: 16.1, navEfficiency: 94.8, distanceKm: 48.0, missions: 6, avgSafety: 97.5 },
  { date: 'Jul 24', energyKwh: 21.0, navEfficiency: 93.2, distanceKm: 62.4, missions: 8, avgSafety: 98.1 },
  { date: 'Jul 25', energyKwh: 12.8, navEfficiency: 97.1, distanceKm: 39.8, missions: 4, avgSafety: 99.0 },
  { date: 'Jul 26', energyKwh: 19.4, navEfficiency: 95.6, distanceKm: 58.2, missions: 7, avgSafety: 97.8 },
  { date: 'Jul 27', energyKwh: 15.6, navEfficiency: 96.8, distanceKm: 45.5, missions: 5, avgSafety: 98.5 },
];

// Radar Data for Robot Archetype Efficiency Comparison
const RADAR_ROBOT_COMPARISON = [
  { subject: 'Energy Economy', Quadruped: 82, Humanoid: 74, Rover: 92, Drone: 88 },
  { subject: 'Nav Smoothness', Quadruped: 94, Humanoid: 88, Rover: 91, Drone: 98 },
  { subject: 'Payload Capacity', Quadruped: 85, Humanoid: 95, Rover: 98, Drone: 45 },
  { subject: 'Obstacle Agility', Quadruped: 98, Humanoid: 91, Rover: 70, Drone: 99 },
  { subject: 'LiDAR Density', Quadruped: 90, Humanoid: 96, Rover: 88, Drone: 82 },
  { subject: 'Thermal Rating', Quadruped: 92, Humanoid: 85, Rover: 95, Drone: 78 },
];

export const MissionAnalytics: React.FC<MissionAnalyticsProps> = ({
  robots,
  missions,
  onNavigateToFleet,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedRobotType, setSelectedRobotType] = useState<string>('All');
  const [selectedMissionType, setSelectedMissionType] = useState<string>('All');
  const [selectedLog, setSelectedLog] = useState<CompletedMissionLog | null>(HISTORICAL_MISSION_LOGS[0]);

  // Filter logs based on selection
  const filteredLogs = HISTORICAL_MISSION_LOGS.filter((log) => {
    if (selectedRobotType !== 'All' && log.robotType !== selectedRobotType) return false;
    if (selectedMissionType !== 'All' && log.type !== selectedMissionType) return false;
    return true;
  });

  // Calculate aggregated stats
  const totalMissionsCount = filteredLogs.length;
  const totalDistanceKm = filteredLogs.reduce((acc, curr) => acc + curr.actualDistanceKm, 0);
  const totalEnergyKwh = filteredLogs.reduce((acc, curr) => acc + curr.energyKwh, 0);
  const avgNavEfficiency = Math.round(
    filteredLogs.reduce((acc, curr) => acc + curr.navEfficiencyPercent, 0) / (totalMissionsCount || 1)
  );
  const avgSafetyScore = Math.round(
    filteredLogs.reduce((acc, curr) => acc + curr.safetyScore, 0) / (totalMissionsCount || 1)
  );

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#22C55E] text-white shadow-lg shadow-sky-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Mission Analytics & Efficiency
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded-full">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Historical performance benchmarking, energy consumption curves, and ROS2 path navigation efficiency insights.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Time Range Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl flex items-center space-x-1 font-mono text-xs">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  timeRange === range
                    ? 'bg-[#0EA5E9] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Exporting full telemetry dataset in JSON/CSV format...')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-[#0EA5E9]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden group hover:border-[#0EA5E9]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Completed Missions</span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalMissionsCount}</span>
            <span className="text-xs font-bold text-[#22C55E]">+14.2%</span>
          </div>
          <p className="text-[11px] text-slate-400">100% telemetry verified</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0EA5E9]/10 rounded-full blur-2xl group-hover:bg-[#0EA5E9]/20 transition-all pointer-events-none" />
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Energy Consumed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalEnergyKwh.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-300">kWh</span>
          </div>
          <p className="text-[11px] text-slate-400">Avg 0.32 kWh / km</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden group hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Nav Efficiency</span>
            <Navigation className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{avgNavEfficiency}%</span>
            <span className="text-xs font-bold text-[#22C55E]">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400">Path deviation &lt; 0.35m</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0EA5E9]/10 rounded-full blur-2xl group-hover:bg-[#0EA5E9]/20 transition-all pointer-events-none" />
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Distance Covered</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalDistanceKm.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-300">km</span>
          </div>
          <p className="text-[11px] text-slate-400">Ground + Aerial operations</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
        </div>

        {/* Metric 5 */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden group hover:border-[#22C55E]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Safety Score</span>
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{avgSafetyScore}</span>
            <span className="text-xs font-bold text-[#22C55E]">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">Zero safety critical breaches</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#22C55E]/10 rounded-full blur-2xl group-hover:bg-[#22C55E]/20 transition-all pointer-events-none" />
        </div>

      </div>

      {/* Primary Analytics Section: 2 Big Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: Energy Consumption & Navigation Efficiency over Time */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-white/10 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#0EA5E9]" />
                <h2 className="text-lg font-bold text-white font-sans">
                  Energy Consumption Trends & Nav Efficiency Index
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Correlating total kWh power draw against navigation smoothness over time
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1 text-amber-400">
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span>Energy (kWh)</span>
              </span>
              <span className="flex items-center space-x-1 text-[#0EA5E9]">
                <span className="w-3 h-3 rounded-full bg-[#0EA5E9] inline-block" />
                <span>Nav Efficiency (%)</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={TIME_SERIES_ANALYTICS}>
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#F59E0B" tick={{ fontSize: 11 }} domain={[0, 30]} />
                <YAxis yAxisId="right" orientation="right" stroke="#0EA5E9" tick={{ fontSize: 11 }} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="energyKwh" name="Energy (kWh)" stroke="#F59E0B" fill="url(#energyGrad)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="navEfficiency" name="Nav Efficiency (%)" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, fill: '#0EA5E9' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Robot Archetype Performance Radar Comparison */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-white/10 shadow-2xl space-y-4">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white font-sans">
                Archetype Efficiency Radar
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Comparative matrix: Quadruped vs Humanoid vs Rover vs Drone
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_ROBOT_COMPARISON}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                <Radar name="Quadruped" dataKey="Quadruped" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} />
                <Radar name="Humanoid" dataKey="Humanoid" stroke="#A855F7" fill="#A855F7" fillOpacity={0.2} />
                <Radar name="Rover" dataKey="Rover" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} />
                <Radar name="Drone" dataKey="Drone" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Secondary Analytics: Distance vs Planned & Anomaly Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Planned vs Actual Distance Deviation */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-[#22C55E]" />
              <h3 className="text-base font-bold text-white">Route Accuracy: Planned vs Actual Distance</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Deviation Offset</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_MISSION_LOGS.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="robotName" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="plannedDistanceKm" name="Planned (km)" fill="#38BDF8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="actualDistanceKm" name="Actual (km)" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictive Efficiency Suggestions Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-purple-500/30 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI ROS2 PATH OPTIMIZER & PREDICTIVE INSIGHTS</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-[#0EA5E9]">CyberRover-V4 Incline Torque Recommendation</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 rounded-full">+14% Battery Saving</span>
              </div>
              <p className="text-xs text-slate-300">
                Reducing speed from 2.1 m/s to 1.8 m/s on Substation 9 incline reduces motor thermal spikes by 12°C and yields 14% higher energy economy.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-purple-400">SkyScout Drone Rotor Drag Adjustment</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 rounded-full">+8.2% Flight Range</span>
              </div>
              <p className="text-xs text-slate-300">
                Aligning altitude pattern to +15m above solar farm thermal updrafts minimizes motor counter-torque during mid-day surveys.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-amber-400">Titan-X1 Joint Lubrication Cycle</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 rounded-full">Preventative Maintenance</span>
              </div>
              <p className="text-xs text-slate-300">
                Quadruped gait friction coefficient increased by 3.1% on gravel terrain. Recommending knee actuator lubrication check before next mission.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Completed Missions Interactive Log & Filter Table */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Completed Mission Performance Registry</h3>
            <p className="text-xs text-slate-400">Detailed breakdowns of telemetry, energy spent, and safety scores per unit</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Robot Type Filter */}
            <div className="flex items-center space-x-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-2xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <select
                value={selectedRobotType}
                onChange={(e) => setSelectedRobotType(e.target.value)}
                className="bg-transparent focus:outline-none text-white font-mono cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Robot Types</option>
                <option value="Quadruped" className="bg-[#0F172A]">Quadrupeds</option>
                <option value="Autonomous Rover" className="bg-[#0F172A]">Autonomous Rovers</option>
                <option value="Inspection Drone" className="bg-[#0F172A]">Inspection Drones</option>
                <option value="Bipedal Humanoid" className="bg-[#0F172A]">Bipedal Humanoids</option>
              </select>
            </div>

            {/* Mission Type Filter */}
            <div className="flex items-center space-x-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-2xl text-xs text-slate-300">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <select
                value={selectedMissionType}
                onChange={(e) => setSelectedMissionType(e.target.value)}
                className="bg-transparent focus:outline-none text-white font-mono cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Mission Types</option>
                <option value="Inspection" className="bg-[#0F172A]">Inspection</option>
                <option value="Surveillance" className="bg-[#0F172A]">Surveillance</option>
                <option value="Emergency Response" className="bg-[#0F172A]">Emergency Response</option>
                <option value="Material Handling" className="bg-[#0F172A]">Material Handling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Mission Title</th>
                <th className="py-3 px-4">Robot Unit</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Energy (kWh)</th>
                <th className="py-3 px-4">Nav Efficiency</th>
                <th className="py-3 px-4">Safety Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`hover:bg-white/10 cursor-pointer transition-colors ${
                    selectedLog?.id === log.id ? 'bg-white/10 border-l-4 border-l-[#0EA5E9]' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {log.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 flex items-center space-x-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>{log.robotName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-white/10 text-slate-300">
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{log.durationMins} min</td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{log.actualDistanceKm} km</td>
                  <td className="py-3.5 px-4 text-amber-400 font-mono font-bold">{log.energyKwh} kWh</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0EA5E9]">
                    {log.navEfficiencyPercent}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                      {log.safetyScore} / 100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1.5 rounded-xl bg-white/5 hover:bg-white/20 text-slate-300">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Log Deep Dive Inspector Drawer */}
        {selectedLog && (
          <div className="p-5 rounded-2xl bg-black/50 border border-white/15 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#0EA5E9]" />
                <h4 className="text-sm font-bold text-white">Deep-Dive Telemetry Breakdown: {selectedLog.title}</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">{selectedLog.date}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-slate-400 text-[10px]">BATTERY DRAIN</p>
                <p className="text-base font-bold text-amber-400">{selectedLog.batteryDrainPercent}% total</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-slate-400 text-[10px]">AVG CRUISE SPEED</p>
                <p className="text-base font-bold text-sky-400">{selectedLog.avgSpeedMps} m/s</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-slate-400 text-[10px]">ANOMALIES DETECTED</p>
                <p className="text-base font-bold text-emerald-400">{selectedLog.anomaliesCount} events</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-slate-400 text-[10px]">PATH OPTIMIZATION</p>
                <p className="text-base font-bold text-purple-400">{selectedLog.navEfficiencyPercent}% Smoothness</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
