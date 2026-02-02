import type {
  LyriaServerMessage,
  MusicGenerationConfig,
  PlaybackControl,
  WeightedPrompt,
} from './types';

const WS_ENDPOINT =
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateMusic';

export type LyriaClientOptions = {
  apiKey: string;
  model: string;
  onMessage: (message: LyriaServerMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
};

export class LyriaClient {
  private socket?: WebSocket;
  private readonly options: LyriaClientOptions;
  private isReady = false;

  constructor(options: LyriaClientOptions) {
    this.options = options;
  }

  connect() {
    const url = `${WS_ENDPOINT}?key=${encodeURIComponent(this.options.apiKey)}`;
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      this.isReady = false;
      this.send({ setup: { model: this.options.model } });
      this.options.onOpen?.();
    };
    this.socket.onmessage = (event) => {
      void this.handleMessage(event.data);
    };
    this.socket.onerror = (event) => {
      this.options.onError?.(event);
    };
    this.socket.onclose = () => {
      this.isReady = false;
      this.options.onClose?.();
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = undefined;
    this.isReady = false;
  }

  sendPrompts(prompts: WeightedPrompt[]) {
    this.ensureReady();
    this.send({
      clientContent: {
        weightedPrompts: prompts.map((prompt) => ({
          text: prompt.text,
          weight: prompt.weight,
        })),
      },
    });
  }

  sendConfig(config: MusicGenerationConfig) {
    this.ensureReady();
    this.send({
      musicGenerationConfig: {
        temperature: config.temperature,
        topK: config.topK,
        seed: config.seed,
        guidance: config.guidance,
        bpm: config.bpm,
        density: config.density,
        brightness: config.brightness,
        scale: config.scale,
        muteBass: config.muteBass,
        muteDrums: config.muteDrums,
        onlyBassAndDrums: config.onlyBassAndDrums,
        musicGenerationMode: config.musicGenerationMode,
      },
    });
  }

  sendPlayback(control: PlaybackControl) {
    this.ensureReady();
    this.send({ playbackControl: control });
  }

  private ensureReady() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Socket not connected.');
    }
  }

  private send(payload: Record<string, unknown>) {
    this.socket?.send(JSON.stringify(payload));
  }

  private async handleMessage(data: MessageEvent['data']) {
    const text = await readAsText(data);
    const message = JSON.parse(text) as LyriaServerMessage;
    if ('setupComplete' in message || 'setup_complete' in message) {
      this.isReady = true;
    }
    this.options.onMessage(message);
  }
}

async function readAsText(data: MessageEvent['data']) {
  if (typeof data === 'string') {
    return data;
  }
  if (data instanceof Blob) {
    return data.text();
  }
  if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data);
  }
  if (data && ArrayBuffer.isView(data)) {
    return new TextDecoder().decode(data);
  }
  return String(data);
}
