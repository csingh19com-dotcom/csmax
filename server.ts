import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI server-side with User-Agent header per skill instructions
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Available models catalog
const AVAILABLE_MODELS = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google Gemini',
    tier: 'free',
    badge: 'Recommended',
    description: 'Fast, high-quality multimodal reasoning. Best for daily queries and coding.',
    status: apiKey ? 'available' : 'requires_key',
    speed: 'Ultra-Fast',
    contextWindow: '1M tokens',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    provider: 'Google Gemini',
    tier: 'free',
    badge: 'Lightweight',
    description: 'Cost-optimized, ultra-low latency model for quick questions and summarization.',
    status: apiKey ? 'available' : 'requires_key',
    speed: 'Instant',
    contextWindow: '1M tokens',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'Google Gemini',
    tier: 'paid',
    badge: 'Deep Reasoning',
    description: 'Flagship reasoning and advanced STEM model for complex logic and math.',
    status: apiKey ? 'available' : 'requires_key',
    speed: 'Deep Thinker',
    contextWindow: '2M tokens',
  },
  {
    id: 'ollama:llama3.2',
    name: 'Ollama: Llama 3.2',
    provider: 'Ollama Local',
    tier: 'local',
    badge: 'Local AI',
    description: 'Runs privately on your machine with zero data leaving your device.',
    status: 'local_check',
    speed: 'Hardware Dependent',
    contextWindow: '128K tokens',
  },
  {
    id: 'ollama:deepseek-r1',
    name: 'Ollama: DeepSeek-R1',
    provider: 'Ollama Local',
    tier: 'local',
    badge: 'Local AI',
    description: 'Open-weight reasoning model running locally via Ollama.',
    status: 'local_check',
    speed: 'Hardware Dependent',
    contextWindow: '64K tokens',
  },
  {
    id: 'ollama:mistral',
    name: 'Ollama: Mistral 7B',
    provider: 'Ollama Local',
    tier: 'local',
    badge: 'Local AI',
    description: 'Capable general-purpose open model running locally.',
    status: 'local_check',
    speed: 'Hardware Dependent',
    contextWindow: '32K tokens',
  },
];

// Health / status check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Moon AI',
    creator: 'Chandrashekhar Singh',
    geminiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Models list endpoint
app.get('/api/models', (req: Request, res: Response) => {
  res.json({
    models: AVAILABLE_MODELS,
    hasGeminiKey: Boolean(apiKey),
  });
});

// Ollama detection / status endpoint
app.get('/api/ollama/status', async (req: Request, res: Response) => {
  const host = (req.query.host as string) || 'http://127.0.0.1:11434';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const resp = await fetch(`${host}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json() as { models?: Array<{ name: string; size?: number; modified_at?: string }> };
      res.json({
        online: true,
        host,
        models: data.models || [],
        message: 'Ollama server connected successfully',
      });
    } else {
      res.json({
        online: false,
        host,
        models: [],
        message: `Ollama responded with HTTP ${resp.status}`,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Connection failed';
    res.json({
      online: false,
      host,
      models: [],
      message: `Cannot reach Ollama at ${host}. Make sure Ollama is running (e.g. OLLAMA_ORIGINS="*" ollama serve). (${errorMsg})`,
    });
  }
});

// Ollama chat proxy endpoint
app.post('/api/ollama/chat', async (req: Request, res: Response) => {
  const { model, messages, host = 'http://127.0.0.1:11434', stream = true } = req.body;

  try {
    const cleanModel = (model as string).replace(/^ollama:/, '');
    const ollamaMessages = (messages as Array<{ role: string; content: string }>).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
      content: m.content,
    }));

    const response = await fetch(`${host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: cleanModel,
        messages: ollamaMessages,
        stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Ollama error (${response.status}): ${errorText}`,
      });
    }

    if (!stream) {
      const json = await response.json();
      return res.json(json);
    }

    // Streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: 'Failed to read response from Ollama' });
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.trim().length > 0);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const content = parsed.message?.content || '';
          if (content) {
            res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
          }
          if (parsed.done) {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          }
        } catch {
          // ignore parsing error for partial chunks
        }
      }
    }
    res.end();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown Ollama error';
    if (!res.headersSent) {
      res.status(500).json({ error: errorMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.end();
    }
  }
});

// Gemini chat streaming endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const {
    model = 'gemini-3.8-flash',
    messages = [],
    systemInstruction,
    stream = true,
  } = req.body;

  if (!ai || !apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please add your key to your environment variables or AI Studio Secrets.',
    });
  }

  // Validate allowed Gemini models
  const validGeminiModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'];
  const targetModel = validGeminiModels.includes(model) ? model : 'gemini-3.8-flash';

  try {
    // Format conversation history for Gemini SDK
    // The contents parameter accepts string or array of parts/contents
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> = [];

    for (const msg of messages) {
      const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

      // Add attachments if present (e.g. base64 image or text content)
      if (msg.attachments && Array.isArray(msg.attachments)) {
        for (const att of msg.attachments) {
          if (att.type?.startsWith('image/') && att.base64) {
            parts.push({
              inlineData: {
                mimeType: att.type,
                data: att.base64,
              },
            });
          } else if (att.content) {
            parts.push({
              text: `[File Attachment: ${att.name}]\n${att.content}\n`,
            });
          }
        }
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      if (parts.length > 0) {
        formattedContents.push({ role, parts });
      }
    }

    if (formattedContents.length === 0) {
      return res.status(400).json({ error: 'No content provided in conversation' });
    }

    const defaultSystemInstruction =
      systemInstruction ||
      'You are Moon AI, an intelligent, empathetic, and exceptionally capable AI assistant created by Chandrashekhar Singh. You communicate with clarity, precision, and elegance. Format mathematical formulas in standard notation, write clean code blocks with explicit language tags, and maintain a friendly, humble, and deeply helpful tone.';

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const responseStream = await ai.models.generateContentStream({
        model: targetModel,
        contents: formattedContents,
        config: {
          systemInstruction: defaultSystemInstruction,
        },
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: formattedContents,
        config: {
          systemInstruction: defaultSystemInstruction,
        },
      });

      res.json({
        text: response.text || '',
        model: targetModel,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown generation error';
    console.error('Gemini API Error:', errorMsg);

    let status = 500;
    let userFriendlyMsg = errorMsg;

    if (errorMsg.includes('quota') || errorMsg.includes('ResourceExhausted') || errorMsg.includes('429')) {
      status = 429;
      userFriendlyMsg = 'Gemini API quota exceeded. Please wait a moment before sending another message, or switch models.';
    } else if (errorMsg.includes('API key') || errorMsg.includes('UNAUTHENTICATED')) {
      status = 401;
      userFriendlyMsg = 'Invalid or expired GEMINI_API_KEY. Please verify your API key in AI Studio Secrets.';
    }

    if (!res.headersSent) {
      res.status(status).json({ error: userFriendlyMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: userFriendlyMsg })}\n\n`);
      res.end();
    }
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌙 Moon AI Server running on http://0.0.0.0:${PORT}`);
    console.log(`Created by Chandrashekhar Singh`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Moon AI server:', err);
});
