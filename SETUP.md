# Quick Setup Guide

Get threads-content-simplifier running in <5 minutes.

## Step 1: Install Ollama & Model (1 min)

**macOS:**
```bash
brew install ollama
ollama pull phi-3
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
ollama pull phi-3
```

**Windows:**
- Download from https://ollama.ai
- Run installer
- In PowerShell: `ollama pull phi-3`

**Verify:**
```bash
ollama serve  # Should print "Listening on ..."
```
✅ Keep this terminal open

---

## Step 2: Install Dependencies (2 min)

```bash
cd threads-content-simplifier
npm install
```

**Expected output:**
```
added 178 packages, audited 179 packages in Xs
found 0 vulnerabilities
```

---

## Step 3: Start Dev Servers (30 sec)

**New terminal window:**
```bash
npm run dev
```

**Expected output:**
```
✓ Backend server running on http://localhost:5000
✓ Ollama API endpoint: http://localhost:11434
✓ CORS enabled for http://localhost:3000

VITE v6.4.1  ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

## Step 4: Open in Browser

Visit: http://localhost:3000

✅ **Success!** You should see the Threads Content Simplifier UI

---

## Try It Out

1. **Paste some text** into the editor (e.g., a technical article)
2. **Select a template** (News Hook, Before/After, Hot Take, Quick Win)
3. **Click "Transform for Threads"**
4. **Get results** in 2-3 seconds with readability metrics

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process and retry
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### "Cannot reach Ollama"
```bash
# Verify Ollama is running
curl http://localhost:11434

# If not, in a new terminal:
ollama serve
```

### "Model not found"
```bash
# Download Phi-3 model
ollama pull phi-3

# Check what models you have
ollama list
```

### "Failed to parse JSON"
- Wait a few seconds and try again (Ollama may be busy)
- Check Ollama logs: `tail -f ~/.ollama/logs`
- Ensure you have `phi-3` model, not `phi` or `phi-mini`

---

## Production Deployment

### Option A: Home Server + Vercel Frontend
```bash
# 1. Keep Ollama + backend running on home machine
ollama serve &
npm run dev:backend &

# 2. Deploy frontend to Vercel
npm run build
vercel deploy dist/

# 3. Update .env for production
VITE_BACKEND_URL=https://your-home-ip:5000
```

### Option B: AWS EC2 + Vercel
```bash
# 1. On EC2 instance:
ssh ubuntu@your-ec2-instance
# Install Node, Ollama, etc. (same as local setup)
# Keep backend running:
npm run dev:backend &
ollama serve &

# 2. Deploy frontend to Vercel
npm run build
vercel deploy dist/

# 3. Update .env
VITE_BACKEND_URL=https://your-ec2-dns.compute.amazonaws.com:5000
```

---

## Commands Reference

```bash
npm run dev               # Start frontend + backend together
npm run dev:frontend     # Start just frontend (port 3000)
npm run dev:backend      # Start just backend (port 5000)
npm run build           # Build production frontend
npm run preview         # Preview production build locally
npm audit              # Check for security vulnerabilities
npm audit fix          # Auto-fix vulnerabilities
```

---

## File Structure

```
threads-content-simplifier/
├── App.tsx                 # React main component
├── index.tsx               # React root
├── types.ts               # TypeScript interfaces
├── constants.tsx          # Template configs
├── components/            # React components
│  ├── TemplateSelector.tsx
│  └── ResultView.tsx
├── services/
│  ├── gemini.ts           # Frontend API client (calls backend)
│  └── phi-service.js      # Backend Phi-3 service
├── server.js              # Express.js backend server
├── vite.config.ts         # Frontend build config
├── .env.example           # Environment template
├── .env.local             # Local secrets (gitignored)
├── PRD.md                 # Project requirements
├── README.md              # Full documentation
└── package.json           # Dependencies
```

---

## Architecture in 30 Seconds

```
Browser (React)
    ↓ HTTP POST
Backend (Express)
    ↓ Prompt Engineering
Ollama Server
    ↓ Local LLM Inference
Phi-3 Mini Model
    ↓ JSON Response
Backend → Frontend → User
```

All runs on your machine. No cloud APIs. No costs.

---

## Next: Read Full Docs

See [README.md](README.md) for:
- Architecture diagrams
- Security implementation
- Production deployment strategies
- Troubleshooting deep dives

---

**Questions?** Check the [README.md](README.md) troubleshooting section or PRD.md for technical details.
