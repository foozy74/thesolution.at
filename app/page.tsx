"use client";

import { useState } from "react";

export default function HomePage() {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  return (
    <>
      <Hero />
      <ServicesSection />
      <AISection showDiagnostic={showDiagnostic} setShowDiagnostic={setShowDiagnostic} />
    </>
  );
}

function Hero() {
  return (
    <header
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "4rem" }}
      >
        <div style={{ flex: "1" }}>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 5rem)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Elevating Infrastructure,<br />
            <span className="gradient-text">Mastering AI.</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "600px", marginBottom: "2.5rem" }}>
            Expert IT Consulting for Datacenter Virtualization, AWS Multicloud, and Cutting-edge AI Solutions.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="#contact" className="btn btn-primary">
              Start a Project
            </a>
            <a href="#services" className="btn glass" style={{ padding: "0.8rem 2rem" }}>
              Our Expertise
            </a>
          </div>
        </div>
        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src="/logo.jpeg"
            alt="thesolution.at logo"
            style={{
              maxWidth: "400px",
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 0 40px rgba(125, 211, 192, 0.4)) brightness(1.1)",
              opacity: 0.95,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "-5%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(125, 211, 192, 0.12) 0%, rgba(91, 155, 213, 0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(91, 155, 213, 0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))",
          zIndex: 2,
        }}
      />
    </header>
  );
}

function ServicesSection() {
  const [showStats, setShowStats] = useState(false);
  const [counters, setCounters] = useState({ years: 0, customers: 0, projects: 0 });

  const startCounters = () => {
    setShowStats(true);
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const progress = i / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCounters({
          years: Math.floor(25 * easeOut),
          customers: Math.floor(500 * easeOut),
          projects: Math.floor(100 * easeOut),
        });
      }, i * interval);
    }
  };

  return (
    <section id="services" className="container" aria-labelledby="services-heading">
      <button
        onClick={() => (showStats ? setShowStats(false) : startCounters())}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
        aria-expanded={showStats}
        aria-controls="stats-section"
      >
        <h2 id="services-heading" style={{ fontSize: "2.5rem", marginBottom: "0.5rem", textAlign: "center" }}>
          Infrastructure <span className="gradient-text">Expertise</span>
        </h2>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-teal))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {showStats ? "− Less Details" : "+ More Details"}
        </span>
      </button>

      {showStats && (
        <div
          id="stats-section"
          className="animate-in fade-in slide-in-from-top-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
            padding: "2rem",
            background: "rgba(59, 130, 246, 0.05)",
            borderRadius: "16px",
            border: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "var(--accent-blue)", lineHeight: 1 }}>
              {counters.years}+
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "0.75rem" }}>
              Years of Experience
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "var(--accent-teal)", lineHeight: 1 }}>
              {counters.customers}+
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "0.75rem" }}>
              Satisfied Customers
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "var(--accent-purple)", lineHeight: 1 }}>
              {counters.projects}%
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "0.75rem" }}>
              Successful Projects
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-4" role="list">
        <ServiceCard
          icon="🌀"
          title="Datacenter & Virtualization"
          items={[
            "Server Virtualization (VMware, Hyper-V, KVM)",
            "Kubernetes, KubeVirt & Cilium",
            "Storage & Network Virtualization",
            "Infrastructure Optimization",
            "Backup & Disaster Recovery",
          ]}
          ariaLabel="Datacenter & Virtualization Service"
        />
        <ServiceCard
          icon="☁️"
          title="AWS Multicloud Training"
          items={["Strategic Workshops", "Hands-on Multicloud Mastery", "Integration & Migration", "Cloud Architecture Design"]}
          ariaLabel="AWS Multicloud Training Service"
        />
        <ServiceCard
          icon="🔷"
          title="VMware Specialist"
          items={["Broadcom Era Consultation", "License Optimization", "VCF Implementation", "Legacy Migration"]}
          ariaLabel="VMware Specialist Service"
        />
        <ServiceCard
          icon="📊"
          title="Databricks"
          items={[
            "Lakehouse Architecture",
            "Apache Spark & Delta Lake",
            "MLflow & Model Training",
            "Data Engineering Pipelines",
            "ETL & Streaming Analytics",
          ]}
          ariaLabel="Databricks Service"
        />
      </div>
    </section>
  );
}

function ServiceCard({
  icon,
  title,
  items,
  ariaLabel,
}: {
  icon: string;
  title: string;
  items: string[];
  ariaLabel: string;
}) {
  return (
    <article className="glass" style={{ padding: "2.5rem", height: "100%" }} role="listitem" aria-label={ariaLabel}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }} aria-hidden="true">
        {icon}
      </div>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{title}</h3>
      <ul style={{ listStyle: "none", color: "var(--text-secondary)" }}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function AISection({
  showDiagnostic,
  setShowDiagnostic,
}: {
  showDiagnostic: boolean;
  setShowDiagnostic: (value: boolean) => void;
}) {
  return (
    <section id="ai" style={{ background: "rgba(59, 130, 246, 0.02)" }} aria-labelledby="ai-heading">
      <div className="container">
        <h2 id="ai-heading" style={{ fontSize: "2.5rem", marginBottom: "3rem", textAlign: "center" }}>
          Machine Learning & <span className="gradient-text">AI</span>
        </h2>
        <div className="grid grid-2">
          <article style={{ padding: "2rem" }} aria-label="AI Services Overview">
            <h3 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Future-Proof Your Business</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              Leverage the power of modern AI to automate workflows, analyze complex data, and build intelligent products.
            </p>
            <div className="grid grid-2" style={{ gap: "1rem" }} role="list">
              {[
                "💬 NLP Solutions",
                "✨ Generative AI",
                "🌀 Neural Networks",
                "📈 Data Science",
                "⚡ AI-Automation",
                "👁️ Computer Vision",
              ].map((item, i) => (
                <div key={i} className="glass" style={{ padding: "1rem", fontWeight: 600 }} role="listitem">
                  {item}
                </div>
              ))}
            </div>
          </article>
          <div
            className="glass"
            style={{ border: "none", overflow: "hidden", position: "relative", minHeight: "500px" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(45deg, var(--accent-blue), var(--accent-purple))",
                opacity: 0.1,
                zIndex: 0,
              }}
            />
            <div
              style={{ position: "relative", zIndex: 1, padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem", opacity: 0.3 }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }} />
              </div>
              <div style={{ padding: "0 1rem 1.5rem 1rem" }}>
                <div
                  style={{
                    marginBottom: "1rem",
                    opacity: 0.5,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--accent-teal)",
                  }}
                >
                  AI_IMPLEMENTATION.js (Source)
                </div>
                <code style={{ color: "var(--accent-teal)", fontSize: "1.1rem", lineHeight: 1.6 }}>
                  {/* Step 1: Optimize business with AI */}<br />
                  const solution = await AI.optimize(business);<br />
                  {/* Step 2: Profit */}<br />
                  console.log(&quot;Efficiency Increased&quot;);
                </code>
              </div>
              <TerminalWindow showDiagnostic={showDiagnostic} setShowDiagnostic={setShowDiagnostic} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TerminalWindow({
  showDiagnostic,
  setShowDiagnostic,
}: {
  showDiagnostic: boolean;
  setShowDiagnostic: (value: boolean) => void;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(0,0,0,0.4)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.05)",
        padding: "1.5rem",
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: "0.9rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "#666" }}>
        <span style={{ color: "var(--accent-teal)" }}>❯</span>
        <span>npm start</span>
      </div>

      <div>
        <div style={{ color: "#fff", marginBottom: "0.5rem" }}>
          <span style={{ opacity: 0.5 }}>[info]</span> Initializing AI Reality Check...
        </div>

          <div style={{ color: "#fff", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--accent-teal)" }}>Processing:</span> &quot;Wait for AI.optimize(business)...&quot;
          </div>

          <div style={{ color: "var(--accent-teal)", marginBottom: "1rem" }}>
            <span style={{ color: "var(--accent-teal)" }}>LOG:</span> &quot;Efficiency Increased&quot;
          </div>

          <div style={{ color: "var(--accent-teal)", marginBottom: "1rem" }}>
            <span style={{ color: "var(--accent-teal)" }}>LOG:</span> &quot;Efficiency Increased&quot;
          </div>

        {!showDiagnostic ? (
          <div
            onClick={() => setShowDiagnostic(true)}
            style={{
              cursor: "pointer",
              color: "var(--accent-blue)",
              marginTop: "2rem",
              padding: "0.5rem 0",
              borderTop: "1px dashed rgba(255,255,255,0.1)",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span className="animate-pulse">❯</span> Run System Analysis_
          </div>
        ) : (
          <div
            className="animate-in fade-in slide-in-from-top-4"
            style={{
              marginTop: "2rem",
              background: "rgba(59, 130, 246, 0.1)",
              borderLeft: "3px solid var(--accent-blue)",
              padding: "1rem",
            }}
          >
            <div style={{ color: "var(--accent-blue)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              System Diagnosis: Satire Detected
            </div>
            <p style={{ color: "var(--text-primary)", fontSize: "0.85rem", marginBottom: "1rem", lineHeight: 1.4 }}>
              This code parodies the naive notion that complex business problems can be magically solved by simply calling an{" "}
              <code>optimize()</code> function.
            </p>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "0.25rem" }}>• Success is assumed here, not measured.</li>
              <li style={{ marginBottom: "0.25rem" }}>• No true understanding of the problem required.</li>
              <li style={{ marginBottom: "0.25rem" }}>• Real AI solutions require precision & depth.</li>
            </ul>
            <div
              onClick={() => setShowDiagnostic(false)}
              style={{ marginTop: "1rem", fontSize: "0.7rem", opacity: 0.5, cursor: "pointer", textAlign: "right" }}
            >
              [Close Diagnosis]
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
