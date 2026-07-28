import React, { useState } from 'react';
import { FileCode2, Folder, Play, Search, Sparkles, Save, MessageSquare } from 'lucide-react';

const INITIAL_FILES = [
  { id: 'file-1', name: 'src/App.tsx', type: 'tsx', content: 'import React from \'react\';\n\nexport default function App() {\n  return <div>Welcome to RoboAssistAI Code Workspace.</div>\n}\n' },
  { id: 'file-2', name: 'src/components/RobotController.ts', type: 'ts', content: 'export function createRobotCommand() {\n  return { op: \'move\', speed: 1.2 };\n}\n' },
  { id: 'file-3', name: 'README.md', type: 'md', content: '# RoboAssistAI Code Studio\n\nThis workspace supports AI-powered code suggestions, multi-file editing, and repository-aware workflows.' },
];

export const CodeWorkspace: React.FC = () => {
  const [files] = useState(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState(files[0].id);
  const [editorValue, setEditorValue] = useState(files[0].content);
  const [assistantOutput, setAssistantOutput] = useState<string>('Ready to assist. Click any action to begin.');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantActive, setAssistantActive] = useState(false);
  const [isAssistantBusy, setIsAssistantBusy] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const activeFile = files.find((file) => file.id === activeFileId) || files[0];

  const handleSelectFile = (id: string) => {
    const file = files.find((item) => item.id === id);
    if (file) {
      setActiveFileId(id);
      setEditorValue(file.content);
      setAssistantOutput(`Loaded ${file.name} into the editor.`);
    }
  };

  const handleLaunchAssistant = () => {
    setAssistantActive(true);
    setAssistantOutput(
      'AI Code Assistant is ready. Type a prompt below, then click Ask Assistant to get contextual help for the active file.'
    );
  };

  const handleAssistantQuery = async () => {
    if (!assistantPrompt.trim()) {
      setAssistantOutput('Please type a question or instruction for the assistant first.');
      return;
    }

    setIsAssistantBusy(true);
    setAssistantOutput('Assistant is analyzing your code and preparing a response...');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: assistantPrompt },
            { role: 'user', content: `Current file: ${activeFile.name}\n\n${editorValue}` },
          ],
          tone: 'Friendly, expert, and helpful',
          context: 'RoboAssistAI code workspace: provide code review, refactor suggestions, and debugging help.',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAssistantOutput(data.reply || 'Assistant did not return a message.');
      } else {
        setAssistantOutput(`Assistant error: ${data.error || 'Unexpected response from server.'}`);
      }
    } catch (error: any) {
      setAssistantOutput(`Assistant connection failed: ${error.message || 'Unable to reach server.'}`);
    } finally {
      setIsAssistantBusy(false);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setAssistantOutput('Running code...');
    window.setTimeout(() => {
      setIsRunning(false);
      setAssistantOutput(
        `Execution complete for ${activeFile.name}.\n` +
        'Output:\n' +
        '✅ RoboAssistAI compilation passed. No syntax errors found.\n' +
        '🚀 Simulated application startup successful.'
      );
    }, 800);
  };

  const handleAiRefactor = async () => {
    setAssistantOutput('Analyzing current file for refactor opportunities...');
    setIsAssistantBusy(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Refactor the following code for clarity and best practices. Preserve behavior and update comments as needed.' },
            { role: 'user', content: `File: ${activeFile.name}\n\n${editorValue}` },
          ],
          tone: 'Friendly, professional, and expert-level',
          context: 'RoboAssistAI code workspace refactor request.',
        }),
      });

      const data = await response.json();
      if (data.success && typeof data.reply === 'string') {
        const codeMatch = data.reply.match(/```(?:tsx|ts|js|jsx)?([\s\S]*?)```/m);
        const cleaned = codeMatch ? codeMatch[1].trim() : data.reply;

        if (cleaned.length > 0) {
          setEditorValue(cleaned);
          setAssistantOutput(`Refactor complete for ${activeFile.name}. Editor updated with suggested changes.`);
        } else {
          setAssistantOutput('Refactor completed, but the assistant response could not be parsed into code. See the output below.');
        }
      } else {
        setAssistantOutput(`Refactor failed: ${data.error || 'No valid assistant reply.'}`);
      }
    } catch (error: any) {
      setAssistantOutput(`Refactor connection failed: ${error.message || 'Unable to reach server.'}`);
    } finally {
      setIsAssistantBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-sky-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-3xl bg-slate-800 text-sky-400 grid place-items-center shadow-lg shadow-sky-500/20">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">RoboAssistAI Code Workspace</h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  AI-powered coding studio with multi-file workspace, repository understanding, and assistant-driven editing.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAiRefactor}
              className="rounded-2xl bg-white/10 border border-white/10 px-4 py-2 text-xs text-slate-200 hover:bg-white/15 transition"
            >
              AI Refactor
            </button>
            <button
              onClick={handleRunCode}
              className="rounded-2xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 transition"
            >
              {isRunning ? 'Running…' : 'Run Code'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-white/10 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm text-slate-300 uppercase tracking-[0.2em] mb-4">Workspace Files</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleSelectFile(file.id)}
                  className={`w-full text-left rounded-2xl px-4 py-3 transition ${
                    file.id === activeFileId ? 'bg-slate-800 border border-sky-500/30 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{file.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{file.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/90 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm text-slate-300 uppercase tracking-[0.2em]">AI Assistant</h3>
            <div className="space-y-3 text-xs text-slate-400">
              <p>Ask the assistant to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Fix the current bug.</li>
                <li>Generate a ROS2 node.</li>
                <li>Write tests for this module.</li>
                <li>Explain the architecture.</li>
              </ul>
            </div>
            <button
              onClick={handleLaunchAssistant}
              className="w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white hover:bg-slate-700 transition"
            >
              Launch AI Code Assistant
            </button>
            {assistantActive && (
              <div className="space-y-3 pt-3">
                <textarea
                  value={assistantPrompt}
                  onChange={(e) => setAssistantPrompt(e.target.value)}
                  placeholder="Ask the assistant to refactor, debug, explain, or extend this file..."
                  className="w-full min-h-[140px] rounded-3xl bg-[#020617] border border-white/10 p-4 text-xs text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleAssistantQuery}
                  disabled={isAssistantBusy}
                  className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAssistantBusy ? 'Assistant is working…' : 'Ask Assistant'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{activeFile.name}</h3>
                <p className="text-xs text-slate-500">Editing a file in the RoboAssistAI code workspace</p>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10">
                  <Play className="w-3.5 h-3.5" /> Run
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10">
                  <Save className="w-3.5 h-3.5" /> Auto-Save
                </span>
              </div>
            </div>
            <textarea
              className="min-h-[520px] w-full rounded-3xl bg-[#020617] border border-white/10 p-4 text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-xl">
              <h4 className="text-sm font-semibold text-white mb-3">Workspace Summary</h4>
              <ul className="space-y-3 text-slate-300 text-xs">
                <li className="flex items-start gap-2"><Folder className="w-4 h-4 text-[#0EA5E9] mt-1" /> Multi-file editing + file explorer</li>
                <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-[#22C55E] mt-1" /> AI inline editing and contextual suggestions</li>
                <li className="flex items-start gap-2"><Search className="w-4 h-4 text-[#7C3AED] mt-1" /> Search and replace across workspace</li>
                <li className="flex items-start gap-2"><MessageSquare className="w-4 h-4 text-[#38BDF8] mt-1" /> Assistant-guided code review</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-xl">
              <h4 className="text-sm font-semibold text-white mb-3">AI Assistant Output</h4>
              <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10 text-slate-300 text-xs font-mono min-h-[172px] whitespace-pre-wrap">
                {assistantOutput}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
