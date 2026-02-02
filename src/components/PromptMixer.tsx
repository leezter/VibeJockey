import type { WeightedPrompt } from '../lib/lyria/types';

const presetSuggestions = [
  'minimal techno',
  'deep house',
  'ambient pads',
  'breakbeat drums',
  'acid bass',
  'lo-fi textures',
  'cinematic strings',
  'funk guitar',
  'jazzy keys',
  'dub techno',
  'psychedelic',
  'bright arps',
];

type PromptMixerProps = {
  prompts: WeightedPrompt[];
  onChange: (prompts: WeightedPrompt[]) => void;
  onSend: () => void;
};

export default function PromptMixer({ prompts, onChange, onSend }: PromptMixerProps) {
  const updatePrompt = (index: number, next: Partial<WeightedPrompt>) => {
    const updated = prompts.map((prompt, i) =>
      i === index ? { ...prompt, ...next } : prompt
    );
    onChange(updated);
  };

  const addPrompt = (text = '') => {
    onChange([...prompts, { id: crypto.randomUUID(), text, weight: 1 }]);
  };

  const removePrompt = (index: number) => {
    onChange(prompts.filter((_, i) => i !== index));
  };

  const applySuggestion = (text: string) => {
    const hasSlot = prompts.find((prompt) => !prompt.text.trim());
    if (hasSlot) {
      onChange(
        prompts.map((prompt) =>
          prompt === hasSlot ? { ...prompt, text, weight: 1 } : prompt
        )
      );
      return;
    }
    addPrompt(text);
  };

  return (
    <section className="glass rounded-2xl p-5 shadow-glow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Prompt Mixer</h2>
        <button
          onClick={() => addPrompt()}
          className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:border-accent hover:text-white"
        >
          + Add prompt
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        Blend multiple prompts with weights. Use gradual shifts for smoother transitions.
      </p>
      <div className="mt-4 space-y-3">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="rounded-xl bg-surface/60 p-3">
            <div className="flex items-center gap-2">
              <input
                value={prompt.text}
                onChange={(event) => updatePrompt(index, { text: event.target.value })}
                placeholder="Describe sound, genre, mood, instruments"
                className="flex-1 rounded-lg border border-slate-700 bg-ink/60 px-3 py-2 text-sm"
              />
              <button
                onClick={() => removePrompt(index)}
                className="rounded-lg border border-slate-700 px-2 py-2 text-xs text-slate-400 hover:border-rose-400 hover:text-rose-200"
              >
                Remove
              </button>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.1}
                value={prompt.weight}
                onChange={(event) => updatePrompt(index, { weight: Number(event.target.value) })}
                className="range"
              />
              <span className="w-12 text-right text-sm text-slate-300">
                {prompt.weight.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {presetSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => applySuggestion(suggestion)}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-accent hover:text-white"
          >
            {suggestion}
          </button>
        ))}
      </div>
      <button
        onClick={onSend}
        className="mt-5 w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink hover:bg-glow"
      >
        Send prompts
      </button>
    </section>
  );
}
