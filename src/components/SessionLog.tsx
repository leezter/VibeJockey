import { useState } from 'react';

type SessionLogProps = {
  logs: { id: string; message: string; time: string }[];
  metadata: Record<string, unknown> | null;
  onClear: () => void;
};

export default function SessionLog({ logs, metadata, onClear }: SessionLogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`panel rounded-sm p-6 flex flex-col ${isOpen ? 'flex-1 h-full min-h-[300px]' : ''}`}>
      <div 
        className={`flex items-center justify-between border-b border-[#27272a] pb-4 ${isOpen ? 'mb-4' : ''} cursor-pointer select-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
           <span className={`text-slate-400 text-xs transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
             ▶
           </span>
           <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">System Log</h2>
        </div>
        {isOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-[10px] text-slate-500 hover:text-rose-500 uppercase tracking-wider font-bold"
          >
            [ Clear Buffer ]
          </button>
        )}
      </div>
      
      {isOpen && (
        <>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar font-mono text-xs space-y-1 mb-4 h-48">
            {logs.length === 0 && <div className="text-slate-700 italic">&gt; system idle...</div>}
            {logs.map((entry) => (
              <div key={entry.id} className="flex gap-3 text-slate-400 border-b border-[#1f1f22] pb-1 last:border-0 hover:text-slate-200 transition-colors">
                <span className="text-slate-600 shrink-0 select-none">[{entry.time}]</span>
                <span className="text-emerald-500/80">&gt;</span>
                <span className="break-all">{entry.message}</span>
              </div>
            ))}
          </div>
          
           <div className="mt-auto border-t border-[#27272a] pt-4">
            <div className="text-[10px] uppercase tracking-wide text-slate-600 mb-2 font-bold">Last Packet Metadata</div>
            <pre className="h-32 overflow-auto rounded-sm bg-[#08080a] p-3 text-[10px] text-blue-400 font-mono border border-[#1f1f22]">
              {metadata ? JSON.stringify(metadata, null, 2) : '// No incoming stream data'}
            </pre>
          </div>
        </>
      )}
    </section>
  );
}
