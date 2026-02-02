import type { PlaybackControl } from '../lib/lyria/types';
import type { SessionStatus } from '../state/useLyriaSession';

const statusLabels: Record<SessionStatus, string> = {
  disconnected: 'Disconnected',
  connecting: 'Connecting',
  ready: 'Ready',
  playing: 'Playing',
  paused: 'Paused',
};

type DeckControlsProps = {
  status: SessionStatus;
  apiKey: string;
  model: string;
  setApiKey: (value: string) => void;
  setModel: (value: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onPlayback: (control: PlaybackControl) => void;
};

export default function DeckControls({
  status,
  apiKey,
  model,
  setApiKey,
  setModel,
  onConnect,
  onDisconnect,
  onPlayback,
}: DeckControlsProps) {
  const canConnect = status === 'disconnected';
  const canDisconnect = status !== 'disconnected';
  const canControl = status === 'ready' || status === 'playing' || status === 'paused';

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Session</h2>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
          {statusLabels[status]}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <label className="text-xs uppercase tracking-wide text-slate-400">API Key</label>
        <input
          type="text"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="Paste your Gemini API key"
          autoComplete="off"
          className="input"
        />
        <label className="text-xs uppercase tracking-wide text-slate-400">Model</label>
        <input
          value={model}
          onChange={(event) => setModel(event.target.value)}
          className="input"
        />
        <div className="flex gap-2">
          <button
            onClick={onConnect}
            disabled={!canConnect}
            className="flex-1 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
          >
            Connect
          </button>
          <button
            onClick={onDisconnect}
            disabled={!canDisconnect}
            className="flex-1 rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onPlayback('PLAY')}
          disabled={!canControl}
          className="rounded-xl bg-emerald-400/90 px-3 py-2 text-xs font-semibold text-ink disabled:opacity-40"
        >
          Play
        </button>
        <button
          onClick={() => onPlayback('PAUSE')}
          disabled={!canControl}
          className="rounded-xl bg-amber-400/90 px-3 py-2 text-xs font-semibold text-ink disabled:opacity-40"
        >
          Pause
        </button>
        <button
          onClick={() => onPlayback('STOP')}
          disabled={!canControl}
          className="rounded-xl bg-rose-400/90 px-3 py-2 text-xs font-semibold text-ink disabled:opacity-40"
        >
          Stop
        </button>
        <button
          onClick={() => onPlayback('RESET_CONTEXT')}
          disabled={!canControl}
          className="rounded-xl border border-slate-600 px-3 py-2 text-xs text-slate-200 disabled:opacity-40"
        >
          Reset context
        </button>
      </div>
    </section>
  );
}
