import React from 'react';
import {
  Bot,
  Github,
  Linkedin,
  Youtube,
  Twitter,
  Instagram,
  ShieldCheck,
  Mail,
  MapPin,
  Phone,
  Radio
} from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#0B1220]/90 backdrop-blur-2xl border-t border-white/10 text-slate-400 font-sans text-xs relative z-20">
      
      {/* Bottom Info Ticker Bar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Partnered with</span>
          <span className="text-xs font-mono font-bold tracking-widest text-white/70">NVIDIA ROBOTICS / ROS2</span>
        </div>
        <div className="flex-1 overflow-hidden whitespace-nowrap text-[10px] font-mono text-[#22C55E]/80 flex items-center gap-6">
          <span>[LOG]: PACKET_LOSS &lt; 0.01%</span>
          <span>[LOG]: LATENCY 14ms</span>
          <span>[LOG]: NODE_01_HEALTH STATUS_NORMAL</span>
          <span>[LOG]: SLAM_SYNC_COMPLETE</span>
          <span>[LOG]: OBSTACLE_AVOIDANCE_RECALIBRATED</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span className="text-[#0EA5E9] font-bold">INDIA v1.0</span>
          <div className="w-px h-3 bg-white/20" />
          <span>HQ: KANPUR</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#22C55E] p-[1.5px] shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#0EA5E9]" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white">
                RoboAssist<span className="text-[#0EA5E9]">AI</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Building intelligent autonomous robots that improve safety, productivity, and operational efficiency across heavy industries. India’s leading AI robotics platform for Industry 4.0.
            </p>

            <div className="flex items-center space-x-2 text-xs font-mono text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span>All Systems Operational (99.99% Uptime)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors">Fleet Telemetry</button></li>
              <li><button onClick={() => setCurrentView('incident')} className="hover:text-white transition-colors">AI Incident Commander</button></li>
              <li><button onClick={() => setCurrentView('projects')} className="hover:text-white transition-colors">Project Builder</button></li>
              <li><button onClick={() => setCurrentView('deployments')} className="hover:text-white transition-colors">CI/CD Deployments</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('docs')} className="hover:text-white transition-colors">API Documentation</button></li>
              <li><button onClick={() => setCurrentView('docs')} className="hover:text-white transition-colors">ROS2 Bridge SDK</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog & News</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Connect</h4>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-sky-500/30 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-sky-500/30 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-rose-500/30 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-sky-400/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            {/* Contact cards */}
            <div className="space-y-2 pt-1">

              {/* Email */}
              <a
                href="mailto:roboticsdevelopindia@gmail.com"
                className="group flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-sky-500/10 border border-white/8 hover:border-sky-500/30 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-sky-500/25 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Email</p>
                  <p className="text-[10px] text-slate-300 group-hover:text-sky-300 transition-colors font-mono whitespace-nowrap leading-tight">
                    roboticsdevelopindia@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+919199326333"
                className="group flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/8 hover:border-emerald-500/30 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/25 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Phone</p>
                  <p className="text-[11px] text-slate-300 group-hover:text-emerald-300 transition-colors font-mono">
                    +91 9199326333
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="group flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/8">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Address</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Triveni Apartment,<br />
                    Near ESI Hospital, India
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} RoboAssistAI Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security Audit</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
