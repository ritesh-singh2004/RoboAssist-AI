import React from 'react';
import { Cloud, Satellite, Wifi, Shield, Activity, Zap } from 'lucide-react';

const features = [
  { title: 'Secure ROS2 Bridge', description: 'Connect robots to the cloud with encrypted ROS2 tunnels and fleet orchestration.', icon: <Satellite className="w-5 h-5" /> },
  { title: 'Live Telemetry Streams', description: 'Stream sensor, vision, and diagnostics data to central dashboards in real time.', icon: <Cloud className="w-5 h-5" /> },
  { title: 'Edge Compute Fleet', description: 'Run inference close to robots with private GPU clusters and mission-specific models.', icon: <Zap className="w-5 h-5" /> },
  { title: 'Policy Enforcement', description: 'Apply safety policies, no-go zones, and automated emergency stop controls.', icon: <Shield className="w-5 h-5" /> },
];

export const RoboticsCloud: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ROBOTICS CLOUD PLATFORM</p>
            <h2 className="text-3xl font-extrabold text-white">Secure Fleet Cloud & Mission Orchestration</h2>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Manage robots, telemetry, mission pipelines, and secure live control from a single SaaS command center.
            </p>
          </div>
          <div className="space-y-2 text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-slate-200 border border-white/10">
              <Wifi className="w-4 h-4 text-sky-400" /> 24/7 Fleet Connectivity
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-slate-200 border border-white/10">
              <Activity className="w-4 h-4 text-emerald-400" /> Live Mission Analytics
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="inline-flex items-center justify-center rounded-3xl bg-slate-900/80 p-3 mb-4 border border-white/10 text-sky-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Connected Fleet</h3>
          <p className="mt-3 text-slate-300 text-sm">Monitor connected robots, link connectivity scores to mission readiness, and spin up edge clusters per region.</p>
          <div className="mt-6 space-y-4 text-slate-300 text-xs">
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Robots Online</p>
              <p className="mt-2">34 / 40</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Safety Alerts</p>
              <p className="mt-2 text-emerald-300">2 Active</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Mission Pipeline</h3>
          <p className="mt-3 text-slate-300 text-sm">Orchestrate mission phases from planning, validation, field deployment, and post-mission analytics.</p>
          <div className="mt-6 space-y-4 text-slate-300 text-xs">
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Current Missions</p>
              <p className="mt-2">8 Active</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Edge Workloads</p>
              <p className="mt-2">14 GPU Pods</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Security & Audit</h3>
          <p className="mt-3 text-slate-300 text-sm">Control access to fleets, enforce mission policies, and capture audit trails for every command and model deployment.</p>
          <div className="mt-6 space-y-4 text-slate-300 text-xs">
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Compliance Status</p>
              <p className="mt-2">PCI/ISO Ready</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
              <p className="font-semibold text-white">Data Encryption</p>
              <p className="mt-2">AES-256 at rest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
