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
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Instant Vibes</h2>
        <span className="text-xs text-slate-400">Tap to load</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset.prompts)}
            className="rounded-xl border border-slate-700 bg-surface/70 p-4 text-left text-sm text-slate-200 hover:border-accent"
          >
            <div className="font-semibold text-slate-100">{preset.label}</div>
            <div className="mt-2 text-xs text-slate-400">
              {preset.prompts.map((prompt) => prompt.text).join(' • ')}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
