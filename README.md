# Threads Content Simplifier — Local AI Backend

Transform technical writing into viral-ready Threads content using **local Phi-3 Mini AI** running on your machine.

## Problem

❌ Writing long, technical content doesn't perform on social media
❌ Converting complex ideas to Threads posts is time-consuming
❌ Cloud API costs ($) add up with frequent transformations
❌ Sharing content means sending it through third-party APIs (privacy concern)

## Solution

✅ **One-click transformation** from technical draft to viral Threads post
✅ **Four strategic templates** optimized for different content types (News, Educational, Opinion, Quick Tips)
✅ **Local AI inference** — runs entirely on your machine, zero cloud costs
✅ **Privacy-first** — all content stays on your device
✅ **Hemingway-style metrics** — shows readability grade + engagement prediction
✅ **Real-time preview** — see results instantly

### How It Works

1. **Paste your technical content** into the editor (up to 5,000 characters)
2. **Select a content strategy** (News Hook, Before/After, Hot Take, Quick Win)
3. **Add optional custom instructions** ("Make it sarcastic", "Target developers", etc.)
4. **Click Transform** — AI simplifies instantly (~2-3 seconds)
5. **Review metrics** — Readability grade, engagement forecast
6. **Copy & share** to Threads, Twitter, LinkedIn

---

## How to Run It

### Prerequisites

- **Node.js** 16+ (download from [nodejs.org](https://nodejs.org))
- **Ollama** (downloads model automatically)

### Quick Start (< 5 minutes)

```bash
# 1. Install Ollama and Phi-3 model
curl https://ollama.ai/install.sh | sh
ollama pull phi-3
ollama serve  # Keep running in background

# 2. Clone/navigate to this repo
cd threads-content-simplifier

# 3. Install dependencies
npm install

# 4. Start dev server (frontend + backend)
npm run dev

# 5. Open http://localhost:3000 in your browser
```

### Development Setup (Detailed)

**1. Install Ollama:**
- macOS: Download from [ollama.ai](https://ollama.ai) or `brew install ollama`
- Linux: `curl https://ollama.ai/install.sh | sh`
- Windows: Download installer from [ollama.ai](https://ollama.ai)

**2. Download Phi-3 Model:**
```bash
ollama pull phi-3  # 2.3GB download, happens once
ollama serve       # Start server on http://localhost:11434
```

**3. Setup Frontend + Backend:**
```bash
cd threads-content-simplifier
npm install
npm run dev       # Starts frontend on :3000 + backend on :5000
```

**4. Verify It Works:**
- Frontend: http://localhost:3000 (React app loads)
- Backend: http://localhost:5000/health (should return `{"status":"ok"}`)
- Ollama: http://localhost:11434 (model runs locally)

**Expected Output:**
```
✓ Backend server running on http://localhost:5000
✓ Ollama API endpoint: http://localhost:11434
✓ CORS enabled for http://localhost:3000
```

### Environment Variables

**Frontend (.env.local):**
```
VITE_BACKEND_URL=http://localhost:5000
```

**Backend (.env.local):**
```
PORT=5000
NODE_ENV=development
OLLAMA_API_URL=http://localhost:11434
FRONTEND_URL=http://localhost:3000
```

For production, update `FRONTEND_URL` to your deployed frontend domain.

### Deployment Options

#### Option A: Vercel Frontend + Home Server Backend
- **Frontend:** Deploy to Vercel (free tier)
- **Backend:** Run on home machine or VPS with Ollama
- **Environment:** `VITE_BACKEND_URL=https://yourserver.com:5000`
- **Pros:** Simple, free frontend hosting
- **Cons:** Backend depends on home machine uptime

#### Option B: Vercel Frontend + AWS EC2 Backend
- **Frontend:** Deploy to Vercel
- **Backend:** EC2 instance running Node.js + Ollama
- **Environment:** `VITE_BACKEND_URL=https://ec2-instance.us-east-1.compute.amazonaws.com:5000`
- **Pros:** Scalable, reliable backend
- **Cons:** Monthly AWS costs (~$5-20/month for micro instance)

#### Option C: Full Serverless (Vercel Functions)
- Use Vercel Functions as backend (replaces Express server)
- Run Ollama in separate container or EC2
- Fastest deployment, pay-per-use

**Recommended for MVP:** Option A (home server) → scales to Option B if needed

---

## Architecture

### System Overview
```
┌─────────────────────────┐
│   USER BROWSER          │
│  (React App)            │
│  http://localhost:3000  │
└────────┬────────────────┘
         │
         │ POST /api/simplify
         │ { text, template, customInstructions }
         ▼
┌─────────────────────────────────────┐
│   NODE.JS BACKEND SERVER            │
│  http://localhost:5000              │
│  - Input validation (zod)           │
│  - Rate limiting (60 req/min)       │
│  - Prompt engineering               │
│  - Error handling                   │
└────────┬────────────────────────────┘
         │
         │ HTTP POST to /api/generate
         │ { model: "phi-3", prompt }
         ▼
┌─────────────────────────────────────┐
│   OLLAMA SERVER                     │
│  http://localhost:11434             │
│  - Phi-3 Mini (2.3GB model)         │
│  - Token generation                 │
│  - JSON output parsing              │
└─────────────────────────────────────┘
```

### Data Flow

**Request (Frontend → Backend):**
```json
POST /api/simplify
{
  "text": "Technical content here...",
  "template": "NEWS_HOOK",
  "customInstructions": "Make it sarcastic"
}
```

**Response (Backend → Frontend):**
```json
{
  "transformedContent": "Simplified Threads post",
  "audit": {
    "gradeLevel": "6",
    "longestSentenceWordCount": 12,
    "removedComplexWords": ["sophisticated", "paradigm"]
  },
  "engagementPrediction": "75% higher engagement vs technical writing"
}
```

### Component Breakdown

| Component | Location | Purpose |
|-----------|----------|---------|
| **Frontend** | `/App.tsx`, `/components/` | React UI, input/output, state management |
| **Backend Server** | `/server.js` | Express.js API, validation, rate limiting |
| **Prompt Engineering** | `/services/phi-service.js` | Template system, Phi-3 prompt optimization |
| **Ollama Client** | `/services/phi-service.js` | Calls Ollama `/api/generate` endpoint |
| **Types** | `/types.ts` | TypeScript interfaces (ContentTemplate, SimplifiedContent) |

### Security Implementation

**Local Development:**
- No API keys needed (Ollama runs locally)
- `.env.local` contains only non-secret values
- VITE_BACKEND_URL exposed safely (localhost URL)

**Backend Security:**
- ✅ Input validation with Zod schema
- ✅ Rate limiting: 60 requests/minute per IP
- ✅ CORS restricted to `http://localhost:3000` (dev) / configurable (prod)
- ✅ No hardcoded secrets in code
- ✅ Error messages don't leak internal details

**Production Hardening:**
- HTTPS enforced (Vercel handles frontend TLS)
- Backend deployed with environment variables (AWS Secrets Manager, etc.)
- CORS whitelist updated to production domain
- Rate limiting increased for production traffic

### Dependency Security

**Run before each commit:**
```bash
npm audit       # Check for vulnerabilities
npm audit fix   # Auto-fix non-breaking issues
```

**Critical Dependencies:**
- `express` (4.18.2+) — Web server, minimal surface area
- `zod` (3.22.4+) — Input validation, type-safe
- `cors` (2.8.5+) — Cross-origin security
- `express-rate-limit` (7.1.5+) — DDoS protection

---

## Results

### Sample Transformation

**Original (Technical, Grade 12):**
```
I've been researching the applications of artificial intelligence
in healthcare systems and the implications for diagnostic accuracy.
The integration of machine learning algorithms with existing medical
infrastructure presents both unprecedented opportunities and significant
challenges from a regulatory compliance perspective.
```

**Transformed (Grade 6-7, Threads-ready):**
```
AI is changing healthcare.

Stop: Slow, inaccurate diagnoses.
Start: ML models catching problems faster.

Real cost? Regulatory complexity.
Real win? Lives saved.

Disagree? Let's talk 👇
```

**Metrics:**
- Grade Level: 6 (vs. original 12)
- Engagement Prediction: "78% more likely to generate comments"
- Removed Complex Words: ["artificial", "implications", "compliance"]

### Performance Metrics

| Metric | Performance |
|--------|-------------|
| First Load | 1-2s (model loads once) |
| Transformation Time | 2-3 seconds (M4 MacBook Pro) |
| Memory Usage | <6GB total (Mac + Ollama + Node.js) |
| Output Quality | Near-parity with Gemini |
| Monthly Cost | $0 (vs. ~$20-50 with cloud API) |

### Portfolio Value

This project demonstrates:
- ✅ Full-stack architecture (frontend + backend + local LLM)
- ✅ Production security best practices (validation, rate limiting, CORS)
- ✅ DevOps thinking (env management, deployment options)
- ✅ Prompt engineering for specific output format
- ✅ TypeScript + Node.js mastery
- ✅ Real-world problem solving (replacing paid API with local alternative)

---

## Troubleshooting

### "Backend connection refused" / "Cannot reach http://localhost:5000"

**Cause:** Backend server not running
**Fix:**
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start backend + frontend
npm run dev
```

### "Ollama service unavailable" error in app

**Cause:** Ollama not running or model not downloaded
**Fix:**
```bash
ollama pull phi-3  # Download model
ollama serve       # Start Ollama server (keep running)
```

### "Failed to parse model response as JSON"

**Cause:** Phi-3 model returned non-JSON or malformed response
**Fix:**
- Ensure you're using `phi-3` model, not another model
- Try again (occasional model timeouts)
- Check Ollama logs: `tail -f ~/.ollama/logs`

### App is slow / taking >5 seconds per transformation

**Cause:** Insufficient system resources or Ollama contention
**Fix:**
- Close other apps using RAM/CPU
- Ensure M-series Mac or 8GB+ RAM systems
- Check Ollama is not processing other requests: `curl http://localhost:11434/api/stats`

### Frontend loads but can't transform

**Cause:** CORS error (browser blocks backend request)
**Fix:**
- Check browser console for CORS error
- Verify backend running: `curl http://localhost:5000/health`
- Verify `.env.local` has correct `VITE_BACKEND_URL`

### "npm install" fails

**Cause:** Node.js version too old
**Fix:**
```bash
node --version  # Should be v16+
nvm install node  # If using nvm, update to latest
npm install --legacy-peer-deps  # If issues persist
```

---

## Next Steps

**Performance:** Upgrade to Mistral 7B for better quality (7GB VRAM required)
**Scalability:** Deploy backend to AWS ECS + DynamoDB for multiple concurrent users
**Fine-tuning:** Train custom Phi-3 model on your specific brand voice
**Features:** Add user history, template customization, batch processing
**Integration:** Add Threads API integration for direct posting

---

**Built with:** React 19 + Express.js + Phi-3 + Ollama + Vercel
