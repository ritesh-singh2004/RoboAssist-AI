# RoboAssist AI — Industrial AI Robotics Platform

<div align="center">

![RoboAssist AI](https://ai.google.dev/static/site-assets/images/share-ais-513315318.png)

**Enterprise-grade AI-powered robotics management platform built with React, Express, and Gemini AI.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-orange)](https://ai.google.dev)

</div>

---

## 🚀 Overview

RoboAssist AI is a full-stack industrial robotics management platform that combines real-time fleet monitoring, AI-powered mission planning, incident analysis, LLM model registry, and a web studio — all powered by Google's Gemini AI.

**Key Features:**
- 🤖 **Fleet Dashboard** — Real-time robot telemetry, status, and emergency controls
- 🧠 **AI Mission Planner** — Gemini-powered autonomous mission generation
- 🚨 **Incident Commander** — AI war-room analysis and action item tracking
- 🏗️ **Project Builder** — Robotics project scaffolding with AI-generated docs
- 🌐 **Web Studio** — AI-powered web application generator
- 🧬 **LLM Studio** — Custom model training and registry management
- 🛡️ **Security Workspace** — Security audit and monitoring tools
- 📊 **Mission Analytics** — Deep telemetry analysis and reporting

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide React |
| Backend | Express.js, Node.js |
| AI Engine | Google Gemini 2.0 Flash (`@google/genai`) |
| Build | Vite 5, esbuild |
| Dev Server | tsx (TypeScript execution) |

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **npm** 9 or higher
- A **Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/ritesh-singh2004/RoboAssist-AI.git
cd RoboAssist-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Gemini API key
GEMINI_API_KEY="your_actual_key_here"
APP_URL="http://127.0.0.1:3000/"
```

> ⚠️ **Never commit `.env.local`** — it is already in `.gitignore`

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (Vite frontend + esbuild server) |
| `npm run build:slate` | Alias for `build` (used by cloud deployment platforms) |
| `npm run start` | Start the production server (`node dist/server.js`) |
| `npm run lint` | TypeScript type-check with no emit |
| `npm run preview` | Preview the production build locally |

---

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key |
| `PORT` | Optional | Server port (default: `3000`) |
| `APP_URL` | Optional | Public URL of your deployment |
| `NODE_ENV` | Optional | Set to `production` for prod mode |

### Cloud Run / Docker
The app listens on `0.0.0.0:${PORT}` and serves the built frontend from `dist/`. Set `NODE_ENV=production` and provide `GEMINI_API_KEY` as a secret environment variable.

---

## 📁 Project Structure

```
RoboAssist-AI/
├── src/
│   ├── App.tsx              # Root component & state management
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   ├── types.ts             # TypeScript type definitions
│   ├── components/          # All UI components (30+ modules)
│   └── data/                # Initial seed data
├── server.ts                # Express backend + Gemini AI API routes
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies & scripts
└── .env.example             # Environment variable template
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with ❤️ using <a href="https://aistudio.google.com">Google AI Studio</a> & <a href="https://ai.google.dev">Gemini AI</a>
</div>
