import type { WeightedPrompt } from '../lib/lyria/types';

const presets: { label: string; prompts: WeightedPrompt[] }[] = [
  {
    label: 'Night drive',
    prompts: [
      { id: crypto.randomUUID(), text: 'synthwave', weight: 1.2 },
      { id: crypto.randomUUID(), text: 'neon pads', weight: 0.8 },
      { id: crypto.randomUUID(), text: 'steady kick', weight: 0.6 },
    ],
  },
  {
    label: 'Warehouse techno',
    prompts: [
      { id: crypto.randomUUID(), text: 'industrial techno', weight: 1.0 },
      { id: crypto.randomUUID(), text: 'distorted drums', weight: 0.9 },
      { id: crypto.randomUUID(), text: 'dark bassline', weight: 0.7 },
    ],
  },
  {
    label: 'Lo-fi study',
    prompts: [
      { id: crypto.randomUUID(), text: 'lo-fi hip hop', weight: 1.0 },
      { id: crypto.randomUUID(), text: 'vinyl crackle', weight: 0.5 },
      { id: crypto.randomUUID(), text: 'warm piano', weight: 0.6 },
    ],
  },
  {
    label: 'Cinematic swell',
    prompts: [
      { id: crypto.randomUUID(), text: 'cinematic strings', weight: 1.0 },
      { id: crypto.randomUUID(), text: 'soft brass', weight: 0.5 },
      { id: crypto.randomUUID(), text: 'dramatic build', weight: 0.7 },
    ],
  },
];

type PresetPanelProps = {
  onApply: (prompts: WeightedPrompt[]) => void;
};

export default function PresetPanel({ onApply }: PresetPanelProps) {
  const applyPreset = (prompts: WeightedPrompt[]) => {
    onApply(prompts.map((prompt) => ({ ...prompt, id: crypto.randomUUID() })));
  };

  return (
    <section className="panel rounded-sm p-6 mt-6">
       <div className="flex items-center justify-between border-b border-[#27272a] pb-4 mb-4">
        <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Preset Bank</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset.prompts)}
            className="group relative flex flex-col items-start justify-between h-20 overflow-hidden rounded-sm border border-[#27272a] bg-[#0c0c0e] p-3 transition-all hover:border-blue-500 hover:bg-[#13151a] active:translate-y-[1px] active:border-blue-400"
          >
             <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></div>
             </div>
            <div className="font-bold uppercase tracking-wide text-xs text-slate-300 group-hover:text-white font-[Rajdhani]">{preset.label}</div>
            <div className="w-full text-[10px] text-slate-600 truncate font-mono group-hover:text-blue-400 uppercase">
              {preset.prompts.map((prompt) => prompt.text).slice(0, 2).join(' / ')}..
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
