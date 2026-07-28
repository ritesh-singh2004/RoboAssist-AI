import React from 'react';
import { X, Play, Volume2, Shield, Activity } from 'lucide-react';

interface VideoModalProps {
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
      <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Futuristic Video Simulation Container */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
            alt="RoboAssistAI Video Reel"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Video Overlay Graphics */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-slate-900/80 w-fit px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ROBOASSIST AI PLATFORM SHOWCASE (4K 60FPS)</span>
            </div>

            <div className="space-y-2 max-w-lg">
              <h3 className="text-2xl font-bold font-mono text-white">
                Autonomous Quadrupeds & Humanoids in Action
              </h3>
              <p className="text-xs text-slate-300 font-sans">
                Watch Titan-X1 and Vulcan Humanoid execute thermal patrols, gas leak triages, and 3D SLAM spatial mapping in heavy refinery plants.
              </p>
            </div>
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-sky-500 text-white font-bold flex items-center space-x-1">
              <Play className="w-4 h-4 fill-white" />
              <span>PLAYING REEL</span>
            </button>
            <div className="flex items-center space-x-2 text-slate-400">
              <Volume2 className="w-4 h-4" />
              <span>FLIR Audio Active</span>
            </div>
          </div>

          <span className="text-sky-400">FPS: 60.0 | Latency: 12ms</span>
        </div>

      </div>
    </div>
  );
};
