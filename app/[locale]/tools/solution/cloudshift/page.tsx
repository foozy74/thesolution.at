"use client";

import Link from "next/link";
import { Lock, Cog, Settings, Server, Box, Activity, Shield, Network, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

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
          <Link href="/tools/product" className="btn glass">
            ← Back to Products
          </Link>
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
            <div key={i} className="glass" style={{ padding: "2.5rem", border: "1px solid var(--glass-border)", borderRadius: "var(--card-radius)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: "var(--accent-teal)" }}>
                  {layer.icon}
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  {layer.title}
                </h3>
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
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {/* Origin */}
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px dashed var(--accent-blue)", borderRadius: "12px", width: "100%", maxWidth: "600px" }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem" }}>🏢</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Origin Cloud</div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-blue)" }}>VMware vSphere / Oracle OLVM</div>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }} className="text-center sm:text-left">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ width: "100%" }}>
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem" }}>☁️</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Destination Cloud</div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-purple)" }}>OLVM / Hyper-V / Proxmox / VMware / OpenStack</div>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }} className="text-center sm:text-left">
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
