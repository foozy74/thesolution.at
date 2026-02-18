import { useState, useCallback } from 'react';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { CodeBlock } from './components/CodeBlock';

export interface ConfigFile {
  id: string;
  name: string;
  filename: string;
  icon: string;
  description: string;
  category: string;
  securityNotes: string[];
  content: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface FeatureLayer {
  icon: string;
  title: string;
  bgClass: string;
  items: string[];
}

export interface ToolConfig {
  title: string;
  subtitle: string;
  icon: string;
  files: ConfigFile[];
  categories: Category[];
  featureLayers: FeatureLayer[];
}

type ViewMode = 'overview' | 'code';

function SecurityBadge({ note }: { note: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 flex-shrink-0 text-emerald-400">✓</span>
      <span className="text-slate-300">{note}</span>
    </div>
  );
}

function FileCard({
  file,
  isActive,
  onClick,
}: {
  file: ConfigFile;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 glass transition-all duration-200 ${isActive
        ? 'bg-indigo-500/20 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
        : 'hover:bg-white/5 hover:border-white/20'
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{file.icon}</span>
        <div className="min-w-0 flex-1">
          <h3
            className={`font-semibold text-sm truncate ${isActive ? 'text-indigo-300' : 'text-slate-200'
              }`}
          >
            {file.name}
          </h3>
          <p className="text-xs text-slate-500 font-mono truncate">{file.filename}</p>
        </div>
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 animate-pulse" />
        )}
      </div>
    </button>
  );
}

function DownloadAllButton({ files }: { files: ConfigFile[] }) {
  const handleDownloadAll = useCallback(() => {
    files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [files]);

  return (
    <button
      onClick={handleDownloadAll}
      className="btn btn-primary flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download All
    </button>
  );
}

interface ToolTemplateProps {
  config: ToolConfig;
}

export function ToolTemplate({ config }: ToolTemplateProps) {
  const [selectedFile, setSelectedFile] = useState<ConfigFile>(config.files[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const filteredFiles =
    activeCategory === 'all'
      ? config.files
      : config.files.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: '8rem', paddingBottom: '2rem' }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{config.icon}</span>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{config.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              {config.subtitle}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setViewMode('overview')}
            className={`btn ${viewMode === 'overview' ? 'btn-primary' : 'glass'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`btn ${viewMode === 'code' ? 'btn-primary' : 'glass'}`}
          >
            Code
          </button>
          <DownloadAllButton files={config.files} />
        </div>
      </section>

      <section className="container pb-20">
        {viewMode === 'overview' ? (
          <OverviewView config={config} />
        ) : (
          <CodeView
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredFiles={filteredFiles}
            config={config}
          />
        )}
      </section>
    </div>
  );
}

function OverviewView({ config }: { config: ToolConfig }) {
  return (
    <div className="space-y-12">
      <div className="glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🏗️</span> Architecture Overview
          </h3>
        </div>
        <div className="p-6 overflow-x-auto">
          <ArchitectureDiagram />
        </div>
      </div>

      <div className="grid grid-2">
        {config.featureLayers.map((layer, i) => (
          <div
            key={i}
            className="glass p-6 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${layer.bgClass}`}
              >
                {layer.icon}
              </div>
              <div>
                <h4 className="font-bold text-white">{layer.title}</h4>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Feature {i + 1}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {layer.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                  <span className="text-emerald-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeView({
  selectedFile,
  setSelectedFile,
  activeCategory,
  setActiveCategory,
  filteredFiles,
  config,
}: {
  selectedFile: ConfigFile;
  setSelectedFile: (f: ConfigFile) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filteredFiles: ConfigFile[];
  config: ToolConfig;
}) {
  return (
    <div className="grid grid-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">
            Filter Categories
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-md font-bold transition-all ${activeCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
            >
              All
            </button>
            {config.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-md font-bold transition-all ${activeCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">
            Module Files ({filteredFiles.length})
          </h3>
          <div className="space-y-1">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isActive={selectedFile.id === file.id}
                onClick={() => setSelectedFile(file)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-6 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl">{selectedFile.icon}</span>
            <h2 className="text-xl font-bold text-white">{selectedFile.name}</h2>
            <code className="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">
              {selectedFile.filename}
            </code>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{selectedFile.description}</p>
        </div>

        {selectedFile.securityNotes.length > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <span>🛡️</span> Best Practices
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {selectedFile.securityNotes.map((note, i) => (
                <SecurityBadge key={i} note={note} />
              ))}
            </div>
          </div>
        )}

        <CodeBlock code={selectedFile.content} filename={selectedFile.filename} />
      </div>
    </div>
  );
}
