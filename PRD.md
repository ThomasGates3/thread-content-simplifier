# Threads Content Simplifier - Local AI Backend Migration (PRD)

## Project Overview

Migrate threads-content-simplifier from Google Gemini API to a local Phi-3 Mini model running via Ollama, enabling:
- **Cost elimination**: Remove all API charges
- **Privacy**: User content never leaves the device/network
- **Offline capability**: Works without internet connectivity
- **Reduced latency**: 2-3 second transformations instead of 1-3 second cloud roundtrips
- **Full control**: No rate limits, quotas, or service disruptions

**Architecture**: React frontend (unchanged) + Local Ollama backend (new) replacing Gemini API

---

## Feature List

### Feature 1: Ollama Backend Setup & Integration
- Install and configure Ollama on development machine
- Pull Phi-3 Mini model (2.3GB)
- Create Node.js server that wraps Ollama API
- Test local inference pipeline end-to-end
- **Acceptance Criteria**:
  - Ollama runs on `http://localhost:11434`
  - Backend API on `http://localhost:5000`
  - Can generate 100-token response in <3 seconds

### Feature 2: Backend API Server Creation
- Build Express.js server with single `/api/simplify` endpoint
- Accept JSON: `{ text: string, template: string, customInstructions?: string }`
- Return JSON: `{ transformedContent: string, audit: {...}, engagementPrediction: string }`
- Implement error handling and validation
- **Acceptance Criteria**:
  - API returns same JSON structure as Gemini service
  - Validates input (max 5000 chars, template enum, optional custom instructions)
  - Error handling with 400/500 status codes

### Feature 3: Prompt Engineering for Phi-3 Mini
- Convert Gemini system instructions to Phi-3-optimized prompts
- Create template-specific prompt variations
- Ensure JSON schema enforcement for structured output
- Test readability metrics generation
- **Acceptance Criteria**:
  - Generated content matches Gemini quality (subjective assessment by user)
  - Readability metrics (grade level, longest sentence) accurate
  - Engagement predictions plausible

### Feature 4: Frontend API Client Update
- Replace `GeminiService` calls with backend API calls
- Update `services/gemini.ts` to call `http://localhost:5000/api/simplify`
- Handle loading states and errors
- Maintain identical UI/UX (no changes visible to user)
- **Acceptance Criteria**:
  - App functions identically from user perspective
  - Response times <3 seconds on M4 MacBook Pro
  - All error cases handled gracefully

### Feature 5: Environment Configuration & .env Management
- Remove `GEMINI_API_KEY` dependency
- Create `.env.local` with `OLLAMA_API_URL=http://localhost:11434` (dev only)
- Create `.env.example` with dummy values
- Fix vite.config.ts to NOT embed secrets
- Update .gitignore to include CLAUDE.local.md
- **Acceptance Criteria**:
  - No hardcoded API keys in source
  - vite.config.ts uses loadEnv safely
  - .env.local properly gitignored
  - README documents setup clearly

### Feature 6: Local Development Documentation
- Create `.env.example` with setup instructions
- Document Ollama installation steps
- Write troubleshooting guide for common issues
- Create quick-start script (optional)
- **Acceptance Criteria**:
  - New user can follow docs and run app in <10 minutes
  - All prerequisites clearly listed
  - Common errors explained with solutions

### Feature 7: Production Deployment Strategy (Vercel + Local Backend)
- Document dual deployment options:
  - Option A: Frontend on Vercel, Ollama backend on local server/VPS
  - Option B: Frontend on Vercel, backend on AWS EC2/ECS with Ollama
- Create environment config for production
- Document Ollama server scaling considerations
- **Acceptance Criteria**:
  - At least one production deployment documented
  - Environment variables properly configured per environment
  - Security considerations addressed

### Feature 8: Security Hardening & Dependencies
- Run `npm audit` and fix vulnerabilities
- Add input validation using zod for request schema
- Add rate limiting to backend (express-rate-limit)
- CORS configuration (development: localhost, production: configurable)
- Remove hardcoded values from vite.config.ts
- **Acceptance Criteria**:
  - `npm audit` returns no critical issues
  - Input validation rejects invalid inputs
  - Rate limiting active (max 60 requests/minute per IP)
  - CORS only allows expected origins

---

## Technical Architecture

### System Diagram
```
USER DEVICE / VERCEL FRONTEND
    │
    ├─ React App (unchanged)
    │  ├─ App.tsx (state management)
    │  ├─ TemplateSelector.tsx
    │  ├─ ResultView.tsx
    │  └─ components/
    │
    └─ HTTP API Call
        │
        └─ NODE.JS BACKEND (new)
            ├─ Express.js Server
            ├─ /api/simplify endpoint
            ├─ Input validation (zod)
            ├─ Rate limiting
            ├─ Prompt engineering
            │
            └─ HTTP Call (localhost:11434)
                │
                └─ OLLAMA SERVER (local machine)
                    │
                    └─ Phi-3 Mini Model
                        (2.3GB, runs locally)
```

### Component Interaction
1. User enters text + selects template in React UI
2. Click "Transform" → POST to `http://localhost:5000/api/simplify`
3. Backend validates input, constructs Phi-3 prompt
4. Backend calls Ollama `/api/generate`
5. Phi-3 generates JSON response
6. Backend parses and returns to frontend
7. React displays results with metrics

### Data Flow

**Request**:
```json
{
  "text": "Technical content here...",
  "template": "NEWS_HOOK",
  "customInstructions": "Optional: Make sarcastic"
}
```

**Response**:
```json
{
  "transformedContent": "Simplified Threads post content",
  "audit": {
    "gradeLevel": "6",
    "longestSentenceWordCount": 12,
    "removedComplexWords": ["sophisticated", "paradigm"]
  },
  "engagementPrediction": "75% higher engagement vs technical writing"
}
```

---

## API Contracts

### POST /api/simplify

**Request Headers**:
- `Content-Type: application/json`

**Request Body** (zod schema):
```typescript
{
  text: string,           // 10-5000 characters
  template: enum,         // 'NEWS_HOOK' | 'EDUCATIONAL_THREAD' | 'OPINION_ANALYSIS' | 'QUICK_TIP'
  customInstructions?: string  // 0-500 characters (optional)
}
```

**Response 200** (Success):
```json
{
  "transformedContent": "string (100-500 chars)",
  "audit": {
    "gradeLevel": "string (6-12)",
    "longestSentenceWordCount": "number",
    "removedComplexWords": ["string array"]
  },
  "engagementPrediction": "string"
}
```

**Response 400** (Bad Request):
```json
{ "error": "Invalid input: text too short" }
```

**Response 500** (Server Error):
```json
{ "error": "Ollama service unavailable" }
```

---

## Technical Decisions

### Why Phi-3 Mini?
- **Size**: 3.8B parameters fits on consumer hardware (4-6GB VRAM)
- **Speed**: 40-50 tokens/second on M4 MacBook Pro
- **Quality**: Excellent at instruction-following and structured output
- **Trade-off**: Slightly less nuanced than Mistral 7B, but sufficient for content simplification

### Why Not Mistral 7B?
- Larger (7B params) requires 7-8GB VRAM, less accessible
- 20-30% slower inference
- Better quality but overkill for MVP phase
- Can upgrade post-MVP if needed

### Why Ollama?
- **Simplicity**: Single-command setup (`ollama pull phi-3`)
- **Accessibility**: Works on Mac/Linux/Windows
- **No configuration**: Automatic model optimization
- **Trade-off**: ~20-30% slower than raw llama.cpp, but developer experience is superior

### Why Backend API Layer?
- **Isolation**: Frontend doesn't need to know about Ollama/model details
- **Flexibility**: Can swap Ollama for other backends (llama.cpp, vLLM, etc.)
- **Security**: Input validation, rate limiting, logging at API layer
- **Scalability**: Easy to load-balance multiple backend instances

---

## Security Requirements

### Secret Management
- ✅ No API keys needed (Ollama runs locally)
- ✅ .env.local stores only non-secrets (OLLAMA_API_URL=http://localhost:11434)
- ✅ CLAUDE.local.md added to .gitignore
- ❌ vite.config.ts must NOT use 'define' to embed values

### Input Validation
- ✅ Backend validates `text` length (10-5000 chars)
- ✅ Backend validates `template` against enum
- ✅ Backend sanitizes custom instructions
- ✅ Frontend shows character count to user

### Transport Security
- Development: HTTP localhost is acceptable
- Production: HTTPS enforced (Vercel handles frontend, backend TLS depends on deployment)

### Rate Limiting
- Express middleware: 60 requests/minute per IP
- Prevents abuse of local backend

### Dependency Security
- Run `npm audit` before each commit
- Pin critical versions in package.json

---

## Performance Requirements

| Metric | Target | Acceptable |
|--------|--------|-----------|
| Single transformation | <3 seconds | <5 seconds |
| Backend response time | <2 seconds | <3 seconds |
| Model load time | 1-2 seconds (first run) | - |
| Memory usage | <6GB total (Mac + Ollama) | <8GB |
| CPU usage during inference | 60-80% (one core) | <95% |

---

## Testing Acceptance Criteria

### Manual Testing (Phase 1)
- ✓ User can paste text, select template, click "Transform"
- ✓ Results display within 3 seconds
- ✓ Readability metrics appear correctly
- ✓ Copy button works
- ✓ Error handling: shows message if Ollama not running
- ✓ Works on different input lengths (10 chars → 5000 chars)

### Automated Testing (Phase 2, if needed)
- Unit tests: Input validation, schema enforcement
- Integration tests: Backend API → Ollama integration
- E2E tests (Playwright): Full user flow including error cases

---

## Deployment Notes

### Local Development
- User runs: `ollama pull phi-3`
- User runs: `npm install && npm run dev`
- Frontend auto-discovers backend at `http://localhost:5000`
- Ollama runs in background on `http://localhost:11434`

### Production (Option A: Vercel + VPS)
- Frontend: Deploy to Vercel as usual
- Backend: Deploy to personal VPS/EC2 running Ollama + Node.js
- Environment: `OLLAMA_API_URL` points to VPS (e.g., https://ollama.yourserver.com:11434)
- Security: Backend exposed only to Vercel IPs (optional, depends on setup)

### Production (Option B: Vercel + AWS ECS)
- Frontend: Vercel
- Backend: AWS ECS with Ollama container + Node.js container
- Environment: `OLLAMA_API_URL` points to ECS endpoint
- Scaling: Auto-scale container count based on request volume

---

## Known Constraints & Assumptions

### Constraints
- Ollama model must be pre-loaded before requests arrive
- Phi-3 Mini optimized for consumer hardware, not enterprise
- No database (stateless transformations only)
- No user authentication/accounts

### Assumptions
- Users have Ollama installed locally or have backend access
- M4 MacBook Pro has sufficient VRAM (>4GB)
- Network latency between frontend and backend <500ms

---

## Out of Scope (Future Enhancements)

- Mistral 7B upgrade path
- Multi-model support (swap models on-the-fly)
- Fine-tuning on custom datasets
- Browser-based Transformers.js variant
- User accounts / history storage
- Admin dashboard for metrics
