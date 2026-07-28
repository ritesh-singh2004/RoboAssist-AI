import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Bot,
  Boxes,
  Terminal,
  FileCheck,
  CreditCard,
  Key,
  Bell,
  Sparkles,
  ShieldCheck,
  Activity,
  Zap,
  Download,
  Upload,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Globe,
  Camera
} from 'lucide-react';
import { User, Robot, Mission, Project } from '../types';

interface UserApiKey {
  id: string;
  name: string;
  key: string;
  scope: string;
  createdAt: string;
  status: 'Active' | 'Revoked';
}

interface UserDashboardProps {
  user: User;
  robots: Robot[];
  missions: Mission[];
  projects: Project[];
  onOpenPricing: () => void;
  onUpdateProfile?: (updated: Partial<User>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80',
];

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  robots,
  missions,
  projects,
  onOpenPricing,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'Fleet' | 'Missions' | 'Projects' | 'API Keys' | 'Billing & AI Credits' | 'Profile'>('Fleet');

  // API Keys state
  const [apiKeys, setApiKeys] = useState<UserApiKey[]>(() => {
    try {
      const saved = localStorage.getItem(`roboassist_apikeys_${user.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'key-1',
        name: 'Default ROS2 Production Key',
        key: `rb_live_${user.id.slice(0, 4)}_${Math.random().toString(36).substring(2, 12)}`,
        scope: 'Full ROS2 & Gemini Telemetry',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Active',
      }
    ];
  });

  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Full Telemetry & AI Web Studio');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Profile Form state
  const [editName, setEditName] = useState(user.name);
  const [editOrg, setEditOrg] = useState(user.organization);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(`roboassist_apikeys_${user.id}`, JSON.stringify(apiKeys));
    } catch (e) {}
  }, [apiKeys, user.id]);

  // Handle Photo File Upload
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editName,
        organization: editOrg,
        avatarUrl: avatarUrl,
      });
    }
    setProfileSuccessMsg('Profile and photo updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for your API key.');
      return;
    }
    const newKeyObj: UserApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      key: `rb_live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`,
      scope: newKeyScope,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setApiKeys((prev) => [newKeyObj, ...prev]);
    setNewKeyName('');
  };

  const handleCopyKey = (keyString: string, keyId: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleToggleKeyStatus = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === keyId ? { ...k, status: k.status === 'Active' ? 'Revoked' : 'Active' } : k
      )
    );
  };

  const handleDeleteApiKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
  };

  return (
    <div className="space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-5">
          <div className="relative group">
            <img
              src={avatarUrl || user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl border-2 border-sky-500/50 object-cover shadow-xl shadow-sky-500/20"
            />
            <button
              onClick={() => setActiveTab('Profile')}
              className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-mono font-bold transition-all"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold font-mono text-white">{user.name}</h2>
              <span className="px-3 py-0.5 text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-sky-400 font-mono mt-0.5">{user.organization}</p>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          </div>
        </div>

        {/* AI Credits Widget */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/30 min-w-[240px] text-right shadow-inner">
          <div className="flex items-center justify-end space-x-1.5 text-purple-400 text-xs font-mono font-bold mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>AI TOKENS REMAINING</span>
          </div>
          <p className="text-3xl font-mono font-extrabold text-white">{user.aiCreditsRemaining.toLocaleString()}</p>
          <button
            onClick={onOpenPricing}
            className="text-[11px] font-mono text-sky-400 hover:text-sky-300 font-semibold hover:underline mt-1 inline-block"
          >
            + Upgrade Plan & Add Credits
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {(['Fleet', 'Missions', 'Projects', 'API Keys', 'Billing & AI Credits', 'Profile'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-lg shadow-sky-500/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800/80'
            }`}
          >
            {tab === 'API Keys' && <Key className="w-3.5 h-3.5" />}
            {tab === 'Profile' && <UserIcon className="w-3.5 h-3.5" />}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: FLEET */}
      {activeTab === 'Fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {robots.map((r) => (
            <div key={r.id} className="bg-slate-900/90 border border-sky-500/20 p-5 rounded-2xl space-y-3 hover:border-sky-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">{r.name}</span>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{r.type} | Sector: {r.locationSector}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-300">
                <span>Battery: <strong className="text-emerald-400">{r.batteryPercent}%</strong></span>
                <span>CPU: <strong className="text-sky-400">{r.cpuPercent}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MISSIONS */}
      {activeTab === 'Missions' && (
        <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Mission History & AI Telemetry Reports</h3>
          <div className="space-y-3">
            {missions.map((m) => (
              <div key={m.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{m.title}</h4>
                  <span className="text-emerald-400 font-bold">{m.status}</span>
                </div>
                <p className="text-slate-400">Robot: {m.robotName} | Area: {m.sectorArea}</p>
                {m.aiReport && (
                  <p className="text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px]">
                    AI Report: {m.aiReport.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS */}
      {activeTab === 'Projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-slate-900/90 border border-sky-500/20 p-5 rounded-2xl space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white">{p.name}</h4>
                <span className="text-sky-400 font-bold">{p.status}</span>
              </div>
              <p className="text-slate-400">{p.description}</p>
              <p className="text-[10px] text-slate-500">Target: {p.deploymentTarget}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: API KEYS GENERATOR */}
      {activeTab === 'API Keys' && (
        <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-sky-400" />
                <span>USER API KEYS & TOKENS GENERATOR</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Generate production API keys to integrate RoboAssist ROS2 SDK, Web Studio APIs, and AI models into your external applications.
              </p>
            </div>
          </div>

          {/* Create New Key Form */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-sky-500/20 space-y-4">
            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Generate New API Key</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Key Name (e.g. Production Web Studio App)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-xs font-mono p-3 rounded-xl focus:border-sky-500 focus:outline-none col-span-1 sm:col-span-2"
              />
              <select
                value={newKeyScope}
                onChange={(e) => setNewKeyScope(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-xs font-mono p-3 rounded-xl focus:border-sky-500 focus:outline-none"
              >
                <option value="Full Telemetry & AI Web Studio">Full Access (Web & ROS2)</option>
                <option value="ROS2 Telemetry Read-Only">ROS2 Telemetry Read-Only</option>
                <option value="AI Chat & Models Only">AI Chat & Models Only</option>
              </select>
            </div>
            <button
              onClick={handleCreateApiKey}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Generate API Key</span>
            </button>
          </div>

          {/* API Keys List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Active & Generated Keys ({apiKeys.length})</h4>
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{k.name}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      k.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {k.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="text-sky-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
                      {k.key}
                    </code>
                    <button
                      onClick={() => handleCopyKey(k.key, k.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                      title="Copy API Key"
                    >
                      {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Scope: {k.scope} • Created: {k.createdAt}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleKeyStatus(k.id)}
                    className="px-3 py-1.5 rounded-xl text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
                  >
                    {k.status === 'Active' ? 'Revoke' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteApiKey(k.id)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all"
                    title="Delete Key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Integration snippet */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <p className="text-xs font-mono font-bold text-sky-400">⚡ Example cURL Request with your API Key:</p>
            <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto scrollbar-thin">
              {`curl -X POST https://app.roboassist.ai/api/v1/telemetry \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'rb_live_demo_key'}" \\
  -H "Content-Type: application/json" \\
  -d '{"robotId": "titan-x1", "command": "AUTONOMOUS_PATROL"}'`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: BILLING & AI CREDITS */}
      {activeTab === 'Billing & AI Credits' && (
        <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-2xl space-y-4 font-mono text-xs">
          <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Subscription & Usage Billing</h3>
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-white font-bold">Enterprise Industry 4.0 Plan</p>
              <p className="text-slate-400 text-[11px]">$2,999 / month • Billed annually</p>
            </div>
            <button
              onClick={onOpenPricing}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: PROFILE & PHOTO EDIT */}
      {activeTab === 'Profile' && (
        <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-3xl space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-sky-400" />
              <span>EDIT USER PROFILE & AVATAR PHOTO</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Customize your profile picture, display name, and organization details across the RoboAssist AI platform.
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Avatar Photo Section */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-sky-400 uppercase">Profile Photo / Avatar</label>
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-2xl border-2 border-sky-500 object-cover shadow-lg shadow-sky-500/20 shrink-0"
                />
                
                <div className="space-y-3 w-full">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Option A: Upload Image File (PNG / JPG / WEBP)</label>
                    <label className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold rounded-xl cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Choose File...</span>
                      <input type="file" accept="image/*" onChange={handlePhotoFileUpload} className="hidden" />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Option B: Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/your-photo.jpg"
                        value={customPhotoInput}
                        onChange={(e) => setCustomPhotoInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customPhotoInput) {
                            setAvatarUrl(customPhotoInput);
                            setCustomPhotoInput('');
                          }
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                      >
                        Set URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Avatars */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-2">Option C: Select Preset Robotics Avatars</label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preset ${idx + 1}`}
                      onClick={() => setAvatarUrl(url)}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-all hover:scale-105 ${
                        avatarUrl === url ? 'border-sky-400 ring-2 ring-sky-500/50 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Organization / Company</label>
                <input
                  type="text"
                  value={editOrg}
                  onChange={(e) => setEditOrg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address (Immutable)</label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800/50 p-3 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Role Type</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800/50 p-3 rounded-xl text-slate-400 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-sky-500/25 transition-all text-xs"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
