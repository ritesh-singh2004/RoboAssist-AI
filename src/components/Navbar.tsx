import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Activity,
  Boxes,
  Shield,
  Key,
  Cpu,
  Layers,
  ShoppingBag,
  Terminal,
  UserCheck,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  Bell,
  Play,
  FileText,
  Mic,
  ArrowRight,
  AlertTriangle,
  FolderGit2,
  CheckCircle2,
  Tag,
  BarChart3,
  Globe,
  MessageSquare,
  FileCode2,
  Compass,
  Cloud
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
  // Search Data Props
  robots?: Robot[];
  projects?: Project[];
  missions?: Mission[];
  incidents?: Incident[];
  marketplaceItems?: MarketplaceItem[];
  onSelectRobot?: (id: string) => void;
  onSelectProject?: (id: string) => void;
  onSelectIncident?: (id: string) => void;
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'robots' | 'projects' | 'missions' | 'incidents'>('all');
  const [isMicListening, setIsMicListening] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when search overlay opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Web Speech Recognition for Search Bar
  const toggleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please type your query.');
      return;
    }

    if (isMicListening) {
      setIsMicListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsMicListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSearchQuery(transcript);
      };
      recognition.onerror = () => setIsMicListening(false);
      recognition.onend = () => setIsMicListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsMicListening(false);
    }
  };

  // Filtered Search Results
  const query = searchQuery.trim().toLowerCase();

  const filteredRobots = query
    ? robots.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.type.toLowerCase().includes(query) ||
          r.locationSector.toLowerCase().includes(query) ||
          r.status.toLowerCase().includes(query) ||
          (r.modelCode && r.modelCode.toLowerCase().includes(query))
      )
    : robots.slice(0, 3);

  const filteredProjects = query
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.robotType.toLowerCase().includes(query) ||
          p.mission.toLowerCase().includes(query) ||
          p.deploymentTarget.toLowerCase().includes(query)
      )
    : projects.slice(0, 3);

  const filteredMissions = query
    ? missions.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.robotName.toLowerCase().includes(query) ||
          m.status.toLowerCase().includes(query) ||
          m.type.toLowerCase().includes(query) ||
          (m.aiReport?.summary && m.aiReport.summary.toLowerCase().includes(query))
      )
    : missions.slice(0, 3);

  const filteredIncidents = query
    ? incidents.filter(
        (inc) =>
          inc.title.toLowerCase().includes(query) ||
          inc.severity.toLowerCase().includes(query) ||
          inc.status.toLowerCase().includes(query) ||
          inc.executiveSummary.toLowerCase().includes(query)
      )
    : incidents.slice(0, 3);

  const totalResultsCount =
    filteredRobots.length + filteredProjects.length + filteredMissions.length + filteredIncidents.length;

  const handleSelectResult = (type: 'robot' | 'project' | 'mission' | 'incident', item: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');

    if (type === 'robot') {
      if (onSelectRobot) onSelectRobot(item.id);
      setCurrentView('dashboard');
    } else if (type === 'project') {
      if (onSelectProject) onSelectProject(item.id);
      setCurrentView('projects');
    } else if (type === 'mission') {
      if (onSelectRobot && item.robotId) onSelectRobot(item.robotId);
      setCurrentView('dashboard');
    } else if (type === 'incident') {
      if (onSelectIncident) onSelectIncident(item.id);
      setCurrentView('incident');
    }
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Fleet', icon: Activity, badge: 'LIVE' },
    { id: 'web-studio', label: 'Web Studio', icon: Globe, badge: 'NEW' },
    { id: 'code-workspace', label: 'Code Studio', icon: FileCode2, badge: 'IDE' },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare, badge: 'GPT' },
    { id: 'model-registry', label: 'Model Registry', icon: Layers, badge: 'LLM' },
    { id: 'llm-studio', label: 'LLM Studio', icon: Layers, badge: 'BUILD' },
    { id: 'api-platform', label: 'API Platform', icon: Key, badge: 'KEYS' },
    { id: 'projects', label: 'Projects', icon: Boxes },
    { id: 'deployments', label: 'Deploy', icon: Terminal },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
    { id: 'pricing', label: 'Pricing' },
    { id: 'docs', label: 'Docs', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B1220]/90 backdrop-blur-2xl transition-all shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-3 w-full">
          
          {/* Logo */}
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#22C55E] p-[1.5px] shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
              <div className="w-full h-full bg-[#0B1220]/90 rounded-[10px] flex items-center justify-center backdrop-blur-md">
                <Bot className="w-5 h-5 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-sans">
                  RoboAssist<span className="text-[#0EA5E9]">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white/5 text-[#0EA5E9] border border-white/10 rounded-full">
                  v4.2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                Industrial Robotics OS
              </p>
            </div>
          </div>

          {/* GLOBAL SEARCH TRIGGER BAR */}
          <div className="flex-1 max-w-[130px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] mx-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#0EA5E9]/50 rounded-2xl px-3 py-2 text-xs text-slate-400 backdrop-blur-md transition-all group shadow-inner"
            >
              <div className="flex items-center space-x-2 truncate">
                <Search className="w-3.5 h-3.5 text-[#0EA5E9] group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate group-hover:text-slate-200">
                  Search...
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-1 shrink-0">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-300 bg-white/10 border border-white/10 rounded-md">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center glass-pill px-2 py-1 rounded-full border border-white/10 shrink min-w-0 overflow-x-auto scrollbar-none space-x-1">
            <div className="flex items-center space-x-1 min-w-max">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white/15 text-white border border-sky-400/40 shadow-lg shadow-sky-500/20 backdrop-blur-md'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0EA5E9]' : 'text-slate-400'}`} />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1 py-0.2 text-[8px] font-bold rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2 shrink-0 ml-auto">
            <div className="hidden md:flex items-center overflow-x-auto space-x-2 no-scrollbar">
              <button
                onClick={() => setCurrentView('code-workspace')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition-all hover:scale-105"
              >
                <FileCode2 className="w-3 h-3 text-[#0EA5E9]" />
                <span className="hidden lg:inline">Code Studio</span>
              </button>
              <button
                onClick={() => setCurrentView('ai-chat')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition-all hover:scale-105"
              >
                <MessageSquare className="w-3 h-3 text-[#A855F7]" />
                <span className="hidden lg:inline">AI Chat</span>
              </button>
              <button
                onClick={() => setCurrentView('model-registry')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition-all hover:scale-105"
              >
                <Layers className="w-3 h-3 text-[#38BDF8]" />
                <span className="hidden lg:inline">Model Registry</span>
              </button>
            </div>
            <button
              onClick={onOpenDemo}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition-all hover:scale-105"
            >
              <Play className="w-3 h-3 text-[#22C55E] fill-[#22C55E]" />
              <span className="hidden lg:inline">Book Demo</span>
            </button>

            {isLoggedIn && user ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 pl-2 border-l border-white/10">
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border backdrop-blur-md transition-all text-xs font-mono font-bold ${
                    currentView === 'admin'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title="Admin Control Panel"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Admin</span>
                </button>

                <div
                  onClick={() => setCurrentView('user-dashboard')}
                  className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all"
                  title="User Profile Dashboard"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full border border-[#0EA5E9]/50 object-cover"
                  />
                  <div className="hidden 2xl:block text-left pr-1">
                    <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[80px]">{user.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-purple-300 font-mono font-semibold">{user.role}</p>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-2 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-all"
                    title="Sign Out"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-purple-600 to-[#0EA5E9] hover:from-purple-500 hover:to-[#38BDF8] text-white shadow-lg shadow-purple-500/25 hover:scale-105 transition-all"
                >
                  <span>Register</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* GLOBAL SEARCH OVERLAY MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsSearchOpen(false)}
          />

          <div className="relative w-full max-w-3xl bg-[#0F172A] border border-white/15 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden z-10 space-y-0">
            
            {/* Search Input Box */}
            <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-white/5 backdrop-blur-md">
              <Search className="w-5 h-5 text-[#0EA5E9] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search robots, ROS2 projects, mission reports, incidents..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={toggleVoiceSearch}
                className={`p-2 rounded-xl border transition-all ${
                  isMicListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Voice Search via Web Speech API"
              >
                <Mic className="w-4 h-4" />
              </button>
              <kbd
                onClick={() => setIsSearchOpen(false)}
                className="cursor-pointer px-2.5 py-1 text-[10px] font-mono font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg"
              >
                ESC
              </kbd>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2.5 border-b border-white/10 bg-black/40 flex items-center space-x-2 text-xs overflow-x-auto scrollbar-none font-mono">
              {[
                { id: 'all', label: 'All Results', count: totalResultsCount },
                { id: 'robots', label: 'Robots', count: filteredRobots.length },
                { id: 'projects', label: 'Projects', count: filteredProjects.length },
                { id: 'missions', label: 'Mission Reports', count: filteredMissions.length },
                { id: 'incidents', label: 'Incidents', count: filteredIncidents.length },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1 rounded-full border text-[11px] font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-[#0EA5E9]/20 border-[#0EA5E9] text-white shadow-lg shadow-sky-500/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 divide-y divide-white/5">
              
              {/* ROBOTS SECTION */}
              {(activeCategory === 'all' || activeCategory === 'robots') && filteredRobots.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1.5 text-[#0EA5E9]">
                      <Bot className="w-4 h-4" />
                      <span>ROBOTS ({filteredRobots.length})</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredRobots.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => handleSelectResult('robot', r)}
                        className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#0EA5E9]/50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                              {r.name}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                              {r.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{r.type} • {r.locationSector}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS SECTION */}
              {(activeCategory === 'all' || activeCategory === 'projects') && filteredProjects.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1.5 text-purple-400">
                      <Boxes className="w-4 h-4" />
                      <span>PROJECTS & AI DOCS ({filteredProjects.length})</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectResult('project', p)}
                        className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                              {p.name}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Target: {p.deploymentTarget}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MISSION REPORTS SECTION */}
              {(activeCategory === 'all' || activeCategory === 'missions') && filteredMissions.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1.5 text-[#22C55E]">
                      <Activity className="w-4 h-4" />
                      <span>MISSION REPORTS ({filteredMissions.length})</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredMissions.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectResult('mission', m)}
                        className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22C55E]/50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#22C55E] transition-colors">
                              {m.title}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {m.priority} Priority
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Robot: {m.robotName} • Sector: {m.sectorArea}
                          </p>
                          {m.aiReport?.summary && (
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic">
                              "{m.aiReport.summary}"
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INCIDENTS SECTION */}
              {(activeCategory === 'all' || activeCategory === 'incidents') && filteredIncidents.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1.5 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>INCIDENTS ({filteredIncidents.length})</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => handleSelectResult('incident', inc)}
                        className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                              {inc.title}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {inc.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {inc.executiveSummary}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NO RESULTS STATE */}
              {totalResultsCount === 0 && (
                <div className="py-12 text-center space-y-3">
                  <Search className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">No matching items found</p>
                  <p className="text-xs text-slate-500">
                    Try searching for "Titan", "ROS2", "Refinery", "Thermal", or "Leak"
                  </p>
                </div>
              )}

            </div>

            {/* Footer Tip Bar */}
            <div className="p-3 bg-black/60 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between px-4">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">↓</kbd> to navigate</span>
              <span className="text-[#0EA5E9]">Voice Search Enabled 🎤</span>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-sky-500/20 bg-[#0B1220]/95 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentView === item.id
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {Icon && <Icon className="w-4 h-4 text-[#0EA5E9]" />}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#22C55E]/20 text-[#22C55E] rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

