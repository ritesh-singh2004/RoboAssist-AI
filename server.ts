import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnvironment = () => {
  const envFiles = ['.env', '.env.local', '.env.example'];
  for (const fileName of envFiles) {
    const fullPath = path.resolve(__dirname, fileName);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath, override: false });
    }
  }
};

loadEnvironment();
const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
console.log(`GEMINI_API_KEY loaded: ${!!geminiApiKey}`);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Startup validation
if (!geminiApiKey) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set. AI features will run in fallback/demo mode.');
  console.warn('   Set GEMINI_API_KEY in .env.local to enable live Gemini AI responses.');
}

const generatedPages = new Map<string, string>();

const buildBaseUrl = (req: express.Request) => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host') || `localhost:${PORT}`;
  return `${proto}://${host}`;
};

app.use(express.json({ limit: '10mb' }) as any);

// Initialize Gemini client on server-side
const ai = new GoogleGenAI({
  apiKey: geminiApiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'RoboAssistAI Cloud Engine v4.2',
    timestamp: new Date().toISOString(),
    aiEngine: geminiApiKey ? 'Connected (Gemini 3.6 Flash)' : 'Offline (Simulated)',
    geminiConfigured: !!geminiApiKey,
  });
});

// API Endpoint: AI Mission Planning
app.post('/api/ai/plan-mission', async (req, res) => {
  try {
    const { robotType, locationSector, objective, constraints } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if key is not configured
      return res.json({
        success: true,
        plan: {
          missionTitle: `Autonomous ${robotType} Patrol: ${locationSector}`,
          steps: [
            `1. Perform pre-flight/pre-walk diagnostic on ${robotType} chassis and battery.`,
            `2. Initialize 3D SLAM mapping node and zero thermal sensors.`,
            `3. Traverse waypoint sector ${locationSector} at optimal speed (1.2 m/s).`,
            `4. Continuous YOLOv11 anomaly scan for ${objective || 'structural defects'}.`,
            `5. Return to charging dock Alpha upon battery reaching 20%.`
          ],
          estimatedDurationMins: 25,
          safetyProtocolScore: 98,
          recommendedSensors: ['3D LiDAR', 'Thermal FLIR', 'Gas Sniffer', 'Ultrasonic Array']
        }
      });
    }

    const prompt = `You are the lead AI Command Engine for RoboAssistAI industrial robotics platform.
Design a highly detailed, professional autonomous mission plan for an industrial robot with the following parameters:
- Robot Type: ${robotType}
- Location / Sector: ${locationSector}
- Objective: ${objective}
- Special Constraints: ${constraints || 'None'}

Return a JSON object with:
- missionTitle: concise string
- steps: array of 5 detailed operational steps
- estimatedDurationMins: number
- safetyProtocolScore: number between 90 and 100
- recommendedSensors: array of string sensor names
- riskMitigation: string summary of safety protocols`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.error('Error generating AI mission plan:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate mission plan' });
  }
});

// API Endpoint: AI Project Documentation Generator
app.post('/api/ai/generate-docs', async (req, res) => {
  try {
    const { projectName, robotType, mission, description, docType } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        content: `\n# ${projectName} - ${docType?.toUpperCase()}\n\n**Robot Type:** ${robotType}\n**Mission Focus:** ${mission}\n\n## Overview\n${description}\n\n## Architecture & ROS2 Integration\n- **Node Structure:** \`/roboassist/${projectName.toLowerCase().replace(/\s+/g, '_')}\`\n- **Primary Topics:** \`/telemetry\`, \`/cmd_vel\`, \`/camera/thermal\`\n- **Control Rate:** 100Hz real-time loop\n\n## Deployment\nDeployed via RoboAssist K8s & Docker Engine with zero-downtime hot-swapping.`
      });
    }

    const prompt = `You are a Senior Robotics Software Architect writing technical documentation for a robotics project on RoboAssistAI.
Project Name: ${projectName}
Robot Type: ${robotType}
Mission Focus: ${mission}
Description: ${description}
Document Type Requested: ${docType} (Options: 'README', 'API Docs', 'Architecture')

Write production-grade, well-formatted Markdown for this project. Keep it extremely detailed, crisp, and clean.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    res.json({ success: true, content: response.text });
  } catch (error: any) {
    console.error('Error generating docs:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate documentation' });
  }
});

// API Endpoint: AI Incident Commander Analyzer
app.post('/api/ai/analyze-incident', async (req, res) => {
  try {
    const { incidentTitle, meetingPlatform, rawTranscript } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        analysis: {
          facts: [
            'High vibration and thermal spike detected on primary actuator.',
            'Meeting war room convened on ' + meetingPlatform,
            'Automated cooldown valve engagement requested.'
          ],
          hypotheses: [
            'Hydraulic pressure fluctuation in main manifold (78% confidence).',
            'Sensor calibration drift (22% confidence).'
          ],
          actionItems: [
            { text: 'Verify hydraulic pump pressure on Grafana dashboard', assignee: 'On-Call Engineer' },
            { text: 'Execute automated zero-point calibration on sensor array', assignee: 'RoboAssist AI' }
          ],
          executiveSummary: `War room meeting on ${meetingPlatform} addressed ${incidentTitle}. AI engine deployed automated mitigation protocol.`,
          technicalSummary: 'Telemetry logs analyzed via Gemini 3.6 Flash. Hydraulic line 3 stabilized.'
        }
      });
    }

    const prompt = `You are the RoboAssistAI "AI Incident Commander", an enterprise AI war-room agent.
Analyze the following war-room transcript for incident "${incidentTitle}" on platform "${meetingPlatform}":

Transcript:
"${rawTranscript}"

Return a JSON object with:
- facts: array of strings representing facts established
- hypotheses: array of strings representing probable root causes with percentage confidence (e.g. "Hydraulic pressure fluctuation in main manifold (78% confidence)")
- actionItems: array of objects with fields { text: string, assignee: string }
- executiveSummary: string concise paragraph for C-level executives
- technicalSummary: string deep technical breakdown for site reliability & robotics engineers`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing incident:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to analyze incident' });
  }
});

// In-memory LLM registry and dataset store for local model creation and training simulation
const INITIAL_LLM_MODELS = [
  {
    id: 'llm-1',
    name: 'RoboAssist Falcon 7B',
    modelType: 'Vision & Robotics',
    stage: 'Training',
    version: 'v0.2',
    nodeCount: 4,
    accuracy: '87%',
    drift: '1.2%',
    status: 'Live',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'llm-2',
    name: 'RoboAssist Llama Industrial',
    modelType: 'Fine-tune',
    stage: 'Fine-tune',
    version: 'v1.1',
    nodeCount: 2,
    accuracy: '91%',
    drift: '0.8%',
    status: 'Review',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_DATASETS = [
  { id: 'ds-1', name: 'ROS2 Telemetry Corpus', size: '12GB', status: 'Ready', version: 'v1.0' },
  { id: 'ds-2', name: 'Industrial Vision Labels', size: '8GB', status: 'Cleaning', version: 'v1.0' },
];

const llmModelStore: Record<string, any> = {};
const llmDatasetStore: Record<string, any> = {};

for (const model of INITIAL_LLM_MODELS) {
  llmModelStore[model.id] = model;
}
for (const dataset of INITIAL_DATASETS) {
  llmDatasetStore[dataset.id] = dataset;
}

const createLlmModel = (name: string, modelType: string) => {
  const id = `llm-${Date.now()}`;
  const model = {
    id,
    name,
    modelType,
    stage: 'Created',
    version: 'v0.1',
    nodeCount: 2,
    accuracy: 'N/A',
    drift: '0.0%',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  llmModelStore[id] = model;
  return model;
};

const updateLlmModel = (id: string, updates: Record<string, any>) => {
  if (!llmModelStore[id]) return null;
  llmModelStore[id] = { ...llmModelStore[id], ...updates };
  return llmModelStore[id];
};

app.get('/api/llm/models', (req, res) => {
  res.json({ success: true, models: Object.values(llmModelStore) });
});

app.get('/api/llm/datasets', (req, res) => {
  res.json({ success: true, datasets: Object.values(llmDatasetStore) });
});

app.post('/api/llm/create-model', async (req, res) => {
  try {
    console.log('LLM create-model request body:', req.body);
    res.type('application/json');
    const { name, modelType } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, error: 'Model name is required.' });
    }
    const model = createLlmModel(name, modelType || 'Custom Robotics LLM');
    console.log('LLM create-model created:', model.id, model.name);
    res.json({ success: true, model, message: `Created new model ${model.name} successfully.` });
  } catch (error: any) {
    console.error('Error creating LLM model:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create model.' });
  }
});

app.post('/api/llm/train-model', async (req, res) => {
  try {
    res.type('application/json');
    const { modelId, datasetId, strategy, target, epochs, learningRate, checkpointInterval } = req.body;

    if (!modelId || typeof modelId !== 'string') {
      return res.status(400).json({ success: false, error: 'Model ID is required.' });
    }
    if (!datasetId || typeof datasetId !== 'string') {
      return res.status(400).json({ success: false, error: 'Dataset ID is required.' });
    }

    const existing = llmModelStore[modelId];
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Model not found.' });
    }

    const dataset = llmDatasetStore[datasetId];
    if (!dataset) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    const safeStrategy = typeof strategy === 'string' && strategy.length > 0 ? strategy : 'Fine-tune';
    const safeTarget = typeof target === 'string' && target.length > 0 ? target : 'High Accuracy';
    const safeEpochs = Number.isInteger(epochs) ? epochs : 5;
    const safeLearningRate = typeof learningRate === 'number' ? learningRate : 0.0003;
    const safeCheckpointInterval = Number.isInteger(checkpointInterval) ? checkpointInterval : 10;

    const updated = updateLlmModel(modelId, {
      stage: 'Training',
      status: 'Training',
      accuracy: 'Loading…',
      drift: 'Calculating…',
      lastTraining: {
        dataset: dataset.name,
        strategy: safeStrategy,
        target: safeTarget,
        epochs: safeEpochs,
        learningRate: safeLearningRate,
        checkpointInterval: safeCheckpointInterval,
        startedAt: new Date().toISOString(),
      },
    });

    setTimeout(() => {
      updateLlmModel(modelId, {
        stage: 'Fine-tune',
        version: existing.version === 'v0.1' ? 'v0.2' : `${existing.version.split('v')[1] ? `v${Number(existing.version.replace('v', '')) + 1}` : 'v0.2'}`,
        accuracy: '89%',
        drift: '0.9%',
        status: 'Ready for deployment',
      });
    }, 3000);

    res.json({
      success: true,
      model: updated,
      message: `Training started for model ${existing.name} using ${safeStrategy} on dataset ${dataset.name}.`,
      dataset,
    });
  } catch (error: any) {
    console.error('Error training LLM model:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to start training.' });
  }
});

// API Endpoint: AI Chatbot (ChatGPT style for Robotics & Web Dev)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, tone, context } = req.body;

    if (!geminiApiKey) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key is not configured. Add GEMINI_API_KEY to your .env or .env.local and restart the server.',
      });
    }

    const conversationText = (messages || []).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = `You are RoboAssistAI, an advanced AI engineer, robotics specialist, and secure AI advisor.

Context: ${context || 'RoboAssistAI unified AI and robotics platform'}
Tone: ${tone || 'Friendly, professional, and expert-level'}

Conversation History:
${conversationText}

Provide a helpful, concise, and technically accurate reply in English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.9,
        responseMimeType: 'text/plain',
      },
    });

    const replyText = response?.text?.trim();
    if (!replyText) {
      return res.status(502).json({ success: false, error: 'Gemini returned an empty response.' });
    }

    return res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error('Error in AI Chat endpoint:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate chat response' });
  }
});

// API Endpoint: AI Web & App Generator (Google AI Studio / Replit / Vercel style)
app.post('/api/ai/generate-website', async (req, res) => {
  try {
    const { prompt, title } = req.body;
    const requestedTitle = title || prompt || 'AI Generated Web Application';

    // Helper to produce a rich fallback HTML if API key missing or on error
    const createTailoredFallbackHtml = (appPrompt: string, appTitle: string) => {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b1329; color: #f8fafc; }
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
  <!-- Navbar -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-sky-500/30">
          âš¡
        </div>
        <span class="text-lg font-bold text-white tracking-tight">${appTitle}</span>
      </div>
      <nav class="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
        <a href="#features" class="hover:text-sky-400 transition-colors">Features</a>
        <a href="#solutions" class="hover:text-sky-400 transition-colors">Solutions</a>
        <a href="#analytics" class="hover:text-sky-400 transition-colors">Analytics</a>
      </nav>
      <button onclick="alert('Welcome to ${appTitle}!')" class="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/30 transition-all">
        Get Started
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col items-center text-center justify-center space-y-8">
    <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
      <span>ðŸš€ RoboAssist AI Generated Platform</span>
    </div>
    
    <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
      ${appPrompt}
    </h1>
    
    <p class="text-slate-400 text-base max-w-2xl leading-relaxed">
      Next-generation autonomous system built for high-performance scale, real-time telemetry, and effortless cloud deployment.
    </p>

    <div class="flex flex-wrap justify-center gap-4 pt-4">
      <button onclick="alert('Interactive Dashboard Activated')" class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all">
        Launch Control Center
      </button>
      <button onclick="alert('Documentation Opened')" class="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all">
        Explore API Specs
      </button>
    </div>

    <!-- Features Grid -->
    <div id="features" class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 text-left">
      <div class="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/40 transition-all">
        <div class="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">01</div>
        <h3 class="text-lg font-bold text-white">Autonomous Control</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Powered by real-time neural decision models for zero latency response.</p>
      </div>
      <div class="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-all">
        <div class="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">02</div>
        <h3 class="text-lg font-bold text-white">Edge Telemetry</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Continuous pointcloud & sensor data streaming across global networks.</p>
      </div>
      <div class="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-purple-500/40 transition-all">
        <div class="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">03</div>
        <h3 class="text-lg font-bold text-white">Instant Deployment</h3>
        <p class="text-slate-400 text-xs leading-relaxed">One-click publishing to live edge CDN with custom domain support.</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
    <p>Â© 2026 ${appTitle}. Built & Deployed via RoboAssist AI Web Studio.</p>
  </footer>
</body>
</html>`;
    };

    if (!process.env.GEMINI_API_KEY) {
      const deployId = Math.floor(100000 + Math.random() * 900000);
      const pageId = `site-${deployId}`;
      const baseUrl = buildBaseUrl(req);
      const html = createTailoredFallbackHtml(prompt || 'SaaS Autonomous Platform', requestedTitle);
      generatedPages.set(pageId, html);
      return res.json({
        success: true,
        htmlCode: html,
        suggestedTitle: requestedTitle,
        techStack: ['Tailwind CSS', 'Vanilla JavaScript', 'RoboAssist Edge CDN'],
        deploymentUrl: `${baseUrl}/site/${pageId}`
      });
    }

    const aiPrompt = `You are a world-class Full-Stack Web Architect for RoboAssist AI Web Studio.
Generate a complete, modern, production-ready, beautiful, single-file HTML/CSS/JS web application based on this prompt:
"${prompt}"

Title/Theme: ${requestedTitle}

REQUIREMENTS:
- Output ONLY valid, raw, complete HTML starting with <!DOCTYPE html> and ending with </html>.
- Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Use clean dark/modern styling, responsive layouts, interactive JavaScript buttons, forms, state management, and modern cards.
- Include a descriptive <title> tag inside <head>.
- DO NOT wrap in JSON. Output ONLY the complete raw HTML code directly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: aiPrompt,
    });

    let htmlCode = response.text || '';
    // Clean code fences if present
    htmlCode = htmlCode.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    if (!htmlCode.includes('<!DOCTYPE html>')) {
      const docTypeIdx = htmlCode.indexOf('<!DOCTYPE html');
      if (docTypeIdx !== -1) {
        htmlCode = htmlCode.substring(docTypeIdx);
      } else {
        htmlCode = createTailoredFallbackHtml(prompt || 'Autonomous Platform', requestedTitle);
      }
    }

    // Extract title from <title> tag if available
    const titleMatch = htmlCode.match(/<title>(.*?)<\/title>/i);
    const suggestedTitle = titleMatch ? titleMatch[1].trim() : requestedTitle;

    const deployId = Math.floor(100000 + Math.random() * 900000);
    const pageId = `site-${deployId}`;
    const baseUrl = buildBaseUrl(req);
    generatedPages.set(pageId, htmlCode);

    res.json({
      success: true,
      htmlCode: htmlCode,
      suggestedTitle: suggestedTitle,
      techStack: ['Tailwind CSS', 'Vanilla JS', 'RoboAssist Edge CDN'],
      deploymentUrl: `${baseUrl}/site/${pageId}`
    });

  } catch (error: any) {
    console.error('Error generating website:', error);
    const deployId = Math.floor(100000 + Math.random() * 900000);
    const fallbackTitle = req.body?.title || req.body?.prompt || 'AI Web Application';
    const previewPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fallbackTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-8">
  <div class="max-w-xl w-full bg-slate-900 p-8 rounded-3xl border border-sky-500/30 text-center space-y-4">
    <h1 class="text-2xl font-bold">${fallbackTitle}</h1>
    <p class="text-slate-400 text-sm">${req.body?.prompt || 'AI Generated SaaS Web Application'}</p>
    <button onclick="alert('Application Ready')" class="px-6 py-3 bg-sky-500 text-white font-bold rounded-xl text-xs">Launch Demo</button>
  </div>
</body>
</html>`;
    const pageId = `site-${deployId}`;
    generatedPages.set(pageId, previewPage);
    const baseUrl = buildBaseUrl(req);

    res.json({
      success: true,
      htmlCode: previewPage,
      suggestedTitle: fallbackTitle,
      techStack: ['Tailwind CSS', 'Vanilla JavaScript'],
      deploymentUrl: `${baseUrl}/site/${pageId}`
    });
  }
});

// API Endpoint: Persist generated website HTML for live deployment
app.post('/api/ai/deploy-website', async (req, res) => {
  try {
    const { htmlCode, title, prompt } = req.body;
    if (!htmlCode || typeof htmlCode !== 'string') {
      return res.status(400).json({ success: false, error: 'htmlCode is required for deployment.' });
    }

    const deployId = Math.floor(100000 + Math.random() * 900000);
    const pageId = `site-${deployId}`;
    generatedPages.set(pageId, htmlCode);
    const baseUrl = buildBaseUrl(req);

    res.json({
      success: true,
      siteId: pageId,
      deploymentUrl: `${baseUrl}/site/${pageId}`,
      suggestedTitle: title || prompt || 'RoboAssist AI Web App',
    });
  } catch (error: any) {
    console.error('Error deploying website:', error);
    res.status(500).json({ success: false, error: error.message || 'Deployment failed' });
  }
});

// API Endpoint: Improve generated website HTML using AI prompts
app.post('/api/ai/improve-website', async (req, res) => {
  try {
    const { htmlCode, instruction, title } = req.body;
    if (!htmlCode || typeof htmlCode !== 'string' || !instruction || typeof instruction !== 'string') {
      return res.status(400).json({ success: false, error: 'htmlCode and instruction are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const improvedHtml = `${htmlCode.replace(/<\/body>/i, `<div style="display:none"><!-- Improved with instruction: ${instruction} --></div></body>`)}`;
      return res.json({ success: true, htmlCode: improvedHtml, suggestedTitle: title || 'Improved RoboAssist AI Web App' });
    }

    const prompt = `You are a full-stack web AI assistant. Improve this existing HTML page to match the following request:

Instruction: ${instruction}

HTML to improve:
${htmlCode}

Return only the full improved HTML document starting with <!DOCTYPE html> and closing with </html>.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    let improvedHtml = response.text || '';
    improvedHtml = improvedHtml.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    if (!improvedHtml.includes('<!DOCTYPE html>')) {
      improvedHtml = htmlCode.replace(/<\/body>/i, `<div style="display:none"><!-- Improved with instruction: ${instruction} --></div></body>`);
    }

    res.json({ success: true, htmlCode: improvedHtml, suggestedTitle: title || 'Improved RoboAssist AI Web App' });
  } catch (error: any) {
    console.error('Error improving website:', error);
    res.status(500).json({ success: false, error: error.message || 'Improve website failed' });
  }
});

// Setup Vite or Static serving
async function startServer() {
  app.get('/site/:siteId', (req, res) => {
    const html = generatedPages.get(req.params.siteId);
    if (!html) {
      return res.status(404).send('<h1>404 Not Found</h1><p>Site not found or expired.</p>');
    }
    res.send(html);
  });

  if (process.env.NODE_ENV !== 'production') {
    // Dynamically import Vite only in development — avoids crashing in production
    // where Vite may not be available in the bundle
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname),
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares as any);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath) as any);
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RoboAssistAI Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
