import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

function StatsCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
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
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all text-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download All Files
    </button>
  );
}

type ViewMode = 'overview' | 'code';

export function OpenClawTool() {
  const [selectedFile, setSelectedFile] = useState<TerraformFile>(terraformFiles[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200 pt-[320px] sm:pt-[240px]">
      {/* Header */}
      <header className="fixed left-0 right-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10 top-[120px] sm:top-[100px]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-xl">⚖️</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Link to="/tools/solution" className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Solutions
                </Link>
                <span className="text-slate-600 text-[10px]">/</span>
                <h1 className="text-sm font-bold text-white tracking-tight">
                  Solution <span className="text-indigo-400">IaC</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Secure infrastructure delivery and automation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700/50">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'overview'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Code
              </button>
            </div>

            <DownloadAllButton />

            {/* Mobile menu */}
            <button
              className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Sub-navigation Menu */}
        <div className="border-t border-white/5 bg-black/10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2 flex items-center gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setViewMode('overview'); setTimeout(() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
            >
              🏗️ Architecture
            </button>
            <button
              onClick={() => { setViewMode('overview'); setTimeout(() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
            >
              🛡️ Security Layers
            </button>
            <button
              onClick={() => { setViewMode('overview'); setTimeout(() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
            >
              🚀 Quick Start
            </button>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <button
              onClick={() => setViewMode('code')}
              className={`text-[10px] uppercase tracking-widest font-bold transition-colors whitespace-nowrap ${viewMode === 'code' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              📄 Terraform Files
            </button>
          </div>
        </div>

        {/* Mobile view mode toggle */}
        <div className="sm:hidden px-4 pb-3 flex gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${viewMode === 'overview'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${viewMode === 'code'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400'
              }`}
          >
            Code
          </button>
        </div>
      </header>

      {viewMode === 'overview' ? (
        <OverviewView />
      ) : (
        <CodeView
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filteredFiles={filteredFiles}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      {/* Footer Stats Bar */}
      <footer className="border-t border-white/10 bg-black/20 py-10 mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatsCard icon="📄" value={String(terraformFiles.length)} label="Terraform Files" />
            <StatsCard icon="📝" value={String(totalLines)} label="Lines of Code" />
            <StatsCard icon="🔒" value={String(totalSecurityNotes)} label="Security Controls" />
            <StatsCard icon="🏗️" value="6" label="Infrastructure Layers" />
          </div>
          <div className="mt-10 text-center text-xs text-slate-500">
            Solution IaC Architecture · Professional IT Automation · Production-ready blueprints
          </div>
        </div>
      </footer>
    </div>
  );
}

function OverviewView() {
  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-12 mt-4 sm:mt-10">
      {/* Hero */}
      <div className="glass p-8 sm:p-12 text-center space-y-6 relative overflow-hidden boarder-none">
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', zIndex: 0
        }} />
        <div className="z-10 relative space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Production Ready · Security-First
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Secure Infrastructure for{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Solution
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Enterprise-grade Infrastructure-as-Code setup with Terraform.
            Defense-in-Depth with 6 architecture security layers.
          </p>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div id="architecture" className="glass overflow-hidden scroll-mt-40">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🏗️</span> Architecture Overview
          </h3>
          <span className="text-xs text-slate-500 font-mono">OCI eu-frankfurt-1</span>
        </div>
        <ArchitectureDiagram />
      </div>

      {/* Security Layers */}
      <div id="security" className="scroll-mt-40">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🛡️</span> Security Layers (Defense in Depth)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityLayers.map((layer, i) => (
            <div
              key={i}
              className="glass p-5 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${layer.bgClass}`}
                >
                  {layer.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{layer.title}</h4>
                  <p className="text-xs text-slate-500">Layer {i + 1}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {layer.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div id="quickstart" className="glass p-6 sm:p-10 border-indigo-500/20 scroll-mt-40">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <span>🚀</span> Quick Start Guide
        </h3>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-slate-400 text-sm">
              Follow these steps to deploy OpenClaw securely on OCI:
            </p>
            <div className="space-y-4">
              {quickStartSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-400 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-4 font-mono text-sm border-none bg-black/40">
            <div className="text-emerald-400 mb-1"># Terminal</div>
            <div className="space-y-1 text-slate-300">
              <p>
                <span className="text-slate-500">$</span> git clone thesolution/solution-iac/
              </p>
              <p>
                <span className="text-slate-500">$</span> cd solution-iac/openclaw
              </p>
              <p>
                <span className="text-slate-500">$</span> cp terraform.tfvars.example terraform.tfvars
              </p>
              <p>
                <span className="text-slate-500">$</span>{' '}
                <span className="text-amber-300">vim</span> terraform.tfvars
              </p>
              <p>
                <span className="text-slate-500">$</span> terraform init
              </p>
              <p>
                <span className="text-slate-500">$</span> terraform plan{' '}
                <span className="text-cyan-300">-out</span>=tfplan
              </p>
              <p>
                <span className="text-slate-500">$</span> terraform apply tfplan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* File Overview Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📁</span> Terraform Files
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {terraformFiles.map((file) => (
            <div
              key={file.id}
              className="glass p-5 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{file.icon}</span>
                <div>
                  <h4 className="font-semibold text-white text-sm">{file.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{file.filename}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3">{file.description}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-emerald-500">🔒</span>
                {file.securityNotes.length} Security Controls
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function CodeView({
  selectedFile,
  setSelectedFile,
  activeCategory,
  setActiveCategory,
  filteredFiles,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  selectedFile: TerraformFile;
  setSelectedFile: (f: TerraformFile) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filteredFiles: TerraformFile[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) {
  return (
    <div className="max-w-[1600px] mx-auto flex">
      {/* Sidebar */}
      <aside
        className={`${mobileMenuOpen ? 'fixed inset-0 z-40 bg-slate-900/95' : 'hidden'
          } sm:relative sm:block w-full sm:w-72 lg:w-80 flex-shrink-0 border-r border-slate-800/60 overflow-y-auto`}
        style={{ maxHeight: 'calc(100vh - 180px)' }}
      >
        <div className="p-4 space-y-4 sticky top-0">
          {/* Close mobile */}
          <button
            className="sm:hidden mb-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕ Close
          </button>

          {/* Category Filters */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${activeCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${activeCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* File List */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Files ({filteredFiles.length})
            </h3>
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isActive={selectedFile.id === file.id}
                onClick={() => {
                  setSelectedFile(file);
                  setMobileMenuOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 space-y-8" style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
        {/* File Header Block */}
        <div className="glass p-5 py-6 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">{selectedFile.icon}</span>
            <h2 className="text-2xl font-bold text-white">{selectedFile.name}</h2>
            <span className="px-2 py-0.5 text-xs font-mono bg-white/5 text-slate-400 rounded-md border border-white/10">
              {selectedFile.filename}
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{selectedFile.description}</p>
        </div>

        {/* Security Notes */}
        {selectedFile.securityNotes.length > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <span>🔒</span> Security Measures
            </h3>
            <div className="space-y-2">
              {selectedFile.securityNotes.map((note, i) => (
                <SecurityBadge key={i} note={note} />
              ))}
            </div>
          </div>
        )}

        {/* Code */}
        <CodeBlock code={selectedFile.content} filename={selectedFile.filename} />
      </main>
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
