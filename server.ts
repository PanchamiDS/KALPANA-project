import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Copilot Endpoint
app.post('/api/copilot', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.json({
        reply: "VYOM-1 Telemetry System Online. Team ASTRYX-K4 engineered this reusable green microlauncher with a 9-engine solid booster first stage and an eco-friendly HTPB + liquid N₂O hybrid second stage. It delivers 50 kg to 500 km Sun-Synchronous Orbit (SSO) with up to 60% cost reduction, returning to an autonomous drone ship in the Bay of Bengal within 72 hours turnaround.",
        offline: true,
      });
    }

    const systemInstruction = `You are the Aerospace AI Mission Specialist & Telemetry Flight Director for Team ASTRYX-K4.
Team Profile:
- Team Name: Team ASTRYX-K4
- Team Lead: Srishti (Mission Architecture & Systems Integration)
- Propulsion Lead: Vivek Matadu (Hybrid Rocket Propulsion, HTPB grain + liquid N2O oxidizer)
- Avionics & GNC Lead: Sriharsha (Guidance, Navigation & Control, Grid Fin Aerodynamics, Drone ship landing algorithms)
- Payload & Ground Operations Lead: Panchami (CubeSat dispenser integration, Campus ground station network)
- Team Creed: "Dreaming beyond limits, building beyond boundaries! ASTRYX-K4 — Let’s reach beyond!"
- AI Usage: Openly acknowledges and celebrates AI tools in mission design, fluid dynamics simulation, trajectory optimization, and media generation.

Rocket Specifications (VYOM-1):
- Type: 2-stage reusable green microlauncher
- Launch site: Satish Dhawan Space Centre (SDSC SHAR), Sriharikota, India
- Stage 1: 9-engine solid rocket booster cluster, equipped with titanium grid fins and cold-gas thrusters for controlled atmospheric re-entry. 3-engine propulsive landing burn on an autonomous sea-going drone ship in the Bay of Bengal.
- Stage 2: Green hybrid engine utilizing solid Hydroxyl-Terminated Polybutadiene (HTPB) fuel grain and liquid Nitrous Oxide (N2O) oxidizer. Single vacuum-optimized nozzle for precision orbital insertion.
- Max Q: T+ 2 minutes 30 seconds
- Stage Separation: ~70 km altitude
- Payload Capacity: 50 kg into a 500 km Sun-Synchronous Orbit (SSO)
- Primary Payloads: 3 to 6 CubeSats for university student experiments, crop monitoring, disaster tracking, and climate observation.
- Economics: Up to 60% launch cost reduction through booster reusability; 72-hour turnaround inspection & re-fueling cycle.
- Roadmap: Crew-rated suborbital/orbital variant and 3-core clustered heavy-lift launcher.

Provide inspiring, scientifically rigorous, and structured answers with clear markdown formatting. Be enthusiastic about Indian student aerospace innovation!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || '' });
  } catch (err: any) {
    console.error('Gemini Copilot Error:', err);
    res.status(500).json({ error: err.message || 'Mission Copilot service temporarily unavailable' });
  }
});

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Team ASTRYX-K4 Server running at http://0.0.0.0:${PORT}`);
});
