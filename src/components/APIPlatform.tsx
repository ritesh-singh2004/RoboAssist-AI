import React, { useState } from 'react';
import { Key, ShieldCheck, BarChart3, Copy, Plus, RefreshCw } from 'lucide-react';

const INITIAL_KEYS = [
  { id: 'api-1', name: 'RoboAssist Model Endpoint', prefix: 'rba_1x3k...', created: '2026-07-26', status: 'Active', usage: '12.3K' },
  { id: 'api-2', name: 'Fleet Control API', prefix: 'rba_4mj7...', created: '2026-07-24', status: 'Rotated', usage: '4.8K' },
];

export const APIPlatform: React.FC = () => {
  const [apiKeys, setApiKeys] = useState(INITIAL_KEYS);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateKey = () => {
    if (!newKeyName.trim()) return;
    const id = `api-${Date.now()}`;
    const prefix = `rba_${Math.random().toString(36).substring(2, 8)}`;
    setApiKeys([{ id, name: newKeyName.trim(), prefix, created: new Date().toISOString().split('T')[0], status: 'Active', usage: '0' }, ...apiKeys]);
    setNewKeyName('');
  };

  const copyKey = (prefix: string) => {
    navigator.clipboard.writeText(prefix);
    setCopiedKey(prefix);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">API Platform</p>
            <h2 className="text-3xl font-extrabold text-white">Generate & Manage API Keys</h2>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Issue keys, rotate tokens, monitor usage, and secure model endpoints across your RoboAssist AI applications.
            </p>
          </div>
          <button onClick={generateKey} className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition">
            Create API Key
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">API Keys</h3>
              <p className="text-slate-400 text-sm">Secure your integrations with rate limits, usage quotas, and key rotation.</p>
            </div>
            <Plus className="w-5 h-5 text-sky-400" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="New key name"
                className="flex-1 bg-slate-900 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <button onClick={generateKey} className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition">
                Generate Key
              </button>
            </div>
            {apiKeys.map((key) => (
              <div key={key.id} className="rounded-3xl bg-slate-900/80 border border-white/10 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{key.name}</h4>
                    <p className="text-[11px] text-slate-500">Created on {key.created}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 border border-white/10">
                    {key.status}
                  </span>
                </div>
                <div className="bg-slate-950 border border-white/10 rounded-3xl p-3 font-mono text-[11px] text-slate-200 flex items-center justify-between gap-3">
                  <span>{key.prefix}••••••••</span>
                  <button onClick={() => copyKey(key.prefix)} className="text-sky-300 text-xs font-semibold hover:text-sky-100 transition">
                    {copiedKey === key.prefix ? 'Copied' : 'Copy'} <Copy className="inline w-3 h-3 ml-1" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span>Usage: {key.usage} requests</span>
                  <span>Endpoint: /api/llm/v1</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-slate-300">
            <ShieldCheck className="w-5 h-5" />
            <div>
              <h3 className="text-lg font-semibold text-white">Secure API Gateway</h3>
              <p className="text-sm text-slate-400">Use API keys with rate limits, headers, and per-organization scopes.</p>
            </div>
          </div>
          <div className="space-y-4 text-slate-300 text-sm">
            <p>• Automatically revoke keys from compromised sessions.</p>
            <p>• Attach usage tiers for Teams, Enterprise, and Research groups.</p>
            <p>• Monitor requests, latency, and error rates in real time.</p>
          </div>
          <div className="mt-6 grid gap-3 text-xs text-slate-400">
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4">Rate limit: 10k requests / day per key</div>
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4">Usage analytics: requests, tokens, errors</div>
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4">Billing-ready metering for SaaS plans</div>
          </div>
        </div>
      </div>
    </div>
  );
};
