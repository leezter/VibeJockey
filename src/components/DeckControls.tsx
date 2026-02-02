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
    <section className="panel rounded-sm p-6 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-50"></div>
      
      <div className="flex items-center justify-between border-b border-[#27272a] pb-4 mb-4">
        <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Input Config</h2>
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${status === 'disconnected' ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{statusLabels[status].toUpperCase()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Google API Key</label>
            <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Key..."
            autoComplete="off"
            className="input-field"
            />
        </div>
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Model</label>
            <input
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="input-field"
            />
        </div>
        
        <div className="pt-2 grid grid-cols-2 gap-3">
          <button
            onClick={onConnect}
            disabled={!canConnect}
            className={`btn-pad ${!canConnect ? 'opacity-50 cursor-not-allowed' : 'btn-primary'}`}
          >
            LINK
          </button>
          <button
            onClick={onDisconnect}
            disabled={!canDisconnect}
            className={`btn-pad ${!canDisconnect ? 'opacity-50 cursor-not-allowed' : 'border-rose-900 text-rose-500 hover:border-rose-500'}`}
          >
            UNLINK
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-[#27272a] pt-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Transport</h3>
        <div className="grid grid-cols-2 gap-3">
            <button
            onClick={() => onPlayback('PLAY')}
            disabled={!canControl}
            className={`btn-pad btn-play ${!canControl && 'opacity-30'}`}
            >
            ▶ PLAY
            </button>
            <button
            onClick={() => onPlayback('PAUSE')}
            disabled={!canControl}
            className={`btn-pad border-amber-900 bg-amber-950/30 text-amber-500 ${!canControl && 'opacity-30'}`}
            >
            II PAUSE
            </button>
            <button
            onClick={() => onPlayback('STOP')}
            disabled={!canControl}
            className={`btn-pad btn-stop ${!canControl && 'opacity-30'}`}
            >
            ■ STOP
            </button>
             <button
            onClick={() => onPlayback('RESET_CONTEXT')}
            disabled={!canControl}
            className="btn-pad text-xs"
            >
            RESET
            </button>
        </div>
      </div>
    </section>
  );
}
