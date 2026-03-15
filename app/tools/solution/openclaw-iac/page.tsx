"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Cloud, Lock, Cog, Database, BarChart3, Folder, Shield, Globe, Square, User, Package } from "lucide-react";

const terraformFiles = [
  {
    id: "foundation",
    name: "Foundation",
    filename: "01_foundation.tf",
    icon: <Cloud size={24} />,
    description: "Foundation configuration for OCI infrastructure including VCN, compartments, and policies.",
    category: "core",
    securityNotes: [
      "Compartment isolation for resource organization",
      "Tagging standards enforced",
      "Budget alerts configured",
    ],
    content: `# Foundation Terraform Configuration
# OpenClaw IaC - Enterprise OCI Foundation

terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 5.0.0"
    }
  }
}

provider "oci" {
  region = var.region
}

# Create root compartment structure
resource "oci_identity_compartment" "openclaw" {
  compartment_id = var.tenancy_ocid
  description    = "OpenClaw Infrastructure Compartment"
  name           = "openclaw"
  
  tags = {
    Environment = var.environment
    Project     = "OpenClaw"
    Owner       = "DevOps"
  }
}

# VCN for production workloads
resource "oci_core_vcn" "main" {
  compartment_id  = oci_identity_compartment.openclaw.id
  cidr_block      = var.vcn_cidr
  display_name    = "OpenClaw-VCN"
  dns_label       = "openclaw"
  
  tags = {
    Environment = var.environment
  }
}

# Internet Gateway
resource "oci_core_internet_gateway" "igw" {
  compartment_id = oci_identity_compartment.openclaw.id
  display_name   = "OpenClaw-IGW"
  vcn_id         = oci_core_vcn.main.id
  enabled        = "true"
}

# NAT Gateway for private subnets
resource "oci_core_nat_gateway" "nat" {
  compartment_id = oci_identity_compartment.openclaw.id
  display_name   = "OpenClaw-NAT"
  vcn_id         = oci_core_vcn.main.id
}

# Service Gateway for OCI services
resource "oci_core_service_gateway" "sgw" {
  compartment_id = oci_identity_compartment.openclaw.id
  display_name   = "OpenClaw-SGW"
  vcn_id         = oci_core_vcn.main.id
  services {
    service_id = data.oci_core_services.services.services[0].id
  }
}

data "oci_core_services" "services" {
  filter {
    name   = "type"
    values = ["All OCI Services In Region"]
  }
}
`,
  },
  {
    id: "network",
    name: "Network & Security",
    filename: "02_network.tf",
    icon: <Lock size={24} />,
    description: "Network security configuration with subnets, route tables, and security lists.",
    category: "network",
    securityNotes: [
      "Private subnets for App & DB tiers",
      "Network Security Groups with least privilege",
      "Flow logs enabled for monitoring",
    ],
    content: `# Network & Security Configuration
# OpenClaw IaC - Network Security

# Public Subnet for Load Balancers
resource "oci_core_subnet" "public_lb" {
  compartment_id  = oci_identity_compartment.openclaw.id
  vcn_id          = oci_core_vcn.main.id
  cidr_block      = cidrsubnet(var.vcn_cidr, 8, 0)
  display_name    = "Public-LB-Subnet"
  dns_label       = "publb"
  route_table_id  = oci_core_route_table.public.id
  security_list_ids = [oci_core_security_list.public_lb.id]
  
  tags = {
    Tier        = "Public"
    Environment = var.environment
  }
}

# Private Subnet for Application
resource "oci_core_subnet" "private_app" {
  compartment_id  = oci_identity_compartment.openclaw.id
  vcn_id          = oci_core_vcn.main.id
  cidr_block      = cidrsubnet(var.vcn_cidr, 8, 1)
  display_name    = "Private-App-Subnet"
  dns_label       = "priapp"
  route_table_id  = oci_core_route_table.private.id
  security_list_ids = [oci_core_security_list.app.id]
  prohibit_public_ip_on_vnic = true
  
  tags = {
    Tier        = "Application"
    Environment = var.environment
  }
}

# Private Subnet for Database
resource "oci_core_subnet" "private_db" {
  compartment_id  = oci_identity_compartment.openclaw.id
  vcn_id          = oci_core_vcn.main.id
  cidr_block      = cidrsubnet(var.vcn_cidr, 8, 2)
  display_name    = "Private-DB-Subnet"
  dns_label       = "pridb"
  route_table_id  = oci_core_route_table.private.id
  security_list_ids = [oci_core_security_list.db.id]
  prohibit_public_ip_on_vnic = true
  
  tags = {
    Tier        = "Database"
    Environment = var.environment
  }
}
`,
  },
  {
    id: "compute",
    name: "Compute & OKE",
    filename: "03_compute.tf",
    icon: <Cog size={24} />,
    description: "Compute instances and OKE cluster configuration.",
    category: "compute",
    securityNotes: [
      "Non-root container execution",
      "Pod Security Policies enforced",
      "Network policies configured",
    ],
    content: `# Compute & OKE Configuration
# OpenClaw IaC - Compute Resources

# OKE Cluster
resource "oci_containerengine_cluster" "oke" {
  compartment_id     = oci_identity_compartment.openclaw.id
  kubernetes_version = var.k8s_version
  name               = "openclaw-cluster"
  vcn_id             = oci_core_vcn.main.id
  
  endpoint_config {
    is_public_ip_enabled = false
    subnet_id            = oci_core_subnet.private_app.id
  }
  
  options {
    service_lb_subnet_ids = [oci_core_subnet.public_lb.id]
  }
}

# Node Pool
resource "oci_containerengine_node_pool" "oke_nodes" {
  compartment_id      = oci_identity_compartment.openclaw.id
  cluster_id          = oci_containerengine_cluster.oke.id
  kubernetes_version  = var.k8s_version
  name                = "openclaw-pool"
  node_shape          = "VM.Standard.E4.Flex"
  
  node_config_details {
    placement_configs {
      subnet_id = oci_core_subnet.private_app.id
    }
    
    size = var.node_count
  }
  
  node_shape_config {
    memory_in_gbs = 16
    ocpus         = 2
  }
  
  ssh_public_key = var.ssh_public_key
}
`,
  },
  {
    id: "database",
    name: "Database",
    filename: "04_database.tf",
    icon: <Database size={24} />,
    description: "Autonomous Database configuration with backup and security.",
    category: "database",
    securityNotes: [
      "Encryption at rest (AES-256)",
      "Automatic backup enabled",
      "Private endpoint only",
    ],
    content: `# Database Configuration
# OpenClaw IaC - Autonomous Database

resource "oci_database_autonomous_database" "main" {
  compartment_id          = oci_identity_compartment.openclaw.id
  db_name                 = var.db_name
  display_name            = "OpenClaw-ADB"
  
  cpu_core_count          = var.db_ocpus
  data_storage_size_in_tbs = var.db_size
  
  db_workload             = "OLTP"
  is_auto_scaling_enabled = true
  
  # Security
  is_mtls_connection_required = true
  private_endpoint_ip       = cidrhost(cidrsubnet(var.vcn_cidr, 8, 2), 10)
  subnet_id                 = oci_core_subnet.private_db.id
  
  # Backup
  is_auto_backup_enabled  = true
  auto_backup_retention_period = 30
}
`,
  },
  {
    id: "monitoring",
    name: "Monitoring & Logging",
    filename: "05_monitoring.tf",
    icon: <BarChart3 size={24} />,
    description: "Monitoring, logging, and alerting configuration.",
    category: "monitoring",
    securityNotes: [
      "Security alarms configured",
      "Audit logs retained 365 days",
      "Anomaly detection enabled",
    ],
    content: `# Monitoring & Logging Configuration
# OpenClaw IaC - Observability

# Alarm for high CPU usage
resource "oci_monitoring_alarm" "high_cpu" {
  compartment_id = oci_identity_compartment.openclaw.id
  display_name   = "OpenClaw-High-CPU"
  metric_compartment_id = oci_identity_compartment.openclaw.id
  
  metric_name  = "CpuUtilization"
  namespace    = "oci_computeagent"
  statistic    = "MEAN"
  interval     = "PT5M"
  threshold    = 80
  
  destinations = [
    oci_notifications_topic.alerts.topic_endpoint
  ]
}

# Notification Topic
resource "oci_notifications_topic" "alerts" {
  compartment_id = oci_identity_compartment.openclaw.id
  display_name   = "OpenClaw-Alerts"
}

# Log Group
resource "oci_logging_log_group" "openclaw" {
  compartment_id = oci_identity_compartment.openclaw.id
  display_name   = "OpenClaw-Logs"
}
`,
  },
];

const categories = [
  { id: "all", label: "All", icon: <Folder size={20} /> },
  { id: "core", label: "Core", icon: <Cloud size={20} /> },
  { id: "network", label: "Network", icon: <Shield size={20} /> },
  { id: "compute", label: "Compute", icon: <Cog size={20} /> },
  { id: "database", label: "Database", icon: <Database size={20} /> },
  { id: "monitoring", label: "Monitoring", icon: <BarChart3 size={20} /> },
];

const securityLayers = [
  {
    icon: <Globe size={24} />,
    title: "Network Isolation",
    bgClass: "bg-[var(--accent-blue)]/10",
    items: [
      "Private subnets for App & DB",
      "NAT Gateway for controlled egress",
      "Service Gateway for OCI internal",
      "VCN Flow Logs enabled",
    ],
  },
  {
    icon: <Square size={24} />,
    title: "Web Application Firewall",
    bgClass: "bg-[var(--accent-teal)]/10",
    items: [
      "OWASP Top 10 Protection",
      "Rate Limiting (100 req/min)",
      "Bot Detection",
      "Geo-Blocking available",
    ],
  },
  {
    icon: <Lock size={24} />,
    title: "Encryption",
    bgClass: "bg-[var(--accent-purple)]/10",
    items: [
      "TLS 1.2+ forced",
      "HSM-backed KMS Keys",
      "Encryption at Rest (AES-256)",
      "mTLS for DB connections",
    ],
  },
  {
    icon: <User size={24} />,
    title: "Identity & Access",
    bgClass: "bg-[var(--accent-purple)]/10",
    items: [
      "Least-Privilege IAM Policies",
      "Workload Identity for OKE",
      "MFA forced",
      "Compartment isolation",
    ],
  },
  {
    icon: <Package size={24} />,
    title: "Container Security",
    bgClass: "bg-[var(--accent-blue)]/10",
    items: [
      "Non-root container",
      "ReadOnly root filesystem",
      "Seccomp profile (RuntimeDefault)",
      "Network policies",
    ],
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Monitoring & Compliance",
    bgClass: "bg-[var(--accent-teal)]/10",
    items: [
      "Audit logs (365 days)",
      "Security alarms",
      "Vulnerability scanning",
      "Data Safe integration",
    ],
  },
];

export default function OpenClawPage() {
  const [selectedFile, setSelectedFile] = useState(terraformFiles[0]);
  const [activeCategory, setActiveCategory] = useState("all");
  const codeRef = useRef<HTMLElement>(null);

  const filteredFiles = activeCategory === "all"
    ? terraformFiles
    : terraformFiles.filter((f) => f.category === activeCategory);

  const handleDownloadAll = useCallback(() => {
    terraformFiles.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  // Load Prism.js once on mount and highlight when selectedFile changes
  useEffect(() => {
    let Prism: unknown;

    const loadPrism = async () => {
      const prismModule = await import("prismjs");
      Prism = prismModule.default;
      // @ts-expect-error - prismjs components don't have type definitions
      await import("prismjs/components/prism-hcl.js");
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
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>OpenClaw IaC</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Secure infrastructure delivery and enterprise-grade automation blueprints.
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
          Overview
        </h2>

        {/* Architecture Diagram */}
        <div className="glass overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/10 bg-white/2">
            <h3 className="text-lg font-semibold text-white">Architecture Overview</h3>
          </div>
          <div className="p-6">
            <ArchitectureDiagram />
          </div>
        </div>

        {/* Security Layers */}
        <div className="grid grid-2 gap-4">
          {securityLayers.map((layer, i) => (
            <div
              key={i}
              className={`glass p-6 ${layer.bgClass}`}
              style={{ borderRadius: "12px" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  {layer.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white">{layer.title}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Security Layer {i + 1}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {layer.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <span className="text-emerald-500 mt-1">•</span>
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
          Code
        </h2>

        {/* Filter Categories - FULL WIDTH on top */}
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
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-md font-bold transition-all ${activeCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module Files - FULL WIDTH below filters */}
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">
            Module Files ({filteredFiles.length})
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

        {/* Selected File Content - FULL WIDTH at bottom */}
        <div className="space-y-6">
          {/* File Header */}
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
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 flex-shrink-0 text-emerald-400">✓</span>
                    <span className="text-slate-300">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code with Syntax Highlighting - FULL WIDTH */}
          <div className="glass overflow-hidden rounded-xl">
            <div className="px-4 py-2 border-b border-white/10 bg-white/2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">{selectedFile.filename}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Terraform (HCL)</span>
            </div>
            <pre style={{ background: "var(--bg-color)", margin: 0, padding: "1.5rem", overflowX: "auto" }}>
              <code ref={codeRef} className="language-hcl">{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {/* Internet */}
      <div className="glass" style={{ padding: "1rem 3rem", border: "2px dashed var(--accent-blue)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>🌐</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Internet</div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>

      {/* Load Balancer */}
      <div className="glass" style={{ padding: "1rem 2rem", border: "2px solid var(--accent-teal)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>⚖️</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>OCI Load Balancer</div>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-teal)" }}>Public Subnet</div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>

      {/* OKE Cluster */}
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px solid var(--accent-purple)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>☸️</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>OKE Cluster</div>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-purple)" }}>Private Subnet</div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>📦 Pod 1</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>📦 Pod 2</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>📦 Pod 3</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>

      {/* Database */}
      <div className="glass" style={{ padding: "1rem 2rem", border: "2px solid var(--accent-blue)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>🐘</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Autonomous Database</div>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-blue)" }}>Private Subnet</div>
        </div>
      </div>

      {/* Side Services */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem", width: "100%" }}>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>🔒</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Vault</div>
        </div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>🔑</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Secrets</div>
        </div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>📊</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Monitoring</div>
        </div>
      </div>
    </div>
  );
}
