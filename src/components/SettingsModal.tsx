import type { SessionStatus } from '../state/useLyriaSession';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  status: SessionStatus;
  apiKey: string;
  model: string;
  setApiKey: (value: string) => void;
  setModel: (value: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  status,
  apiKey,
  model,
  setApiKey,
  setModel,
  onConnect,
  onDisconnect,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const canConnect = status === 'disconnected';
  const canDisconnect = status !== 'disconnected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="panel w-full max-w-md rounded-sm p-6 relative bg-[#0c0c0e] border border-[#27272a] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase border-b border-[#27272a] pb-4 mb-4">Settings</h2>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Input Config</h3>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Google API Key</label>
                        <input
                        type="password"
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        placeholder="Key..."
                        autoComplete="off"
                        className="input-field w-full"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Model</label>
                        <input
                        value={model}
                        onChange={(event) => setModel(event.target.value)}
                        className="input-field w-full"
                        />
                    </div>
                    
                    <div className="pt-2 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => { onConnect(); onClose(); }}
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
            </div>
        </div>
      </div>
    </div>
  );
}
