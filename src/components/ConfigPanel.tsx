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
    <section className="panel rounded-sm p-6 pb-12">
      <div className="flex items-center justify-between border-b border-[#27272a] pb-4 mb-4">
        <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Sys Config</h2>
        <button
          onClick={onUpdate}
          className="btn-pad text-xs py-1 hover:border-blue-500 hover:text-blue-400"
        >
          FORCE UPDATE
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Control label="BPM" value={`${config.bpm ?? ''}`}> 
          <input
            type="number"
            min={60}
            max={200}
            value={config.bpm ?? ''}
            onChange={(event) => update({ bpm: Number(event.target.value) })}
            className="input-field"
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
            className="w-full h-6 accent-blue-500"
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
            className="w-full h-6 accent-blue-500"
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
            className="w-full h-6 accent-blue-500"
            />
        </Control>

        <Control label="Musical Scale" value={''}> 
            <select
            value={config.scale ?? 'SCALE_UNSPECIFIED'}
            onChange={(event) => update({ scale: event.target.value as MusicGenerationConfig['scale'] })}
            className="input-field"
            >
            {scaleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
            ))}
            </select>
        </Control>
        
        <Control label="Mode" value={''}> 
            <select
            value={config.musicGenerationMode ?? 'QUALITY'}
            onChange={(event) =>
                update({ musicGenerationMode: event.target.value as MusicGenerationConfig['musicGenerationMode'] })
            }
            className="input-field"
            >
            {generationModes.map((option) => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
            ))}
            </select>
        </Control>
      </div>
       
       <div className="mt-6 border-t border-[#27272a] pt-4">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Tuning</h3>
           <div className="grid grid-cols-2 gap-4">
             <Control label="Brightness" value={`${config.brightness ?? ''}`}> 
                <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={config.brightness ?? 0}
                onChange={(event) => update({ brightness: Number(event.target.value) })}
                className="w-full h-6 accent-blue-500"
                />
             </Control>
              <Control label="Top K" value={`${config.topK ?? ''}`}> 
                <input
                    type="number"
                    min={1}
                    max={1000}
                    value={config.topK ?? ''}
                    onChange={(event) => update({ topK: Number(event.target.value) })}
                    className="input-field"
                />
             </Control>
           </div>
       </div>

      <div className="mt-6 border-t border-[#27272a] pt-4">
           <div className="flex gap-4">
            <Toggle label="Mute Bass" checked={config.muteBass} onChange={(c) => update({ muteBass: c })} />
            <Toggle label="Mute Drums" checked={config.muteDrums} onChange={(c) => update({ muteDrums: c })} />
            <Toggle label="Bass Only" checked={config.onlyBassAndDrums} onChange={(c) => update({ onlyBassAndDrums: c })} />
          </div>
      </div>
      
       <div className="mt-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        checked={resetOnUpdate}
                        onChange={(event) => setResetOnUpdate(event.target.checked)}
                     />
                    <div className="w-9 h-5 bg-slate-800 rounded-sm peer-checked:bg-blue-900 border border-slate-700 transition-colors"></div>
                     <div className="absolute left-[3px] top-[3px] bg-slate-500 w-3.5 h-3.5 rounded-sm transition-all peer-checked:translate-x-4 peer-checked:bg-blue-400"></div>
                </div>
                 <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Auto Reset Context</span>
            </label>
      </div>
    </section>
  );
}

function Control({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</label>
        <span className="font-mono text-[10px] text-blue-400 font-bold">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked?: boolean; onChange: (c: boolean) => void }) {
    return (
        <label className={`flex items-center gap-2 px-3 py-1 rounded-sm border cursor-pointer transition-all ${checked ? 'bg-blue-900/30 border-blue-500 text-blue-300' : 'bg-[#0c0c0e] border-[#27272a] text-slate-500 hover:border-slate-600'}`}>
            <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="w-2 h-2 rounded-full bg-current shadow-[0_0_5px_currentColor]" style={{opacity: checked ? 1 : 0.2}}></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </label>
    )
}
