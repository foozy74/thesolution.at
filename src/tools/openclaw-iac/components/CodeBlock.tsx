import React, { useState, useCallback } from 'react';

interface CodeBlockProps {
  code: string;
  filename: string;
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, filename]);

  // Simple syntax highlighting for Terraform
  const highlightedLines = code.split('\n').map((line, i) => {
    let highlighted = line;

    // Comments
    if (line.trimStart().startsWith('#')) {
      return (
        <div key={i} className="text-emerald-400/80 italic">
          {line}
        </div>
      );
    }

    // Strings
    highlighted = line;
    const parts: React.ReactNode[] = [];
    let remaining = highlighted;

    // Match resource/variable/data/output/provider/terraform blocks
    const blockMatch = remaining.match(/^(\s*)(resource|variable|data|output|provider|terraform|backend|module|locals)\s/);
    if (blockMatch) {
      parts.push(<span key={`${i}-ws`}>{blockMatch[1]}</span>);
      parts.push(<span key={`${i}-kw`} className="text-purple-400 font-semibold">{blockMatch[2]}</span>);
      remaining = remaining.slice(blockMatch[0].length - 1);
    }

    // Match attribute assignments
    const attrMatch = line.match(/^(\s+)(\w[\w-]*)(\s*=\s*)/);
    if (attrMatch && !blockMatch) {
      parts.push(<span key={`${i}-ws2`}>{attrMatch[1]}</span>);
      parts.push(<span key={`${i}-attr`} className="text-cyan-300">{attrMatch[2]}</span>);
      parts.push(<span key={`${i}-eq`} className="text-gray-400">{attrMatch[3]}</span>);
      remaining = remaining.slice(attrMatch[0].length);
    }

    if (parts.length === 0) {
      // Highlight strings
      const stringParts = remaining.split(/("(?:[^"\\]|\\.)*")/g);
      return (
        <div key={i}>
          {stringParts.map((part, j) => {
            if (part.startsWith('"') && part.endsWith('"')) {
              return <span key={j} className="text-amber-300">{part}</span>;
            }
            // Highlight booleans and numbers
            const tokenized = part.replace(/\b(true|false|null)\b/g, '###BOOL:$1###')
              .replace(/\b(\d+)\b/g, '###NUM:$1###');
            const tokens = tokenized.split(/(###(?:BOOL|NUM):[^#]+###)/g);
            return tokens.map((token, k) => {
              if (token.startsWith('###BOOL:')) {
                const val = token.replace(/###BOOL:|###/g, '');
                return <span key={`${j}-${k}`} className="text-orange-400">{val}</span>;
              }
              if (token.startsWith('###NUM:')) {
                const val = token.replace(/###NUM:|###/g, '');
                return <span key={`${j}-${k}`} className="text-orange-300">{val}</span>;
              }
              return <span key={`${j}-${k}`} className="text-gray-200">{token}</span>;
            });
          })}
        </div>
      );
    }

    // Handle remaining with strings
    const stringParts = remaining.split(/("(?:[^"\\]|\\.)*")/g);
    return (
      <div key={i}>
        {parts}
        {stringParts.map((part, j) => {
          if (part.startsWith('"') && part.endsWith('"')) {
            return <span key={`r-${j}`} className="text-amber-300">{part}</span>;
          }
          const tokenized = part.replace(/\b(true|false|null)\b/g, '###BOOL:$1###')
            .replace(/\b(\d+)\b/g, '###NUM:$1###');
          const tokens = tokenized.split(/(###(?:BOOL|NUM):[^#]+###)/g);
          return tokens.map((token, k) => {
            if (token.startsWith('###BOOL:')) {
              const val = token.replace(/###BOOL:|###/g, '');
              return <span key={`r-${j}-${k}`} className="text-orange-400">{val}</span>;
            }
            if (token.startsWith('###NUM:')) {
              const val = token.replace(/###NUM:|###/g, '');
              return <span key={`r-${j}-${k}`} className="text-orange-300">{val}</span>;
            }
            return <span key={`r-${j}-${k}`} className="text-gray-200">{token}</span>;
          });
        })}
      </div>
    );
  });

  return (
    <div className="relative group glass overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400">{filename}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all"
            title="Download file"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${copied
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      {/* Code Content */}
      <div className="overflow-x-auto bg-black/40">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code>{highlightedLines}</code>
        </pre>
      </div>
    </div>
  );
}
