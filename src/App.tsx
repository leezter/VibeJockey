import ConfigPanel from './components/ConfigPanel';
import DeckControls from './components/DeckControls';
import PresetPanel from './components/PresetPanel';
import PromptMixer from './components/PromptMixer';
import SessionLog from './components/SessionLog';
import { useLyriaSession } from './state/useLyriaSession';

export default function App() {
  const { state, actions } = useLyriaSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-slate-950 to-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Vibe Jockey</div>
            <h1 className="text-3xl font-semibold text-slate-100">Live Lyria Control Deck</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={state.autoApply}
                onChange={(event) => actions.setAutoApply(event.target.checked)}
              />
              Live apply
            </label>
            <div className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-300">
              Real-time Lyria session • 48kHz stereo
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <DeckControls
              status={state.status}
              apiKey={state.apiKey}
              model={state.model}
              setApiKey={actions.setApiKey}
              setModel={actions.setModel}
              onConnect={actions.connect}
              onDisconnect={actions.disconnect}
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
            <section className="glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold">Live Tips</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Keep prompt weights non-zero and adjust gradually for smooth morphs.</li>
                <li>Use Reset Context after changing BPM or scale for accurate results.</li>
                <li>Buffered playback keeps audio smooth under network jitter.</li>
                <li>Model outputs are instrumental-only and watermarked.</li>
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
