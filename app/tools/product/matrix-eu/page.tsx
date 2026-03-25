"use client";

import Link from "next/link";
import { Clock, Lock, MessageCircle } from "lucide-react";

const features = [
  {
    icon: <MessageCircle size={24} />,
    title: "Chat & Video",
    description: "Instant Messaging, Sprach- und Videoanrufe - alles in einem.",
  },
  {
    icon: <Lock size={24} />,
    title: "Ende-zu-Ende verschlüsselt",
    description: "Maximale Sicherheit für deine Kommunikation - standardmäßig.",
  },
  {
    icon: <Clock size={24} />,
    title: "In Echtzeit",
    description: "Sofortige Nachrichtenlieferung - keine Verzögerung, kein Warten.",
  },
];

export default function MatrixEUPaige() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <div className="flex items-center gap-4 mb-4">
          <img src="/logos/matrix.svg" alt="Matrix Logo" style={{ width: "64px", height: "64px", opacity: 0.5, filter: "grayscale(100%)" }} />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 style={{ fontSize: "2.5rem" }}>Matrix</h1>
              <span className="px-3 py-1 text-xs uppercase tracking-wider font-bold bg-amber-500/20 text-amber-400 rounded border border-amber-500/20">
                In Vorbereitung
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Dezentrale Kommunikation - Chat und Video ohne Big-Tech-Abhängigkeit.
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Link href="/tools/product" className="btn glass">
            ← Back to Products
          </Link>
        </div>
      </section>

      <section className="container pb-16">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Was ist Matrix?
        </h2>
        <div className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "2.2", color: "var(--text-secondary)" }}>
            Matrix ist ein offenes Netzwerk für sichere, dezentrale Kommunikation. 
            Stell dir vor, du könntest mit jedem chatten - egal ob er bei Signal, Telegram 
            oder einem anderen Dienst ist. Matrix macht das möglich. Keine Abhängigkeit 
            von einem einzelnen Unternehmen, keine Datensammlung, keine Werbung. 
            Deine Kommunikation bleibt deine Kommunikation.
          </p>
          <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <p className="text-amber-400 text-sm">
              <strong>Bald verfügbar:</strong> Wir arbeiten derzeit an der Einrichtung 
              eines EU-basierten Matrix-Servers für thesolution.at. Bleib dran!
            </p>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--accent-teal)" }}>
          Features (Coming Soon)
        </h2>
        <div className="grid grid-2 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass opacity-50"
              style={{ padding: "2.5rem", borderRadius: "12px" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-purple)/10", color: "var(--accent-purple)" }}>
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
    </div>
  );
}