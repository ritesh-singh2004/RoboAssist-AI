import React, { useState } from 'react';
import { X, Calendar, Clock, Bot, CheckCircle2, Sparkles } from 'lucide-react';

interface BookDemoModalProps {
  onClose: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('Dr. Rajesh Subramanian');
  const [email, setEmail] = useState('riteshwork952004@gmail.com');
  const [company, setCompany] = useState('Reliance Industry 4.0');
  const [fleetSize, setFleetSize] = useState('10 - 50 Robots');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-sky-500/30 p-6 sm:p-8 rounded-2xl max-w-md w-full space-y-6 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4 font-mono">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Demo Scheduled!</h3>
            <p className="text-xs text-slate-400">
              Our Senior Robotics Architect will connect with you at <strong className="text-sky-400">{email}</strong>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-sky-500 text-white font-bold rounded-xl text-xs"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 p-[2px] mx-auto shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full bg-[#0B1220] rounded-[14px] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-mono text-white">Book Live Fleet Demo</h3>
              <p className="text-xs text-slate-400">
                Experience 120 FPS FLIR thermal streams, YOLO vision, & ROS2 live controls.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Your Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Work Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Company / Organization:</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Estimated Fleet Size:</label>
                <select
                  value={fleetSize}
                  onChange={(e) => setFleetSize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  <option value="1 - 5 Robots">1 - 5 Robots</option>
                  <option value="10 - 50 Robots">10 - 50 Robots</option>
                  <option value="50+ Enterprise Fleet">50+ Enterprise Fleet</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition-all mt-2"
              >
                Schedule Private Demo
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
