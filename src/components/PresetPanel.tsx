import type { WeightedPrompt } from '../lib/lyria/types';

const presets: { label: string; prompts: WeightedPrompt[] }[] = [
  {
    label: 'Night drive',
    prompts: [
      { text: 'synthwave', weight: 1.2 },
      { text: 'neon pads', weight: 0.8 },
      { text: 'steady kick', weight: 0.6 },
    ],
  },
  {
    label: 'Warehouse techno',
    prompts: [
      { text: 'industrial techno', weight: 1.0 },
      { text: 'distorted drums', weight: 0.9 },
      { text: 'dark bassline', weight: 0.7 },
    ],
  },
  {
    label: 'Lo-fi study',
    prompts: [
      { text: 'lo-fi hip hop', weight: 1.0 },
      { text: 'vinyl crackle', weight: 0.5 },
      { text: 'warm piano', weight: 0.6 },
    ],
  },
  {
    label: 'Cinematic swell',
    prompts: [
      { text: 'cinematic strings', weight: 1.0 },
      { text: 'soft brass', weight: 0.5 },
      { text: 'dramatic build', weight: 0.7 },
    ],
  },
];

type PresetPanelProps = {
  onApply: (prompts: WeightedPrompt[]) => void;
};

export default function PresetPanel({ onApply }: PresetPanelProps) {
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
            onClick={() => onApply(preset.prompts)}
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
