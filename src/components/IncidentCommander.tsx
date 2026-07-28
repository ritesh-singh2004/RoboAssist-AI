import React, { useState } from 'react';
import {
  Sparkles,
  Video,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Zap,
  MessageSquare,
  Users,
  CheckSquare,
  ExternalLink,
  Bot
} from 'lucide-react';
import { Incident } from '../types';

interface IncidentCommanderProps {
  incidents: Incident[];
  onApproveActionItem: (incidentId: string, actionItemId: string) => void;
  onRunAiAnalysis: (incidentTitle: string, platform: string, transcript: string) => Promise<any>;
}

export const IncidentCommander: React.FC<IncidentCommanderProps> = ({
  incidents,
  onApproveActionItem,
  onRunAiAnalysis,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(incidents[0]);
  const [activePlatform, setActivePlatform] = useState<'Google Meet' | 'Zoom' | 'MS Teams' | 'Slack Huddles'>('Google Meet');
  const [customTranscript, setCustomTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  const handleRunAnalysis = async () => {
    if (!customTranscript.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await onRunAiAnalysis(selectedIncident.title, activePlatform, customTranscript);
      if (res && res.analysis) {
        setAiAnalysisResult(res.analysis);
      }
    } catch (err) {
      console.error('Error running AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderText = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (typeof val === 'object') {
      if (typeof val.hypothesis === 'string') {
        return val.confidence
          ? `${val.hypothesis} (${val.confidence}${typeof val.confidence === 'number' ? '%' : ''})`
          : val.hypothesis;
      }
      if (typeof val.text === 'string') return val.text;
      if (typeof val.fact === 'string') return val.fact;
      if (typeof val.description === 'string') return val.description;
      if (typeof val.summary === 'string') return val.summary;
      if (typeof val.statement === 'string') return val.statement;
      if (typeof val.cause === 'string') return val.cause;
      try {
        return JSON.stringify(val);
      } catch {
        return String(val);
      }
    }
    return String(val);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-white/10 text-purple-300 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
              <span>AI INCIDENT COMMANDER</span>
              <span className="px-3 py-1 text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-mono font-bold backdrop-blur-md">
                Whisper + LangGraph + Gemini
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Autonomous war-room assistant joining Google Meet, Teams, Zoom, & Slack Huddles for real-time incident triage.
            </p>
          </div>
        </div>

        {/* Integration Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {['Jira', 'Slack', 'PagerDuty', 'Grafana', 'Datadog', 'Prometheus'].map((tool) => (
            <span
              key={tool}
              className="px-3 py-1 text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10 rounded-full backdrop-blur-md"
            >
              ✓ {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Main War Room Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Meeting Join & Live Transcript */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-xs font-mono font-bold text-[#0EA5E9] uppercase">
              1. Select Platform War Room
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(['Google Meet', 'Zoom', 'MS Teams', 'Slack Huddles'] as const).map((plat) => (
                <button
                  key={plat}
                  onClick={() => setActivePlatform(plat)}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-mono transition-all backdrop-blur-md ${
                    activePlatform === plat
                      ? 'bg-white/15 border-white/30 text-purple-300 font-bold shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 mb-1 text-purple-400" />
                  <span>{plat}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Paste Meeting Transcript / Audio Log:
              </label>
              <textarea
                rows={5}
                value={customTranscript}
                onChange={(e) => setCustomTranscript(e.target.value)}
                placeholder="[Engineer] High temperature recorded on primary bearing... [AI] Analyzing historical vibration patterns..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0EA5E9] font-mono backdrop-blur-md"
              />
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !customTranscript.trim()}
                className="w-full mt-3 py-3 rounded-2xl bg-white text-black disabled:opacity-50 font-mono text-xs font-bold shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing via Gemini 3.6 Flash...' : 'Run AI Commander Analysis'}</span>
              </button>
            </div>
          </div>

          {/* Integration Status Links */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-3 font-mono text-xs shadow-2xl">
            <h3 className="font-bold text-white mb-2">Connected Enterprise Services</h3>
            <div className="flex items-center justify-between text-slate-300">
              <span>Jira Ticket:</span>
              <a href="#" className="text-[#0EA5E9] hover:underline flex items-center space-x-1">
                <span>{selectedIncident.integrations.jiraKey}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Slack Channel:</span>
              <span className="text-purple-300">{selectedIncident.integrations.slackChannel}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>PagerDuty Alert:</span>
              <span className="text-rose-400">{selectedIncident.integrations.pagerDutyAlertId}</span>
            </div>
          </div>

        </div>

        {/* Right Column: AI Extraction (Facts, Hypotheses, Action Items, Executive Summary) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="px-3 py-1 text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full font-bold backdrop-blur-md">
                  SEVERITY: {selectedIncident.severity}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {selectedIncident.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-[#22C55E] bg-[#22C55E]/10 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4" />
                <span>HUMAN APPROVAL WORKFLOW</span>
              </div>
            </div>

            {/* AI Facts & Hypotheses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 backdrop-blur-md">
                <h4 className="text-xs font-mono font-bold text-[#0EA5E9] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ESTABLISHED FACTS</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(aiAnalysisResult?.facts || selectedIncident.facts).map((fact: any, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-[#0EA5E9] font-bold">•</span>
                      <span>{renderText(fact)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 backdrop-blur-md">
                <h4 className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>PROBABLE HYPOTHESES</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(aiAnalysisResult?.hypotheses || selectedIncident.hypotheses).map((hypo: any, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{renderText(hypo)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Human Approved Action Items */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 backdrop-blur-md">
              <h4 className="text-xs font-mono font-bold text-purple-300 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>ACTION ITEMS & APPROVALS</span>
                </span>
                <span className="text-[10px] text-slate-400">Click checkmark to approve</span>
              </h4>

              <div className="space-y-2">
                {(aiAnalysisResult?.actionItems || selectedIncident.actionItems).map((item: any, idx: number) => {
                  const itemText = renderText(item?.text || item);
                  const assigneeText = renderText(item?.assignee || 'Assigned');
                  return (
                    <div
                      key={item?.id || idx}
                      className="flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-white/10 text-xs text-slate-200 font-mono backdrop-blur-md"
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => item?.id && onApproveActionItem(selectedIncident.id, item.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            item?.done
                              ? 'bg-[#22C55E] border-[#22C55E] text-black'
                              : 'border-white/20 hover:border-[#22C55E]'
                          }`}
                        >
                          {item?.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <span className={item?.done ? 'line-through text-slate-500' : ''}>{itemText}</span>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-[#0EA5E9] font-bold">
                        {assigneeText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Executive & Technical Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1 backdrop-blur-md">
                <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase">Executive Summary</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {renderText(aiAnalysisResult?.executiveSummary || selectedIncident.executiveSummary)}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1 backdrop-blur-md">
                <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase">Technical Breakdown</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {renderText(aiAnalysisResult?.technicalSummary || selectedIncident.technicalSummary)}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
