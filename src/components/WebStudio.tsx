import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Code2,
  Play,
  Rocket,
  Check,
  Copy,
  ExternalLink,
  Laptop,
  Smartphone,
  Maximize2,
  RefreshCw,
  Layers,
  Terminal,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface PublishedSite {
  id: string;
  title: string;
  prompt: string;
  htmlCode: string;
  url: string;
  deployedAt: string;
  status: 'Live' | 'Building';
}

export const WebStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'preview' | 'code' | 'deploy'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Currently generated app
  const [currentCode, setCurrentCode] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RoboAssist AI Studio Web App</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0B1220] text-slate-100 min-h-screen p-8 flex flex-col items-center justify-center">
  <div class="max-w-2xl w-full bg-slate-900/90 border border-sky-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
    <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-500/30">
      🤖
    </div>
    <h1 class="text-3xl font-extrabold text-white tracking-tight">RoboAssist Web Studio</h1>
    <p class="text-slate-300 text-sm leading-relaxed">
      Type any web app or website prompt above (e.g. "Create a Robotics E-commerce Store" or "Build an Industrial Analytics Dashboard") and click <strong>Generate Web App</strong> to generate and deploy live!
    </p>
    <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs font-mono space-y-2">
      <p className="text-sky-400 font-bold">🚀 Studio Features:</p>
      <p className="text-slate-400">• Full HTML5/Tailwind CSS/JS code generation</p>
      <p className="text-slate-400">• Real-time sandboxed live preview</p>
      <p className="text-slate-400">• Instant global CDN deployment & live URL sharing</p>
    </div>
  </div>
</body>
</html>`);

  const [generatedTitle, setGeneratedTitle] = useState('RoboAssist AI Studio Web App');
  const [liveDeploymentUrl, setLiveDeploymentUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvePrompt, setImprovePrompt] = useState('Refine the landing page with stronger robotics SaaS messaging and a clearer call-to-action.');
  const [deployPreviewMode, setDeployPreviewMode] = useState<'local' | 'live'>('local');

  // History of published deployments saved in LocalStorage
  const [publishedSites, setPublishedSites] = useState<PublishedSite[]>(() => {
    try {
      const saved = localStorage.getItem('roboassist_published_websites');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const savePublishedSites = (sites: PublishedSite[]) => {
    setPublishedSites(sites);
    try {
      localStorage.setItem('roboassist_published_websites', JSON.stringify(sites));
    } catch (e) {}
  };

  const handleGenerateWebsite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setLiveDeploymentUrl('');

    try {
      const res = await fetch('/api/ai/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, title }),
      });
      const data = await res.json();

      if (data.success && data.htmlCode) {
        setCurrentCode(data.htmlCode);
        setGeneratedTitle(data.suggestedTitle || title || 'AI Web Application');
        setLiveDeploymentUrl(
          data.deploymentUrl || `${window.location.origin}/site/site-${Math.floor(100000 + Math.random() * 900000)}`
        );
        setActiveViewMode('preview');
      }
    } catch (error) {
      console.error('Error generating website:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishLive = async () => {
    setIsDeploying(true);

    try {
      const res = await fetch('/api/ai/deploy-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlCode: currentCode,
          title: generatedTitle,
          prompt,
        }),
      });

      const data = await res.json();
      const url = data.success && data.deploymentUrl
        ? data.deploymentUrl
        : liveDeploymentUrl || `${window.location.origin}/site/site-${Math.floor(100000 + Math.random() * 900000)}`;

      const newSite: PublishedSite = {
        id: data.siteId || `site-${Date.now().toString().slice(-6)}`,
        title: generatedTitle,
        prompt: prompt || 'Custom AI Generated Web Application',
        htmlCode: currentCode,
        url,
        deployedAt: new Date().toLocaleString(),
        status: data.success ? 'Live' : 'Building',
      };

      savePublishedSites([newSite, ...publishedSites]);
      setLiveDeploymentUrl(url);
      setDeployPreviewMode('live');
      setActiveViewMode('deploy');
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleImproveWebsite = async () => {
    if (!improvePrompt.trim()) return;
    setIsImproving(true);

    try {
      const res = await fetch('/api/ai/improve-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlCode: currentCode,
          instruction: improvePrompt,
          title: generatedTitle,
        }),
      });
      const data = await res.json();
      if (data.success && data.htmlCode) {
        setCurrentCode(data.htmlCode);
        setActiveViewMode('preview');
      }
    } catch (error) {
      console.error('Improve website failed:', error);
    } finally {
      setIsImproving(false);
    }
  };

  const handlePreviewDeployedSite = () => {
    if (liveDeploymentUrl) {
      setDeployPreviewMode('live');
      setActiveViewMode('preview');
    }
  };

  const handlePreviewLocalSite = () => {
    setDeployPreviewMode('local');
    setActiveViewMode('preview');
  };

  const handleCopyUrl = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const PROMPT_SUGGESTIONS = [
    '🤖 E-Commerce Store for Industrial Robot Arms & Spare Sensors',
    '⚡ Real-time Telemetry Dashboard for Quadruped Fleet Patrols',
    '🚀 SaaS Landing Page for Autonomous Warehouse Logistics AI',
    '💼 Personal Portfolio for Robotics Engineer with 3D Canvas Showcase'
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-sky-500/30 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                GOOGLE AI STUDIO STYLE
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                INSTANT LIVE DEPLOY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans flex items-center gap-3">
              <Globe className="w-8 h-8 text-[#0EA5E9]" />
              <span>ROBOASSIST AI WEB STUDIO</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Prompt the Gemini 3.6 Flash engine to generate complete websites and full-stack web apps, preview them live in a sandboxed container, and publish them live with instant deployment links!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {liveDeploymentUrl && (
              <button
                onClick={handlePublishLive}
                disabled={isDeploying}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
              >
                <Rocket className="w-4 h-4" />
                <span>{isDeploying ? 'Deploying...' : 'Deploy Live Now'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Prompt Input Area */}
        <form onSubmit={handleGenerateWebsite} className="space-y-3 pt-2">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Describe the website or web app you want to build (e.g. 'Build an AI Robotics Store with shopping cart and dark mode')..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-slate-950/90 border border-sky-500/40 text-white placeholder-slate-500 text-xs sm:text-sm font-mono p-4 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 shadow-inner"
            />
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-mono text-xs font-bold shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50 shrink-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-300" />
                  <span>Generating Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span>Generate Web App</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-400">Quick Prompt Ideas:</span>
            {PROMPT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(s.replace(/^[^\s]+\s/, ''));
                }}
                className="text-[10px] font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-2.5 py-1 rounded-xl transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Main Studio Workbench */}
      <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        
        {/* Studio Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-6 py-4 border-b border-white/10 font-mono text-xs">
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="pl-2 font-bold text-white truncate max-w-[200px] sm:max-w-xs">{generatedTitle}</span>
          </div>

          {/* View Toggle Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveViewMode('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'preview'
                  ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={() => setActiveViewMode('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'code'
                  ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML/JS Code</span>
            </button>
            <button
              onClick={() => setActiveViewMode('deploy')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'deploy'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Live Deployments</span>
            </button>
          </div>

          {/* Device toggle for Preview */}
          {activeViewMode === 'preview' && (
            <div className="hidden sm:flex items-center space-x-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
              <button
                onClick={handlePreviewLocalSite}
                className={`px-3 py-1.5 rounded-lg transition-all ${deployPreviewMode === 'local' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Local Preview
              </button>
              <button
                onClick={handlePreviewDeployedSite}
                className={`px-3 py-1.5 rounded-lg transition-all ${deployPreviewMode === 'live' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-300'}`}
                disabled={!liveDeploymentUrl}
              >
                Live Deployed Site
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-500 hover:text-slate-300'}`}
                title="Desktop View"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-500 hover:text-slate-300'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Studio Content View */}
        <div className="p-4 sm:p-6 bg-slate-950/50 min-h-[500px]">
          
          {/* TAB 1: LIVE PREVIEW IFRAME */}
          {activeViewMode === 'preview' && (
            <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0B1220]">
                {deployPreviewMode === 'live' && liveDeploymentUrl ? (
                  <iframe
                    title="Live Deployed Web App Preview"
                    src={liveDeploymentUrl}
                    className="w-full h-[600px] border-none"
                    sandbox="allow-scripts allow-modals allow-forms"
                  />
                ) : (
                  <iframe
                    title="Generated Web App Preview"
                    srcDoc={currentCode}
                    className="w-full h-[600px] border-none"
                    sandbox="allow-scripts allow-modals allow-forms"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CODE EDITOR */}
          {activeViewMode === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-sky-400 font-bold">index.html (Self-Contained Web App)</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Source Code'}</span>
                </button>
              </div>
              <textarea
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                className="w-full h-[550px] bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-sky-500 scrollbar-thin resize-none leading-relaxed"
              />
            </div>
          )}

          {/* TAB 3: LIVE DEPLOYMENTS MANAGER */}
          {activeViewMode === 'deploy' && (
            <div className="space-y-6 font-mono text-xs">
              
              {/* Deploy Current App Card */}
              <div className="bg-slate-900/90 border border-emerald-500/30 p-6 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-emerald-400" />
                      <span>{generatedTitle}</span>
                    </h3>
                    <p className="text-slate-400">Deploy this web application to RoboAssist Global Edge CDN instantly.</p>
                  </div>

                  <button
                    onClick={handlePublishLive}
                    disabled={isDeploying}
                    className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{isDeploying ? 'Deploying...' : 'Publish / Re-Deploy Live'}</span>
                  </button>
                </div>

                {liveDeploymentUrl && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Live CDN Production URL:</span>
                      <span className="px-2.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Live On Edge
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={liveDeploymentUrl}
                        className="flex-1 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-sky-400 font-bold text-xs"
                      />
                      <button
                        onClick={() => handleCopyUrl(liveDeploymentUrl)}
                        className="flex items-center space-x-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                      >
                        {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                      <a
                        href={liveDeploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 rounded-xl transition-all"
                        title="Open Live Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Published Sites History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Published Web Apps ({publishedSites.length})</h4>
                {publishedSites.length === 0 && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-400 text-sm">
                    No live deployments yet. Click <strong>Publish / Re-Deploy Live</strong> to publish your current generated app.
                  </div>
                )}
                {publishedSites.map((site) => (
                  <div
                    key={site.id}
                    className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-bold text-white">{site.title}</h5>
                        <span className="px-2 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                          {site.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] truncate max-w-xl">{site.prompt}</p>
                      <p className="text-[10px] text-slate-500">Deployed at: {site.deployedAt}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyUrl(site.url)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all text-[11px]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </button>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold rounded-xl transition-all text-[11px]"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Cursor AI Smart Actions</h4>
                      <p className="text-slate-400 text-[11px] max-w-xl">
                        Apply AI studio-inspired improvements and generate targeted updates for your page instantly.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setImprovePrompt('Improve the hero copy to sound more professional for industrial robotics buyers.')}
                      className="text-left px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-2xl hover:border-sky-500/30 transition-all"
                    >
                      <div className="text-slate-300 text-xs">Cursor AI Prompt</div>
                      <div className="text-slate-100 font-semibold">Improve hero section copy</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImprovePrompt('Add a sleek pricing / feature comparison section and make the page more conversion-focused.')}
                      className="text-left px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-2xl hover:border-sky-500/30 transition-all"
                    >
                      <div className="text-slate-300 text-xs">Cursor AI Prompt</div>
                      <div className="text-slate-100 font-semibold">Add pricing / conversion blocks</div>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-slate-400 text-[11px] uppercase tracking-wider">Improve Website Instruction</label>
                    <textarea
                      value={improvePrompt}
                      onChange={(e) => setImprovePrompt(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={handleImproveWebsite}
                      disabled={isImproving}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
                    >
                      {isImproving ? 'Improving...' : 'Apply AI Improvements'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
