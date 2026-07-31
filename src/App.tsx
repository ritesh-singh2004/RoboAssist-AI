import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroRobotVisual } from './components/HeroRobotVisual';
import { ProblemSolution } from './components/ProblemSolution';
import { HowItWorks } from './components/HowItWorks';
import { IndustriesGrid } from './components/IndustriesGrid';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { FlowDiagram } from './components/FlowDiagram';
import { FleetDashboard } from './components/FleetDashboard';
import { MissionAnalytics } from './components/MissionAnalytics';
import { IncidentCommander } from './components/IncidentCommander';
import { ProjectBuilder } from './components/ProjectBuilder';
import { DeploymentPipeline } from './components/DeploymentPipeline';
import { Marketplace } from './components/Marketplace';
import { AdminPanel } from './components/AdminPanel';
import { UserDashboard } from './components/UserDashboard';
import { WebStudio } from './components/WebStudio';
import { CodeWorkspace } from './components/CodeWorkspace';
import { ModelRegistry } from './components/ModelRegistry';
import { RoboticsCloud } from './components/RoboticsCloud';
import { AIMissions } from './components/AIMissions';
import { SecurityWorkspace } from './components/SecurityWorkspace';
import { LLMStudio } from './components/LLMStudio';
import { APIPlatform } from './components/APIPlatform';
import { AiChatbot } from './components/AiChatbot';

import { DocsAndBlog } from './components/DocsAndBlog';
import { Footer } from './components/Footer';

import { AuthModal } from './components/AuthModal';
import { BookDemoModal } from './components/BookDemoModal';
import { VideoModal } from './components/VideoModal';

import {
  INITIAL_ROBOTS,
  INITIAL_MISSIONS,
  INITIAL_INCIDENTS,
  INITIAL_PROJECTS,
  INITIAL_DEPLOYMENTS,
  INITIAL_MARKETPLACE,
  INITIAL_REGISTERED_USERS,
  INITIAL_AUDIT_LOGS
} from './data/initialData';

import { Robot, Mission, Incident, Project, Deployment, MarketplaceItem, User, AuditLog, UserRole } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  // Registered Users & Auth state with LocalStorage persistence
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('roboassist_registered_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REGISTERED_USERS;
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('roboassist_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REGISTERED_USERS[0];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('roboassist_is_logged_in');
      return saved ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // App Domain State
  const [robots, setRobots] = useState<Robot[]>(INITIAL_ROBOTS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [deployments, setDeployments] = useState<Deployment[]>(INITIAL_DEPLOYMENTS);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [selectedRobotId, setSelectedRobotId] = useState<string>(INITIAL_ROBOTS[0]?.id || 'bot-01');

  // Modals
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login',
  });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('roboassist_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('roboassist_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('roboassist_current_user');
      }
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('roboassist_is_logged_in', JSON.stringify(isLoggedIn));
    } catch (e) {}
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsInitializing(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  // Auth Functions
  const handleRegister = (newUserObj: User): boolean => {
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === newUserObj.email.toLowerCase()
    );
    if (existing) {
      return false;
    }

    setRegisteredUsers((prev) => [newUserObj, ...prev]);
    setUser(newUserObj);
    setIsLoggedIn(true);

    // Audit Log
    const logEntry: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: newUserObj.name,
      userRole: newUserObj.role,
      action: `New User Account Registered (${newUserObj.email})`,
      category: 'USER_MGMT',
      ipAddress: '103.22.45.18',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);

    return true;
  };

  const handleLogin = (email: string, password?: string) => {
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!found) {
      // Auto-create user if attempting first time login
      const autoUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'User Member',
        email: email,
        password: password || 'password123',
        role: 'Operator',
        organization: 'Robotics Enterprise',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        aiCreditsRemaining: 25000,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Active',
      };
      setRegisteredUsers((prev) => [autoUser, ...prev]);
      setUser(autoUser);
      setIsLoggedIn(true);
      return { success: true, user: autoUser };
    }

    if (found.status === 'Suspended') {
      return { success: false, message: 'Your account has been suspended by the Super Admin.' };
    }

    setUser(found);
    setIsLoggedIn(true);

    const logEntry: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: found.name,
      userRole: found.role,
      action: `User Sign-In Successful (${found.email})`,
      category: 'SECURITY',
      ipAddress: '103.22.45.18',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);

    return { success: true, user: found };
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('landing');
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (user && user.id === userId) {
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Suspended' ? 'Active' : 'Suspended';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
    if (user && user.id === userId) {
      handleLogout();
    }
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const updatedUserObj = { ...user, ...updated };
    setUser(updatedUserObj);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, ...updated } : u))
    );
  };

  const handleAddCredits = (userId: string, amount: number) => {
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, aiCreditsRemaining: u.aiCreditsRemaining + amount }
          : u
      )
    );
    if (user && user.id === userId) {
      setUser((prev) =>
        prev
          ? { ...prev, aiCreditsRemaining: prev.aiCreditsRemaining + amount }
          : null
      );
    }
  };

  // Protected View Handler
  const handleProtectedNavigate = (view: string) => {
    if (!isLoggedIn) {
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    setCurrentView(view);
  };

  // --- Handlers & API integrations ---

  // 1. Mission Dispatch
  const handleDispatchMission = async (robotId: string, commandText: string) => {
    try {
      const response = await fetch('/api/ai/plan-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectorPrompt: commandText,
          robotType: robots.find((r) => r.id === robotId)?.type || 'Quadruped',
          urgency: 'HIGH',
        }),
      });
      const data = await response.json();

      const newMission: Mission = {
        id: `msn-${Date.now()}`,
        title: `Voice Mission: ${commandText.slice(0, 25)}...`,
        robotId,
        robotName: robots.find((r) => r.id === robotId)?.name || 'Robot',
        type: 'Inspection',
        status: 'In Progress',
        progressPercent: 10,
        priority: 'High',
        sectorArea: 'Sector 4 Valve B',
        startTime: new Date().toLocaleTimeString(),
        aiReport: {
          summary: data.plan?.summary || 'AI Mission dispatched successfully.',
          anomaliesFound: 0,
          safetyScore: 98,
          recommendations: data.plan?.recommendations || ['Maintain nominal speed'],
          anomaliesTimeline: [],
        },
      };

      setMissions((prev) => [newMission, ...prev]);
    } catch (err) {
      console.error('Error dispatching mission:', err);
    }
  };

  // 2. Emergency Stop
  const handleTriggerEmergencyStop = (robotId: string) => {
    setRobots((prev) =>
      prev.map((r) => (r.id === robotId ? { ...r, status: 'Idle' } : r))
    );
  };

  // 3. AI Incident Commander Server Analysis
  const handleRunAiAnalysis = async (
    incidentTitle: string,
    platform: string,
    transcriptText: string
  ) => {
    const res = await fetch('/api/ai/analyze-incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentTitle, platform, transcriptText }),
    });
    return await res.json();
  };

  // 4. Action Item Approval
  const handleApproveActionItem = (incidentId: string, actionItemId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            actionItems: inc.actionItems.map((item) =>
              item.id === actionItemId ? { ...item, done: !item.done } : item
            ),
          };
        }
        return inc;
      })
    );
  };

  // 5. Generate AI Docs
  const handleGenerateAiDocs = async (
    projectName: string,
    robotType: string,
    mission: string,
    description: string,
    docType: string
  ) => {
    const res = await fetch('/api/ai/generate-docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName, robotType, mission, description, docType }),
    });
    const data = await res.json();
    return data.document || 'Failed to generate document.';
  };

  // 6. Create & Delete Project
  const handleCreateProject = (proj: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: proj.name || 'New Project',
      description: proj.description || '',
      robotType: proj.robotType || 'Quadruped',
      mission: proj.mission || 'Inspection',
      repositoryUrl: proj.repositoryUrl || '',
      deploymentTarget: proj.deploymentTarget || 'Kubernetes',
      status: 'Draft',
      environmentVars: proj.environmentVars || [],
      aiModels: proj.aiModels || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeployProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const newDep: Deployment = {
      id: `dep-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      environment: proj.deploymentTarget,
      status: 'Success',
      timestamp: new Date().toLocaleTimeString(),
      commitHash: 'a8f9c2d',
      logs: [
        'Connecting to K8s edge cluster...',
        'Compiling ROS2 colcon workspace...',
        'Loading YOLOv11 TensorRT model weights...',
        'Deployment complete! Health check passed (200 OK).'
      ],
    };

    setDeployments((prev) => [newDep, ...prev]);
    setCurrentView('deployments');
  };

  // 7. Rollback Deployment
  const handleTriggerRollback = (deploymentId: string) => {
    setDeployments((prev) =>
      prev.map((d) =>
        d.id === deploymentId
          ? {
              ...d,
              status: 'Success',
              logs: [...d.logs, 'ROLLBACK TRIGGERED: Restoring commit v1.0.4... Success.'],
            }
          : d
      )
    );
  };

  const handleNewDeployment = (target: string) => {
    const newDep: Deployment = {
      id: `dep-${Date.now()}`,
      projectId: 'proj-1',
      projectName: 'Titan Thermal Patrol',
      environment: target,
      status: 'Success',
      timestamp: new Date().toLocaleTimeString(),
      commitHash: 'c9f8a11',
      logs: [
        `Target selected: ${target}`,
        'Initiating container build...',
        'Publishing ROS2 topics...',
        'Status: ACTIVE'
      ],
    };
    setDeployments((prev) => [newDep, ...prev]);
  };

  // 8. Marketplace Install & Publish
  const handleInstallMarketplaceItem = (item: MarketplaceItem) => {
    console.log('Installed item:', item.title);
  };

  const handlePublishMarketplaceItem = (item: Partial<MarketplaceItem>) => {
    const newItem: MarketplaceItem = {
      id: `mkt-${Date.now()}`,
      title: item.title || 'Untitled',
      category: item.category || 'AI Models',
      description: item.description || '',
      priceUSD: item.priceUSD || 0,
      isFree: item.isFree ?? true,
      author: item.author || user.name,
      downloads: 1,
      rating: 5.0,
      tags: item.tags || ['RoboAssistOS'],
      version: 'v1.0.0',
      verified: true,
      iconName: 'Sparkles',
    };
    setMarketplaceItems((prev) => [newItem, ...prev]);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-slate-100 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-sky-400 animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-white text-lg font-semibold">Initializing RoboAssist AI...</p>
            <p className="text-slate-400 text-sm">Loading your workspace and synchronizing local data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* Background Mesh Gradients for Frosted Glass depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0EA5E9] rounded-full blur-[140px] opacity-20 pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-[#22C55E] rounded-full blur-[140px] opacity-15 pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[15%] w-[350px] h-[350px] bg-sky-600 rounded-full blur-[150px] opacity-10 pointer-events-none z-0" />

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          if (!isLoggedIn && ['dashboard', 'analytics', 'incident', 'projects', 'deployments', 'marketplace', 'admin', 'user-dashboard', 'web-studio', 'ai-chat', 'code-workspace', 'model-registry', 'robotics-cloud', 'ai-missions', 'security'].includes(view)) {
            setAuthModal({ open: true, mode: 'login' });
          } else {
            setCurrentView(view);
          }
        }}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onOpenDemo={() => setShowDemoModal(true)}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        robots={robots}
        projects={projects}
        missions={missions}
        incidents={incidents}
        marketplaceItems={marketplaceItems}
        onSelectRobot={(id) => setSelectedRobotId(id)}
      />

      {/* Main View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {currentView === 'landing' && (
          <div className="space-y-24">
            <HeroRobotVisual
              onBookDemo={() => setShowDemoModal(true)}
              onWatchVideo={() => setShowVideoModal(true)}
              onExploreFleet={() => handleProtectedNavigate('dashboard')}
            />
            <ProblemSolution />
            <HowItWorks />
            <IndustriesGrid />
            <FeaturesShowcase />
            <FlowDiagram />

          </div>
        )}

        {/* Auth Gate for Protected Views */}
        {!isLoggedIn && currentView !== 'landing' && currentView !== 'docs' ? (
          <div className="p-12 text-center bg-white/5 border border-purple-500/30 rounded-3xl backdrop-blur-2xl max-w-2xl mx-auto my-12 space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-mono text-white">AUTHENTICATION REQUIRED</h2>
              <p className="text-xs text-slate-300 font-mono">
                Only registered & logged in RoboAssist AI members can access enterprise telemetry, mission controls, and admin settings.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setAuthModal({ open: true, mode: 'login' })}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0EA5E9] hover:bg-sky-400 text-white font-mono text-xs font-bold shadow-lg shadow-sky-500/30 transition-all"
              >
                Sign In to Account
              </button>
              <button
                onClick={() => setAuthModal({ open: true, mode: 'signup' })}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-purple-500/30 transition-all"
              >
                Register New Account
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && (
              <FleetDashboard
                robots={robots}
                missions={missions}
                selectedRobotId={selectedRobotId}
                onSelectRobot={(id) => setSelectedRobotId(id)}
                onTriggerEmergencyStop={handleTriggerEmergencyStop}
                onDispatchMission={handleDispatchMission}
              />
            )}

            {currentView === 'analytics' && (
              <MissionAnalytics
                robots={robots}
                missions={missions}
                onNavigateToFleet={(id) => {
                  if (id) setSelectedRobotId(id);
                  setCurrentView('dashboard');
                }}
              />
            )}

            {currentView === 'incident' && (
              <IncidentCommander
                incidents={incidents}
                onApproveActionItem={handleApproveActionItem}
                onRunAiAnalysis={handleRunAiAnalysis}
              />
            )}

            {currentView === 'projects' && (
              <ProjectBuilder
                projects={projects}
                onCreateProject={handleCreateProject}
                onDeleteProject={handleDeleteProject}
                onDeployProject={handleDeployProject}
                onGenerateAiDocs={handleGenerateAiDocs}
              />
            )}

            {currentView === 'deployments' && (
              <DeploymentPipeline
                deployments={deployments}
                onTriggerRollback={handleTriggerRollback}
                onNewDeployment={handleNewDeployment}
              />
            )}



            {currentView === 'admin' && (
              <AdminPanel
                currentUser={user}
                users={registeredUsers}
                auditLogs={auditLogs}
                onUpdateRole={handleUpdateUserRole}
                onToggleUserStatus={handleToggleUserStatus}
                onDeleteUser={handleDeleteUser}
                onAddUser={handleRegister}
                onAddCredits={handleAddCredits}
              />
            )}

            {currentView === 'user-dashboard' && user && (
              <UserDashboard
                user={user}
                robots={robots}
                missions={missions}
                projects={projects}
                onOpenPricing={() => setCurrentView('pricing')}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {currentView === 'web-studio' && <WebStudio />}


            {currentView === 'model-registry' && <ModelRegistry onOpenLLMStudio={() => setCurrentView('llm-studio')} />}
            {currentView === 'llm-studio' && <LLMStudio />}
            {currentView === 'api-platform' && <APIPlatform />}
            {currentView === 'robotics-cloud' && <RoboticsCloud />}
            {currentView === 'ai-missions' && <AIMissions />}
            {currentView === 'security' && <SecurityWorkspace />}

            {currentView === 'ai-chat' && <AiChatbot />}



            {currentView === 'docs' && <DocsAndBlog />}
          </>
        )}

      </main>

      {/* Global Footer */}
      <Footer setCurrentView={setCurrentView} />

      {/* Modal Dialogs */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          registeredUsers={registeredUsers}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          onRegister={handleRegister}
          onLogin={handleLogin}
        />
      )}

      {showDemoModal && <BookDemoModal onClose={() => setShowDemoModal(false)} />}
      {showVideoModal && <VideoModal onClose={() => setShowVideoModal(false)} />}

    </div>
  );
}
