"use client";

import Link from "next/link";
import { MessageSquare, Search, Brain, LineChart, Zap } from "lucide-react";

const features = [
  {
    icon: <MessageSquare size={24} />,
    title: "Multi-Agenten Debatte",
    description: "Spezialisierte Analysten debattieren aktiv über Stärken und Schwächen einer Aktie, um einseitige Halluzinationen zu vermeiden.",
  },
  {
    icon: <Search size={24} />,
    title: "Glass-Box Transparenz",
    description: "Verfolge via Live-Terminal in Echtzeit, wie jeder Agent denkt und zu seiner Entscheidung kommt – keine Black-Box.",
  },
  {
    icon: <Brain size={24} />,
    title: "Multi-LLM Engine",
    description: "Wähle flexibel zwischen verschiedenen Modellen wie Claude 3.5 Sonnet oder GPT-4o, um die Analyse-Qualität zu steuern.",
  },
  {
    icon: <LineChart size={24} />,
    title: "Deep Social Sentiment",
    description: "Integration von Firecrawl für Echtzeit-Analysen von Reddit und StockTwits, um das Marktsentiment zu erfassen.",
  },
];

const advantages = [
  {
    title: "Echtes Investment-Komitee",
    text: "Simulation eines kompletten Teams: Market-, News-, Social- und Fundamental-Analysten arbeiten Hand in Hand mit einem Portfolio- und Risk-Manager.",
  },
  {
    title: "Wall Street vs. KI",
    text: "Einzigartiger Kontrollmechanismus: Vergleiche den trägen Wall-Street-Konsens direkt mit der dynamischen Meinung deines KI-Teams.",
  },
  {
    title: "Due Diligence in Sekunden",
    text: "Spare Stunden an Recherchearbeit. Die KI liefert dir fundierte Argumente und gewichtet harte Daten gegen die Stimmung der Masse.",
  },
];

export default function TradingAgentsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <div className="flex items-center gap-4 mb-4">
          <img src="/logos/analyse-stock.svg" alt="TradingAgents Logo" style={{ width: "64px", height: "64px" }} />
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Analyse Stock Agent Team</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              TradingAgents: Das multidimensionale KI-Investment-Komitee für transparente Aktienanalysen.
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Link href="/tools/product" className="btn glass">
            ← Back to Products
          </Link>
          <button
            className="btn btn-primary opacity-50 cursor-not-allowed"
            style={{ fontSize: "0.95rem", padding: "0.6rem 1.5rem" }}
            disabled
          >
            In Vorbereitung
          </button>
        </div>
      </section>

      <section className="container pb-16">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Warum TradingAgents?
        </h2>
        <div className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "2.2", color: "var(--text-secondary)" }}>
            Der entscheidende Vorteil gegenüber klassischen Finanzportalen wie Yahoo Finance oder Bloomberg liegt in unserer 
            <strong> multidimensionalen, transparenten KI-Architektur</strong>. Während herkömmliche Tools oft nur statische 
            Daten anzeigen oder simple KI-Zusammenfassungen liefern, simuliert TradingAgents einen kompletten 
            <strong> interaktiven Hedgefonds-Simulator</strong>. Durch den Einsatz spezialisierter Agenten, die in einen 
            aktiven Diskurs treten, minimieren wir Halluzinationen und liefern eine objektive, tiefgreifende Due Diligence 
            in Sekundenschnelle.
          </p>
        </div>
      </section>

      <section className="container pb-16">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Kernvorteile
        </h2>
        <div className="grid grid-2 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass"
              style={{ padding: "2.5rem", borderRadius: "12px" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-teal)/10", color: "var(--accent-teal)" }}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white" style={{ fontSize: "1.25rem" }}>{feature.title}</h4>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Der strategische Vorsprung
        </h2>
        <div className="grid grid-3 gap-6">
          {advantages.map((adv, i) => (
            <div
              key={i}
              className="glass"
              style={{ padding: "2.5rem", borderRadius: "12px" }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-amber-400" />
                {adv.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {adv.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "3rem" }}>
        <div className="glass text-center" style={{ padding: "3rem", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "white" }}>Bereit für die nächste Generation des Investierens?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            TradingAgents befindet sich aktuell in der geschlossenen Beta. Melde dich an, um als einer der Ersten Zugriff auf unser KI-Investment-Komitee zu erhalten.
          </p>
          <Link href="/team" className="btn btn-primary">
            Kontakt aufnehmen
          </Link>
        </div>
      </section>
    </div>
  );
}