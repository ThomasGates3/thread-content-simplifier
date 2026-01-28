# Docker Setup — Local Deployment

Run threads-content-simplifier completely in Docker on your MacBook.

## Prerequisites

- **Docker Desktop** for Mac: https://www.docker.com/products/docker-desktop
- **Docker Compose** (comes with Docker Desktop)

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up --build
```

This will:
1. Pull `ollama/ollama` image and start Ollama server
2. Build Node.js backend container
3. Download Phi-3 model (2.3GB, first run only)
4. Start backend API server
5. Serve built frontend

**Expected output:**
```
threads-ollama      | Listening on 127.0.0.1:11434
threads-backend     | ✓ Backend server running on http://localhost:5000
threads-backend     | ✓ Ollama API endpoint: http://ollama:11434
```

### 2. Open in Browser

Visit: **http://localhost:3000**

Wait for frontend to load (first time may take 30-60s while model downloads).

### 3. Test Transformation

1. Paste technical text
2. Select template
3. Click "Transform"
4. Results appear in 2-3 seconds

### 4. Stop Services

```bash
docker-compose down
```

---

## Architecture

```
localhost:3000 (Frontend - Static HTML)
       ↓
localhost:5000 (Backend - Node.js)
       ↓
localhost:11434 (Ollama - Phi-3 Model)
```

All running in Docker containers, isolated from your system.

---

## Common Commands

### Start Everything
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f           # All services
docker-compose logs -f backend   # Backend only
docker-compose logs -f ollama    # Ollama only
```

### Rebuild Backend Only
```bash
docker-compose build backend --no-cache
```

### Shell into Backend Container
```bash
docker-compose exec backend sh
```

### Shell into Ollama Container
```bash
docker-compose exec ollama bash
```

### Check Service Status
```bash
docker-compose ps
```

---

## Performance Notes

### First Run
- Model download: 2.3GB (5-10 minutes on good internet)
- Takes time only once, then cached in `ollama-data` volume

### Subsequent Runs
- Instant startup
- Models pre-cached
- 2-3 second transformations

### Resource Usage
- **CPU**: 60-80% (one core during inference)
- **RAM**: ~4-6GB (Ollama + Node.js + containers)
- **Disk**: 2.3GB (Phi-3 model, one-time)

---

## Troubleshooting

### Docker daemon not running
```bash
open /Applications/Docker.app
# Wait for Docker to start
docker ps  # Should show running containers
```

### "Cannot connect to Docker daemon"
- Restart Docker Desktop: System Preferences → Docker → Restart

### Port already in use
```bash
# Find what's using port 5000
lsof -i :5000

# Find what's using port 11434
lsof -i :11434

# Kill it
kill -9 <PID>
```

### Model download stuck / very slow
- Check internet connection
- Model is 2.3GB (~5-10 min on 50Mbps internet)
- Can't be interrupted, will restart if needed

### Backend can't reach Ollama
```bash
# Check Ollama is healthy
docker-compose ps

# Check connectivity from backend
docker-compose exec backend curl http://ollama:11434
```

### Want to use different backend port
Edit `docker-compose.yml`:
```yaml
backend:
  ports:
    - "5555:5000"  # Maps container 5000 → localhost 5555
```

---

## Development vs Production

### Development (Current)
```bash
npm run dev
# Frontend: http://localhost:3000 (Vite dev server, hot reload)
# Backend: node server.js
# Ollama: ollama serve
```

### Production (Docker)
```bash
docker-compose up
# Frontend: Built static assets, served from backend
# Backend: Production Node.js container
# Ollama: Containerized with persistent volume
```

---

## Deployment Options

### Option A: Keep Local (Recommended for Personal Use)
- Run Docker Compose on your MacBook
- Accessible via `http://localhost:3000`
- Zero cloud costs
- Offline-capable

### Option B: Deploy Frontend to Vercel (Sharing)
```bash
# Build frontend
npm run build

# Deploy dist/ to Vercel
vercel deploy --prod

# In Vercel environment, set:
# VITE_BACKEND_URL=http://your-local-ip:5000
# Keep backend running locally
```

### Option C: Deploy Entire Stack to AWS
- Frontend: Vercel or S3 + CloudFront
- Backend: EC2 or ECS
- Ollama: EC2 with GPU (expensive)
- Not recommended for personal use

---

## Persistence

### Ollama Model Cache
- Location: `ollama-data` Docker volume
- Persists between `docker-compose down` / `up`
- Never needs re-download
- Delete volume to free 2.3GB:
  ```bash
  docker volume rm threads-content-simplifier_ollama-data
  ```

### Backend Logs
- Logged to console, not persisted
- Use `docker-compose logs` to view history

---

## Next Steps

### Immediate
1. ✅ Run `docker-compose up`
2. ✅ Open http://localhost:3000
3. ✅ Test a transformation

### Optional Enhancements
- Set up auto-restart: Add `restart_policy` to docker-compose
- Add Nginx reverse proxy for cleaner URLs
- Create GitHub Actions to auto-build Docker image
- Deploy backend to AWS EC2 for sharing

### Sharing Your App (Without Deployment)
If you want to share temporarily:
```bash
# Terminal 1: Keep docker-compose running
docker-compose up

# Terminal 2: Create tunnel
npx ngrok http 5000

# Share tunnel URL with others (50 concurrent connections free)
```

---

## File Structure

```
threads-content-simplifier/
├── Dockerfile           # Backend container definition
├── docker-compose.yml   # Orchestration (Ollama + Backend)
├── .dockerignore       # Files excluded from Docker build
├── DOCKER_SETUP.md     # This file
├── server.js           # Backend Express server
├── services/phi-service.js  # Phi-3 service
├── dist/               # Built frontend (generated by build)
└── [source files]
```

---

## Security Notes

- ✅ No secrets in containers
- ✅ Port 11434 (Ollama) only accessible locally
- ✅ Port 5000 (Backend) only accessible locally
- ✅ CORS restricted to localhost
- ✅ Container volumes are isolated

For production deployment, add:
- HTTPS/TLS
- Authentication
- Rate limiting per user (not just per IP)
- Secrets management (AWS Secrets Manager, etc.)

---

**Status:** All services containerized and ready to run locally! 🐳
