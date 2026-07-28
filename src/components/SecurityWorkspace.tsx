import React from 'react';
import { Shield, Lock, Key, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

const securityFeatures = [
  { title: 'Identity & Access', detail: 'Enterprise RBAC, role-based policies, and API key lifecycle management.' },
  { title: 'Model Privacy', detail: 'Encrypted model vault, private inference, and drift detection for sensitive robotics data.' },
  { title: 'Audit Trail', detail: 'Immutable event logs, command approvals, and compliance-ready reporting.' },
  { title: 'Emergency Controls', detail: 'Remote kill switches, safety interlocks, and mission rollback automation.' },
];

export const SecurityWorkspace: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">SECURITY OPERATIONS</p>
            <h2 className="text-3xl font-extrabold text-white">RoboAssist AI Security Studio</h2>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Enforce safe AI behavior, protect fleet and model assets, and audit every live operation from a single secure control plane.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-3xl bg-slate-900 border border-white/10 px-5 py-3 text-sm text-white hover:bg-slate-800 transition">Review Policies</button>
            <button className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm text-white hover:bg-emerald-400 transition">Run Compliance Scan</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {securityFeatures.map((feature) => (
          <div key={feature.title} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed">{feature.detail}</p>
              </div>
              <Shield className="w-6 h-6 text-slate-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-950/95 border border-white/10 p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Access Controls</p>
          <p className="mt-4 text-slate-300 text-sm">5 permission tiers, API key audit, and single sign-on support with conditional approvals.</p>
        </div>
        <div className="rounded-3xl bg-slate-950/95 border border-white/10 p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Threat Signals</p>
          <p className="mt-4 text-slate-300 text-sm">Real-time breach detection, anomaly alerts, and policy triggers for unsafe mission commands.</p>
        </div>
        <div className="rounded-3xl bg-slate-950/95 border border-white/10 p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Compliance</p>
          <p className="mt-4 text-slate-300 text-sm">Audit-ready evidence, model governance tags, and operator signoff for every critical action.</p>
        </div>
      </div>
    </div>
  );
};
