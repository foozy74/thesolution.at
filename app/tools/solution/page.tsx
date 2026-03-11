"use client";

import { useState } from "react";
import Link from "next/link";

const solutions = [
  {
    id: "openclaw-iac",
    title: "OpenClaw IaC",
    description: "Enterprise-grade Infrastructure-as-Code for Oracle Cloud. Secure, scalable, and production-ready.",
    icon: "🔷",
    path: "/tools/solution/openclaw-iac",
    tags: ["IaC", "Terraform", "OCI", "Security"],
  },
  {
    id: "coolify-iac",
    title: "Coolify on OCI",
    description: "Self-hosted PaaS on Oracle Cloud Infrastructure. Automated deployment with Terraform and LVM.",
    icon: "🚀",
    path: "/tools/solution/coolify-iac",
    tags: ["IaC", "Coolify", "OCI", "Docker"],
  },
  {
    id: "databricks-iac",
    title: "Databricks IaC",
    description: "Infrastructure-as-Code for Databricks. Automate workspaces, clusters, and jobs with Terraform and Asset Bundles.",
    icon: "⚡",
    path: "/tools/solution/databricks-iac",
    tags: ["IaC", "Databricks", "Terraform", "CI/CD"],
  },
  {
    id: "personal-security",
    title: "Personal Security Checklist",
    description: "Umfassende Checkliste für digitale Sicherheit und Privatsphäre. Über 100 Punkte in 12 Kategorien.",
    icon: "🛡️",
    path: "/tools/solution/personal-security",
    tags: ["Security", "Privacy", "Checklist", "Guide"],
  },
];

export default function SolutionLandingPage() {
  const [hoveredSolution, setHoveredSolution] = useState<string | null>(null);

  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
        Our <span className="gradient-text">Solutions</span>
      </h2>

      <div className="grid grid-2 gap-8">
        {solutions.map((sol) => {
          const isHovered = hoveredSolution === sol.id;
          
          return (
            <Link
              key={sol.id}
              href={sol.path}
              onMouseEnter={() => setHoveredSolution(sol.id)}
              onMouseLeave={() => setHoveredSolution(null)}
              className="p-8 flex flex-col h-full transition-all duration-300 border-none relative overflow-hidden"
              style={{
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--card-radius)",
                boxShadow: isHovered ? "0 0 30px rgba(125, 211, 192, 0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                background: isHovered ? "rgba(255, 255, 255, 0.08)" : "var(--glass-bg)",
              }}
            >
              <div className="absolute inset-0 transition-all duration-300" style={{ background: isHovered ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent" }} />
              
              <div className="text-4xl mb-6 transform transition-transform duration-300 relative z-10" style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}>{sol.icon}</div>

              <h2
                className="text-2xl font-bold mb-4 transition-all duration-300 relative z-10"
                style={{
                  color: isHovered ? "var(--accent-teal)" : "var(--text-primary)",
                  textShadow: isHovered ? "0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.6), 0 0 40px rgba(125, 211, 192, 0.4)" : "0 0 10px rgba(125, 211, 192, 0.3)",
                }}
              >
                {sol.title}
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 relative z-10">{sol.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {sol.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/5 text-slate-500 rounded border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center relative z-10" style={{ color: isHovered ? "var(--accent-teal)" : "var(--accent-indigo)", fontWeight: 700, fontSize: "0.9rem", transition: "all 0.3s ease" }}>
                <span>Explore Solution</span>
                <span className="ml-2" style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s ease", display: "inline-block" }}>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
