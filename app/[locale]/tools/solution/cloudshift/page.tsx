"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Cloud, Lock, Cog, Settings, Server, Box, Activity, Shield, Network, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const configFiles = [
  {
    id: "migration",
    name: "Migration Definition",
    filename: "01_migration.json",
    icon: <Cloud size={24} />,
    description: "API payload for migrating VMs from VMware vSphere to OpenStack with network mapping.",
    category: "api",
    securityNotes: [
      "Credentials passed via Barbican Secret ID",
      "Network isolation mapped securely",
    ],
    content: `{
    "migration": {
        "origin": {
            "type": "vmware_vsphere",
            "connection_info": {
                "secret_id": "ebe69d82-da6f-451e-a0f6-3551d0f7ef85"
            }
        },
        "destination": {
            "type": "openstack",
            "target_environment": {
                "flavor_name": "m1.small",
                "network_map": {
                    "VM Network": "private",
                    "VM Network Local": "public"
                }
            }
        },
        "instances": ["CentOS 7", "RHEL 7.2", "Ubuntu 14.04", "WS 2012 R2"]
    }
}
`,
  },
  {
    id: "standalone",
    name: "Standalone Mode Configuration",
    filename: "02_api-paste.ini",
    icon: <Settings size={24} />,
    description: "API pipeline configuration for Standalone (NoAuth) mode without Keystone.",
    category: "config",
    securityNotes: [
      "Use only in isolated environments",
      "Bypasses token verification",
      "Automatically maps to default admin context",
    ],
    content: `# CloudShift API Pipeline Configuration
# Standalone (NoAuth) Mode

[pipeline:coriolis-api-v1]
# Replace 'authtoken' with 'noauth' to bypass Keystone
pipeline = request_id faultwrap noauth apiv1

[app:apiv1]
paste.app_factory = coriolis.api.v1.router:APIRouter.factory

[filter:noauth]
paste.filter_factory = coriolis.api.middleware.auth:NoAuthMiddleware.factory

[filter:faultwrap]
paste.filter_factory = coriolis.api.middleware.fault:FaultWrapper.factory

[filter:request_id]
paste.filter_factory = oslo_middleware:RequestId.factory
`,
  },
  {
    id: "secret",
    name: "Barbican Secret",
    filename: "03_secret.json",
    icon: <Lock size={24} />,
    description: "vSphere connection credentials securely stored in Barbican.",
    category: "security",
    securityNotes: [
      "Passwords never exposed in API payloads",
      "Managed via OpenStack Key Manager",
      "RBAC policies enforce access",
    ],
    content: `{
    "host": "10.0.0.10",
    "username": "user@vsphere.local",
    "password": "SuperSecretPassword123!",
    "allow_untrusted": true
}
`,
  },
];

const categories = [
  { id: "all", label: "All", icon: <Box size={20} /> },
  { id: "api", label: "API Examples", icon: <Cloud size={20} /> },
  { id: "config", label: "Configuration", icon: <Settings size={20} /> },
  { id: "security", label: "Security", icon: <Lock size={20} /> },
];

const featureLayers = [
  {
    icon: <Network size={24} />,
    title: "Cross-Cloud Migration",
    bgClass: "bg-[var(--accent-blue)]/10",
    items: [
      "Migrate from VMware vSphere",
      "Migrate from Oracle OLVM / oVirt",
      "Import to Proxmox VE",
      "Import to OLVM or VMware vSphere",
      "Automated format conversion",
    ],
  },
  {
    icon: <Box size={24} />,
    title: "Stateless Microservices",
    bgClass: "bg-[var(--accent-teal)]/10",
    items: [
      "Built on robust Oslo libraries",
      "Asynchronous tasks via RabbitMQ",
      "Highly scalable worker nodes",
      "Fault-tolerant from the ground up",
    ],
  },
  {
    icon: <Cog size={24} />,
    title: "Format & Driver Injection",
    bgClass: "bg-[var(--accent-purple)]/10",
    items: [
      "Automatic VM disk conversion",
      "Hypervisor tools injection",
      "cloud-init for Linux workloads",
      "VirtIO & LIS for Windows workloads",
    ],
  },
  {
    icon: <Shield size={24} />,
    title: "Security & Secrets",
    bgClass: "bg-[var(--accent-purple)]/10",
    items: [
      "Keystone Auth Integration",
      "Barbican Secret Management",
      "Credentials kept out of APIs",
      "Isolated tenant migrations",
    ],
  },
  {
    icon: <Settings size={24} />,
    title: "Standalone Deployments",
    bgClass: "bg-[var(--accent-blue)]/10",
    items: [
      "Optional NoAuth mode",
      "Perfect for PoCs and small setups",
      "All-in-one container deployment",
      "No external dependencies required",
    ],
  },
  {
    icon: <Activity size={24} />,
    title: "Robust Tracking",
    bgClass: "bg-[var(--accent-teal)]/10",
    items: [
      "Progress updates in real-time",
      "Support for long-running tasks",
      "Graceful cancellation",
      "Detailed failure logging",
    ],
  },
];

export default function CloudShiftPage() {
  const t = useTranslations("tools.cloudshift_page");
  const [selectedFile, setSelectedFile] = useState(configFiles[0]);
  const [activeCategory, setActiveCategory] = useState("all");
  const codeRef = useRef<HTMLElement>(null);

  const filteredFiles = activeCategory === "all"
    ? configFiles
    : configFiles.filter((f) => f.category === activeCategory);

  const handleDownloadAll = useCallback(() => {
    configFiles.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  useEffect(() => {
    let Prism: unknown;

    const loadPrism = async () => {
      const prismModule = await import("prismjs");
      Prism = prismModule.default;
      // @ts-expect-error - prismjs components don't have type definitions
      await import("prismjs/components/prism-json.js");
      // @ts-expect-error - prismjs components don't have type definitions
      await import("prismjs/components/prism-ini.js");
      // @ts-expect-error - prismjs themes don't have type definitions
      await import("prismjs/themes/prism-tomorrow.css");

      if (codeRef.current && Prism) {
        (Prism as { highlightElement: (element: HTMLElement) => void }).highlightElement(codeRef.current);
      }
    };

    loadPrism();
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      {/* Header */}
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl"></span>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{t("title")}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Link href="/tools/solution" className="btn glass">
            ← Back to Solutions
          </Link>
          <button onClick={handleDownloadAll} className="btn btn-primary" style={{ fontSize: "0.95rem", padding: "0.6rem 1.5rem" }}>
            Download All
          </button>
        </div>
      </section>

      {/* ===== OVERVIEW SECTION ===== */}
      <section className="container pb-16">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          {t("featuresTitle")}
        </h2>

        {/* Architecture Diagram */}
        <div className="glass overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/10 bg-white/2">
            <h3 className="text-lg font-semibold text-white">{t("architectureTitle")}</h3>
          </div>
          <div className="p-6">
            <ArchitectureDiagram />
          </div>
        </div>

        {/* Security / Feature Layers */}
        <div className="grid grid-2 gap-4">
          {featureLayers.map((layer, i) => (
            <div
              key={i}
              className={`glass ${layer.bgClass} hover:scale-[1.02] transition-transform duration-300`}
              style={{ padding: "2.5rem", borderRadius: "12px" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ marginBottom: "0rem" }}>
                  {layer.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white" style={{ fontSize: "1.5rem", marginBottom: "0rem" }}>{layer.title}</h4>
                </div>
              </div>
              <ul className="space-y-2">
                {layer.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed" style={{ marginBottom: "0.75rem" }}>
                    <span className="text-[var(--accent-teal)] mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CODE SECTION ===== */}
      <section className="container pb-20" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "3rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          {t("configTitle")}
        </h2>

        {/* Filter Categories */}
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">
            Filter Categories
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-md font-bold transition-all ${activeCategory === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
            >
              All
            </button>
            {categories.filter(c => c.id !== "all").map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-md font-bold transition-all ${activeCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <div className="flex items-center gap-2">
                   {cat.icon}
                   {cat.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Module Files */}
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">
            Files ({filteredFiles.length})
          </h3>
          <div className="grid grid-2 gap-2">
            {filteredFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-4 glass transition-all duration-200 ${selectedFile.id === file.id
                  ? "bg-indigo-500/20 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                  : "hover:bg-white/5 hover:border-white/20"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{file.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-sm truncate ${selectedFile.id === file.id ? "text-indigo-300" : "text-slate-200"}`}>
                      {file.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono truncate">{file.filename}</p>
                  </div>
                  {selectedFile.id === file.id && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected File Content */}
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

          {selectedFile.securityNotes && selectedFile.securityNotes.length > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <span>🛡️</span> Security Controls
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {selectedFile.securityNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 flex-shrink-0 text-emerald-400">✓</span>
                    <span className="text-slate-300">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass overflow-hidden rounded-xl">
            <div className="px-4 py-2 border-b border-white/10 bg-white/2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">{selectedFile.filename}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">{selectedFile.filename.endsWith('.json') ? 'JSON' : 'INI'}</span>
            </div>
            <pre style={{ background: "var(--bg-color)", margin: 0, padding: "1.5rem", overflowX: "auto" }}>
              <code ref={codeRef} className={`language-${selectedFile.filename.endsWith('.json') ? 'json' : 'ini'}`}>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {/* Origin */}
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px dashed var(--accent-blue)", borderRadius: "12px", width: "100%", maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem" }}>🏢</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Origin Cloud</div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-blue)" }}>VMware vSphere / Oracle OLVM</div>
          </div>
          <div style={{ textAlign: "left", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
             <div>• Virtual Machines</div>
             <div>• Templates</div>
             <div>• Storage & Network</div>
          </div>
        </div>
      </div>

      {/* Arrow Down */}
      <div style={{ fontSize: "1.5rem", color: "var(--accent-teal)" }}>
         <ArrowRight className="rotate-90 transform" size={32} />
      </div>

      {/* CloudShift Pipeline */}
      <div className="glass" style={{ padding: "2rem", border: "2px solid var(--accent-teal)", borderRadius: "12px", width: "100%", maxWidth: "600px" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>CloudShift Service Pipeline</div>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-teal)" }}>Stateless Microservices</div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          <div className="glass" style={{ padding: "1rem", textAlign: "center", backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--accent-blue)" }}><Activity className="mx-auto" /></div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>API</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>REST / WSGI</div>
          </div>
          <div className="glass" style={{ padding: "1rem", textAlign: "center", backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--accent-teal)" }}><Server className="mx-auto" /></div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Conductor</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Orchestration</div>
          </div>
          <div className="glass" style={{ padding: "1rem", textAlign: "center", backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--accent-purple)" }}><Cog className="mx-auto" /></div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Worker</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Execution</div>
          </div>
        </div>
      </div>

      {/* Arrow Down */}
      <div style={{ fontSize: "1.5rem", color: "var(--accent-teal)" }}>
         <ArrowRight className="rotate-90 transform" size={32} />
      </div>

      {/* Destination */}
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px solid var(--accent-purple)", borderRadius: "12px", width: "100%", maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem" }}>☁️</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Destination Cloud</div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-purple)" }}>OLVM / Hyper-V / Proxmox / VMware / OpenStack</div>
          </div>
          <div style={{ textAlign: "left", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
             <div>• Converted Disks</div>
             <div>• Injected Drivers</div>
             <div>• Mapped Networks</div>
          </div>
        </div>
      </div>
      
      {/* Infrastructure side services */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", width: "100%", maxWidth: "600px" }}>
        <div className="glass" style={{ flex: 1, padding: "1rem", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}><Shield className="mx-auto" size={20} /></div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Barbican Secrets</div>
        </div>
        <div className="glass" style={{ flex: 1, padding: "1rem", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}><Lock className="mx-auto" size={20} /></div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Keystone Auth</div>
        </div>
      </div>
    </div>
  );
}
