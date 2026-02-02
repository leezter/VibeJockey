# Vibe Jockey

Vibe Jockey is a responsive, real-time DJing webapp built around Lyria RealTime. It streams 48kHz stereo music, lets you blend prompts, and exposes every Live Music API control for performance-level steering.

## Features
- Real-time WebSocket session controls (play, pause, stop, reset)
- Weighted prompt mixer with presets
- Full Live Music configuration: BPM, guidance, density, brightness, scale, temperature, topK, seed, and modes
- Bass/drum isolation toggles
- Live metadata and safety warnings display

## Getting started
1. Create a Gemini API key in AI Studio.
2. Copy .env.example to .env and set VITE_GEMINI_API_KEY.
3. Install dependencies: npm install
4. Start the dev server: npm run dev

## Launch instructions
- Development server: npm run dev
- Production build: npm run build
- Preview production build: npm run preview

## Notes
- Audio is instrumental-only and watermarked by the model.
- Change BPM/scale and use Reset Context for best results.
- Keep prompt weights non-zero and evolve them gradually for smooth transitions.
