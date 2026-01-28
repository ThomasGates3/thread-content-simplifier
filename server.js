import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { simplifiyWithPhi } from './services/phi-service.js';

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || 'http://localhost:3000')
    : 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many requests, please try again later'
});

app.use(limiter);

const requestSchema = z.object({
  text: z.string().min(10, 'Text too short (min 10 chars)').max(5000, 'Text too long (max 5000 chars)'),
  template: z.enum(['NEWS_HOOK', 'EDUCATIONAL_THREAD', 'OPINION_ANALYSIS', 'QUICK_TIP']),
  customInstructions: z.string().max(500, 'Custom instructions too long (max 500 chars)').optional()
});

app.post('/api/simplify', async (req, res) => {
  try {
    const { text, template, customInstructions } = requestSchema.parse(req.body);

    const result = await simplifiyWithPhi(
      text,
      template,
      customInstructions,
      OLLAMA_API_URL
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors[0].message
      });
    }

    console.error('API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process request'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n✓ Backend server running on http://localhost:${PORT}`);
  console.log(`✓ Ollama API endpoint: ${OLLAMA_API_URL}`);
  console.log(`✓ CORS enabled for http://localhost:3000\n`);
});
