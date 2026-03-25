"use client";

import Link from "next/link";
import { CheckCircle2, Users, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: <Users size={24} />,
    title: "Gemeinsam brainstormen",
    description: "Echtzeit-Zusammenarbeit mit deinem Team - egal wo ihr seid.",
  },
  {
    icon: <Globe size={24} />,
    title: "Überall verfügbar",
    description: "Zugriff von jedem Gerät - Browser, Tablet oder Smartphone.",
  },
  {
    icon: <Zap size={24} />,
    title: "Schnell loslegen",
    description: "Vorlagen für jedes Projekt - von Retros bis zu User Stories.",
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: "Strukturiert arbeiten",
    description: "Organisiere deine Ideen mit Boards, Frames und sticky Notes.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0€",
    period: "/ Monat",
    description: "Für Einzelpersonen",
    features: ["3 Boards", "Unbegrenzte Nutzer", "Vorlagen"],
  },
  {
    name: "Team",
    price: "8€",
    period: "/ Nutzer / Monat",
    description: "Für kleine Teams",
    features: ["Unbegrenzte Boards", "Admin-Tools", "Support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Kontakt",
    period: "",
    description: "Für große Organisationen",
    features: ["Single Sign-On", "Audit Logs", "Dedizierter Support"],
  },
];

export default function MiroFishEUPaige() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <div className="flex items-center gap-4 mb-4">
          <img src="/logos/mirofish.svg" alt="MiroFish Logo" style={{ width: "64px", height: "64px" }} />
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>MiroFish</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Deine digitale Pinnwand - EU-gehostet und datenschutzkonform.
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Link href="/tools/product" className="btn glass">
            ← Back to Products
          </Link>
          <a
            href="https://mirofish.thesolution.at"
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
          Was ist MiroFish?
        </h2>
        <div className="glass p-10" style={{ borderRadius: "12px" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "2.2", color: "var(--text-secondary)" }}>
            MiroFish ist deine digitale Pinnwand für Ideen, Brainstorming und Teamarbeit. 
            Stell dir eine riesige, unendliche Wand vor, an die du Post-its, Bilder, 
            Diagramme und mehr heften kannst - nur eben digital. Egal ob du ein Team 
            durch ein Projekt führst, einen Workshop facilitierst oder einfach deine 
            Gedanken sortieren möchtest: MiroFish macht es einfach und macht Spaß.
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-teal)/10", color: "var(--accent-teal)" }}>
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
              style={{ borderRadius: "12px", border: plan.popular ? "2px solid var(--accent-teal)" : "1px solid var(--glass-border)" }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-bold bg-[var(--accent-teal)] text-white rounded-full">
                    Beliebt
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-teal)" }}>{plan.price}</span>
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