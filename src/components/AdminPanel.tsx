/// <reference types="react" />
import React, { useState } from 'react';
import {
  Shield,
  Users,
  Building,
  Key,
  Flag,
  FileText,
  Activity,
  Cpu,
  Database,
  Lock,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Search,
  Filter,
  UserCheck,
  UserX,
  X,
  Coins,
  AlertTriangle,
  RefreshCw,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { User, AuditLog, UserRole } from '../types';

interface AdminPanelProps {
  currentUser: User | null;
  users: User[];
  auditLogs: AuditLog[];
  onUpdateRole: (userId: string, role: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser: (newUser: User) => void;
  onAddCredits?: (userId: string, amount: number) => void;
}

export const AdminPanel = ({
  currentUser,
  users = [],
  auditLogs = [],
  onUpdateRole,
  onToggleUserStatus,
  onDeleteUser,
  onAddUser,
  onAddCredits,
}: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'Users' | 'Audit Logs' | 'API Keys' | 'Feature Flags' | 'System Telemetry'>('Users');
  
  // Search & Filter state for Users
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Operator');
  const [newUserOrg, setNewUserOrg] = useState('Reliance Industry 4.0 Robotics Hub');

  // Feature Flags State
  const [featureFlags, setFeatureFlags] = useState([
    { id: 'ff-1', name: 'Gemini 3.6 Flash Mission Planner', enabled: true, category: 'AI' },
    { id: 'ff-2', name: '120 FPS FLIR Thermal Vision WebRTC', enabled: true, category: 'STREAMING' },
    { id: 'ff-3', name: 'AI Incident Commander Auto-Jira', enabled: true, category: 'WAR_ROOM' },
    { id: 'ff-[#4]', name: 'Autonomous Emergency Kill Switch', enabled: true, category: 'SAFETY' },
  ]);

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-01', name: 'Production ROS2 Bridge Key', prefix: 'rb_live_90a8...', created: '2026-07-20', status: 'Active' },
    { id: 'key-02', name: 'Refinery Sector 4 Telemetry Key', prefix: 'rb_live_12c4...', created: '2026-07-22', status: 'Active' },
  ]);

  const toggleFlag = (id: string) => {
    setFeatureFlags(featureFlags.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const handleGenerateKey = () => {
    const keyName = prompt('Enter key description / application name:');
    if (keyName) {
      setApiKeys([
        ...apiKeys,
        {
          id: `key-${Date.now()}`,
          name: keyName,
          prefix: `rb_live_${Math.random().toString(36).substring(2, 8)}...`,
          created: new Date().toISOString().split('T')[0],
          status: 'Active',
        },
      ]);
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUserObj: User = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      organization: newUserOrg || 'Robotics Enterprise',
      avatarUrl: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random()*100)}?auto=format&fit=crop&w=250&q=80`,
      aiCreditsRemaining: 25000,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    onAddUser(newUserObj);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status !== 'Suspended').length;
  const suspendedUsersCount = users.filter((u) => u.status === 'Suspended').length;

  const auditSeries = auditLogs
    .slice()
    .reverse()
    .map((log, idx) => ({
      index: idx + 1,
      timestamp: log.timestamp,
      accessCount: idx % 3 === 0 ? 5 : idx % 2 === 0 ? 3 : 4,
      category: log.category,
    }));

  const downloadCsv = () => {
    const header = ['Timestamp', 'User Name', 'Role', 'Action', 'Category', 'IP Address'];
    const rows = auditLogs.map((log) => [
      log.timestamp,
      log.userName,
      log.userRole,
      log.action,
      log.category,
      log.ipAddress,
    ]);
    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'audit-log-history.csv';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-purple-500/30 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                ADMIN & USER CONTROL CENTER
              </h1>
              <span className="px-2.5 py-0.5 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-mono font-bold">
                RBAC SUPERADMIN
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage registered user accounts, role permissions, API keys, feature flags, and security compliance.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-black/40 p-3 rounded-2xl border border-white/10 font-mono text-xs text-sky-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-bold text-white">{currentUser?.name || 'Admin User'}</p>
            <p className="text-[10px] text-slate-400">{currentUser?.email || 'admin@roboassist.ai'}</p>
          </div>
        </div>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalUsersCount}</span>
            <span className="text-xs text-emerald-400 font-bold">+100% Verified</span>
          </div>
          <p className="text-[11px] text-slate-400">Registered platform accounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Active Members</span>
            <UserCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{activeUsersCount}</span>
            <span className="text-xs text-[#22C55E] font-bold">Active</span>
          </div>
          <p className="text-[11px] text-slate-400">Can access RoboAssist AI OS</p>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Suspended Users</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{suspendedUsersCount}</span>
            <span className="text-xs text-rose-400 font-bold">Blocked</span>
          </div>
          <p className="text-[11px] text-slate-400">Access restricted</p>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase">
            <span>Global AI Credits</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">150,000</span>
            <span className="text-xs text-amber-400 font-bold">Tokens</span>
          </div>
          <p className="text-[11px] text-slate-400">Gemini 3.6 Flash Pool</p>
        </div>

      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {(['Users', 'Audit Logs', 'API Keys', 'Feature Flags', 'System Telemetry'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {tab === 'Users' ? `Users (${totalUsersCount})` : tab}
          </button>
        ))}
      </div>

      {/* TAB 1: REGISTERED USERS MANAGEMENT */}
      {activeTab === 'Users' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#0EA5E9]" />
                <span>Registered Platform User Directory</span>
              </h3>
              <p className="text-xs text-slate-400">
                Only registered users can log in and utilize RoboAssist AI features. Manage accounts and roles below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search user name or email..."
                  className="bg-black/40 border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center space-x-1.5 bg-black/40 border border-white/10 px-3 py-2 rounded-2xl text-xs text-slate-300">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent focus:outline-none text-white font-mono cursor-pointer"
                >
                  <option value="All" className="bg-[#0F172A]">All Roles</option>
                  <option value="Super Admin" className="bg-[#0F172A]">Super Admin</option>
                  <option value="Admin" className="bg-[#0F172A]">Admin</option>
                  <option value="Operator" className="bg-[#0F172A]">Operator</option>
                  <option value="Engineer" className="bg-[#0F172A]">Engineer</option>
                  <option value="Developer" className="bg-[#0F172A]">Developer</option>
                  <option value="Viewer" className="bg-[#0F172A]">Viewer</option>
                </select>
              </div>

              {/* Add User Button */}
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Register New User</span>
              </button>
            </div>
          </div>

          {/* Users Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">User Member</th>
                  <th className="py-3 px-4">Work Email</th>
                  <th className="py-3 px-4">Role Access</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">AI Tokens</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono text-xs">
                      No registered users found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                            className="w-8 h-8 rounded-full border border-white/10 object-cover"
                            alt=""
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-sky-400 font-mono">{u.email}</td>

                      {/* Inline Role Selector Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateRole(u.id, e.target.value as UserRole)}
                          className="bg-black/50 border border-white/15 text-purple-300 font-mono text-[11px] font-bold rounded-xl px-2.5 py-1 focus:outline-none focus:border-purple-400 cursor-pointer"
                        >
                          {['Super Admin', 'Admin', 'Organization', 'Developer', 'Operator', 'Engineer', 'Viewer'].map((r) => (
                            <option key={r} value={r} className="bg-[#0F172A] text-white">
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status Badge & Toggle */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold inline-flex items-center space-x-1 ${
                            u.status === 'Suspended'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Suspended' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          <span>{u.status || 'Active'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-sans">{u.organization}</td>

                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {u.aiCreditsRemaining.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          
                          {/* Refill Credits */}
                          <button
                            onClick={() => onAddCredits && onAddCredits(u.id, 5000)}
                            className="px-2 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold transition-all"
                            title="Add +5,000 AI Credits"
                          >
                            +5k AI Tokens
                          </button>

                          {/* Suspend / Reactivate */}
                          <button
                            onClick={() => onToggleUserStatus(u.id)}
                            className={`p-1.5 rounded-xl border transition-all text-xs ${
                              u.status === 'Suspended'
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                            }`}
                            title={u.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {u.status === 'Suspended' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user ${u.name}?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'Audit Logs' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-sky-400 uppercase">
                Immutable Security Audit Trail & Activity Logs
              </h3>
              <p className="text-[11px] text-slate-400 mt-2">
                Monitor system access over time and export audit history for compliance reporting.
              </p>
            </div>
            <button
              onClick={downloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold font-mono shadow-lg shadow-sky-500/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              Download CSV
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 p-4 rounded-3xl bg-slate-950/70 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-[0.22em] text-slate-400 font-mono">Security Audit Trend</span>
                <span className="text-[11px] text-emerald-300 font-bold">Peak access times shown</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={auditSeries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                    <XAxis dataKey="timestamp" tick={{ fill: '#94A3B8', fontSize: 10 }} interval={Math.max(0, Math.floor(auditSeries.length / 6))} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#0EA5E9' }} />
                    <Line type="monotone" dataKey="accessCount" stroke="#38BDF8" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
                <span>Audit Summary</span>
                <span>{auditLogs.length} entries</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Total Audits</p>
                  <p className="text-2xl text-white font-bold mt-3">{auditLogs.length}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Security Categories</p>
                  <p className="text-2xl text-white font-bold mt-3">{new Set(auditLogs.map((log) => log.category)).size}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-900/80 p-4 border border-white/10 text-[11px] text-slate-300">
                <p className="font-bold text-white text-sm">Peak Access Metrics</p>
                <p className="mt-2 text-slate-400">Use the visual line chart to identify hourly spikes and repeated access from key user roles.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2.5 py-0.5 text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-bold">
                      {log.category}
                    </span>
                    <span className="text-white font-bold">{log.userName} ({log.userRole})</span>
                  </div>
                  <p className="text-slate-300">{log.action}</p>
                </div>
                <div className="text-right text-slate-500 text-[10px]">
                  <p>{log.timestamp}</p>
                  <p>IP Address: {log.ipAddress}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: API KEYS */}
      {activeTab === 'API Keys' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono font-bold text-sky-400 uppercase">
              Production ROS2 API Keys & Tokens
            </h3>
            <button
              onClick={handleGenerateKey}
              className="flex items-center space-x-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-xs font-mono font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New API Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="bg-black/40 p-4 rounded-2xl border border-white/10 flex items-center justify-between font-mono text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{k.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{k.prefix}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px]">
                    {k.status}
                  </span>
                  <button
                    onClick={() => alert(`Copied API Key ${k.prefix}`)}
                    className="text-sky-400 hover:underline text-[11px]"
                  >
                    Copy Key
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE FLAGS */}
      {activeTab === 'Feature Flags' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-sky-400 uppercase">
            System Feature Flags & Canary Toggles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureFlags.map((ff) => (
              <div
                key={ff.id}
                className="bg-black/40 p-4 rounded-2xl border border-white/10 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{ff.category}</span>
                  <h4 className="text-xs font-bold font-mono text-white mt-0.5">{ff.name}</h4>
                </div>
                <button
                  onClick={() => toggleFlag(ff.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    ff.enabled ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      ff.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM TELEMETRY */}
      {activeTab === 'System Telemetry' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-4 font-mono text-xs">
          <h3 className="text-xs font-mono font-bold text-sky-400 uppercase">
            Global Cloud Infra Resources & Storage
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-200">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
              <p className="text-slate-500 text-[10px]">DATABASE SERVERS</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">PostgreSQL + Redis</p>
              <p className="text-[10px] text-slate-400 mt-1">Status: Operational (99.99%)</p>
            </div>

            <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
              <p className="text-slate-500 text-[10px]">STORAGE BUCKETS</p>
              <p className="text-lg font-bold text-sky-400 mt-1">AWS S3 (1.4 TB)</p>
              <p className="text-[10px] text-slate-400 mt-1">Video & LiDAR Point Clouds</p>
            </div>

            <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
              <p className="text-slate-500 text-[10px]">AI ENGINE MODEL</p>
              <p className="text-lg font-bold text-purple-400 mt-1">Gemini 3.6 Flash</p>
              <p className="text-[10px] text-slate-400 mt-1">Latency: 180ms</p>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-purple-500/30 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-mono text-white flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-purple-400" />
                <span>Register Platform Member</span>
              </h3>
              <p className="text-xs text-slate-400">
                Create a new registered user account for RoboAssist AI OS.
              </p>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Full Name:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Work Email:</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. ramesh@robotics-hub.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Role Permission:</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500"
                >
                  {['Super Admin', 'Admin', 'Organization', 'Developer', 'Operator', 'Engineer', 'Viewer'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Organization / Enterprise:</label>
                <input
                  type="text"
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-xs font-bold shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all mt-2"
              >
                Create Account & Grant Access
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
