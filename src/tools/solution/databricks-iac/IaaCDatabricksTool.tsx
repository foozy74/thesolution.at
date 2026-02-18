import { useState, useCallback } from 'react';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';

interface DatabricksFile {
  id: string;
  name: string;
  filename: string;
  icon: string;
  description: string;
  content: string;
  category: string;
  securityNotes: string[];
}

const databricksFiles: DatabricksFile[] = [
  {
    id: 'provider',
    name: 'Provider Configuration',
    filename: 'provider.tf',
    icon: '☁️',
    description: 'Configure the Databricks Terraform provider with workspace URL and token authentication.',
    category: 'core',
    securityNotes: [
      'Use workspace token or Azure AD token',
      'Store credentials in environment variables',
      'Support for Azure, AWS, and GCP',
    ],
    content: `provider "databricks" {
  host  = "https://\${var.workspace_url}"
  token = var.databricks_token
  
  # For Azure
  # azure_workspace_resource_id = var.workspace_resource_id
  
  # For AWS  
  # aws_account_id = var.aws_account_id
}

variable "workspace_url" {
  description = "Databricks workspace URL"
  type        = string
  sensitive   = true
}

variable "databricks_token" {
  description = "Databricks access token"
  type        = string
  sensitive   = true
}`,
  },
  {
    id: 'workspace',
    name: 'Workspace Configuration',
    filename: 'workspace.tf',
    icon: '📊',
    description: 'Set up workspace-level configurations including Unity Catalog and security settings.',
    category: 'core',
    securityNotes: [
      'Enable Unity Catalog',
      'Configure workspace Conf',
      'Set up workspace-scoped credentials',
    ],
    content: `resource "databricks_workspace_conf" "this" {
  custom_config = {
    "enableWorkspaceConf" = "true"
    "unityCatalog.enabled" = "true"
  }
}

resource "databricks_mws_credentials" "this" {
  account_id   = var.account_id
  name         = "databricks-creds"
  role         = "arn:aws:iam::123456789012:role/databricks-role"
  aws_credentials {
    stub = false
  }
}`,
  },
  {
    id: 'cluster',
    name: 'Cluster Configuration',
    filename: 'cluster.tf',
    icon: '⚙️',
    description: 'Define shared clusters with auto-scaling, auto-termination, and spark configurations.',
    category: 'compute',
    securityNotes: [
      'Auto-termination to save costs',
      'Cluster log delivery enabled',
      'Isolate compute from storage',
    ],
    content: `resource "databricks_cluster" "shared_cluster" {
  cluster_name            = "shared-cluster"
  spark_version           = "13.3-scala12"
  node_type_id            = "i3.xlarge"
  autotermination_minutes = 15
  num_workers            = 4
  
  spark_conf = {
    "spark.databricks.cluster.profile"                = "serverless"
    "spark.databricks.repl.allowedLocalFilePaths"     = "/tmp"
    "spark.sql.adaptive.enabled"                       = "true"
  }
  
  custom_tags = {
    "Environment" = "production"
    "Project"     = "analytics"
  }
}`,
  },
  {
    id: 'job',
    name: 'Job Definition',
    filename: 'job.tf',
    icon: '📋',
    description: 'Create scheduled jobs for ETL pipelines with notebook tasks and dependencies.',
    category: 'jobs',
    securityNotes: [
      'Job run as service principal',
      'Timeout protection enabled',
      'Retry policy configured',
    ],
    content: `resource "databricks_job" "etl_pipeline" {
  name = "etl-pipeline-\${var.environment}"
  
  job_cluster {
    cluster_name = databricks_cluster.shared_cluster.cluster_name
  }
  
  notebook_task {
    notebook_path = "/Shared/etl/bronze"
    base_parameters = {
      environment = var.environment
    }
  }
  
  retry_on_timeout = true
  max_retries      = 2
  timeout_seconds = 3600
  
  schedule {
    quartz_cron_expression = "0 0 * * * ?"
    timezone_id           = "Europe/Vienna"
  }
}`,
  },
  {
    id: 'unity-catalog',
    name: 'Unity Catalog',
    filename: 'unity-catalog.tf',
    icon: '🔐',
    description: 'Configure Unity Catalog with metastores, catalogs, and granular access controls.',
    category: 'security',
    securityNotes: [
      'Lakehouse governance',
      'Column-level security',
      'Row-level filtering support',
    ],
    content: `resource "databricks_catalog" "production" {
  name           = "production"
  comment        = "Production data catalog"
  isolation_mode = "ISOLATED"
  
  owner = var.admin_group
  
  grants {
    principal  = "analysts-group"
    privileges = ["CREATE", "SELECT"]
  }
}

resource "databricks_schema" "raw" {
  catalog = databricks_catalog.production.name
  name    = "raw"
  comment = "Raw ingested data"
}`,
  },
  {
    id: 'asset-bundle',
    name: 'Asset Bundle',
    filename: 'databricks.yml',
    icon: '📦',
    description: 'Databricks Asset Bundle configuration for CI/CD integration.',
    category: 'cicd',
    securityNotes: [
      'Git source for notebooks',
      'Environment-specific targets',
      'Validate before deploy',
    ],
    content: `bundle:
  name: etl-pipeline
  
include:
  - resources/**/*.yml

targets:
  dev:
    workspace:
      host: https://dev.cloud.databricks.com
    resources:
      jobs:
        etl-job:
          name: etl-pipeline-dev
          tasks:
            - task_key: bronze
              notebook_task:
                notebook_path: ./notebooks/bronze.py
            - task_key: silver
              notebook_task:
                notebook_path: ./notebooks/silver.py
              depends_on:
                - task_key: bronze

  prod:
    workspace:
      host: https://prod.cloud.databricks.com
    mode: production`,
  },
];

const categories = [
  { id: 'all', label: 'All', icon: '📁' },
  { id: 'core', label: 'Core', icon: '☁️' },
  { id: 'compute', label: 'Compute', icon: '⚙️' },
  { id: 'jobs', label: 'Jobs', icon: '📋' },
  { id: 'security', label: 'Security', icon: '🔐' },
  { id: 'cicd', label: 'CI/CD', icon: '🔄' },
];

type ViewMode = 'overview' | 'code';

function CodeBlock({ code, filename }: { code: string; filename: string }) {
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
  file: DatabricksFile;
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
    databricksFiles.forEach((file) => {
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

export function IaaCDatabricksTool() {
  const [selectedFile, setSelectedFile] = useState<DatabricksFile>(databricksFiles[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const filteredFiles =
    activeCategory === 'all'
      ? databricksFiles
      : databricksFiles.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: '8rem', paddingBottom: '2rem' }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">⚡</span>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Databricks IaC</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Infrastructure-as-Code for Databricks. Automate workspaces, clusters, and jobs.
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
      <div className="glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🏗️</span> Architecture Overview
          </h3>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Multi-Cloud: AWS, Azure, GCP</span>
        </div>
        <div className="p-6 overflow-x-auto">
          <ArchitectureDiagram />
        </div>
      </div>

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
}: {
  selectedFile: DatabricksFile;
  setSelectedFile: (f: DatabricksFile) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filteredFiles: DatabricksFile[];
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

const securityLayers = [
  {
    icon: '☁️',
    title: 'Multi-Cloud Support',
    bgClass: 'bg-orange-500/10',
    items: [
      'AWS, Azure, and GCP support',
      'Unified Terraform provider',
      'Cross-cloud patterns',
    ],
  },
  {
    icon: '📊',
    title: 'Workspace Automation',
    bgClass: 'bg-indigo-500/10',
    items: [
      'Automated provisioning',
      'Workspace configuration',
      'Unity Catalog setup',
    ],
  },
  {
    icon: '⚙️',
    title: 'Compute Management',
    bgClass: 'bg-blue-500/10',
    items: [
      'Cluster provisioning',
      'Auto-scaling policies',
      'Job scheduling',
    ],
  },
  {
    icon: '🔐',
    title: 'Security & Governance',
    bgClass: 'bg-pink-500/10',
    items: [
      'Unity Catalog',
      'Access controls',
      'Secret management',
    ],
  },
  {
    icon: '🔄',
    title: 'CI/CD Integration',
    bgClass: 'bg-purple-500/10',
    items: [
      'GitHub Actions',
      'Databricks CLI',
      'Asset Bundles',
    ],
  },
  {
    icon: '📋',
    title: 'Job Orchestration',
    bgClass: 'bg-cyan-500/10',
    items: [
      'Scheduled pipelines',
      'Task dependencies',
      'Alerting & monitoring',
    ],
  },
];
