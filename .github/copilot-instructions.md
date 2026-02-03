# Copilot Instructions for Vibe Jockey

## Project Overview
Vibe Jockey is a real-time DJing interface for the Lyria music generation model. It is a Single Page Application (SPA) built with:
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **API:** Google Gemini / Lyria RealTime via WebSockets

## Architecture specific for AI Context

### Core Libraries (`/src/lib`)
- **`lyria/LyriaClient.ts`**: The low-level WebSocket client. It manages the connection state, sends commands (Create, Predict, Edit), and handles incoming responses.
- **`audio/PcmPlayer.ts`**: Handles raw audio playback. It uses the Web Audio API (`AudioContext`) to schedule buffer nodes. It is crucial for gapless playback of the streamed chunks.

### Components (`/src/components`)
- **`ConfigPanel.tsx`**: Controls for generation parameters (Temperature, TopK, Guidance).
- **`DeckControls.tsx`**: Transport controls (Play, Pause, Reset).
- **`PromptMixer.tsx`**: Allows blending of different text prompts with weights.
- **`PresetPanel.tsx`**: Quick access to predefined configurations.
- **`SessionLog.tsx`**: detailed logs of WebSocket events for debugging.

### State Management
- **`state/useLyriaSession.ts`**: A custom hook that instantiates the `LyriaClient` and `PcmPlayer`. It exposes the state and control functions to the React components.

## Development Guidelines

1. **Audio Latency**: When modifying `PcmPlayer` or `LyriaClient`, prioritize low latency and seamless buffer scheduling.
2. **Type Safety**: Maintain strict typing for the connection messages in `lyria/types.ts`.
3. **Styling**: Use utility classes (Tailwind) for all styling. Avoid custom CSS files unless necessary for complex animations.
4. **Environment Variables**: The API key is loaded from `import.meta.env.VITE_GEMINI_API_KEY`. Never hardcode keys.

## Running the Application
When helping the user run or debug the app:
- Verify `.env` exists with the API key.
- Commands:
    - `npm install` (First time)
    - `npm run dev` (Start server)

