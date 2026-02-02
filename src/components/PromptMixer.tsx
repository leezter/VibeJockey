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
    <section className="panel rounded-sm p-6 pb-10 flex flex-col h-full min-h-[450px]">
      <div className="flex items-center justify-between border-b border-[#27272a] pb-4 mb-4">
        <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Prompt Mixer</h2>
        <button
          onClick={() => addPrompt()}
          className="btn-pad text-xs py-1 hover:border-blue-500 hover:text-blue-400"
        >
          + ADD CHANNEL
        </button>
      </div>
      <p className="text-xs text-slate-500 mb-4 font-mono">
        // BLEND PROMPTS TO MORPH AUDIO TEXTURE
      </p>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="relative rounded-sm border border-[#27272a] bg-[#0c0c0e] p-3 shadow-lg group hover:border-slate-700 transition-colors">
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${prompt.weight > 1 ? 'bg-blue-600 shadow-[0_0_8px_#2563eb]' : 'bg-slate-800'}`}></div>
            <div className="pl-3 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-[#1f1f22] pb-2">
                  <span className="text-[10px] font-mono text-slate-600">CH{index + 1}</span>
                  <input
                      value={prompt.text}
                      onChange={(event) => updatePrompt(index, { text: event.target.value })}
                      placeholder="Input sound description..."
                      className="flex-1 bg-transparent border-none p-0 text-sm font-medium text-slate-300 placeholder-slate-700 focus:ring-0 font-[Rajdhani]"
                  />
                  <button
                      onClick={() => removePrompt(index)}
                      className="text-[10px] text-slate-600 hover:text-rose-500 uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                      [X]
                  </button>
                </div>
                
                <div className="flex items-center gap-4 bg-[#08080a] p-2 rounded-sm border border-[#1f1f22] input-group-hover:border-slate-600 transition-colors">
                    <span className="text-[10px] font-mono text-slate-500 w-8">WGT</span>
                    <input
                        type="range"
                        min={0.1}
                        max={3}
                        step={0.1}
                        value={prompt.weight}
                        onChange={(event) => updatePrompt(index, { weight: Number(event.target.value) })}
                        className="w-full h-6 accent-blue-500"
                    />
                    <div className="w-12 text-right">
                       <span className={`text-xs font-mono font-bold ${prompt.weight > 1.0 ? 'text-blue-400' : 'text-slate-500'}`}>
                          {prompt.weight.toFixed(1)}
                       </span>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-[#27272a] pt-4">
         <div className="flex flex-wrap gap-2 pb-4">
            {presetSuggestions.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => applySuggestion(tag)}
                  className="text-[10px] uppercase font-bold tracking-wider text-slate-600 hover:text-blue-400 border border-[#1f1f22] hover:border-blue-900 bg-[#0c0c0e] px-2 py-1 rounded-sm transition-all"
                >
                    {tag}
                </button>
            ))}
         </div>
         <button
            onClick={onSend}
            className="w-full btn-pad btn-primary py-3 uppercase tracking-widest text-xs"
        >
            Deploy Prompts
        </button>
      </div>
    </section>
  );
}
