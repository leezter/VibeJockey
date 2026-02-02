type SessionLogProps = {
  logs: { id: string; message: string; time: string }[];
  metadata: Record<string, unknown> | null;
  onClear: () => void;
};

export default function SessionLog({ logs, metadata, onClear }: SessionLogProps) {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Session Log</h2>
        <button
          onClick={onClear}
          className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:border-accent"
        >
          Clear
        </button>
      </div>
      <div className="mt-3 h-52 space-y-2 overflow-y-auto pr-2 text-xs text-slate-300">
        {logs.map((entry) => (
          <div key={entry.id} className="rounded-lg bg-surface/70 p-2">
            <div className="text-[10px] text-slate-500">{entry.time}</div>
            <div>{entry.message}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide text-slate-400">Last chunk metadata</div>
        <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-ink/60 p-3 text-[11px] text-slate-300">
          {metadata ? JSON.stringify(metadata, null, 2) : 'No metadata received yet.'}
        </pre>
      </div>
    </section>
  );
}
