"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Settings, FileText, Laptop, HardDrive, Cog, Folder, Shield, Lock, Server, Database, Cloud, Activity } from "lucide-react";

const terraformFiles = [
  {
    id: "provider",
    name: "Provider Config",
    filename: "provider.tf",
    icon: <Settings size={24} />,
    description: "OCI provider configuration with authentication setup.",
    category: "core",
    securityNotes: [
      "API key-based authentication",
      "Region: eu-frankfurt-1",
      "OCI CLI config integration",
    ],
    content: `# OCI Provider Configuration
# Coolify IaC - Infrastructure Setup

terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 4.0.0"
    }
  }
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}
`,
  },
  {
    id: "variables",
    name: "Variables",
    filename: "variables.tf",
    icon: <FileText size={24} />,
    description: "Input variables for instance configuration and resources.",
    category: "core",
    securityNotes: [
      "Customizable instance shape",
      "Flexible OCPU and memory config",
      "SSH key management",
    ],
    content: `# Variables Configuration
# Coolify IaC - Input Parameters

variable "tenancy_ocid" {
  type        = string
  description = "OCI Tenancy OCID"
}

variable "user_ocid" {
  type        = string
  description = "OCI User OCID"
}

variable "fingerprint" {
  type        = string
  description = "OCI API Key Fingerprint"
}

variable "private_key_path" {
  type        = string
  description = "Path to OCI Private Key"
}

variable "region" {
  type    = string
  default = "eu-frankfurt-1"
}

variable "compartment_ocid" {
  type        = string
  description = "OCI Compartment OCID"
}

variable "ssh_public_key_path" {
  type    = string
  default = "~/.ssh/id_rsa.pub"
}

variable "instance_display_name" {
  type    = string
  default = "coolify-vm"
}

variable "instance_shape" {
  type    = string
  default = "VM.Standard.A1.Flex"
}

variable "instance_ocpus" {
  type    = number
  default = 4
}

variable "instance_memory_gb" {
  type    = number
  default = 24
}

variable "docker_volume_size_gb" {
  type        = number
  default     = 100
  description = "Groesse der zusaetzlichen Disk fuer Docker in GB"
}

variable "docker_lv_size_gb" {
  type        = number
  default     = 90
  description = "Groesse des LVM Logical Volume in GB"
}
`,
  },
  {
    id: "compute",
    name: "Compute Instance",
    filename: "compute.tf",
    icon: <Laptop size={24} />,
    description: "Ubuntu VM instance with cloud-init automation.",
    category: "compute",
    securityNotes: [
      "Ubuntu 22.04 Minimal",
      "SSH key-based access",
      "Cloud-init automation",
      "Public IP assigned",
    ],
    content: `# Compute Instance Configuration
# Coolify IaC - VM Setup

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_ocid
}

data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = var.instance_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_instance" "coolify_vm" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  compartment_id      = var.compartment_ocid
  display_name        = var.instance_display_name
  shape               = var.instance_shape

  shape_config {
    ocpus         = var.instance_ocpus
    memory_in_gbs = var.instance_memory_gb
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.coolify_subnet.id
    display_name     = "coolify-vnic"
    assign_public_ip = true
    hostname_label   = "coolify"
  }

  source_details {
    source_type             = "image"
    source_id               = data.oci_core_images.ubuntu.images[0].id
    boot_volume_size_in_gbs = 50
  }

  metadata = {
    ssh_authorized_keys = file(var.ssh_public_key_path)
    user_data = base64encode(templatefile("\${path.module}/scripts/install_coolify.sh", {
      docker_lv_size_gb = var.docker_lv_size_gb
    }))
  }

  preserve_boot_volume = false
}
`,
  },
  {
    id: "storage",
    name: "Storage & LVM",
    filename: "storage.tf",
    icon: <HardDrive size={24} />,
    description: "Block volume for Docker data with LVM configuration.",
    category: "storage",
    securityNotes: [
      "Separate block volume for Docker",
      "LVM for flexible storage management",
      "Persistent mount configuration",
    ],
    content: `# Storage Configuration
# Coolify IaC - Block Volume & LVM

resource "oci_core_volume" "docker_volume" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "coolify-docker-volume"
  size_in_gbs         = var.docker_volume_size_gb

  freeform_tags = {
    "purpose" = "docker-data"
  }
}

resource "oci_core_volume_attachment" "docker_volume_attachment" {
  attachment_type = "paravirtualized"
  instance_id     = oci_core_instance.coolify_vm.id
  volume_id       = oci_core_volume.docker_volume.id
  display_name    = "coolify-docker-attachment"

  device = "/dev/oracleoci/oraclevdb"
}
`,
  },
  {
    id: "install",
    name: "Installation Script",
    filename: "install_coolify.sh",
    icon: <Cog size={24} />,
    description: "Automated Docker and Coolify installation with LVM setup.",
    category: "automation",
    securityNotes: [
      "Automated LVM setup",
      "Docker on separate volume",
      "Log rotation configured",
      "Coolify auto-install",
    ],
    content: `#!/bin/bash
set -e

echo "=== Coolify Installation startet ==="

apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git lvm2

DISK=""
for i in 1 2 3 4 5; do
  if [ -b "/dev/sdb" ]; then DISK="/dev/sdb"; break; fi
  if [ -b "/dev/vdb" ]; then DISK="/dev/vdb"; break; fi
  sleep 5
done

if [ -n "$DISK" ]; then
  pvcreate $DISK
  vgcreate docker-vg $DISK
  lvcreate -L 90G -n docker-lv docker-vg
  mkfs.ext4 /dev/docker-vg/docker-lv
  mkdir -p /mnt/docker
  mount /dev/docker-vg/docker-lv /mnt/docker
  echo "/dev/docker-vg/docker-lv /mnt/docker ext4 defaults 0 2" >> /etc/fstab
fi

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu jammy stable" > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io

mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<'DOCKEREOF'
{
  "data-root": "/mnt/docker",
  "log-driver": "json-file",
  "log-opts": {"max-size": "10m", "max-file": "3"}
}
DOCKEREOF

systemctl enable docker && systemctl start docker
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

echo "=== Installation abgeschlossen ==="
`,
  },
];

const categories = [
  { id: "all", label: "All", icon: <Folder size={20} /> },
  { id: "core", label: "Core", icon: <Settings size={20} /> },
  { id: "compute", label: "Compute", icon: <Laptop size={20} /> },
  { id: "storage", label: "Storage", icon: <HardDrive size={20} /> },
  { id: "automation", label: "Automation", icon: <Cog size={20} /> },
];

const securityLayers = [
  { icon: <Lock size={24} />, title: "Authentication", bgClass: "bg-[var(--accent-blue)]/10", items: ["OCI API key authentication", "SSH key-based access", "IAM policies enforced", "Compartment isolation"] },
  { icon: <Shield size={24} />, title: "Network Security", bgClass: "bg-[var(--accent-teal)]/10", items: ["Public IP for VM access", "Security lists configured", "SSH (22) port access", "HTTP/HTTPS (80/443) open"] },
  { icon: <Server size={24} />, title: "Instance Security", bgClass: "bg-[var(--accent-purple)]/10", items: ["Ubuntu 22.04 Minimal", "Automatic security updates", "Cloud-init automation", "Preserve boot volume disabled"] },
  { icon: <Database size={24} />, title: "Storage Security", bgClass: "bg-[var(--accent-purple)]/10", items: ["Separate block volume for Docker", "LVM for flexible management", "Persistent fstab configuration", "Data isolation from OS"] },
  { icon: <Cloud size={24} />, title: "Docker Security", bgClass: "bg-[var(--accent-blue)]/10", items: ["Official Docker installation", "GPG key verification", "Log rotation (10MB, 3 files)", "Systemd service enabled"] },
  { icon: <Activity size={24} />, title: "Monitoring & Logging", bgClass: "bg-[var(--accent-teal)]/10", items: ["Installation logging", "Cloud-init output logs", "Docker service monitoring", "Coolify built-in monitoring"] },
];

export default function CoolifyPage() {
  const [selectedFile, setSelectedFile] = useState(terraformFiles[0]);
  const [activeCategory, setActiveCategory] = useState("all");
  const codeRef = useRef<HTMLElement>(null);

  const filteredFiles = activeCategory === "all" ? terraformFiles : terraformFiles.filter((f) => f.category === activeCategory);

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

  useEffect(() => {
    const loadPrism = async () => {
      const Prism = (await import("prismjs")).default;
      // @ts-expect-error - prismjs components don't have type definitions
      await import("prismjs/components/prism-hcl.js");
      // @ts-expect-error - prismjs components don't have type definitions
      await import("prismjs/components/prism-bash.js");
      // @ts-expect-error - prismjs themes don't have type definitions
      await import("prismjs/themes/prism-tomorrow.css");
      if (codeRef.current) Prism.highlightElement(codeRef.current);
    };
    loadPrism();
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl"></span>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Coolify on OCI</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Self-hosted PaaS on Oracle Cloud Infrastructure. Automated deployment with Terraform.</p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Link href="/tools/solution" className="btn glass">← Back to Solutions</Link>
          <button onClick={handleDownloadAll} className="btn btn-primary" style={{ fontSize: "0.95rem", padding: "0.6rem 1.5rem" }}>Download All</button>
        </div>
      </section>

      <section className="container pb-16">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>Overview</h2>
        <div className="glass overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/10 bg-white/2"><h3 className="text-lg font-semibold text-white">Architecture Overview</h3></div>
          <div className="p-6"><ArchitectureDiagram /></div>
        </div>
        <div className="grid grid-2 gap-4">
          {securityLayers.map((layer, i) => (
            <div key={i} className={`glass ${layer.bgClass}`} style={{ padding: "2.5rem", borderRadius: "12px" }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl">{layer.icon}</div>
                <div><h4 className="font-bold text-white" style={{ fontSize: "1.25rem" }}>{layer.title}</h4><p className="text-[10px] uppercase tracking-widest text-slate-500">Security Layer {i + 1}</p></div>
              </div>
              <ul className="space-y-2">{layer.items.map((item, j) => (<li key={j} className="flex items-start gap-2 text-xs text-slate-300"><span className="text-emerald-500 mt-1">•</span>{item}</li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "3rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}> Code</h2>
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">Filter Categories</h3>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setActiveCategory("all")} className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-md font-bold ${activeCategory === "all" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"}`}>All</button>
            {categories.map((cat) => (<button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-md font-bold ${activeCategory === cat.id ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"}`}>{cat.icon} {cat.label}</button>))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">Module Files ({filteredFiles.length})</h3>
          <div className="grid grid-2 gap-2">
            {filteredFiles.map((file) => (
              <button key={file.id} onClick={() => setSelectedFile(file)} className={`w-full text-left p-4 glass transition-all ${selectedFile.id === file.id ? "bg-indigo-500/20 border-indigo-500/40" : "hover:bg-white/5"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{file.icon}</span>
                  <div className="min-w-0 flex-1"><h3 className={`font-semibold text-sm truncate ${selectedFile.id === file.id ? "text-indigo-300" : "text-slate-200"}`}>{file.name}</h3><p className="text-xs text-slate-500 font-mono truncate">{file.filename}</p></div>
                  {selectedFile.id === file.id && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass p-6 space-y-3">
            <div className="flex items-center gap-3 flex-wrap"><span className="text-3xl">{selectedFile.icon}</span><h2 className="text-xl font-bold text-white">{selectedFile.name}</h2><code className="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/10 text-indigo-300 rounded">{selectedFile.filename}</code></div>
            <p className="text-slate-400 text-sm">{selectedFile.description}</p>
          </div>
          {selectedFile.securityNotes.length > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-3">🛡️ Security Controls</h3>
              <div className="grid sm:grid-cols-2 gap-2">{selectedFile.securityNotes.map((note, i) => (<div key={i} className="flex items-start gap-2 text-sm"><span className="text-emerald-400">✓</span><span className="text-slate-300">{note}</span></div>))}</div>
            </div>
          )}
          <div className="glass overflow-hidden rounded-xl">
            <div className="px-4 py-2 border-b border-white/10 bg-white/2 flex justify-between"><span className="text-xs text-slate-400 font-mono">{selectedFile.filename}</span><span className="text-[10px] uppercase text-slate-500">{selectedFile.filename.endsWith('.sh') ? 'Bash Script' : 'Terraform (HCL)'}</span></div>
            <pre style={{ background: "var(--bg-color)", margin: 0, padding: "1.5rem", overflowX: "auto" }}><code ref={codeRef} className={selectedFile.filename.endsWith('.sh') ? 'language-bash' : 'language-hcl'}>{selectedFile.content}</code></pre>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", padding: "2rem" }}>
      <div className="glass" style={{ padding: "1rem 3rem", border: "2px dashed var(--accent-blue)" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: "2rem" }}>🌐</div><div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Internet</div></div></div>
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>
      <div className="glass" style={{ padding: "1rem 2rem", border: "2px solid var(--accent-teal)" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: "2rem" }}>☁️</div><div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>OCI VCN</div><div style={{ fontSize: "0.75rem", color: "var(--accent-teal)" }}>eu-frankfurt-1</div></div></div>
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px solid var(--accent-purple)" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: "2rem" }}>💻</div><div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Coolify VM</div><div style={{ fontSize: "0.75rem", color: "var(--accent-purple)" }}>VM.Standard.A1.Flex (4 OCPU, 24GB)</div><div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}><span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🐳 Docker</span><span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🚀 Coolify</span><span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>💾 LVM</span></div></div></div>
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>
      <div className="glass" style={{ padding: "1rem 2rem", border: "2px solid var(--accent-blue)" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: "2rem" }}>💾</div><div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Block Volume</div><div style={{ fontSize: "0.75rem", color: "var(--accent-blue)" }}>100GB (Docker Data)</div></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem", width: "100%" }}>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}><div style={{ fontSize: "1.5rem" }}>🔑</div><div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>SSH Access</div></div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}><div style={{ fontSize: "1.5rem" }}>🔒</div><div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Security Lists</div></div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}><div style={{ fontSize: "1.5rem" }}>📝</div><div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Cloud-Init</div></div>
      </div>
    </div>
  );
}
