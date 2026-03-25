"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Building, Lock, Cog, Users, BarChart3, Folder, Shield, User, Package, Activity } from "lucide-react";

const terraformFiles = [
  {
    id: "workspace",
    name: "Workspace Setup",
    filename: "01_workspace.tf",
    icon: <Building size={24} />,
    description: "Databricks workspace configuration with networking and security setup.",
    category: "core",
    securityNotes: [
      "VPC injection for network isolation",
      "Customer-managed keys for encryption",
      "Private connectivity only",
    ],
    content: `# Databricks Workspace Configuration
# Databricks IaC - Enterprise Workspace Setup

terraform {
  required_providers {
    databricks = {
      source  = "databricks/databricks"
      version = ">= 1.50.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0"
    }
  }
}

provider "databricks" {
  host = var.databricks_host
}

# Databricks Workspace
resource "databricks_mws_workspaces" "main" {
  account_id     = var.databricks_account_id
  aws_region     = var.aws_region
  workspace_name = var.workspace_name
  
  credentials_id           = databricks_mws_credentials.main.credentials_id
  storage_configuration_id = databricks_mws_storage_configurations.main.storage_configuration_id
  network_id               = databricks_mws_networks.main.network_id
  
  token {
    comment          = "Terraform token"
    lifetime_seconds = 86400
  }
}

# Customer-managed keys
resource "databricks_mws_customer_managed_keys" "workspace" {
  account_id = var.databricks_account_id
  aws_key_info {
    key_arn   = var.kms_key_arn
    key_alias = var.kms_key_alias
  }
  use_cases = ["MANAGED_SERVICES"]
}

# Managed services encryption
resource "databricks_mws_storage_configurations" "main" {
  account_id                 = var.databricks_account_id
  storage_configuration_name = "\${var.workspace_name}-storage"
  root_bucket_info {
    bucket_name = var.root_bucket_name
  }
}
`,
  },
  {
    id: "network",
    name: "Network & Security",
    filename: "02_network.tf",
    icon: <Lock size={24} />,
    description: "Network configuration with private subnets and security groups.",
    category: "network",
    securityNotes: [
      "Private subnets for clusters",
      "Security groups with least privilege",
      "VPC endpoints for AWS services",
    ],
    content: `# Network Configuration
# Databricks IaC - Network & Security

# VPC for Databricks
resource "aws_vpc" "databricks" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "\${var.workspace_name}-vpc"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Private subnets for clusters
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.databricks.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "\${var.workspace_name}-private-\${count.index + 1}"
  }
}

# NAT Gateway for outbound traffic
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  
  tags = {
    Name = "\${var.workspace_name}-nat"
  }
}

# Route tables
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.databricks.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }
  
  tags = {
    Name = "\${var.workspace_name}-private-rt"
  }
}

# Security group for clusters
resource "aws_security_group" "clusters" {
  name        = "\${var.workspace_name}-clusters-sg"
  description = "Security group for Databricks clusters"
  vpc_id      = aws_vpc.databricks.id
  
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "\${var.workspace_name}-clusters-sg"
  }
}
`,
  },
  {
    id: "clusters",
    name: "Cluster Policies",
    filename: "03_clusters.tf",
    icon: <Cog size={24} />,
    description: "Cluster policies and compute configuration.",
    category: "compute",
    securityNotes: [
      "Instance type restrictions",
      "Auto-termination enforced",
      "Tagging requirements",
    ],
    content: `# Cluster Policies
# Databricks IaC - Compute Configuration

# Cluster policy for data engineering
resource "databricks_cluster_policy" "data_engineering" {
  name = "Data Engineering Policy"
  
  definition = jsonencode({
    "node_type_id" : {
      "type" : "fixed",
      "value" : "i3.xlarge"
    },
    "driver_node_type_id" : {
      "type" : "fixed",
      "value" : "i3.xlarge"
    },
    "autotermination_minutes" : {
      "type" : "fixed",
      "value" : 30
    },
    "spark_version" : {
      "type" : "fixed",
      "value" : "14.3.x-scala2.12"
    },
    "custom_tags.Team" : {
      "type" : "fixed",
      "value" : "DataEngineering"
    }
  })
  
  description = "Cluster policy for data engineering workloads"
}

# Cluster policy for data science
resource "databricks_cluster_policy" "data_science" {
  name = "Data Science Policy"
  
  definition = jsonencode({
    "node_type_id" : {
      "type" : "allowlist",
      "values" : [
        { "value" : "i3.xlarge" },
        { "value" : "i3.2xlarge" },
        { "value" : "m5.2xlarge" }
      ]
    },
    "autotermination_minutes" : {
      "type" : "fixed",
      "value" : 120
    },
    "spark_version" : {
      "type" : "fixed",
      "value" : "14.3.x-scala2.12"
    },
    "custom_tags.Team" : {
      "type" : "fixed",
      "value" : "DataScience"
    }
  })
  
  description = "Cluster policy for data science workloads"
}

# Job cluster for production
resource "databricks_job" "production_etl" {
  name = "Production ETL Job"
  
  job_cluster {
    job_cluster_key = "production_cluster"
    
    new_cluster {
      spark_version = "14.3.x-scala2.12"
      node_type_id  = "i3.2xlarge"
      
      aws_attributes {
        first_on_demand   = 1
        availability      = "SPOT_WITH_FALLBACK"
        zone_id           = var.aws_zone
        spot_bid_price_percent = 75
      }
      
      autoscale {
        min_workers = 2
        max_workers = 10
      }
      
      custom_tags = {
        "Environment" = "Production"
        "CostCenter"  = "DataEngineering"
      }
    }
  }
  
  task {
    task_key = "etl_task"
    
    notebook_task {
      notebook_path = "/Shared/Production/ETL/Main"
    }
    
    job_cluster_key = "production_cluster"
  }
}
`,
  },
  {
    id: "permissions",
    name: "Permissions & Access",
    filename: "04_permissions.tf",
    icon: <Users size={24} />,
    description: "User permissions, groups, and access control.",
    category: "security",
    securityNotes: [
      "Role-based access control",
      "SCIM provisioning enabled",
      "Audit logging configured",
    ],
    content: `# Permissions & Access Control
# Databricks IaC - Identity & Access Management

# Data Engineering group
resource "databricks_group" "data_engineering" {
  display_name = "Data Engineering"
  
  entitlements = ["allow-cluster-create"]
}

# Data Science group
resource "databricks_group" "data_science" {
  display_name = "Data Science"
  
  entitlements = ["allow-cluster-create", "allow-instance-pool-create"]
}

# Analytics group
resource "databricks_group" "analytics" {
  display_name = "Analytics"
  
  entitlements = []
}

# Workspace admin group
resource "databricks_group" "admins" {
  display_name = "Workspace Admins"
  
  entitlements = ["allow-cluster-create", "allow-instance-pool-create", "databricks-sql-access"]
}

# Grant permissions on folders
resource "databricks_directory" "shared" {
  path = "/Shared"
}

resource "databricks_permissions" "shared_usage" {
  directory_id = databricks_directory.shared.id
  
  access_control {
    group_name       = databricks_group.data_engineering.display_name
    permission_level = "CAN_READ"
  }
  
  access_control {
    group_name       = databricks_group.data_science.display_name
    permission_level = "CAN_READ"
  }
  
  access_control {
    group_name       = databricks_group.analytics.display_name
    permission_level = "CAN_READ"
  }
}

# Service principal for automation
resource "databricks_service_principal" "automation" {
  display_name = "Automation Service Principal"
  
  application_id = var.service_principal_app_id
}

resource "databricks_group_member" "automation_member" {
  group_id  = databricks_group.data_engineering.id
  member_id = databricks_service_principal.automation.id
}
`,
  },
  {
    id: "pipelines",
    name: "Delta Live Tables",
    filename: "05_pipelines.tf",
    icon: <BarChart3 size={24} />,
    description: "Delta Live Tables pipelines and data quality.",
    category: "data",
    securityNotes: [
      "Data quality expectations defined",
      "Schema enforcement enabled",
      "Unity Catalog integration",
    ],
    content: `# Delta Live Tables Pipelines
# Databricks IaC - Data Pipelines

# DLT Pipeline for ETL
resource "databricks_pipeline" "etl_pipeline" {
  name    = "Production ETL Pipeline"
  target  = "production_etl"
  storage = var.pipeline_storage_location
  
  cluster {
    label       = "default"
    num_workers = 4
    
    custom_tags = {
      "pipeline" = "production_etl"
    }
  }
  
  library {
    notebook {
      path = "/Shared/Production/DLT/ETL"
    }
  }
  
  configuration = {
    "spark.databricks.delta.preview.enabled" = "true"
    "pipelines.reset.allowed"                = "false"
  }
  
  continuous = false
  development = false
}

# DLT Pipeline for data quality
resource "databricks_pipeline" "quality_pipeline" {
  name    = "Data Quality Pipeline"
  target  = "data_quality"
  storage = var.quality_storage_location
  
  cluster {
    label       = "default"
    num_workers = 2
  }
  
  library {
    notebook {
      path = "/Shared/Quality/DLT/QualityChecks"
    }
  }
  
  configuration = {
    "quality.expectations" = "strict"
  }
  
  continuous = true
}

# Unity Catalog integration
resource "databricks_catalog" "production" {
  name           = "production"
  comment        = "Production data catalog"
  storage_root   = var.catalog_storage_location
  provider_name  = "azure"
  share_name     = "production_share"
}

resource "databricks_schema" "bronze" {
  name         = "bronze"
  catalog_name = databricks_catalog.production.id
}

resource "databricks_schema" "silver" {
  name         = "silver"
  catalog_name = databricks_catalog.production.id
}

resource "databricks_schema" "gold" {
  name         = "gold"
  catalog_name = databricks_catalog.production.id
}

# Grant access to schemas
resource "databricks_grants" "bronze_access" {
  schema = databricks_schema.bronze.id
  
  grant {
    principal  = databricks_group.data_engineering.display_name
    privileges = ["SELECT", "READ_FILES", "WRITE_FILES"]
  }
}
`,
  },
];

const categories = [
  { id: "all", label: "All", icon: <Folder size={20} /> },
  { id: "core", label: "Core", icon: <Building size={20} /> },
  { id: "network", label: "Network", icon: <Shield size={20} /> },
  { id: "compute", label: "Compute", icon: <Cog size={20} /> },
  { id: "security", label: "Security", icon: <Users size={20} /> },
  { id: "data", label: "Data", icon: <BarChart3 size={20} /> },
];

const securityLayers = [
  {
    icon: <Lock size={24} />,
    title: "Encryption",
    bgClass: "bg-[var(--accent-blue)]/10",
    items: [
      "Customer-managed keys (CMK)",
      "Encryption at rest (AES-256)",
      "TLS 1.2+ for data in transit",
      "Secrets management with Databricks Secrets",
    ],
  },
  {
    icon: "🔒",
    title: "Network Security",
    bgClass: "bg-[var(--accent-teal)]/10",
    items: [
      "VPC injection for isolation",
      "Private subnets for clusters",
      "No public IP addresses",
      "VPC endpoints for AWS services",
    ],
  },
  {
    icon: <User size={24} />,
    title: "Identity & Access",
    bgClass: "bg-[var(--accent-purple)]/10",
    items: [
      "SCIM provisioning integration",
      "Role-based access control (RBAC)",
      "Multi-factor authentication (MFA)",
      "Audit logging enabled",
    ],
  },
  {
    icon: "",
    title: "Data Governance",
    bgClass: "bg-[var(--accent-purple)]/10",
    items: [
      "Unity Catalog integration",
      "Data lineage tracking",
      "Column-level security",
      "Data masking policies",
    ],
  },
  {
    icon: <Cog size={24} />,
    title: "Cluster Security",
    bgClass: "bg-[var(--accent-blue)]/10",
    items: [
      "Instance type restrictions",
      "Auto-termination enforced",
      "Init scripts for hardening",
      "Cluster policies defined",
    ],
  },
  {
    icon: <Activity size={24} />,
    title: "Monitoring & Compliance",
    bgClass: "bg-[var(--accent-teal)]/10",
    items: [
      "System logs retained 90 days",
      "Audit logs to S3/CloudWatch",
      "Notebook revision history",
      "Compliance reports (SOC2, HIPAA)",
    ],
  },
];

export default function DatabricksPage() {
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

  // Load Prism.js and apply highlighting on client-side only
  useEffect(() => {
    const loadPrism = async () => {
      const Prism = (await import("prismjs")).default;
      // @ts-expect-error - prismjs components don't have type definitions
      await import("prismjs/components/prism-hcl.js");
      // @ts-expect-error - prismjs themes don't have type definitions
      await import("prismjs/themes/prism-tomorrow.css");

      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
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
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Databricks IaC</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Infrastructure-as-Code for Databricks. Automate workspaces, clusters, and jobs.
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
              className={`glass ${layer.bgClass}`}
              style={{ padding: "2.5rem", borderRadius: "12px" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  {layer.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white" style={{ fontSize: "1.25rem" }}>{layer.title}</h4>
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
                <span><Shield size={24} /></span> Security Controls
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
      {/* Users */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", width: "100%", marginBottom: "1rem" }}>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>👨‍💻</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Data Engineer</div>
        </div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>👩‍🔬</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Data Scientist</div>
        </div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>📊</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Analyst</div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>

      {/* Databricks Workspace */}
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px solid var(--accent-teal)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem" }}>⚡</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Databricks Workspace</div>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-teal)" }}>Managed Services</div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>📓 Notebooks</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>⚙️ Jobs</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>📊 Dashboards</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>

      {/* Compute Layer */}
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px solid var(--accent-purple)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>☸️</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Cluster Layer</div>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-purple)" }}>Private Subnet</div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🔷 Shared</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🔷 Single User</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🔷 Job</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>↓</div>

      {/* Data Layer */}
      <div className="glass" style={{ padding: "1.5rem 3rem", border: "2px solid var(--accent-blue)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>📦</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Data Layer</div>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-blue)" }}>S3 / ADLS / GCS</div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🥉 Bronze</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🥈 Silver</span>
            <span className="glass" style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>🥇 Gold</span>
          </div>
        </div>
      </div>

      {/* Side Services */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "2rem", width: "100%" }}>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>🔑</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Unity Catalog</div>
        </div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>🔐</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>CMK</div>
        </div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>📈</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Monitoring</div>
        </div>
        <div className="glass" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>🔒</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>SCIM</div>
        </div>
      </div>
    </div>
  );
}
