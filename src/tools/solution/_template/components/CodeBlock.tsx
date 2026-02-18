export function CodeBlock({ code, filename }: { code: string; filename: string }) {
  return (
    <div className="glass overflow-hidden">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between bg-white/5">
        <span className="text-xs font-mono text-slate-400">{filename}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-slate-500 hover:text-white transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
