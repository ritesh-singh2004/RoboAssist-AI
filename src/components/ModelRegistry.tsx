import React from 'react';
import { Cpu, Layers, Database, Sparkles, ShieldCheck } from 'lucide-react';

interface ModelRegistryProps {
  onOpenLLMStudio?: () => void;
}

const MODELS = [
  { id: 'm1', name: 'Gemini 4X RoboPilot', category: 'Mission Planning', latency: '45ms', accuracy: '98%' },
  { id: 'm2', name: 'Optimus ROS2 Navigator', category: 'Navigation', latency: '38ms', accuracy: '96%' },
  { id: 'm3', name: 'HuggingFace VisionArm', category: 'Perception', latency: '55ms', accuracy: '94%' },
  { id: 'm4', name: 'RoboAssist SafetyGuard', category: 'Compliance', latency: '28ms', accuracy: '99%' },
];

export const ModelRegistry: React.FC<ModelRegistryProps> = ({ onOpenLLMStudio }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border border-sky-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">LLM Studio & Model Registry</p>
            <h2 className="text-3xl font-extrabold text-white">Enterprise Model Catalog</h2>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Manage secure robotics AI models, onboard new weights, version deployments, and launch mission-specific inference pipelines.
            </p>
          </div>
          <button
            onClick={() => onOpenLLMStudio?.()}
            className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition"
          >
            Onboard New Model
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MODELS.map((model) => (
          <div key={model.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{model.category}</p>
                <h3 className="text-xl font-bold text-white">{model.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/90 border border-white/10">
                  <Cpu className="w-3.5 h-3.5" /> {model.latency}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/90 border border-white/10">
                  <Layers className="w-3.5 h-3.5" /> {model.accuracy}
                </span>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Enterprise-grade model prepared for robotics mission planning, perception, and safety orchestration with drift monitoring and secure gateway access.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="rounded-2xl bg-slate-900/80 p-3 border border-white/10">
                <p className="font-bold text-white">Stage</p>
                <p className="mt-1">Production</p>
              </div>
              <div className="rounded-2xl bg-slate-900/80 p-3 border border-white/10">
                <p className="font-bold text-white">Security</p>
                <p className="mt-1">Private GPU Vault</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/15 transition">Deploy Revision</button>
              <button className="rounded-2xl bg-slate-900/80 border border-white/10 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition">View Metrics</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4 text-slate-300">
          <Database className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-semibold text-white">Model Governance</h3>
            <p className="text-xs text-slate-500">Audit model versions, compliance tags, security approvals, and usage policies.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Approved</p>
            <p className="mt-3 text-2xl font-extrabold text-white">12</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pending Review</p>
            <p className="mt-3 text-2xl font-extrabold text-white">3</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Compliance Score</p>
            <p className="mt-3 text-2xl font-extrabold text-white">99.2%</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Drift Alerts</p>
            <p className="mt-3 text-2xl font-extrabold text-white">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};
