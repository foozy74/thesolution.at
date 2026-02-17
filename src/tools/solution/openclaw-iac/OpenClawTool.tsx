import { useState, useCallback } from 'react';
import { terraformFiles, categories, type TerraformFile } from './data/terraformConfigs';
import { CodeBlock } from './components/CodeBlock';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';

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
  file: TerraformFile;
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

function DownloadAllButton() {
  const handleDownloadAll = useCallback(() => {
    terraformFiles.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

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

type ViewMode = 'overview' | 'code';

export function OpenClawTool() {
  const [selectedFile, setSelectedFile] = useState<TerraformFile>(terraformFiles[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const filteredFiles =
    activeCategory === 'all'
      ? terraformFiles
      : terraformFiles.filter((f) => f.category === activeCategory);

  const totalLines = terraformFiles.reduce(
    (acc, f) => acc + f.content.split('\n').length,
    0
  );

  const totalSecurityNotes = terraformFiles.reduce(
    (acc, f) => acc + f.securityNotes.length,
    0
  );

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      {/* Header */}
      <section className="container" style={{ paddingTop: '8rem', paddingBottom: '2rem' }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">🛡️</span>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>OpenClaw IaC</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Secure infrastructure delivery and enterprise-grade automation blueprints.
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
          <DownloadAllButton />
        </div>
      </section>

      {/* Content */}
      <section className="container pb-20">
        {viewMode === 'overview' ? (
          <OverviewView />
        ) : (
          <CodeView
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredFiles={filteredFiles}
          />
        )}
      </section>
    </div>
  );
}

function OverviewView() {
  return (
    <div className="space-y-12">
      {/* Architecture Diagram - First */}
      <div className="glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🏗️</span> Architecture Overview
          </h3>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">OCI Region: eu-frankfurt-1</span>
        </div>
        <div className="p-6 overflow-x-auto">
          <ArchitectureDiagram />
        </div>
      </div>

      {/* Security Layers Grid */}
      <div className="grid grid-2">
        {securityLayers.map((layer, i) => (
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
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Security Layer {i + 1}</p>
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
}: {
  selectedFile: TerraformFile;
  setSelectedFile: (f: TerraformFile) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filteredFiles: TerraformFile[];
}) {
  return (
    <div className="grid grid-2 gap-8">
      {/* Sidebar - File List */}
      <div className="space-y-6">
        {/* Category Filters */}
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
            {categories.map((cat) => (
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

        {/* File List */}
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

      {/* Main Content - Code */}
      <div className="space-y-6">
        {/* File Header Block */}
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

        {/* Security Notes */}
        {selectedFile.securityNotes.length > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <span>🛡️</span> Security Controls
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {selectedFile.securityNotes.map((note, i) => (
                <SecurityBadge key={i} note={note} />
              ))}
            </div>
          </div>
        )}

        {/* Code */}
        <CodeBlock code={selectedFile.content} filename={selectedFile.filename} />
      </div>
    </div>
  );
}

const securityLayers = [
  {
    icon: '🌐',
    title: 'Network Isolation',
    bgClass: 'bg-blue-500/10',
    items: [
      'Private subnets for App & DB',
      'NAT Gateway for controlled egress',
      'Service Gateway for OCI internal',
      'VCN Flow Logs enabled',
    ],
  },
  {
    icon: '🛡️',
    title: 'Web Application Firewall',
    bgClass: 'bg-red-500/10',
    items: [
      'OWASP Top 10 Protection',
      'Rate Limiting (100 req/min)',
      'Bot Detection',
      'Geo-Blocking available',
    ],
  },
  {
    icon: '🔐',
    title: 'Encryption',
    bgClass: 'bg-pink-500/10',
    items: [
      'TLS 1.2+ forced',
      'HSM-backed KMS Keys',
      'Encryption at Rest (AES-256)',
      'mTLS for DB connections',
    ],
  },
  {
    icon: '👤',
    title: 'Identity & Access',
    bgClass: 'bg-purple-500/10',
    items: [
      'Least-Privilege IAM Policies',
      'Workload Identity for OKE',
      'MFA forced',
      'Compartment isolation',
    ],
  },
  {
    icon: '📦',
    title: 'Container Security',
    bgClass: 'bg-indigo-500/10',
    items: [
      'Non-root container',
      'ReadOnly root filesystem',
      'Seccomp profile (RuntimeDefault)',
      'Network policies',
    ],
  },
  {
    icon: '📊',
    title: 'Monitoring & Compliance',
    bgClass: 'bg-cyan-500/10',
    items: [
      'Audit logs (365 days)',
      'Security alarms',
      'Vulnerability scanning',
      'Data Safe integration',
    ],
  },
];

const quickStartSteps = [
  {
    title: 'Clone repository',
    desc: 'Download all .tf files',
  },
  {
    title: 'Configure variables',
    desc: 'Fill terraform.tfvars with OCI credentials',
  },
  {
    title: 'Initialize Terraform',
    desc: 'terraform init for providers & backend',
  },
  {
    title: 'Check plan',
    desc: 'terraform plan for preview',
  },
  {
    title: 'Deployment',
    desc: 'terraform apply for production deployment',
  },
];
