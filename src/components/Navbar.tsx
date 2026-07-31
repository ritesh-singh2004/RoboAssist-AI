import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Activity,
  Boxes,
  Shield,
  Key,
  Layers,
  ShoppingBag,
  Terminal,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Search,
  Play,
  FileText,
  Mic,
  AlertTriangle,
  CheckCircle2,
  Globe,
  MessageSquare,
  FileCode2,
  Cloud,
  LogOut,
  User as UserIcon,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { User, Robot, Project, Mission, Incident, MarketplaceItem } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User | null;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDemo: () => void;
  unreadNotifications?: number;
  robots?: Robot[];
  projects?: Project[];
  missions?: Mission[];
  incidents?: Incident[];
  marketplaceItems?: MarketplaceItem[];
  onSelectRobot?: (id: string) => void;
  onSelectProject?: (id: string) => void;
  onSelectIncident?: (id: string) => void;
}

/* ─── Nav Item Definitions ───────────────────────────────── */
const primaryNavItems = [
  { id: 'landing',        label: 'Home',           icon: null         },
  { id: 'dashboard',      label: 'Fleet',          icon: Activity     },
  { id: 'ai-chat',        label: 'AI Chat',        icon: MessageSquare },
  { id: 'model-registry', label: 'Model Registry', icon: Layers       },
];

const moreNavItems = [
  { id: 'web-studio',   label: 'Web Studio',   icon: Globe       },
  { id: 'llm-studio',   label: 'LLM Studio',   icon: Sparkles    },
  { id: 'api-platform', label: 'API Platform', icon: Key         },
  { id: 'projects',     label: 'Projects',     icon: Boxes       },
  { id: 'deployments',  label: 'Deploy',       icon: Terminal    },
  { id: 'docs',         label: 'Docs',         icon: FileText    },
];

const allNavItems = [...primaryNavItems, ...moreNavItems];

/* ══════════════════════════════════════════════════════════ */
export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  isLoggedIn = true,
  onLogout,
  onOpenAuth,
  onOpenDemo,
  unreadNotifications = 0,
  robots = [],
  projects = [],
  missions = [],
  incidents = [],
  marketplaceItems = [],
  onSelectRobot,
  onSelectProject,
  onSelectIncident,
}) => {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [moreOpen,     setMoreOpen]     = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [activeCategory, setActiveCategory] = useState<'all'|'robots'|'projects'|'missions'|'incidents'>('all');
  const [isMicListening, setIsMicListening] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef  = useRef<HTMLInputElement>(null);
  const moreRef    = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Cmd+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false); setMoreOpen(false); setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── focus search input ── */
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [isSearchOpen]);

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── voice search ── */
  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (isMicListening) { setIsMicListening(false); return; }
    const rec = new SR();
    rec.continuous = false; rec.interimResults = true; rec.lang = 'en-US';
    rec.onstart = () => setIsMicListening(true);
    rec.onresult = (ev: any) => {
      let t = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) t += ev.results[i][0].transcript;
      setSearchQuery(t);
    };
    rec.onerror = rec.onend = () => setIsMicListening(false);
    rec.start();
  };

  /* ── filtered results ── */
  const q = searchQuery.trim().toLowerCase();
  const fRobots    = q ? robots.filter(r    => [r.name,r.type,r.locationSector,r.status,r.modelCode||''].some(v=>v.toLowerCase().includes(q))) : robots.slice(0,3);
  const fProjects  = q ? projects.filter(p  => [p.name,p.description,p.robotType,p.mission,p.deploymentTarget].some(v=>v.toLowerCase().includes(q))) : projects.slice(0,3);
  const fMissions  = q ? missions.filter(m  => [m.title,m.robotName,m.status,m.type,m.aiReport?.summary||''].some(v=>v.toLowerCase().includes(q))) : missions.slice(0,3);
  const fIncidents = q ? incidents.filter(i => [i.title,i.severity,i.status,i.executiveSummary].some(v=>v.toLowerCase().includes(q))) : incidents.slice(0,3);
  const totalCount = fRobots.length + fProjects.length + fMissions.length + fIncidents.length;

  const handleSelect = (type: 'robot'|'project'|'mission'|'incident', item: any) => {
    setIsSearchOpen(false); setSearchQuery('');
    if (type === 'robot')    { onSelectRobot?.(item.id);    setCurrentView('dashboard'); }
    if (type === 'project')  { onSelectProject?.(item.id);  setCurrentView('projects');  }
    if (type === 'mission')  { onSelectRobot?.(item.robotId); setCurrentView('dashboard'); }
    if (type === 'incident') { onSelectIncident?.(item.id); setCurrentView('incident');  }
  };

  const navigate = (id: string) => { setCurrentView(id); setMobileOpen(false); setMoreOpen(false); };

  /* ── current "More" item active? ── */
  const moreActive = moreNavItems.some(i => i.id === currentView);

  /* ════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── NAVBAR ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#080E1A]/95 backdrop-blur-2xl border-b border-white/8 shadow-2xl shadow-black/60'
            : 'bg-[#080E1A]/80 backdrop-blur-xl border-b border-white/5'
        }`}
      >
        {/* thin gradient accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center h-[60px] gap-3">

            {/* ── LOGO ── */}
            <button
              onClick={() => navigate('landing')}
              className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
              aria-label="RoboAssistAI Home"
            >
              {/* icon */}
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-[1.5px] rounded-[10px] bg-[#080E1A] flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5 text-sky-400 group-hover:text-sky-300 transition-colors" style={{ width: 18, height: 18 }} />
                </div>
                {/* animated ring */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-sky-500/0 group-hover:ring-sky-500/50 transition-all duration-300" />
              </div>
              {/* wordmark */}
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[15px] font-extrabold tracking-tight text-white">
                  RoboAssist<span className="text-sky-400">AI</span>
                  <span className="ml-1.5 text-[10px] font-semibold font-mono text-sky-400/70 border border-sky-500/30 bg-sky-500/10 px-1.5 py-px rounded-full align-middle">v4.2</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-[0.08em] font-medium">Industrial Robotics OS</span>
              </div>
            </button>



            {/* ── DESKTOP PRIMARY NAV ── */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-1">
              {primaryNavItems.map(item => {
                const active = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 group focus:outline-none ${
                      active
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        style={{ width: 14, height: 14 }}
                        className={`shrink-0 transition-colors ${active ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                      />
                    )}
                    <span>{item.label}</span>
                    {/* active underline */}
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" />
                    )}
                  </button>
                );
              })}

              {/* ── MORE DROPDOWN ── */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 focus:outline-none ${
                    moreActive || moreOpen
                      ? 'text-white bg-white/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    style={{ width: 13, height: 13 }}
                    className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  />
                  {moreActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" />
                  )}
                </button>

                {/* More dropdown panel */}
                {moreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-[#0D1526]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* top gradient border */}
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
                    <div className="p-1.5 grid grid-cols-1 gap-px">
                      {moreNavItems.map(item => {
                        const active = currentView === item.id;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => navigate(item.id)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all group ${
                              active
                                ? 'bg-sky-500/15 text-white'
                                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                          >
                            {Icon
                              ? <Icon style={{ width: 14, height: 14 }} className={`shrink-0 ${active ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                              : <div className="w-3.5 h-3.5 shrink-0" />
                            }
                            <span className="flex-1 text-left">{item.label}</span>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <div className="px-4 py-2 text-[10px] text-slate-500 font-mono">
                      {allNavItems.length} modules available
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* ── SPACER ── */}
            <div className="flex-1" />

            {/* ── RIGHT ACTIONS ── */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {/* Book Demo CTA */}
              <button
                onClick={onOpenDemo}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 hover:text-emerald-200 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <Play style={{ width: 12, height: 12 }} className="fill-emerald-400 text-emerald-400 shrink-0" />
                <span className="hidden lg:inline">Book Demo</span>
              </button>

              {isLoggedIn && user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-white/8">
                  {/* Profile dropdown trigger */}
                  <div ref={profileRef} className="relative">
                    <button
                      onClick={() => setProfileOpen(v => !v)}
                      className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky-500/30 transition-all duration-200 group"
                    >
                      <div className="relative">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-7 h-7 rounded-lg object-cover border border-sky-500/30"
                        />
                        {/* online dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080E1A]" />
                      </div>
                      <div className="hidden 2xl:block text-left">
                        <p className="text-[11px] font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
                        <p className="text-[9px] text-violet-300 font-mono mt-0.5">{user.role}</p>
                      </div>
                      <ChevronDown
                        style={{ width: 12, height: 12 }}
                        className={`text-slate-500 group-hover:text-slate-300 transition-all duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Profile dropdown */}
                    {profileOpen && (
                      <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-[#0D1526]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                        {/* user header */}
                        <div className="px-4 py-3 flex items-center gap-3 border-b border-white/8">
                          <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-xl border border-violet-500/30 object-cover" />
                          <div>
                            <p className="text-[13px] font-bold text-white">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.role}</p>
                          </div>
                        </div>
                        {/* actions */}
                        <div className="p-1.5 space-y-px">
                          {[
                            { icon: LayoutDashboard, label: 'Dashboard', view: 'user-dashboard' },
                            { icon: Settings,        label: 'Settings',  view: 'admin' },
                          ].map(({ icon: Icon, label, view }) => (
                            <button
                              key={view}
                              onClick={() => { navigate(view); setProfileOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                            >
                              <Icon style={{ width: 14, height: 14 }} className="text-slate-500" />
                              <span>{label}</span>
                            </button>
                          ))}
                        </div>
                        {onLogout && (
                          <>
                            <div className="mx-3 border-t border-white/8" />
                            <div className="p-1.5">
                              <button
                                onClick={() => { onLogout(); setProfileOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-rose-300 hover:bg-rose-500/10 transition-colors"
                              >
                                <LogOut style={{ width: 14, height: 14 }} />
                                <span>Sign out</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Logout pill (kept visible as per original design) */}
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/50 text-rose-300 text-[12px] font-semibold font-mono transition-all duration-200 hidden xl:flex items-center gap-1"
                      title="Sign out"
                    >
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-white/8">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-bold bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200"
                  >
                    Get started
                    <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              )}
            </div>

            {/* ── MOBILE: search icon + hamburger ── */}
            <div className="flex md:hidden items-center gap-2 ml-auto">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300"
              >
                <Search style={{ width: 16, height: 16 }} />
              </button>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-200 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
              </button>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            MOBILE DRAWER
        ═══════════════════════════════════════════════════ */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/8 bg-[#080E1A]/98 backdrop-blur-2xl">
            {/* user header if logged in */}
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
                <div className="relative">
                  <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-xl border border-sky-500/30 object-cover" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080E1A]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-violet-300 font-mono">{user.role}</p>
                </div>
              </div>
            )}

            {/* nav items */}
            <div className="px-3 py-3 space-y-0.5 max-h-[70vh] overflow-y-auto">
              {allNavItems.map(item => {
                const active = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                      active
                        ? 'bg-sky-500/15 text-white border border-sky-500/25'
                        : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    {Icon
                      ? <Icon style={{ width: 16, height: 16 }} className={active ? 'text-sky-400' : 'text-slate-500'} />
                      : <div className="w-4 h-4 shrink-0" />
                    }
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* bottom actions */}
            <div className="px-4 py-3 border-t border-white/8 flex flex-col gap-2">
              <button
                onClick={() => { onOpenDemo(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              >
                <Play style={{ width: 14, height: 14 }} className="fill-emerald-400" />
                Book Demo
              </button>
              {isLoggedIn && onLogout ? (
                <button
                  onClick={() => { onLogout(); setMobileOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-[14px] font-bold text-rose-300 bg-rose-500/10 border border-rose-500/25"
                >
                  Sign out
                </button>
              ) : !isLoggedIn && (
                <div className="flex gap-2">
                  <button onClick={() => { onOpenAuth('login');  setMobileOpen(false); }} className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold text-slate-300 bg-white/[0.05] border border-white/10">Sign in</button>
                  <button onClick={() => { onOpenAuth('signup'); setMobileOpen(false); }} className="flex-1 py-2.5 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-violet-600 to-sky-500">Get started</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════
          SEARCH OVERLAY
      ═══════════════════════════════════════════════════ */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 bg-black/70 backdrop-blur-xl"
          onClick={e => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
        >
          <div className="w-full max-w-2xl rounded-2xl bg-[#0D1526]/98 border border-white/12 shadow-2xl shadow-black/80 overflow-hidden">
            {/* top gradient line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent" />

            {/* input row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
              <Search className="w-4 h-4 text-sky-400 shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search robots, projects, missions, incidents…"
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-500 hover:text-white rounded-md transition-colors">
                  <X style={{ width: 14, height: 14 }} />
                </button>
              )}
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-lg border transition-all ${isMicListening ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-pulse' : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'}`}
              >
                <Mic style={{ width: 14, height: 14 }} />
              </button>
              <kbd
                onClick={() => setIsSearchOpen(false)}
                className="cursor-pointer px-2 py-1 text-[10px] font-mono font-bold text-slate-500 hover:text-white bg-white/[0.05] border border-white/10 rounded-md transition-colors"
              >
                ESC
              </kbd>
            </div>

            {/* category pills */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 overflow-x-auto scrollbar-none">
              {[
                { id: 'all',       label: 'All',       count: totalCount },
                { id: 'robots',    label: 'Robots',    count: fRobots.length },
                { id: 'projects',  label: 'Projects',  count: fProjects.length },
                { id: 'missions',  label: 'Missions',  count: fMissions.length },
                { id: 'incidents', label: 'Incidents', count: fIncidents.length },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-sky-500/20 border-sky-500/60 text-white shadow-sm shadow-sky-500/20'
                      : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                  <span className="px-1.5 py-px rounded-full bg-white/10 text-[10px]">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* results */}
            <div className="max-h-[52vh] overflow-y-auto divide-y divide-white/[0.04]">

              {/* Robots */}
              {(activeCategory === 'all' || activeCategory === 'robots') && fRobots.length > 0 && (
                <div className="px-4 py-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Bot style={{ width: 12, height: 12 }} /> Robots ({fRobots.length})
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {fRobots.map(r => (
                      <button key={r.id} onClick={() => handleSelect('robot', r)}
                        className="text-left group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-sky-500/40 transition-all flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-semibold text-white group-hover:text-sky-300 transition-colors">{r.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{r.type} · {r.locationSector}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">{r.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(activeCategory === 'all' || activeCategory === 'projects') && fProjects.length > 0 && (
                <div className="px-4 py-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                    <Boxes style={{ width: 12, height: 12 }} /> Projects ({fProjects.length})
                  </p>
                  <div className="space-y-1.5">
                    {fProjects.map(p => (
                      <button key={p.id} onClick={() => handleSelect('project', p)}
                        className="text-left w-full group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-violet-500/40 transition-all flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white group-hover:text-violet-300 transition-colors">{p.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{p.description}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 shrink-0">{p.deploymentTarget}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Missions */}
              {(activeCategory === 'all' || activeCategory === 'missions') && fMissions.length > 0 && (
                <div className="px-4 py-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Activity style={{ width: 12, height: 12 }} /> Missions ({fMissions.length})
                  </p>
                  <div className="space-y-1.5">
                    {fMissions.map(m => (
                      <button key={m.id} onClick={() => handleSelect('mission', m)}
                        className="text-left w-full group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold text-white group-hover:text-emerald-300 transition-colors">{m.title}</p>
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">{m.priority}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{m.robotName} · {m.sectorArea}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Incidents */}
              {(activeCategory === 'all' || activeCategory === 'incidents') && fIncidents.length > 0 && (
                <div className="px-4 py-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle style={{ width: 12, height: 12 }} /> Incidents ({fIncidents.length})
                  </p>
                  <div className="space-y-1.5">
                    {fIncidents.map(inc => (
                      <button key={inc.id} onClick={() => handleSelect('incident', inc)}
                        className="text-left w-full group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-rose-500/40 transition-all">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold text-white group-hover:text-rose-300 transition-colors">{inc.title}</p>
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 shrink-0">{inc.severity}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{inc.executiveSummary}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty */}
              {totalCount === 0 && (
                <div className="py-16 flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/8 flex items-center justify-center">
                    <Search className="w-5 h-5 text-slate-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">No results found</p>
                  <p className="text-xs text-slate-500">Try "Titan", "ROS2", "Refinery", or "Thermal"</p>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="px-4 py-2.5 border-t border-white/8 bg-black/30 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-600">
                <kbd className="px-1.5 py-px bg-white/8 border border-white/10 rounded text-slate-400">↑</kbd>{' '}
                <kbd className="px-1.5 py-px bg-white/8 border border-white/10 rounded text-slate-400">↓</kbd>{' '}
                navigate · <kbd className="px-1.5 py-px bg-white/8 border border-white/10 rounded text-slate-400">↵</kbd> select
              </span>
              <span className="text-[10px] font-mono text-sky-500/70 flex items-center gap-1">
                <Mic style={{ width: 10, height: 10 }} /> Voice enabled
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
