import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Terminal,
  FileCode2,
  Trash2,
  Copy,
  Share2,
  Play,
  Save,
  Sparkles,
  Github,
  Check,
  Cpu,
  Layers,
  FileText
} from 'lucide-react';
import { Project, RobotType, MissionType } from '../types';

interface ProjectBuilderProps {
  projects: Project[];
  onCreateProject: (proj: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onDeployProject: (projectId: string) => void;
  onGenerateAiDocs: (projectName: string, robotType: string, mission: string, desc: string, docType: string) => Promise<string>;
}

export const ProjectBuilder: React.FC<ProjectBuilderProps> = ({
  projects,
  onCreateProject,
  onDeleteProject,
  onDeployProject,
  onGenerateAiDocs,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Form State
  const [projectName, setProjectName] = useState('Project Titan Thermal Patrol');
  const [description, setDescription] = useState('Autonomous ROS2 thermal patrol pipeline for heavy oil refinery valves.');
  const [robotType, setRobotType] = useState<RobotType>('Quadruped');
  const [mission, setMission] = useState<MissionType>('Inspection');
  const [repositoryUrl, setRepositoryUrl] = useState('https://github.com/roboassist/titan-thermal-patrol');
  const [deploymentTarget, setDeploymentTarget] = useState<'AWS' | 'Azure' | 'Google Cloud' | 'Docker' | 'Kubernetes' | 'Vercel' | 'Railway'>('Kubernetes');
  const [envVars, setEnvVars] = useState([{ key: 'THERMAL_THRESHOLD_C', value: '60' }]);
  
  // Generated AI Docs State
  const [generatedDocsContent, setGeneratedDocsContent] = useState<string | null>(null);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<'README' | 'API Docs' | 'Architecture'>('README');

  const selectedProj = projects.find((p) => p.id === selectedProjectId);

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const handleSaveProject = () => {
    onCreateProject({
      name: projectName,
      description,
      robotType,
      mission,
      repositoryUrl,
      deploymentTarget,
      environmentVars: envVars,
      aiModels: ['YOLOv11-Industrial', 'SLAM-Nav2-3D'],
      status: 'Draft',
    });
    setIsCreatingNew(false);
  };

  const handleGenerateDocs = async (docType: 'README' | 'API Docs' | 'Architecture') => {
    setIsGeneratingDocs(true);
    setActiveDocTab(docType);
    try {
      const docStr = await onGenerateAiDocs(
        selectedProj?.name || projectName,
        selectedProj?.robotType || robotType,
        selectedProj?.mission || mission,
        selectedProj?.description || description,
        docType
      );
      setGeneratedDocsContent(docStr);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDocs(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-white/10 text-[#0EA5E9] border border-white/10 backdrop-blur-md">
            <Boxes className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
              <span>ROBOTICS PROJECT BUILDER</span>
              <span className="px-3 py-1 text-[10px] bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30 rounded-full font-mono font-bold backdrop-blur-md">
                ROS2 + AI Models
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Configure, build, deploy, & auto-generate AI documentation for robotics projects.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingNew(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-black font-mono text-xs font-bold shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Robotics Project</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List of Projects */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">Existing Projects</h3>
          
          {projects.map((p) => {
            const isSelected = p.id === selectedProjectId && !isCreatingNew;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProjectId(p.id);
                  setIsCreatingNew(false);
                  setGeneratedDocsContent(null);
                }}
                className={`cursor-pointer p-4.5 rounded-2xl border transition-all backdrop-blur-md shadow-xl ${
                  isSelected
                    ? 'bg-white/15 border-white/30 text-white ring-1 ring-[#0EA5E9]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white">{p.name}</h4>
                  <span className={`px-2.5 py-0.5 text-[9px] font-mono rounded-full font-bold ${
                    p.status === 'Deployed' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30' : 'bg-white/10 text-slate-300 border border-white/10'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1">{p.description}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#0EA5E9]">
                  <span>{p.robotType}</span>
                  <span>Target: {p.deploymentTarget}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Details & AI Docs Generator */}
        <div className="lg:col-span-2 space-y-6">
          
          {isCreatingNew ? (
            /* CREATE NEW FORM */
            <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-5 shadow-2xl">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Create New Robotics Project
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 mb-1">Project Name:</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#0EA5E9] backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Robot Hardware Type:</label>
                  <select
                    value={robotType}
                    onChange={(e) => setRobotType(e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-[#0EA5E9] backdrop-blur-md"
                  >
                    {['Quadruped', 'Bipedal Humanoid', 'Industrial Robotic Arm', 'Autonomous Rover', 'Heavy Payload Exoskeleton', 'Inspection Drone'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Mission Protocol:</label>
                  <select
                    value={mission}
                    onChange={(e) => setMission(e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-[#0EA5E9] backdrop-blur-md"
                  >
                    {['Inspection', 'Surveillance', 'Emergency Response', 'Material Handling'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Deployment Target:</label>
                  <select
                    value={deploymentTarget}
                    onChange={(e) => setDeploymentTarget(e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-[#0EA5E9] backdrop-blur-md"
                  >
                    {['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Vercel', 'Railway'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">GitHub Repository URL:</label>
                <input
                  type="text"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:border-[#0EA5E9] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#0EA5E9] backdrop-blur-md"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-mono hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold shadow-xl hover:scale-105 transition-all"
                >
                  Save Project
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE PROJECT DETAILS & AI DOC GENERATOR */
            selectedProj && (
              <div className="space-y-6">
                
                <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl space-y-4 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">{selectedProj.name}</h3>
                      <p className="text-xs text-slate-300">{selectedProj.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onDeployProject(selectedProj.id)}
                        className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold shadow-xl hover:scale-105 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Deploy Now</span>
                      </button>
                      <button
                        onClick={() => onDeleteProject(selectedProj.id)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-400 border border-white/10 backdrop-blur-md"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* AI Documentation Generator Buttons */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-purple-300 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>GENERATE AI DOCUMENTATION (GEMINI 3.6 FLASH)</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(['README', 'API Docs', 'Architecture'] as const).map((docType) => (
                        <button
                          key={docType}
                          onClick={() => handleGenerateDocs(docType)}
                          disabled={isGeneratingDocs}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-300 border border-white/10 text-xs font-mono font-bold transition-all disabled:opacity-50 backdrop-blur-md"
                        >
                          Generate {docType}
                        </button>
                      ))}
                    </div>

                    {isGeneratingDocs && (
                      <p className="text-xs font-mono text-purple-400 animate-pulse">
                        Generating full production markdown documentation...
                      </p>
                    )}

                    {generatedDocsContent && (
                      <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-white/10 max-h-80 overflow-y-auto backdrop-blur-md">
                        <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                          <span className="text-xs font-mono text-[#0EA5E9] font-bold">{activeDocTab} Output</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(generatedDocsContent)}
                            className="text-[10px] text-slate-300 hover:text-white flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Markdown</span>
                          </button>
                        </div>
                        <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {generatedDocsContent}
                        </pre>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};
