import React, { useEffect, useState } from 'react';
import { Cpu, Layers, Database, Sparkles, ShieldCheck, ArrowUpRight, Cloud } from 'lucide-react';

const INITIAL_MODELS = [
  { id: 'llm-1', name: 'RoboAssist Falcon 7B', stage: 'Training', version: 'v0.2', nodeCount: 4, accuracy: '87%', drift: '1.2%', status: 'Live' },
  { id: 'llm-2', name: 'RoboAssist Llama Industrial', stage: 'Fine-tune', version: 'v1.1', nodeCount: 2, accuracy: '91%', drift: '0.8%', status: 'Review' },
];

const INITIAL_DATASETS = [
  { id: 'ds-1', name: 'ROS2 Telemetry Corpus', size: '12GB', status: 'Ready' },
  { id: 'ds-2', name: 'Industrial Vision Labels', size: '8GB', status: 'Cleaning' },
];

export const LLMStudio: React.FC = () => {
  const [models, setModels] = useState(INITIAL_MODELS);
  const [datasets, setDatasets] = useState(INITIAL_DATASETS);
  const [trainingPinned, setTrainingPinned] = useState(false);
  const [activeTab, setActiveTab] = useState<'models' | 'datasets' | 'jobs'>('models');
  const [jobStatus, setJobStatus] = useState('No active training jobs.');
  const [newModelName, setNewModelName] = useState('');
  const [newModelType, setNewModelType] = useState('Vision & Robotics');
  const [selectedModelId, setSelectedModelId] = useState(INITIAL_MODELS[0]?.id || '');
  const [trainingDatasetId, setTrainingDatasetId] = useState(INITIAL_DATASETS[0]?.id || '');
  const [trainingJobs, setTrainingJobs] = useState<Array<{ id: string; modelId: string; datasetId: string; status: string; startedAt: string; strategy: string; target: string; epochs: number; learningRate: number; checkpointInterval: number; error?: string }>>([]);
  const [deploymentPrompt, setDeploymentPrompt] = useState('RoboAssistAI model deployment dashboard for industrial robotics');
  const [deploymentStatus, setDeploymentStatus] = useState('Ready to generate a deployment app.');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [deploymentError, setDeploymentError] = useState('');
  const [trainingStrategy, setTrainingStrategy] = useState('Fine-tune');
  const [trainingEpochs, setTrainingEpochs] = useState(5);
  const [trainingLearningRate, setTrainingLearningRate] = useState(0.0003);
  const [trainingTarget, setTrainingTarget] = useState('High Accuracy');
  const [checkpointInterval, setCheckpointInterval] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchModelsAndDatasets = async () => {
    try {
      const [modelsRes, datasetsRes] = await Promise.all([
        fetch('/api/llm/models'),
        fetch('/api/llm/datasets'),
      ]);
      const modelsJson = await modelsRes.json();
      const datasetsJson = await datasetsRes.json();
      if (modelsJson.success && Array.isArray(modelsJson.models)) {
        setModels(modelsJson.models);
        setSelectedModelId(modelsJson.models[0]?.id || '');
      }
      if (datasetsJson.success && Array.isArray(datasetsJson.datasets)) {
        setDatasets(datasetsJson.datasets);
        setTrainingDatasetId(datasetsJson.datasets[0]?.id || '');
      }
    } catch (error: any) {
      setErrorMessage(`Could not load models or datasets: ${error.message}`);
    }
  };

  React.useEffect(() => {
    fetchModelsAndDatasets();
  }, []);

  const handleStartTraining = async (modelId: string, datasetId: string = trainingDatasetId) => {
    setErrorMessage('');
    const model = models.find((item) => item.id === modelId);
    const dataset = datasets.find((item) => item.id === datasetId);
    if (!model) {
      setErrorMessage('Selected model not found.');
      return;
    }
    if (!dataset) {
      setErrorMessage('Selected dataset not found.');
      return;
    }

    const jobId = `job-${Date.now()}`;
    setSelectedModelId(modelId);
    setJobStatus(`Starting ${trainingStrategy} for ${model.name} on ${dataset.name}...`);
    setTrainingPinned(true);
    setTrainingJobs((prev) => [
      {
        id: jobId,
        modelId,
        datasetId,
        status: 'Queued',
        strategy: trainingStrategy,
        target: trainingTarget,
        epochs: trainingEpochs,
        learningRate: trainingLearningRate,
        checkpointInterval,
        startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);

    try {
      const response = await fetch('/api/llm/train-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId,
          datasetId,
          strategy: trainingStrategy,
          target: trainingTarget,
          epochs: trainingEpochs,
          learningRate: trainingLearningRate,
          checkpointInterval,
        }),
      });
      const text = await response.text();
      let data: any;

      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        const message = `Training request failed: Invalid JSON response. Raw response: ${text}`;
        setErrorMessage(message);
        setTrainingJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: 'Failed', error: message } : job)));
        return;
      }

      if (data && data.success && data.model) {
        setModels((prev) => prev.map((item) => (item.id === modelId ? data.model : item)));
        setJobStatus(data.message || `Training kicked off for ${model.name}.`);
        setTrainingJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: 'In progress' } : job)));
      } else {
        const apiError = data?.error || 'Training request failed.';
        setErrorMessage(apiError);
        setJobStatus(apiError);
        setTrainingJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: 'Failed', error: apiError } : job)));
      }
    } catch (error: any) {
      const message = `Training request failed: ${error.message || 'Server error.'}`;
      setErrorMessage(message);
      setJobStatus(message);
      setTrainingJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: 'Failed', error: message } : job)));
    }
  };

  const handleCreateModel = async () => {
    const modelName = newModelName.trim() || `RoboAssist Model ${Date.now()}`;
    setJobStatus(`Creating new LLM model: ${modelName}...`);

    try {
      const response = await fetch('/api/llm/create-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName, modelType: newModelType || 'Vision & Robotics' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setJobStatus(`Model creation failed: ${errorText || response.statusText}`);
        return;
      }

      const text = await response.text();
      let data: any;

      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        setJobStatus(`Model creation failed: Invalid JSON response. Raw response: ${text}`);
        return;
      }

      if (data && data.success && data.model) {
        setModels((prev) => [data.model, ...prev]);
        setNewModelName('');
        setJobStatus(`Model ${data.model.name} created successfully.`);
      } else {
        setJobStatus(data?.error || 'Could not create model.');
      }
    } catch (error: any) {
      setJobStatus(`Model creation failed: ${error.message || 'Server error.'}`);
    }
  };

  const handleLaunchDataset = () => {
    setJobStatus('Dataset manager launched. Verify labels, split training/validation, and version your corpus.');
  };

  const handleDeployWebApp = async () => {
    setDeploymentError('');
    setDeploymentStatus('Generating deployment app, please wait...');

    try {
      const response = await fetch('/api/ai/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: deploymentPrompt, title: 'RoboAssistAI Deployment Portal' }),
      });

      const data = await response.json();
      if (data.success && data.deploymentUrl) {
        setDeploymentUrl(data.deploymentUrl);
        setDeploymentStatus('Deployment app generated successfully. Preview link ready.');
      } else if (data.success && data.htmlCode) {
        setDeploymentUrl('Preview available on generated page.');
        setDeploymentStatus('Deployment app generated successfully. Use the raw HTML preview returned by the backend.');
      } else {
        const errorText = data.error || 'Deployment generation failed.';
        setDeploymentError(errorText);
        setDeploymentStatus('Deployment generation failed.');
      }
    } catch (error: any) {
      setDeploymentError(error.message || 'Failed to generate deployment app.');
      setDeploymentStatus('Deployment generation failed.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">LLM Studio</p>
            <h2 className="text-3xl font-extrabold text-white">Build, Train & Deploy Custom LLMs</h2>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Train new models, fine-tune existing weights, manage datasets, and deploy model endpoints from a single AI engineering workspace.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs text-slate-300">
            <span className="rounded-3xl bg-slate-900/80 border border-white/10 px-4 py-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" /> 4 GPUs
            </span>
            <span className="rounded-3xl bg-slate-900/80 border border-white/10 px-4 py-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> 14 TB Data
            </span>
            <span className="rounded-3xl bg-slate-900/80 border border-white/10 px-4 py-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" /> 99.9% Uptime
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Active Model Projects</h3>
                <p className="text-slate-400 text-sm">Inspect versions, launch fine-tuning, or publish model endpoints.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] w-full sm:w-auto">
                <input
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="New model name"
                  className="w-full rounded-3xl bg-slate-900/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleCreateModel}
                  className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition"
                >
                  Create Model
                </button>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-900/80 border border-white/10 p-5">
              <h5 className="text-sm font-semibold text-white mb-3">Training Controls</h5>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col text-slate-300 text-xs">
                  Select Model
                  <select
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                    className="mt-2 rounded-3xl bg-slate-950/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col text-slate-300 text-xs">
                  Training Dataset
                  <select
                    value={trainingDatasetId}
                    onChange={(e) => setTrainingDatasetId(e.target.value)}
                    className="mt-2 rounded-3xl bg-slate-950/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    {datasets.map((dataset) => (
                      <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <label className="flex flex-col text-slate-300 text-xs">
                  Strategy
                  <select
                    value={trainingStrategy}
                    onChange={(e) => setTrainingStrategy(e.target.value)}
                    className="mt-2 rounded-3xl bg-slate-950/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    <option value="Fine-tune">Fine-tune</option>
                    <option value="Quantization">Quantization</option>
                    <option value="LoRA">LoRA</option>
                    <option value="RLHF">RLHF</option>
                  </select>
                </label>
                <label className="flex flex-col text-slate-300 text-xs">
                  Target
                  <select
                    value={trainingTarget}
                    onChange={(e) => setTrainingTarget(e.target.value)}
                    className="mt-2 rounded-3xl bg-slate-950/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    <option>High Accuracy</option>
                    <option>Low Latency</option>
                    <option>Small Footprint</option>
                    <option>Balanced</option>
                  </select>
                </label>
                <label className="flex flex-col text-slate-300 text-xs">
                  Epochs
                  <input
                    type="number"
                    min={1}
                    value={trainingEpochs}
                    onChange={(e) => setTrainingEpochs(Number(e.target.value))}
                    className="mt-2 rounded-3xl bg-slate-950/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-slate-300 text-xs">
                  LR / ckpt
                  <div className="mt-2 grid grid-cols-[1fr_1fr] gap-2">
                    <input
                      type="number"
                      step={0.0001}
                      min={0.0001}
                      value={trainingLearningRate}
                      onChange={(e) => setTrainingLearningRate(Number(e.target.value))}
                      className="rounded-3xl bg-slate-950/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
                    />
                    <input
                      type="number"
                      min={1}
                      value={checkpointInterval}
                      onChange={(e) => setCheckpointInterval(Number(e.target.value))}
                      className="rounded-3xl bg-slate-950/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
                      placeholder="CKPT"
                    />
                  </div>
                </label>
              </div>
              <button
                onClick={() => handleStartTraining(selectedModelId, trainingDatasetId)}
                className="mt-4 w-full rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
              >
                Train Selected Model
              </button>
              {errorMessage && (
                <p className="mt-3 text-sm text-rose-400">{errorMessage}</p>
              )}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {models.map((model) => (
                <div key={model.id} className="rounded-3xl bg-slate-900/80 border border-white/10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{model.stage}</p>
                      <h4 className="text-lg font-bold text-white">{model.name}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] border border-white/10">{model.version}</span>
                  </div>
                  <div className="mt-4 grid gap-3 text-slate-300 text-xs">
                    <div className="rounded-2xl bg-slate-900/70 p-3 border border-white/10">Accuracy: {model.accuracy}</div>
                    <div className="rounded-2xl bg-slate-900/70 p-3 border border-white/10">Drift: {model.drift}</div>
                    <div className="rounded-2xl bg-slate-900/70 p-3 border border-white/10">Nodes: {model.nodeCount}</div>
                    <div className="rounded-2xl bg-slate-900/70 p-3 border border-white/10">Status: {model.status || 'Ready'}</div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setSelectedModelId(model.id);
                        setTrainingDatasetId(datasets[0]?.id || '');
                        handleStartTraining(model.id, datasets[0]?.id || '');
                      }}
                      className="rounded-2xl bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/15 transition"
                    >
                      Train Model
                    </button>
                    <button className="rounded-2xl bg-slate-900/80 border border-white/10 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition">
                      View Metrics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">Model Training Dashboard</h4>
                <p className="text-slate-400 text-sm">Monitoring your current training jobs and dataset health.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLaunchDataset}
                  className="rounded-3xl bg-slate-800 border border-white/10 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700 transition"
                >
                  Open Dataset Manager
                </button>
                <span className="rounded-3xl bg-slate-900/80 border border-white/10 px-4 py-2 text-xs text-slate-200">
                  Selected Model: {models.find((m) => m.id === selectedModelId)?.name || 'None'}
                </span>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 text-slate-300 font-mono text-sm min-h-[140px] whitespace-pre-wrap">
              {jobStatus}
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950/90 border border-white/10 p-4">
              <h5 className="text-sm font-semibold text-white mb-3">Training Job History</h5>
              <div className="space-y-3">
                {trainingJobs.length === 0 && (
                  <p className="text-slate-500 text-xs">No training jobs started yet.</p>
                )}
                {trainingJobs.map((job) => {
                  const model = models.find((m) => m.id === job.modelId);
                  const dataset = datasets.find((d) => d.id === job.datasetId);
                  return (
                    <div key={job.id} className="rounded-3xl bg-slate-900/80 border border-white/10 p-3">
                      <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                        <span>{job.startedAt}</span>
                        <span className={`rounded-full px-2 py-1 ${job.status === 'Failed' ? 'bg-rose-700 text-rose-200' : 'bg-slate-800 text-slate-200'}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-2 text-slate-200 text-sm space-y-1">
                        <div><strong>Model:</strong> {model?.name || job.modelId}</div>
                        <div><strong>Dataset:</strong> {dataset?.name || job.datasetId}</div>
                        <div><strong>Strategy:</strong> {job.strategy}</div>
                        <div><strong>Target:</strong> {job.target}</div>
                        <div><strong>Epochs:</strong> {job.epochs}</div>
                        <div><strong>LR:</strong> {job.learningRate}</div>
                        <div><strong>Checkpoint:</strong> every {job.checkpointInterval} steps</div>
                        {job.error && <div className="text-rose-300"><strong>Reason:</strong> {job.error}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950/90 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">Dataset Manager</h4>
                <p className="text-slate-400 text-sm">Upload, version, and clean your training data.</p>
              </div>
              <button
                onClick={() => setActiveTab('datasets')}
                className="rounded-3xl bg-white/10 border border-white/10 px-4 py-2 text-xs text-slate-200 hover:bg-white/15 transition"
              >
                View Datasets
              </button>
            </div>
            <div className="space-y-4">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="rounded-3xl bg-slate-900/80 border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h5 className="text-sm font-semibold text-white">{dataset.name}</h5>
                      <p className="text-[11px] text-slate-400">{dataset.size}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 border border-white/10">
                      {dataset.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-slate-300">
              <ShieldCheck className="w-5 h-5" />
              <div>
                <h5 className="text-sm font-semibold text-white">Secure Model Registry</h5>
                <p className="text-xs text-slate-400">Store, version, and deploy LLMs with enterprise governance.</p>
              </div>
            </div>
            <div className="grid gap-3 text-slate-300 text-xs">
              <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">Publish model endpoints with private access tokens.</div>
              <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">Rollback versions instantly and keep historical checkpoints.</div>
              <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">Enable quantization, LoRA, and RLHF pipelines from the training console.</div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950/95 border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h5 className="text-lg font-semibold text-white">Integrations</h5>
                <p className="text-slate-400 text-sm">Connect training jobs to cloud GPUs, PyTorch, Hugging Face, and Triton endpoints.</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-sky-400" />
            </div>
            <div className="grid gap-3 text-slate-300 text-xs">
              <span className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">Hugging Face</span>
              <span className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">PyTorch / vLLM</span>
              <span className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">Triton / TensorRT</span>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950/95 border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h5 className="text-lg font-semibold text-white">Web App Deployment</h5>
                <p className="text-slate-400 text-sm">Generate a deployment portal for your selected model in one click.</p>
              </div>
              <Cloud className="w-5 h-5 text-sky-400" />
            </div>
            <label className="mt-5 flex flex-col text-slate-300 text-xs">
              Deployment prompt
              <textarea
                value={deploymentPrompt}
                onChange={(e) => setDeploymentPrompt(e.target.value)}
                className="mt-2 min-h-[100px] rounded-3xl bg-slate-900/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none"
              />
            </label>
            <button
              onClick={handleDeployWebApp}
              className="mt-4 w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition"
            >
              Generate & Deploy Web App
            </button>
            <div className="mt-4 rounded-3xl bg-slate-900/80 border border-white/10 p-4 text-slate-300 text-sm">
              <p><strong>Status:</strong> {deploymentStatus}</p>
              {deploymentUrl && (
                <p className="mt-2 text-sky-300 break-all">URL: <a href={deploymentUrl} target="_blank" rel="noreferrer" className="underline">{deploymentUrl}</a></p>
              )}
              {deploymentError && <p className="mt-2 text-rose-400">{deploymentError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
