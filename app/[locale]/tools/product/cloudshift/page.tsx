"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Server,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Lock,
  Network,
  Cpu,
  HardDrive,
  AlertCircle,
  Star,
  Users,
  RefreshCw,
  Package,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Platform {
  id: string;
  name: string;
  logo: string;
  badge?: string;
  priceMultiplier: number;
  description: string;
  features: string[];
  color: string;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  maxPrice: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
  vmTypes: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const platforms: Platform[] = [
  {
    id: "olvm",
    name: "Oracle OLVM / oVirt",
    logo: "🔴",
    badge: "Fully Supported",
    priceMultiplier: 1.0,
    description:
      "Native integration with Oracle Linux Virtualization Manager and oVirt. Optimized disk conversion, storage domain mapping, and cluster placement.",
    features: [
      "Native OLVM API integration",
      "Storage domain auto-mapping",
      "Cluster & host placement",
      "OS morphing for KVM",
      "VirtIO driver injection",
      "Template-based minion VMs",
    ],
    color: "var(--accent-teal)",
  },
  {
    id: "hyperv",
    name: "Microsoft Hyper-V",
    logo: "🔵",
    badge: "Full Support",
    priceMultiplier: 1.15,
    description:
      "Full WinRM/PowerShell-based integration for standalone and clustered Hyper-V environments. Automatic Hyper-V Integration Services injection.",
    features: [
      "WinRM / PowerShell transport",
      "Hyper-V Gen 1 & Gen 2 VMs",
      "Virtual switch mapping",
      "HIS & driver injection",
      "NTLM / Kerberos auth",
      "Clustered environment support",
    ],
    color: "var(--accent-blue)",
  },
  {
    id: "openstack",
    name: "OpenStack",
    logo: "🟠",
    priceMultiplier: 1.1,
    description:
      "Keystone-integrated migration to any OpenStack environment. cloud-init injection, flavor mapping, and Barbican secret management.",
    features: [
      "Keystone auth integration",
      "Barbican secret storage",
      "cloud-init injection",
      "Flavor & network mapping",
      "Cinder volume support",
      "Neutron network mapping",
    ],
    color: "#e09b4e",
  },
];

const pricingTiers: PricingTier[] = [
  {
    id: "simple",
    name: "Simple Workloads",
    description: "Linux VMs with standard configuration, single disk, no complex networking",
    basePrice: 8,
    maxPrice: 15,
    vmTypes: ["Ubuntu Server", "Debian", "CentOS / RHEL (minimal)", "Oracle Linux (minimal)"],
    features: [
      "Single vDisk conversion",
      "Basic network mapping",
      "Standard OS morphing",
      "cloud-init / VirtIO injection",
      "Progress monitoring",
      "Email status reports",
    ],
  },
  {
    id: "standard",
    name: "Standard Workloads",
    description: "Mixed Linux/Windows VMs, multiple disks, custom network configurations",
    basePrice: 15,
    maxPrice: 30,
    badge: "Most Popular",
    highlight: true,
    vmTypes: ["Windows Server 2016–2022", "RHEL / CentOS (complex)", "SUSE Linux", "Multi-disk VMs"],
    features: [
      "Multi-disk conversion",
      "Complex network mapping",
      "Full OS morphing suite",
      "Driver & tools injection",
      "Storage domain mapping",
      "Priority support queue",
      "Rollback capability",
    ],
  },
  {
    id: "enterprise",
    name: "Complex Workloads",
    description: "Large Windows Server VMs, cluster roles, legacy OS, or high-storage instances",
    basePrice: 30,
    maxPrice: 50,
    vmTypes: [
      "Windows Server (domain-joined)",
      "Legacy OS (Win 2008 / RHEL 6)",
      "High-storage VMs (> 500 GB)",
      "Clustered / HA workloads",
    ],
    features: [
      "Everything in Standard",
      "Legacy OS compatibility",
      "Domain-aware migration",
      "Incremental sync (delta)",
      "Zero-downtime cutover",
      "Dedicated migration engineer",
      "SLA-backed completion",
    ],
  },
];

const stats = [
  { value: "< 2h", label: "Avg. Migration Time", icon: <Clock size={22} /> },
  { value: "99.7%", label: "Success Rate", icon: <BarChart3 size={22} /> },
  { value: "0", label: "Downtime During Sync", icon: <Zap size={22} /> },
  { value: "3", label: "Supported Destinations", icon: <Network size={22} /> },
];

const migrationSteps = [
  {
    step: "01",
    title: "Register Endpoints",
    description:
      "Connect your VMware vCenter and destination platform (OLVM, Hyper-V, or OpenStack) via our REST API or web UI.",
    icon: <Server size={24} />,
    color: "var(--accent-blue)",
  },
  {
    step: "02",
    title: "Define Migration",
    description:
      "Select VMs, map networks and storage, set target cluster and OS morphing options. Credentials stored securely in Barbican.",
    icon: <Package size={24} />,
    color: "var(--accent-teal)",
  },
  {
    step: "03",
    title: "Live Data Sync",
    description:
      "Disks are copied in the background while the source VM remains running. Differential sync minimizes downtime.",
    icon: <RefreshCw size={24} />,
    color: "var(--accent-purple)",
  },
  {
    step: "04",
    title: "Cutover & Boot",
    description:
      "Final delta sync, OS morphing (drivers, cloud-init, network config), VM start on destination. Source VM is shut down.",
    icon: <Zap size={24} />,
    color: "var(--accent-teal)",
  },
];

const testimonials = [
  {
    quote:
      "We migrated 120 VMs from vSphere to Oracle OLVM in a weekend. The incremental sync meant near-zero downtime for our production workloads.",
    author: "Thomas K.",
    role: "Infrastructure Lead",
    company: "Austrian Financial Services",
    stars: 5,
  },
  {
    quote:
      "CloudShift handled our complex Windows Server domain-joined VMs flawlessly. Driver injection and Hyper-V Integration Services were applied automatically.",
    author: "Sandra M.",
    role: "Senior Systems Engineer",
    company: "Central European Retailer",
    stars: 5,
  },
  {
    quote:
      "The modular pricing is fair and transparent. We only paid for what we actually migrated, with no hidden fees per GB or per-CPU licensing.",
    author: "Andreas R.",
    role: "IT Director",
    company: "Manufacturing Group",
    stars: 5,
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  return <span>{target}{suffix}</span>;
}

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: `${platform.color}22`,
        border: `1px solid ${platform.color}55`,
        color: platform.color,
      }}
    >
      {platform.badge}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CloudShiftProductPage() {
  const [activePlatform, setActivePlatform] = useState<string>("olvm");
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [visibleSection, setVisibleSection] = useState<string>("");
  const heroRef = useRef<HTMLDivElement>(null);

  const selectedPlatform = platforms.find((p) => p.id === activePlatform) ?? platforms[0];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisibleSection(e.target.id);
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-gradient)", color: "var(--text-primary)" }}
    >
      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: "1px solid var(--glass-border)",
          background: "rgba(10,15,26,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>☁️</span>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "1.25rem",
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #fff 0%, var(--accent-teal) 60%, var(--accent-blue) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CloudShift
            </span>
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "4px",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                background: "rgba(125,211,192,0.15)",
                border: "1px solid rgba(125,211,192,0.3)",
                color: "var(--accent-teal)",
              }}
            >
              v2.1
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {["Features", "Migration", "Platforms", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-secondary)")
                }
              >
                {item}
              </a>
            ))}
            <Link
              href="/tools/solution/cloudshift"
              className="btn btn-primary"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "6rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(125,211,192,0.08) 0%, rgba(91,155,213,0.05) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              background: "rgba(125,211,192,0.1)",
              border: "1px solid rgba(125,211,192,0.25)",
              marginBottom: "2rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--accent-teal)",
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent-teal)",
                animation: "pulse 2s infinite",
              }}
            />
            VMware vSphere → Oracle OLVM · Hyper-V · OpenStack
          </div>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
            }}
          >
            Migrate VMware Workloads{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-teal), var(--accent-blue))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              without the complexity.
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "var(--text-secondary)",
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            CloudShift automates live VM migration from VMware vSphere to Oracle OLVM,
            Microsoft Hyper-V, and OpenStack — with automatic disk conversion, driver
            injection, and near-zero downtime cutover.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "4rem",
            }}
          >
            <Link href="/tools/solution/cloudshift" className="btn btn-primary">
              Start Migration →
            </Link>
            <a
              href="#migration"
              className="btn glass"
              style={{ color: "var(--text-primary)" }}
            >
              See How It Works
            </a>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px",
              maxWidth: "700px",
              margin: "0 auto",
              background: "var(--glass-border)",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--glass-border)",
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "1.5rem 1rem",
                  background: "rgba(255,255,255,0.03)",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    color: "var(--accent-teal)",
                    marginBottom: "0.5rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    letterSpacing: "-0.03em",
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 500 }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="container" style={{ padding: "6rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-teal)",
              marginBottom: "0.75rem",
            }}
          >
            Core Capabilities
          </p>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Everything you need to migrate at scale
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "560px", margin: "0 auto" }}>
            Built on OpenStack-proven microservice patterns with enterprise-grade security,
            observability, and rollback capabilities.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              icon: <RefreshCw size={28} />,
              color: "var(--accent-teal)",
              title: "Live Disk Replication",
              desc: "Copy VM disks while the source VM stays running. Differential sync on cutover means seconds of actual downtime, not hours.",
            },
            {
              icon: <Cpu size={28} />,
              color: "var(--accent-blue)",
              title: "Automatic OS Morphing",
              desc: "Network drivers, storage controllers, cloud-init, VirtIO, Hyper-V Integration Services — all injected automatically for the target hypervisor.",
            },
            {
              icon: <Network size={28} />,
              color: "var(--accent-purple)",
              title: "Network & Storage Mapping",
              desc: "Map VMware port groups, distributed switches, and datastores to destination logical networks and storage domains with a single config block.",
            },
            {
              icon: <Shield size={28} />,
              color: "var(--accent-teal)",
              title: "Credential Vault",
              desc: "Source and destination credentials stored in OpenStack Barbican. Secrets never appear in API payloads or log files.",
            },
            {
              icon: <HardDrive size={28} />,
              color: "var(--accent-blue)",
              title: "Format Conversion",
              desc: "VMDK → QCOW2, VMDK → VHDX, and more. Conversion handled in-pipeline by worker minions on the destination platform.",
            },
            {
              icon: <BarChart3 size={28} />,
              color: "var(--accent-purple)",
              title: "Real-Time Progress",
              desc: "Task-level progress updates via REST API polling or webhook. Each migration step has granular status: PENDING → RUNNING → COMPLETED.",
            },
          ].map((feat, i) => (
            <FeatureCard key={i} {...feat} />
          ))}
        </div>
      </section>

      {/* ── MIGRATION FLOW ───────────────────────────────────────── */}
      <section
        id="migration"
        style={{
          padding: "6rem 0",
          borderTop: "1px solid var(--glass-border)",
          borderBottom: "1px solid var(--glass-border)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div className="container" style={{ padding: "0 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-blue)",
                marginBottom: "0.75rem",
              }}
            >
              How It Works
            </p>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Four steps from vSphere to your target platform
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto" }}>
              CloudShift handles every layer of the migration — from raw disk transfer to
              OS-level adaptation and final cutover.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              position: "relative",
            }}
          >
            {migrationSteps.map((step, i) => (
              <div
                key={i}
                className="glass"
                style={{
                  padding: "2rem",
                  borderRadius: "16px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1.25rem",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "3rem",
                    color: `${step.color}15`,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.step}
                </div>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    background: `${step.color}18`,
                    border: `1px solid ${step.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.color,
                    marginBottom: "1.25rem",
                  }}
                >
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    marginBottom: "0.75rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Architecture Visual */}
          <div
            className="glass"
            style={{
              marginTop: "3rem",
              padding: "2.5rem",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {/* Source */}
            <div style={{ textAlign: "center", minWidth: "140px" }}>
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "12px",
                  background: "rgba(91,155,213,0.1)",
                  border: "2px dashed rgba(91,155,213,0.4)",
                  marginBottom: "0.75rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏢</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>VMware vSphere</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Source Platform
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--accent-blue)" }}>
                vCenter · ESXi · VMDK
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.05em" }}>LIVE SYNC</div>
              <ArrowRight size={28} style={{ color: "var(--accent-teal)" }} />
            </div>

            {/* Pipeline */}
            <div style={{ textAlign: "center", minWidth: "180px" }}>
              <div
                style={{
                  padding: "1.5rem 2rem",
                  borderRadius: "12px",
                  background: "rgba(125,211,192,0.08)",
                  border: "2px solid rgba(125,211,192,0.35)",
                  marginBottom: "0.75rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>CloudShift</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  API · Conductor · Worker
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--accent-teal)" }}>
                Morphing · Conversion · Secrets
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.05em" }}>CUTOVER</div>
              <ArrowRight size={28} style={{ color: "var(--accent-purple)" }} />
            </div>

            {/* Destination */}
            <div style={{ textAlign: "center", minWidth: "140px" }}>
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "12px",
                  background: "rgba(155,143,184,0.1)",
                  border: "2px solid rgba(155,143,184,0.4)",
                  marginBottom: "0.75rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>☁️</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Target Platform</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Destination
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--accent-purple)" }}>
                OLVM · Hyper-V · OpenStack
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORMS ────────────────────────────────────────────── */}
      <section id="platforms" className="container" style={{ padding: "6rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-purple)",
              marginBottom: "0.75rem",
            }}
          >
            Destination Platforms
          </p>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Choose your destination
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto" }}>
            CloudShift provides native integration for each target — not a generic adapter.
            VMware vSphere → Oracle OLVM is our primary, battle-tested migration path.
          </p>
        </div>

        {/* Platform Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                borderRadius: "10px",
                border: `1px solid ${activePlatform === p.id ? p.color : "var(--glass-border)"}`,
                background:
                  activePlatform === p.id ? `${p.color}18` : "rgba(255,255,255,0.03)",
                color: activePlatform === p.id ? p.color : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              <span>{p.logo}</span>
              {p.name}
              {p.badge && (
                <span
                  style={{
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    background: `${p.color}25`,
                    color: p.color,
                    letterSpacing: "0.04em",
                  }}
                >
                  {p.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Platform Detail */}
        <div
          className="glass"
          style={{
            padding: "2.5rem",
            borderRadius: "20px",
            border: `1px solid ${selectedPlatform.color}30`,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2.5rem" }}>{selectedPlatform.logo}</span>
              <div>
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {selectedPlatform.name}
                </h3>
                {selectedPlatform.badge && (
                  <PlatformBadge platform={selectedPlatform} />
                )}
              </div>
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                marginBottom: "2rem",
              }}
            >
              {selectedPlatform.description}
            </p>

            {activePlatform === "olvm" && (
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "12px",
                  background: "rgba(125,211,192,0.07)",
                  border: "1px solid rgba(125,211,192,0.2)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                    fontWeight: 700,
                    color: "var(--accent-teal)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  <Star size={14} /> Primary Migration Path
                </div>
                <p style={{ color: "var(--text-secondary)" }}>
                  VMware vSphere → Oracle OLVM is our flagship, production-hardened route.
                  Used by enterprises running Oracle Linux workloads who need to exit VMware
                  without re-platforming their applications.
                </p>
              </div>
            )}
          </div>

          <div>
            <h4
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "1.25rem",
              }}
            >
              Platform-Specific Features
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {selectedPlatform.features.map((feat, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: `${selectedPlatform.color}22`,
                      border: `1px solid ${selectedPlatform.color}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} color={selectedPlatform.color} />
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{
          padding: "6rem 0",
          borderTop: "1px solid var(--glass-border)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div className="container" style={{ padding: "0 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-teal)",
                marginBottom: "0.75rem",
              }}
            >
              Modular Pricing
            </p>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Pay per VM — based on complexity
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: "560px",
                margin: "0 auto 1.5rem",
              }}
            >
              No per-GB transfer fees. No per-CPU licensing. One transparent price per
              virtual machine, determined by OS complexity and configuration.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                background: "rgba(91,155,213,0.1)",
                border: "1px solid rgba(91,155,213,0.2)",
                fontSize: "0.82rem",
                color: "var(--accent-blue)",
              }}
            >
              <AlertCircle size={14} />
              Destination platform may apply a small surcharge — see platform matrix below
            </div>
          </div>

          {/* Pricing Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {pricingTiers.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                hovered={hoveredTier === tier.id}
                onHover={() => setHoveredTier(tier.id)}
                onLeave={() => setHoveredTier(null)}
              />
            ))}
          </div>

          {/* Platform Price Matrix */}
          <div className="glass" style={{ borderRadius: "20px", overflow: "hidden" }}>
            <div
              style={{
                padding: "1.25rem 2rem",
                borderBottom: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                }}
              >
                Platform Pricing Matrix
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Base prices apply for Oracle OLVM. Other destinations include a platform surcharge.
              </p>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.875rem",
                }}
              >
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "1rem 2rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid var(--glass-border)",
                      }}
                    >
                      Destination Platform
                    </th>
                    {pricingTiers.map((t) => (
                      <th
                        key={t.id}
                        style={{
                          textAlign: "center",
                          padding: "1rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          borderBottom: "1px solid var(--glass-border)",
                        }}
                      >
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((platform, pi) => (
                    <tr
                      key={platform.id}
                      style={{
                        borderBottom:
                          pi < platforms.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "none",
                        background:
                          platform.id === "olvm"
                            ? "rgba(125,211,192,0.03)"
                            : "transparent",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.03)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          platform.id === "olvm"
                            ? "rgba(125,211,192,0.03)"
                            : "transparent")
                      }
                    >
                      <td style={{ padding: "1rem 2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontSize: "1.25rem" }}>{platform.logo}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>
                              {platform.name}
                            </div>
                            {platform.id === "olvm" && (
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  color: "var(--accent-teal)",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                ★ Primary Path
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {pricingTiers.map((tier) => {
                        const low = Math.ceil(tier.basePrice * platform.priceMultiplier);
                        const high = Math.ceil(tier.maxPrice * platform.priceMultiplier);
                        return (
                          <td
                            key={tier.id}
                            style={{ textAlign: "center", padding: "1rem" }}
                          >
                            <div
                              style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                color:
                                  tier.highlight
                                    ? "var(--accent-teal)"
                                    : "var(--text-primary)",
                                fontSize: "0.95rem",
                              }}
                            >
                              €{low}–€{high}
                            </div>
                            <div
                              style={{
                                fontSize: "0.65rem",
                                color: "var(--text-secondary)",
                                marginTop: "0.15rem",
                              }}
                            >
                              per VM
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Footnotes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            {[
              { icon: "✅", text: "No per-GB transfer fees" },
              { icon: "✅", text: "No per-CPU licensing" },
              { icon: "✅", text: "Volume discounts from 20+ VMs" },
              { icon: "✅", text: "Free re-run on failed migrations" },
            ].map((note, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span>{note.icon}</span>
                {note.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section id="testimonials" className="container" style={{ padding: "6rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-blue)",
              marginBottom: "0.75rem",
            }}
          >
            Customer Stories
          </p>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Trusted by infrastructure teams
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: "2rem",
                borderRadius: "16px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
              }
            >
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star
                    key={si}
                    size={14}
                    fill="var(--accent-teal)"
                    color="var(--accent-teal)"
                  />
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-teal))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0a0f1a",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                  }}
                >
                  {t.author[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.author}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 0",
          borderTop: "1px solid var(--glass-border)",
          background:
            "linear-gradient(180deg, rgba(125,211,192,0.04) 0%, rgba(91,155,213,0.04) 100%)",
        }}
      >
        <div
          className="container"
          style={{ padding: "0 2rem", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
            }}
          >
            Ready to exit VMware?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.65,
            }}
          >
            Start with a single VM. Our API-first approach means you can integrate
            CloudShift into your existing automation pipelines from day one.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/tools/solution/cloudshift" className="btn btn-primary">
              Open CloudShift Console →
            </Link>
            <a
              href="mailto:cloudshift@thesolution.at"
              className="btn glass"
              style={{ color: "var(--text-primary)" }}
            >
              Talk to an Engineer
            </a>
          </div>
          <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Deployed on-premise or as a service · No per-seat licensing · Volume discounts available
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--glass-border)",
          padding: "2rem 0",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="container"
          style={{
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>☁️</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                background: "linear-gradient(135deg, #fff, var(--accent-teal))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CloudShift
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginLeft: "0.5rem",
              }}
            >
              by thesolution.at
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            <Link href="/impressum" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Impressum
            </Link>
            <Link href="/datenschutz" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Datenschutz
            </Link>
            <Link href="/tools/solution/cloudshift" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Console
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  color,
  title,
  desc,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="glass"
      style={{
        padding: "2rem",
        borderRadius: "16px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.25)` : "none",
        borderColor: hovered ? `${color}40` : "var(--glass-border)",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "12px",
          background: `${color}15`,
          border: `1px solid ${color}35`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          marginBottom: "1.25rem",
          transition: "transform 0.3s ease",
          transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: "1.05rem",
          marginBottom: "0.6rem",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
        {desc}
      </p>
    </div>
  );
}

function PricingCard({
  tier,
  hovered,
  onHover,
  onLeave,
}: {
  tier: PricingTier;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "20px",
        padding: tier.highlight ? "2px" : "0",
        background: tier.highlight
          ? "linear-gradient(135deg, var(--accent-teal), var(--accent-blue))"
          : "transparent",
        transition: "transform 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        style={{
          background: "var(--bg-color)",
          borderRadius: tier.highlight ? "18px" : "20px",
          border: tier.highlight
            ? "none"
            : "1px solid var(--glass-border)",
          padding: "2rem",
          height: "100%",
          backdropFilter: "blur(12px)",
        }}
      >
        {tier.badge && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: "rgba(125,211,192,0.15)",
              border: "1px solid rgba(125,211,192,0.3)",
              color: "var(--accent-teal)",
              marginBottom: "1.25rem",
            }}
          >
            <Star size={10} fill="currentColor" /> {tier.badge}
          </div>
        )}

        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: "1.15rem",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          {tier.name}
        </h3>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
            minHeight: "2.5rem",
          }}
        >
          {tier.description}
        </p>

        {/* Price */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "2.75rem",
                letterSpacing: "-0.03em",
                color: tier.highlight ? "var(--accent-teal)" : "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              €{tier.basePrice}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              – €{tier.maxPrice}
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.375rem" }}>
            per virtual machine · to Oracle OLVM
          </div>
        </div>

        {/* VM Types */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "0.625rem",
            }}
          >
            Applies to
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {tier.vmTypes.map((vm, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                <ChevronRight
                  size={12}
                  style={{ color: tier.highlight ? "var(--accent-teal)" : "var(--accent-blue)", flexShrink: 0 }}
                />
                {vm}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <ul style={{ listStyle: "none", margin: "0 0 2rem", padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {tier.features.map((feat, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
                fontSize: "0.85rem",
                color: "var(--text-primary)",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: tier.highlight
                    ? "rgba(125,211,192,0.2)"
                    : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <Check size={9} color={tier.highlight ? "var(--accent-teal)" : "var(--text-secondary)"} />
              </span>
              {feat}
            </li>
          ))}
        </ul>

        <Link
          href="/tools/solution/cloudshift"
          style={{
            display: "block",
            textAlign: "center",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.9rem",
            textDecoration: "none",
            transition: "all 0.25s ease",
            background: tier.highlight
              ? "linear-gradient(135deg, var(--accent-teal), var(--accent-blue))"
              : "rgba(255,255,255,0.07)",
            color: tier.highlight ? "#0a0f1a" : "var(--text-primary)",
            border: tier.highlight ? "none" : "1px solid var(--glass-border)",
          }}
          onMouseEnter={(e) => {
            if (!tier.highlight) {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)";
            }
          }}
          onMouseLeave={(e) => {
            if (!tier.highlight) {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
            }
          }}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
