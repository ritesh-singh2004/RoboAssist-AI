import React, { useState } from 'react';
import { Cpu, Layers, Database, Sparkles, CheckCircle, ShieldAlert, LineChart, FileClock } from 'lucide-react';

interface ModelRegistryProps {
  onOpenLLMStudio?: () => void;
}

const INITIAL_MODELS = [
  { id: 'm1', name: 'Gemini 4X RoboPilot', category: 'Mission Planning', latency: '45ms', accuracy: '98%', revision: 'v2.4.1', stage: 'Production', security: 'Private GPU Vault', desc: 'Enterprise-grade model prepared for robotics mission planning, perception, and safety orchestration.' },
  { id: 'm2', name: 'Optimus ROS2 Navigator', category: 'Navigation', latency: '38ms', accuracy: '96%', revision: 'v1.9.0', stage: 'Production', security: 'Private GPU Vault', desc: 'Real-time navigation and collision avoidance model optimized for industrial wheel/bipedal robots.' },
  { id: 'm3', name: 'HuggingFace VisionArm', category: 'Perception', latency: '55ms', accuracy: '94%', revision: 'v3.1.2-beta', stage: 'Production', security: 'Private GPU Vault', desc: 'Precise 3D object detection and depth estimation pipeline tailored for robotic arm manipulation.' },
  { id: 'm4', name: 'RoboAssist SafetyGuard', category: 'Compliance', latency: '28ms', accuracy: '99%', revision: 'v4.0.5', stage: 'Production', security: 'Private GPU Vault', desc: 'Continuous compliance monitor that detects safety corridor drifts and handles immediate fail-safes.' },
];

export const ModelRegistry: React.FC<ModelRegistryProps> = ({ onOpenLLMStudio }) => {
  const [models, setModels] = useState(INITIAL_MODELS);
  const [toast, setToast] = useState<string | null>(null);
  const [activeMetrics, setActiveMetrics] = useState<string | null>(null);
  const [revisionInputs, setRevisionInputs] = useState<Record<string, string>>({});
  const [activeRevModelId, setActiveRevModelId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeployRevisionSubmit = (modelId: string) => {
    const revName = revisionInputs[modelId]?.trim();
    if (!revName) {
      showToast('Please enter a valid revision tag (e.g., v2.5.0)');
      return;
    }
    
    setModels(prev =>
      prev.map(m => (m.id === modelId ? { ...m, revision: revName } : m))
    );
    showToast(`Successfully deployed revision ${revName} to production!`);
    setRevisionInputs(prev => ({ ...prev, [modelId]: '' }));
    setActiveRevModelId(null);
  };

  const handleOpenDeploySection = (modelId: string) => {
    setActiveRevModelId(activeRevModelId === modelId ? null : modelId);
  };

  const handleToggleMetrics = (modelId: string) => {
    if (activeMetrics === modelId) {
      setActiveMetrics(null);
    } else {
      setActiveMetrics(modelId);
      showToast(`Fetching real-time telemetry metrics...`);
    }
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Dynamic Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4.5 py-3 rounded-2xl glass border border-emerald-500/30 text-emerald-300 font-mono text-xs shadow-2xl flex items-center gap-2 animate-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Panel */}
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
            className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition shrink-0"
          >
            Onboard New Model
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {models.map((model) => (
          <div key={model.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{model.category}</p>
                  <h3 className="text-xl font-bold text-white">{model.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs shrink-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/90 border border-white/10">
                    <Cpu className="w-3.5 h-3.5" /> {model.latency}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/90 border border-white/10">
                    <Layers className="w-3.5 h-3.5" /> {model.accuracy}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm leading-relaxed">{model.desc}</p>
              
              <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-slate-400">
                <div className="rounded-2xl bg-slate-900/80 p-3 border border-white/10">
                  <p className="font-bold text-white">Stage</p>
                  <p className="mt-1 text-emerald-400 font-medium">{model.stage}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-3 border border-white/10">
                  <p className="font-bold text-white">Security</p>
                  <p className="mt-1">{model.security}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-3 border border-white/10">
                  <p className="font-bold text-white">Revision</p>
                  <p className="mt-1 text-sky-400 font-mono font-semibold">{model.revision}</p>
                </div>
              </div>
            </div>

            {/* Sub-panels for actions */}
            <div className="mt-5 space-y-4">
              
              {/* Deploy Revision Form */}
              {activeRevModelId === model.id && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/30 space-y-3 animate-in">
                  <p className="text-xs font-semibold text-white flex items-center gap-1">
                    <FileClock className="w-4 h-4 text-sky-400" /> Deploy New Revision Tag
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. v2.5.0"
                      value={revisionInputs[model.id] || ''}
                      onChange={(e) => setRevisionInputs(p => ({ ...p, [model.id]: e.target.value }))}
                      className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 flex-1 font-mono"
                    />
                    <button
                      onClick={() => handleDeployRevisionSubmit(model.id)}
                      className="bg-sky-500 hover:bg-sky-400 px-4 py-2 rounded-xl text-xs font-semibold text-white transition"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              )}

              {/* View Metrics panel */}
              {activeMetrics === model.id && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-violet-500/30 space-y-2 animate-in text-xs">
                  <p className="font-semibold text-white flex items-center gap-1.5 mb-2">
                    <LineChart className="w-4 h-4 text-violet-400" /> Real-time Performance Telemetry
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
                    <div>GPU Memory: <strong className="text-white">14.8 GB / 24 GB</strong></div>
                    <div>Throughput: <strong className="text-white">82.4 tokens/s</strong></div>
                    <div>Inference Cost: <strong className="text-white">$0.0015 / request</strong></div>
                    <div>Health Score: <strong className="text-emerald-400">99.8% OK</strong></div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleOpenDeploySection(model.id)}
                  className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                    activeRevModelId === model.id
                      ? 'bg-sky-500 text-white hover:bg-sky-400'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  Deploy Revision
                </button>
                <button
                  onClick={() => handleToggleMetrics(model.id)}
                  className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                    activeMetrics === model.id
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 hover:bg-violet-500/30'
                      : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {activeMetrics === model.id ? 'Hide Metrics' : 'View Metrics'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Governance Footer */}
      <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4 text-slate-300">
          <Database className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-semibold text-white">Model Governance</h3>
            <p className="text-xs text-slate-500">Audit model versions, compliance tags, security approvals, and usage policies.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 hover:border-white/15 transition cursor-pointer" onClick={() => showToast('Displaying approved model checklist audit logs...')}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Approved</p>
            <p className="mt-3 text-2xl font-extrabold text-white">12</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 hover:border-white/15 transition cursor-pointer" onClick={() => showToast('Displaying pending weights & policy evaluation approvals...')}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pending Review</p>
            <p className="mt-3 text-2xl font-extrabold text-white">3</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 hover:border-white/15 transition cursor-pointer" onClick={() => showToast('Fetching model drift & threshold compliance report...')}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Compliance Score</p>
            <p className="mt-3 text-2xl font-extrabold text-white">99.2%</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 hover:border-white/15 transition cursor-pointer" onClick={() => showToast('Opening drift alert monitoring panel...')}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Drift Alerts</p>
            <p className="mt-3 text-2xl font-extrabold text-white">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};
