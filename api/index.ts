// Vercel Serverless Function entry point
// This wraps the Express app from server.ts for Vercel's serverless runtime

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load env
dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }) as any);

const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

const ai = new GoogleGenAI({
  apiKey: geminiApiKey || '',
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' },
  },
});

// In-memory store for generated pages (per cold-start lifecycle)
const generatedPages = new Map<string, string>();

const buildBaseUrl = (req: express.Request) => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
};

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'RoboAssistAI Cloud Engine v4.2',
    timestamp: new Date().toISOString(),
    aiEngine: geminiApiKey ? 'Connected (Gemini 2.0 Flash)' : 'Offline (Simulated)',
    geminiConfigured: !!geminiApiKey,
  });
});

// ── AI Chat ───────────────────────────────────────────────────────────────────
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, tone, context } = req.body;

    if (!geminiApiKey) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured on the server. Set it in Vercel Environment Variables.',
      });
    }

    const conversationText = (messages || [])
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `You are RoboAssistAI, an advanced AI engineer and robotics specialist.
Context: ${context || 'RoboAssistAI unified AI and robotics platform'}
Tone: ${tone || 'Friendly, professional, and expert-level'}

Conversation History:
${conversationText}

Provide a helpful, concise, and technically accurate reply.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { temperature: 0.5, topP: 0.9, responseMimeType: 'text/plain' },
    });

    const replyText = response?.text?.trim();
    if (!replyText) {
      return res.status(502).json({ success: false, error: 'Gemini returned an empty response.' });
    }
    return res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate chat response' });
  }
});

// ── AI Mission Planning ────────────────────────────────────────────────────────
app.post('/api/ai/plan-mission', async (req, res) => {
  try {
    const { robotType, locationSector, objective, constraints } = req.body;

    if (!geminiApiKey) {
      return res.json({
        success: true,
        plan: {
          missionTitle: `Autonomous ${robotType} Patrol: ${locationSector}`,
          steps: [
            `1. Perform pre-flight diagnostic on ${robotType} chassis and battery.`,
            `2. Initialize 3D SLAM mapping node and zero thermal sensors.`,
            `3. Traverse waypoint sector ${locationSector} at optimal speed (1.2 m/s).`,
            `4. Continuous YOLOv11 anomaly scan for ${objective || 'structural defects'}.`,
            `5. Return to charging dock Alpha upon battery reaching 20%.`,
          ],
          estimatedDurationMins: 25,
          safetyProtocolScore: 98,
          recommendedSensors: ['3D LiDAR', 'Thermal FLIR', 'Gas Sniffer', 'Ultrasonic Array'],
        },
      });
    }

    const prompt = `You are the lead AI Command Engine for RoboAssistAI industrial robotics platform.
Design a detailed autonomous mission plan for:
- Robot Type: ${robotType}
- Location / Sector: ${locationSector}
- Objective: ${objective}
- Special Constraints: ${constraints || 'None'}

Return JSON with: missionTitle, steps (array of 5), estimatedDurationMins, safetyProtocolScore (90-100), recommendedSensors, riskMitigation`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, plan: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate mission plan' });
  }
});

// ── AI Docs Generator ─────────────────────────────────────────────────────────
app.post('/api/ai/generate-docs', async (req, res) => {
  try {
    const { projectName, robotType, mission, description, docType } = req.body;

    if (!geminiApiKey) {
      return res.json({
        success: true,
        content: `# ${projectName} - ${docType?.toUpperCase()}\n\n**Robot Type:** ${robotType}\n**Mission:** ${mission}\n\n## Overview\n${description}`,
      });
    }

    const prompt = `You are a Senior Robotics Software Architect writing ${docType} documentation.
Project: ${projectName} | Robot: ${robotType} | Mission: ${mission}
Description: ${description}
Write production-grade, well-formatted Markdown.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
    res.json({ success: true, content: response.text });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate docs' });
  }
});

// ── AI Incident Analyzer ──────────────────────────────────────────────────────
app.post('/api/ai/analyze-incident', async (req, res) => {
  try {
    const { incidentTitle, meetingPlatform, rawTranscript } = req.body;

    if (!geminiApiKey) {
      return res.json({
        success: true,
        analysis: {
          facts: ['High vibration detected on primary actuator.', `Meeting convened on ${meetingPlatform}.`],
          hypotheses: ['Hydraulic pressure fluctuation (78% confidence).'],
          actionItems: [{ text: 'Verify hydraulic pump pressure', assignee: 'On-Call Engineer' }],
          executiveSummary: `War room on ${meetingPlatform} addressed ${incidentTitle}.`,
          technicalSummary: 'Telemetry analyzed. Hydraulic line stabilized.',
        },
      });
    }

    const prompt = `You are RoboAssistAI Incident Commander. Analyze this war-room transcript for "${incidentTitle}" on "${meetingPlatform}":
"${rawTranscript}"
Return JSON: facts[], hypotheses[], actionItems[{text,assignee}], executiveSummary, technicalSummary`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, analysis: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to analyze incident' });
  }
});

// ── AI Website Generator ──────────────────────────────────────────────────────
app.post('/api/ai/generate-website', async (req, res) => {
  try {
    const { prompt, title } = req.body;
    const requestedTitle = title || prompt || 'AI Generated Web Application';

    if (!geminiApiKey) {
      const deployId = Math.floor(100000 + Math.random() * 900000);
      const pageId = `site-${deployId}`;
      const baseUrl = buildBaseUrl(req);
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${requestedTitle}</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-950 text-white min-h-screen flex items-center justify-center"><div class="text-center"><h1 class="text-4xl font-bold">${requestedTitle}</h1><p class="text-slate-400 mt-4">${prompt}</p></div></body></html>`;
      generatedPages.set(pageId, html);
      return res.json({ success: true, htmlCode: html, suggestedTitle: requestedTitle, deploymentUrl: `${baseUrl}/site/${pageId}` });
    }

    const aiPrompt = `Generate a complete, modern single-file HTML/CSS/JS web app for: "${prompt}". Title: ${requestedTitle}. Use Tailwind CDN. Output ONLY raw HTML starting with <!DOCTYPE html>.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: aiPrompt });

    let htmlCode = (response.text || '').replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const titleMatch = htmlCode.match(/<title>(.*?)<\/title>/i);
    const suggestedTitle = titleMatch ? titleMatch[1].trim() : requestedTitle;
    const deployId = Math.floor(100000 + Math.random() * 900000);
    const pageId = `site-${deployId}`;
    generatedPages.set(pageId, htmlCode);
    const baseUrl = buildBaseUrl(req);
    res.json({ success: true, htmlCode, suggestedTitle, deploymentUrl: `${baseUrl}/site/${pageId}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate website' });
  }
});

// ── Deploy & Improve Website ──────────────────────────────────────────────────
app.post('/api/ai/deploy-website', async (req, res) => {
  const { htmlCode, title, prompt } = req.body;
  if (!htmlCode) return res.status(400).json({ success: false, error: 'htmlCode is required.' });
  const pageId = `site-${Math.floor(100000 + Math.random() * 900000)}`;
  generatedPages.set(pageId, htmlCode);
  const baseUrl = buildBaseUrl(req);
  res.json({ success: true, siteId: pageId, deploymentUrl: `${baseUrl}/site/${pageId}`, suggestedTitle: title || prompt || 'RoboAssist AI Web App' });
});

app.post('/api/ai/improve-website', async (req, res) => {
  try {
    const { htmlCode, instruction, title } = req.body;
    if (!htmlCode || !instruction) return res.status(400).json({ success: false, error: 'htmlCode and instruction are required.' });

    if (!geminiApiKey) {
      return res.json({ success: true, htmlCode, suggestedTitle: title || 'Improved App' });
    }

    const prompt = `Improve this HTML page per the instruction: "${instruction}"\n\nHTML:\n${htmlCode}\n\nReturn only the full improved HTML starting with <!DOCTYPE html>.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
    let improved = (response.text || '').replace(/^```html\s*/i, '').replace(/\s*```$/i, '').trim();
    res.json({ success: true, htmlCode: improved || htmlCode, suggestedTitle: title || 'Improved App' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Improve failed' });
  }
});

// ── LLM Studio ────────────────────────────────────────────────────────────────
const llmModelStore: Record<string, any> = {
  'llm-1': { id: 'llm-1', name: 'RoboAssist Falcon 7B', modelType: 'Vision & Robotics', stage: 'Training', version: 'v0.2', nodeCount: 4, accuracy: '87%', drift: '1.2%', status: 'Live', createdAt: new Date().toISOString() },
  'llm-2': { id: 'llm-2', name: 'RoboAssist Llama Industrial', modelType: 'Fine-tune', stage: 'Fine-tune', version: 'v1.1', nodeCount: 2, accuracy: '91%', drift: '0.8%', status: 'Review', createdAt: new Date().toISOString() },
};
const llmDatasetStore: Record<string, any> = {
  'ds-1': { id: 'ds-1', name: 'ROS2 Telemetry Corpus', size: '12GB', status: 'Ready', version: 'v1.0' },
  'ds-2': { id: 'ds-2', name: 'Industrial Vision Labels', size: '8GB', status: 'Cleaning', version: 'v1.0' },
};

app.get('/api/llm/models', (_req, res) => res.json({ success: true, models: Object.values(llmModelStore) }));
app.get('/api/llm/datasets', (_req, res) => res.json({ success: true, datasets: Object.values(llmDatasetStore) }));

app.post('/api/llm/create-model', (req, res) => {
  const { name, modelType } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Model name is required.' });
  const id = `llm-${Date.now()}`;
  const model = { id, name, modelType: modelType || 'Custom Robotics LLM', stage: 'Created', version: 'v0.1', nodeCount: 2, accuracy: 'N/A', drift: '0.0%', status: 'Pending', createdAt: new Date().toISOString() };
  llmModelStore[id] = model;
  res.json({ success: true, model, message: `Created ${model.name} successfully.` });
});

app.post('/api/llm/train-model', (req, res) => {
  const { modelId, datasetId, strategy, target, epochs, learningRate, checkpointInterval } = req.body;
  if (!modelId || !llmModelStore[modelId]) return res.status(404).json({ success: false, error: 'Model not found.' });
  if (!datasetId || !llmDatasetStore[datasetId]) return res.status(404).json({ success: false, error: 'Dataset not found.' });
  const updated = { ...llmModelStore[modelId], stage: 'Training', status: 'Training', accuracy: 'Loading…' };
  llmModelStore[modelId] = updated;
  setTimeout(() => { llmModelStore[modelId] = { ...llmModelStore[modelId], stage: 'Fine-tune', accuracy: '89%', drift: '0.9%', status: 'Ready for deployment' }; }, 3000);
  res.json({ success: true, model: updated, message: `Training started for ${updated.name}.` });
});

// ── Serve generated sites ─────────────────────────────────────────────────────
app.get('/site/:siteId', (req, res) => {
  const html = generatedPages.get(req.params.siteId);
  if (!html) return res.status(404).send('<h1>404 — Site not found or expired.</h1>');
  res.send(html);
});

export default app;
