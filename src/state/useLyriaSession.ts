import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LyriaClient } from '../lib/lyria/LyriaClient';
import { PcmPlayer } from '../lib/audio/PcmPlayer';
import type {
  LyriaServerMessage,
  MusicGenerationConfig,
  PlaybackControl,
  WeightedPrompt,
  FilteredPrompt,
  Scale,
  MusicGenerationMode,
} from '../lib/lyria/types';

export type SessionStatus = 'disconnected' | 'connecting' | 'ready' | 'playing' | 'paused';

const DEFAULT_PROMPTS: WeightedPrompt[] = [
  { id: crypto.randomUUID(), text: 'minimal techno', weight: 1.0 },
  { id: crypto.randomUUID(), text: 'warm synth bass', weight: 0.6 },
];

const DEFAULT_CONFIG: MusicGenerationConfig = {
  temperature: 1.1,
  topK: 40,
  guidance: 4,
  bpm: 120,
  density: 0.5,
  brightness: 0.55,
  scale: 'SCALE_UNSPECIFIED',
  muteBass: false,
  muteDrums: false,
  onlyBassAndDrums: false,
  musicGenerationMode: 'QUALITY',
};

const defaultLog = (message: string) => ({
  id: crypto.randomUUID(),
  message,
  time: new Date().toLocaleTimeString(),
});

export const scaleOptions: { label: string; value: Scale }[] = [
  { label: 'Auto (model decides)', value: 'SCALE_UNSPECIFIED' },
  { label: 'C major / A minor', value: 'C_MAJOR_A_MINOR' },
  { label: 'D♭ major / B♭ minor', value: 'D_FLAT_MAJOR_B_FLAT_MINOR' },
  { label: 'D major / B minor', value: 'D_MAJOR_B_MINOR' },
  { label: 'E♭ major / C minor', value: 'E_FLAT_MAJOR_C_MINOR' },
  { label: 'E major / C♯/D♭ minor', value: 'E_MAJOR_D_FLAT_MINOR' },
  { label: 'F major / D minor', value: 'F_MAJOR_D_MINOR' },
  { label: 'G♭ major / E♭ minor', value: 'G_FLAT_MAJOR_E_FLAT_MINOR' },
  { label: 'G major / E minor', value: 'G_MAJOR_E_MINOR' },
  { label: 'A♭ major / F minor', value: 'A_FLAT_MAJOR_F_MINOR' },
  { label: 'A major / F♯/G♭ minor', value: 'A_MAJOR_G_FLAT_MINOR' },
  { label: 'B♭ major / G minor', value: 'B_FLAT_MAJOR_G_MINOR' },
  { label: 'B major / G♯/A♭ minor', value: 'B_MAJOR_A_FLAT_MINOR' },
];

export const generationModes: { label: string; value: MusicGenerationMode }[] = [
  { label: 'Quality', value: 'QUALITY' },
  { label: 'Diversity', value: 'DIVERSITY' },
  { label: 'Vocalization', value: 'VOCALIZATION' },
];

export function useLyriaSession() {
  const [status, setStatus] = useState<SessionStatus>('disconnected');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY ?? '');
  const [model, setModel] = useState('models/lyria-realtime-exp');
  const [prompts, setPrompts] = useState<WeightedPrompt[]>(DEFAULT_PROMPTS);
  const [config, setConfig] = useState<MusicGenerationConfig>(DEFAULT_CONFIG);
  const [logs, setLogs] = useState([defaultLog('Ready to connect to Lyria RealTime.')]);
  const [lastMetadata, setLastMetadata] = useState<Record<string, unknown> | null>(null);
  const [resetOnConfigUpdate, setResetOnConfigUpdate] = useState(true);
  const [autoApply, setAutoApply] = useState(true);

  const clientRef = useRef<LyriaClient | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);

  const log = useCallback((message: string) => {
    setLogs((current) => [defaultLog(message), ...current].slice(0, 50));
  }, []);

  const handleServerMessage = useCallback(
    (message: LyriaServerMessage) => {
      if ('setupComplete' in message || 'setup_complete' in message) {
        setStatus('ready');
        log('Session ready. Send prompts and press Play.');
        return;
      }

      if ('warning' in message) {
        log(`Warning: ${message.warning}`);
        return;
      }

      if ('filteredPrompt' in message || 'filtered_prompt' in message) {
        const filtered = (
          'filteredPrompt' in message ? message.filteredPrompt : message.filtered_prompt
        ) as FilteredPrompt | undefined;
        log(`Filtered prompt: ${filtered?.filteredReason ?? filtered?.filtered_reason ?? 'Unknown reason'}`);
        return;
      }

      if ('serverContent' in message) {
        const content = message.serverContent;
        const chunks = content.audioChunks ?? content.audio_chunks ?? [];
        for (const chunk of chunks) {
          const data = chunk.data;
          if (!data) {
            continue;
          }
          const bytes = decodeBase64(data);
          playerRef.current?.enqueue(bytes);
          const metadata = chunk.sourceMetadata ?? chunk.source_metadata ?? null;
          if (metadata) {
            setLastMetadata(metadata as Record<string, unknown>);
          }
        }
      }
    },
    [log]
  );

  const connect = useCallback(async () => {
    if (!apiKey.trim()) {
      log('Add your API key before connecting.');
      return;
    }
    if (status !== 'disconnected') {
      return;
    }
    setStatus('connecting');
    playerRef.current = new PcmPlayer();
    await playerRef.current.ensureStarted();
    clientRef.current = new LyriaClient({
      apiKey,
      model,
      onMessage: handleServerMessage,
      onOpen: () => log('Socket opened. Waiting for setup...'),
      onClose: () => {
        setStatus('disconnected');
        log('Disconnected from Lyria RealTime.');
      },
      onError: () => {
        log('Socket error. Check key and network.');
      },
    });
    clientRef.current.connect();
  }, [apiKey, handleServerMessage, log, model, status]);

  const disconnect = useCallback(async () => {
    clientRef.current?.disconnect();
    clientRef.current = null;
    await playerRef.current?.reset();
    playerRef.current = null;
    setStatus('disconnected');
    log('Session closed.');
  }, [log]);

  const sendPrompts = useCallback(() => {
    try {
      clientRef.current?.sendPrompts(prompts);
      log('Prompts sent to Lyria.');
    } catch (error) {
      log((error as Error).message);
    }
  }, [log, prompts]);

  const updateConfig = useCallback(
    (options?: { resetContext?: boolean }) => {
      try {
        clientRef.current?.sendConfig(config);
        log('Generation config updated.');
        if (options?.resetContext ?? resetOnConfigUpdate) {
          clientRef.current?.sendPlayback('RESET_CONTEXT');
          log('Context reset after config change.');
        }
      } catch (error) {
        log((error as Error).message);
      }
    },
    [config, log, resetOnConfigUpdate]
  );

  const sendPlayback = useCallback(
    (control: PlaybackControl) => {
      try {
        clientRef.current?.sendPlayback(control);
        if (control === 'PLAY') {
          setStatus('playing');
          log('Playback started.');
          playerRef.current?.ensureStarted();
        }
        if (control === 'PAUSE') {
          setStatus('paused');
          log('Playback paused.');
        }
        if (control === 'STOP') {
          setStatus('ready');
          playerRef.current?.reset();
          log('Playback stopped and context reset.');
        }
        if (control === 'RESET_CONTEXT') {
          log('Context reset.');
        }
      } catch (error) {
        log((error as Error).message);
      }
    },
    [log]
  );

  const clearLogs = useCallback(() => {
    setLogs([defaultLog('Log cleared.')]);
  }, []);

  const canSend = status === 'ready' || status === 'playing' || status === 'paused';

  useEffect(() => {
    if (!autoApply || !canSend) {
      return;
    }
    const timer = window.setTimeout(() => {
      sendPrompts();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [autoApply, canSend, prompts, sendPrompts]);

  useEffect(() => {
    if (!autoApply || !canSend) {
      return;
    }
    const timer = window.setTimeout(() => {
      updateConfig();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [autoApply, canSend, config, updateConfig]);

  const state = useMemo(
    () => ({
      status,
      apiKey,
      model,
      prompts,
      config,
      logs,
      lastMetadata,
      resetOnConfigUpdate,
      autoApply,
    }),
    [status, apiKey, model, prompts, config, logs, lastMetadata, resetOnConfigUpdate, autoApply]
  );

  const actions = useMemo(
    () => ({
      setApiKey,
      setModel,
      setPrompts,
      setConfig,
      setResetOnConfigUpdate,
      setAutoApply,
      connect,
      disconnect,
      sendPrompts,
      updateConfig,
      sendPlayback,
      clearLogs,
    }),
    [
      clearLogs,
      connect,
      disconnect,
      sendPlayback,
      sendPrompts,
      updateConfig,
      setApiKey,
      setConfig,
      setModel,
      setPrompts,
      setResetOnConfigUpdate,
      setAutoApply,
    ]
  );

  return { state, actions };
}

function decodeBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
