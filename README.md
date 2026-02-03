# Vibe Jockey

Vibe Jockey is a responsive, real-time DJing webapp built around Lyria RealTime. It streams 48kHz stereo music, lets you blend prompts, and exposes every Live Music API control for performance-level steering.

## Features
- Real-time WebSocket session controls (play, pause, stop, reset)
- Weighted prompt mixer with presets
- Full Live Music configuration: BPM, guidance, density, brightness, scale, temperature, topK, seed, and modes
- Bass/drum isolation toggles
- Live metadata and safety warnings display

## How it Works
Vibe Jockey is a client-side React application that directly connects to the music generation API via WebSockets.

**Core Components:**
- **LyriaClient:** Handles WebSocket communication, including session management and audio chunk buffering.
- **PcmPlayer:** A dedicated audio processor that queues and plays back the raw PCM audio data received from the model.
- **React State:** `useLyriaSession` hook bridges the imperative WebSocket events with the declarative React UI.

**Data Flow:**
1. User configures settings (BPM, prompts) in the UI.
2. `LyriaClient` sends a JSON message to the server.
3. Server streams back PCM audio chunks and metadata events.
4. `PcmPlayer` schedules audio playback for seamless streaming.
5. UI updates in real-time to show beat progress and generation status.

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
