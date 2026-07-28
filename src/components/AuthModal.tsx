import React, { useState } from 'react';
import {
  X,
  Bot,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  registeredUsers: User[];
  onClose: () => void;
  onRegister: (newUser: User) => boolean;
  onLogin: (email: string, password: string) => { success: boolean; user?: User; message?: string };
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  registeredUsers = [],
  onClose,
  onRegister,
  onLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('Operator');
  const [signupOrg, setSignupOrg] = useState('Robotics Facility India');

  // Status message
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = onLogin(loginEmail, loginPassword);
    if (res.success && res.user) {
      setSuccessMsg(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setErrorMsg(res.message || 'Invalid credentials or user not registered.');
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signupName || !signupEmail) {
      setErrorMsg('Please enter your full name and work email.');
      return;
    }

    const newUserObj: User = {
      id: `usr-${Date.now()}`,
      name: signupName,
      email: signupEmail,
      password: signupPassword || 'password123',
      role: signupRole,
      organization: signupOrg || 'Industrial Enterprise',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*10)}?auto=format&fit=crop&w=250&q=80`,
      aiCreditsRemaining: 25000,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    const registered = onRegister(newUserObj);
    if (registered) {
      setSuccessMsg(`Registration successful! Welcome to RoboAssist AI, ${signupName}.`);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg('An account with this email is already registered. Please Sign In.');
    }
  };

  // Quick 1-Click Select User
  const handleQuickLogin = (u: User) => {
    const res = onLogin(u.email, u.password || 'password123');
    if (res.success) {
      setSuccessMsg(`Logged in as ${u.name}`);
      setTimeout(() => onClose(), 500);
    } else {
      setErrorMsg(res.message || 'Failed to login as selected user.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-[#0F172A] to-[#1E293B] border border-sky-500/30 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl relative text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/15 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#22C55E] p-[1.5px] mx-auto shadow-lg shadow-sky-500/30">
            <div className="w-full h-full bg-[#0B1220] rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#0EA5E9]" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono text-white">
            {mode === 'login' ? 'Sign In to RoboAssist AI' : 'Register New Industry Account'}
          </h3>
          <p className="text-xs text-slate-400">
            Access enterprise fleet telemetry, ROS2 pipeline control, and AI Incident Commander.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-black/40 rounded-2xl border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
              mode === 'login'
                ? 'bg-[#0EA5E9] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
              mode === 'signup'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Error / Success Feedback Banners */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-2xl text-xs font-mono text-rose-300 flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-xs font-mono text-emerald-300 flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM: LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1">Work Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="riteshwork952004@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] text-white font-mono text-xs font-bold shadow-lg shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition-all mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>
        )}

        {/* FORM: SIGN UP MODE */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1">Full Name:</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Work Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="ramesh@robotics.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Set Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Role Permission:</label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {['Super Admin', 'Admin', 'Organization', 'Developer', 'Operator', 'Engineer', 'Viewer'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Organization:</label>
                <input
                  type="text"
                  value={signupOrg}
                  onChange={(e) => setSignupOrg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-xs font-bold shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all mt-2"
            >
              Create Registered Account
            </button>
          </form>
        )}

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            1-Click Registered User Login Presets:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {registeredUsers.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all flex items-center space-x-2 group"
              >
                <img src={u.avatarUrl} className="w-6 h-6 rounded-full shrink-0 object-cover" alt="" />
                <div className="truncate">
                  <p className="text-[11px] font-bold text-white group-hover:text-sky-300 truncate">{u.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
