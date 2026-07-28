import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Server,
  Cloud,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Deployment } from '../types';

interface DeploymentPipelineProps {
  deployments: Deployment[];
  onTriggerRollback: (deploymentId: string) => void;
  onNewDeployment: (target: string) => void;
}

export const DeploymentPipeline: React.FC<DeploymentPipelineProps> = ({
  deployments,
  onTriggerRollback,
  onNewDeployment,
}) => {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment>(deployments[0]);
  const [selectedTarget, setSelectedTarget] = useState('Kubernetes (GCP Cluster)');
  const [isDeploying, setIsDeploying] = useState(false);

  const pipelineMetrics = [
    { step: 'Commit', successRate: 98, cpu: 48, memory: 64 },
    { step: 'Build', successRate: 95, cpu: 62, memory: 72 },
    { step: 'Test', successRate: 91, cpu: 55, memory: 70 },
    { step: 'Deploy', successRate: 96, cpu: 67, memory: 78 },
    { step: 'Verify', successRate: 94, cpu: 52, memory: 65 },
  ];

  const targets = [
    'Kubernetes (GCP Cluster)',
    'AWS ECS Docker',
    'Azure Edge Container',
    'Vercel Serverless',
    'Railway Edge',
    'Netlify Function'
  ];

  const handleStartDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      onNewDeployment(selectedTarget);
      setIsDeploying(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Terminal className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center space-x-2">
              <span>CLOUD & EDGE DEPLOYMENT PIPELINE</span>
              <span className="px-2.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-sans">
                CI/CD + K8s
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Deploy robotics code to K8s, Docker, AWS, Azure, GCP, Vercel, Railway, Render, & Netlify with automated rollbacks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white font-mono text-xs rounded-xl p-2.5"
          >
            {targets.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={handleStartDeploy}
            disabled={isDeploying}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isDeploying ? 'Deploying...' : 'Trigger Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Deployment History List */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">Deployment History</h3>

          {deployments.map((d) => {
            const isSelected = d.id === selectedDeployment.id;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDeployment(d)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-400 ring-1 ring-emerald-500 shadow-lg shadow-emerald-500/15'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold font-mono text-white">{d.projectName}</h4>
                  <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {d.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Target: {d.environment}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Commit: {d.commitHash}</span>
                  <span>{d.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Visualization Widget */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950/90 border border-cyan-500/20 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Deployment Status Visualizer</h3>
                <p className="text-[11px] text-slate-400">Realtime pipeline success and resource usage trends.</p>
              </div>
              <div className="inline-flex items-center px-3 py-2 rounded-2xl bg-slate-900/80 border border-white/10 text-[11px] text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2" />
                Success Rate
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 font-bold">Latest Deployment</p>
                <p className="mt-3 text-lg font-bold text-white">{selectedDeployment.projectName}</p>
                <p className="text-[11px] text-slate-500 mt-1">{selectedDeployment.environment} - {selectedDeployment.status}</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 font-bold">Commit Health</p>
                <p className="mt-3 text-lg font-bold text-white">{selectedDeployment.commitHash}</p>
                <p className="text-[11px] text-slate-500 mt-1">{selectedDeployment.timestamp}</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 font-bold">Average Success</p>
                <p className="mt-3 text-lg font-bold text-emerald-300">{Math.round(pipelineMetrics.reduce((sum, item) => sum + item.successRate, 0) / pipelineMetrics.length)}%</p>
                <p className="text-[11px] text-slate-500 mt-1">Resource efficiency trend</p>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pipelineMetrics} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usageGradCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="usageGradMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                  <XAxis dataKey="step" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#38BDF8', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#22C55E" fill="url(#usageGradCpu)" name="CPU %" />
                  <Area type="monotone" dataKey="memory" stroke="#38BDF8" fill="url(#usageGradMem)" name="Memory %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Terminal Log Viewer */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300 ml-2">Pipeline Terminal Logs ({selectedDeployment.projectName})</span>
              </div>

              <button
                onClick={() => onTriggerRollback(selectedDeployment.id)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rollback Build</span>
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs text-emerald-400 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
              <p className="text-slate-500">// Deployment ID: {selectedDeployment.id} | Environment: {selectedDeployment.environment}</p>
              {selectedDeployment.logs.map((log, idx) => (
                <p key={idx} className="leading-relaxed">
                  {log}
                </p>
              ))}
              <div className="flex items-center space-x-1 pt-2">
                <span className="text-sky-400">roboassist@cloud-edge:~$</span>
                <span className="w-2 h-4 bg-emerald-400 animate-pulse" />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
