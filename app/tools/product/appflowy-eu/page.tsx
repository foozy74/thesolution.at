"use client";

import Link from "next/link";
import { CheckCircle2, FileText, Shield, Layout } from "lucide-react";

const features = [
  {
    icon: <FileText size={24} />,
    title: "Persönliche Notizen",
    description: "Schreibe Notizen, Dokumente und ganze Wikis - strukturiert und durchsuchbar.",
  },
  {
    icon: <Layout size={24} />,
    title: "Flexible Views",
    description: "Switch zwischen Board, List und Calendar View - wie du es gerade brauchst.",
  },
  {
    icon: <Shield size={24} />,
    title: "Deine Daten, dein Server",
    description: "Self-hosted Option: Du kontrollierst, wo deine Daten liegen.",
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: "Open Source",
    description: "100% Open Source, keine vendor lock-in, community-driven development.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0€",
    period: "/ Monat",
    description: "Für Einzelpersonen",
    features: ["Unbegrenzte Pages", "10 Workspaces", "Community Support"],
  },
  {
    name: "Pro",
    price: "10€",
    period: "/ Nutzer / Monat",
    description: "Für Power User",
    features: ["Unbegrenzte Workspaces", "Priority Support", "Custom Themes"],
    popular: true,
  },
  {
    name: "Self-Hosted",
    price: "0€",
    period: "",
    description: "Auf deinem eigenen Server",
    features: ["Unbegrenzte Nutzer", "Volle Kontrolle", "Community Support"],
  },
];

export default function AppFlowyEUPaige() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <div className="flex items-center gap-4 mb-4">
          <img src="/logos/appflowy.svg" alt="AppFlowy Logo" style={{ width: "64px", height: "64px" }} />
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>AppFlowy</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Dein persönlicher Arbeitsraum - open source, EU-gehostet.
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Link href="/tools/product" className="btn glass">
            ← Back to Products
          </Link>
          <a
            href="https://appflowy.thesolution.at"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ fontSize: "0.95rem", padding: "0.6rem 1.5rem" }}
          >
            Jetzt starten →
          </a>
        </div>
      </section>

      <section className="container pb-16">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Was ist AppFlowy?
        </h2>
        <div className="glass p-10" style={{ borderRadius: "12px" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "2.2", color: "var(--text-secondary)" }}>
            AppFlowy ist dein persönlicher digitaler Arbeitsraum. Stell dir vor, du hättest 
            ein Notizbuch, einen Task-Manager und eine Wiki in einem - nur viel mächtiger. 
            Du kannst hier deine Gedanken sammeln, Projekte planen, Aufgaben tracken und 
            dein ganzes Wissensarchiv aufbauen. Anders als bei Notion oder anderen Cloud-Diensten 
            gehört dir alles - deine Daten bleiben auf deinem Server (oder unserem EU-Server).
          </p>
        </div>
      </section>

      <section className="container pb-16">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Features
        </h2>
        <div className="grid grid-2 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass p-8"
              style={{ borderRadius: "12px" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-blue)/10", color: "var(--accent-blue)" }}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white">{feature.title}</h4>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "3rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Preise
        </h2>
        <div className="grid grid-3 gap-6">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className="glass p-8 relative"
              style={{ borderRadius: "12px", border: plan.popular ? "2px solid var(--accent-blue)" : "1px solid var(--glass-border)" }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-bold bg-[var(--accent-blue)] text-white rounded-full">
                    Beliebt
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-blue)" }}>{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    {feature}
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