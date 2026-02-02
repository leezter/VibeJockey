import type { MusicGenerationConfig } from '../lib/lyria/types';
import { generationModes, scaleOptions } from '../state/useLyriaSession';

type ConfigPanelProps = {
  config: MusicGenerationConfig;
  onChange: (config: MusicGenerationConfig) => void;
  onUpdate: () => void;
  resetOnUpdate: boolean;
  setResetOnUpdate: (value: boolean) => void;
};

export default function ConfigPanel({
  config,
  onChange,
  onUpdate,
  resetOnUpdate,
  setResetOnUpdate,
}: ConfigPanelProps) {
  const update = (next: Partial<MusicGenerationConfig>) => onChange({ ...config, ...next });

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generation Controls</h2>
        <button
          onClick={onUpdate}
          className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:border-accent"
        >
          Update config
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Control label="BPM" value={`${config.bpm ?? ''}`}> 
          <input
            type="number"
            min={60}
            max={200}
            value={config.bpm ?? ''}
            onChange={(event) => update({ bpm: Number(event.target.value) })}
            className="input"
          />
        </Control>
        <Control label="Guidance" value={`${config.guidance ?? ''}`}> 
          <input
            type="range"
            min={0}
            max={6}
            step={0.1}
            value={config.guidance ?? 0}
            onChange={(event) => update({ guidance: Number(event.target.value) })}
            className="range"
          />
        </Control>
        <Control label="Density" value={`${config.density ?? ''}`}> 
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={config.density ?? 0}
            onChange={(event) => update({ density: Number(event.target.value) })}
            className="range"
          />
        </Control>
        <Control label="Brightness" value={`${config.brightness ?? ''}`}> 
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={config.brightness ?? 0}
            onChange={(event) => update({ brightness: Number(event.target.value) })}
            className="range"
          />
        </Control>
        <Control label="Temperature" value={`${config.temperature ?? ''}`}> 
          <input
            type="range"
            min={0}
            max={3}
            step={0.05}
            value={config.temperature ?? 0}
            onChange={(event) => update({ temperature: Number(event.target.value) })}
            className="range"
          />
        </Control>
        <Control label="Top K" value={`${config.topK ?? ''}`}> 
          <input
            type="number"
            min={1}
            max={1000}
            value={config.topK ?? ''}
            onChange={(event) => update({ topK: Number(event.target.value) })}
            className="input"
          />
        </Control>
        <Control label="Seed" value={`${config.seed ?? ''}`}> 
          <input
            type="number"
            min={0}
            max={2147483647}
            value={config.seed ?? ''}
            onChange={(event) =>
              update({ seed: event.target.value === '' ? undefined : Number(event.target.value) })
            }
            className="input"
          />
        </Control>
        <Control label="Scale" value={config.scale ?? ''}> 
          <select
            value={config.scale ?? 'SCALE_UNSPECIFIED'}
            onChange={(event) => update({ scale: event.target.value as MusicGenerationConfig['scale'] })}
            className="input"
          >
            {scaleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Control>
        <Control label="Mode" value={config.musicGenerationMode ?? ''}> 
          <select
            value={config.musicGenerationMode ?? 'QUALITY'}
            onChange={(event) =>
              update({ musicGenerationMode: event.target.value as MusicGenerationConfig['musicGenerationMode'] })
            }
            className="input"
          >
            {generationModes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Control>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={config.muteBass ?? false}
            onChange={(event) => update({ muteBass: event.target.checked })}
          />
          Mute bass
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={config.muteDrums ?? false}
            onChange={(event) => update({ muteDrums: event.target.checked })}
          />
          Mute drums
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={config.onlyBassAndDrums ?? false}
            onChange={(event) => update({ onlyBassAndDrums: event.target.checked })}
          />
          Only bass + drums
        </label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-400">
        <input
          type="checkbox"
          checked={resetOnUpdate}
          onChange={(event) => setResetOnUpdate(event.target.checked)}
        />
        Reset context after config update (recommended for BPM or scale changes)
      </label>
    </section>
  );
}

function Control({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
