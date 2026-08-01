import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  Mic,
  MicOff,
  Speaker,
  Trash2,
  RefreshCw,
  Code,
  Terminal,
  Zap,
  Globe,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const CHAT_STORAGE_KEY = 'roboassist_chat_messages';
const CHAT_VERSION_KEY = 'roboassist_chat_version';
const CHAT_VERSION = 'v2';

export const AiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedVersion = localStorage.getItem(CHAT_VERSION_KEY);
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedVersion === CHAT_VERSION && saved) return JSON.parse(saved);
      localStorage.setItem(CHAT_VERSION_KEY, CHAT_VERSION);
    } catch (e) {}
    return [
      {
        id: 'msg-1',
        role: 'assistant',
        content: `Hey there! I’m RoboAssistAI — the unified AI operating platform for AI, robotics, and autonomous systems.\n\nI can help you with:\n- AI code completion, generation, debugging, and Git-aware repository workflows.\n- Multi-LLM orchestration, model fine-tuning, dataset management, and API platform design.\n- ROS2 integration, fleet control, mission planning, voice commands, and autonomous monitoring.\n\nTell me what you want to build today, and I’ll provide secure, scalable, production-ready guidance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState('Senior Robotics & Full-Stack Architect');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      localStorage.setItem(CHAT_VERSION_KEY, CHAT_VERSION);
    } catch (e) {}
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recognition setup
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsgText = inputMessage.trim();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          tone: selectedPersona,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.success && data.reply ? data.reply : `Sorry, I ran into an issue connecting to the AI engine. ${data.error || ''}`.trim();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.success && data.reply) {
        speakText(data.reply);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I ran into an issue connecting to the AI engine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Clear entire chat conversation history?')) {
      const resetMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation history cleared. How can I help you next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
    }
  };

  const STARTER_PROMPTS = [
    '🐍 Write a ROS2 Python publisher node for ultrasonic telemetry',
    '🌐 How do I deploy a website live on RoboAssist Web Studio?',
    '🔑 Show me how to generate and use API Keys in cURL',
    '⚡ Explain 3D SLAM pointcloud mapping algorithms'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              CHATGPT & GEMINI POWERED
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              ROS2 & WEB STUDIO AI
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-purple-400" />
            <span>ROBOASSIST AI CHATBOT</span>
          </h2>
          <p className="text-xs text-slate-300">
            Ask technical robotics questions, debug ROS2 nodes, or generate website code in real time with AI.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="bg-slate-950 border border-purple-500/30 text-purple-300 text-xs font-mono p-2.5 rounded-xl focus:outline-none"
          >
            <option value="Senior Robotics & Full-Stack Architect">Architect Persona</option>
            <option value="ROS2 Python Specialist">ROS2 Python Expert</option>
            <option value="Web Studio Full-Stack Engineer">Web Dev Engineer</option>
            <option value="Industrial Incident Commander">Incident Commander</option>
          </select>

          <button
            onClick={handleClearChat}
            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface Window */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col h-[650px] overflow-hidden backdrop-blur-xl">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((m) => {
            const isAi = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isAi
                    ? 'bg-gradient-to-tr from-purple-600 to-sky-500 text-white border-purple-400/40 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}>
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Content Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs font-sans leading-relaxed space-y-2 border ${
                  isAi
                    ? 'bg-slate-950/90 text-slate-100 border-purple-500/20 shadow-xl'
                    : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-400/30 shadow-lg shadow-sky-500/20'
                }`}>
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1 text-[10px] font-mono text-slate-400">
                    <span className="font-bold text-purple-300">{isAi ? 'RoboAssist AI' : 'You'}</span>
                    <div className="flex items-center space-x-2">
                      <span>{m.timestamp}</span>
                      <button
                        onClick={() => handleCopyMessage(m.content, m.id)}
                        className="p-1 hover:text-white transition-all"
                        title="Copy text"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Body text formatted */}
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {m.content}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-950 p-4 rounded-3xl border border-purple-500/20 text-xs font-mono text-purple-300 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span>RoboAssist AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Starter Prompts Bar if chat is short */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 bg-slate-950/60 border-t border-white/5 flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(promptText.replace(/^[^\s]+\s/, ''))}
                className="text-[10px] font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
              >
                {promptText}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-white/10 flex items-center gap-3">
          
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
            title="Voice Input (Speech to Text)"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => speakText('RoboAssist is ready to help you. Ask me anything!')}
            className={`p-3 rounded-2xl border transition-all ${
              isSpeaking
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
            title="Play AI Voice Response"
          >
            <Speaker className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder={isListening ? 'Listening... Speak now!' : 'Ask RoboAssist AI anything... (e.g. Write ROS2 python code or generate web app)'}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm font-mono p-3.5 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
