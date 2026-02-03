import { useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import DeckControls from './components/DeckControls';
import SettingsModal from './components/SettingsModal';
import PresetPanel from './components/PresetPanel';
import PromptMixer from './components/PromptMixer';
import SessionLog from './components/SessionLog';
import { useLyriaSession } from './state/useLyriaSession';

export default function App() {
  const { state, actions } = useLyriaSession();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27272a] pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-blue-500 bg-blue-950 text-xl font-bold text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              VJ
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-widest text-slate-100 uppercase font-[Rajdhani]">Vibe Jockey</h1>
              <div className="text-xs tracking-[0.4em] text-blue-500 uppercase font-semibold">Generative Audio Interface</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 rounded-sm border border-[#27272a] bg-[#0c0c0e] p-2 shadow-inner">
             <div className="flex items-center gap-3 px-3 border-r border-[#27272a]">
                 <div className={`h-2 w-2 rounded-full ${state.status === 'playing' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}></div>
                 <span className="text-xs font-mono text-slate-400 uppercase">SYS: {state.status.toUpperCase()}</span>
            </div>
            <label className="flex cursor-pointer items-center gap-3 px-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${state.autoApply ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]' : 'text-slate-600'}`}>
                Live Mode
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={state.autoApply}
                  onChange={(event) => actions.setAutoApply(event.target.checked)}
                />
                <div className="h-4 w-8 rounded-sm border border-slate-700 bg-slate-900 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-900/50"></div>
                <div className="absolute left-[3px] top-[3px] h-2.5 w-2.5 rounded-sm bg-slate-500 transition-all peer-checked:translate-x-4 peer-checked:bg-blue-400 shadow-sm"></div>
              </div>
            </label>
            <div className="h-6 w-px bg-[#27272a] mx-2"></div>
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-slate-500 hover:text-blue-400 transition-colors"
                title="Settings"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
        </header>

        <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            status={state.status}
            apiKey={state.apiKey}
            model={state.model}
            setApiKey={actions.setApiKey}
            setModel={actions.setModel}
            onConnect={actions.connect}
            onDisconnect={actions.disconnect}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <DeckControls
              status={state.status}
              onPlayback={actions.sendPlayback}
            />
            <PresetPanel onApply={actions.setPrompts} />
          </div>

          <div className="flex flex-col gap-6">
            <PromptMixer
              prompts={state.prompts}
              onChange={actions.setPrompts}
              onSend={actions.sendPrompts}
            />
            <ConfigPanel
              config={state.config}
              onChange={actions.setConfig}
              onUpdate={() => actions.updateConfig()}
              resetOnUpdate={state.resetOnConfigUpdate}
              setResetOnUpdate={actions.setResetOnConfigUpdate}
            />
          </div>

          <div className="flex flex-col gap-6">
            <section className="panel rounded-sm p-6">
              <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase border-b border-[#27272a] pb-4 mb-4">Operator Manual</h2>
              <ul className="space-y-3 text-[10px] uppercase tracking-wide text-slate-500 font-mono">
                <li className="flex gap-2"><span className="text-blue-500">&gt;</span> Morph sounds by sliding weights</li>
                <li className="flex gap-2"><span className="text-blue-500">&gt;</span> Reset Context on major changes</li>
                <li className="flex gap-2"><span className="text-blue-500">&gt;</span> Buffer handles network jitter</li>
                <li className="flex gap-2"><span className="text-blue-500">&gt;</span> Output is watermarked</li>
              </ul>
            </section>
            <SessionLog
              logs={state.logs}
              metadata={state.lastMetadata}
              onClear={actions.clearLogs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
