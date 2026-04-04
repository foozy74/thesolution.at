"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: "mirofish-eu",
    title: "MiroFish",
    description: "Deine digitale Pinnwand. Gemeinsam Ideen sammeln, brainstormen und visualisieren - ganz einfach wie Post-its an eine Pinnwand, aber digital und überall erreichbar.",
    logo: "/logos/mirofish.svg",
    path: "/tools/product/mirofish-eu",
    tags: ["Brainstorming", "Teams", "Visualisierung"],
    available: true,
  },
  {
    id: "appflowy-eu",
    title: "AppFlowy",
    description: "Dein persönlicher Arbeitsraum. Notizen, Aufgaben und Wissensdatenbank an einem Ort. So strukturiert wie ein Tower, aber so einfach wie ein Notizbuch.",
    logo: "/logos/appflowy.svg",
    path: "/tools/product/appflowy-eu",
    tags: ["Notizen", "Wiki", "Aufgaben"],
    available: true,
  },
  {
    id: "matrix-eu",
    title: "Matrix",
    description: "Sichere Kommunikation für Teams - Chat und Videocalls ohne Big-Tech-Abhängigkeit. Wird in Kürze verfügbar sein.",
    logo: "/logos/matrix.svg",
    path: "/tools/product/matrix-eu",
    tags: ["Chat", "Video", "Kommunikation"],
    available: false,
  },
  {
    id: "analyse-stock-agent-team",
    title: "Analyse Stock Agent Team",
    description: "Dein KI-Investment-Komitee. Spezialisierte Agenten analysieren, debattieren und bewerten Aktien in Echtzeit – transparent und fundiert.",
    logo: "/logos/analyse-stock.svg",
    path: "/tools/product/analyse-stock-agent-team",
    tags: ["AI", "Finance", "Analysis"],
    available: true,
  },
];

export default function ProductLandingPage() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
        Our <span className="gradient-text">Products</span>
      </h1>

      <div className="grid grid-2 gap-8">
        {products.map((product) => {
          const isHovered = hoveredProduct === product.id;
          const isAvailable = product.available;

          return (
            <Link
              key={product.id}
              href={isAvailable ? product.path : "#"}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={(e) => {
                if (!isAvailable) {
                  e.preventDefault();
                }
              }}
              className={`flex flex-col h-full transition-all duration-300 border-none relative overflow-hidden ${!isAvailable ? "opacity-50 grayscale" : ""}`}
              style={{
                padding: "2.5rem",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--card-radius)",
                boxShadow: isHovered && isAvailable ? "0 0 30px rgba(125, 211, 192, 0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
                transform: isHovered && isAvailable ? "translateY(-4px)" : "translateY(0)",
                background: isHovered && isAvailable ? "rgba(255, 255, 255, 0.08)" : "var(--glass-bg)",
                cursor: isAvailable ? "pointer" : "not-allowed",
              }}
            >
              <div className="absolute inset-0 transition-all duration-300" style={{ background: isHovered && isAvailable ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent" }} />

              <div className="relative z-10" style={{ marginBottom: "1.5rem", transform: isHovered && isAvailable ? "scale(1.15) rotate(5deg)" : "scale(1) rotate(0deg)", transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}>
                <img
                  src={product.logo}
                  alt={`${product.title} logo`}
                  style={{
                    width: "64px",
                    height: "64px",
                    filter: isHovered && isAvailable ? "drop-shadow(0 0 20px rgba(125, 211, 192, 0.6))" : "none",
                    transition: "filter 0.3s ease",
                  }}
                />
              </div>

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <h2
                  className="font-bold transition-all duration-300"
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: 0,
                    color: isHovered && isAvailable ? "var(--accent-teal)" : "var(--text-primary)",
                    textShadow: isHovered && isAvailable ? "0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.6), 0 0 40px rgba(125, 211, 192, 0.4)" : "0 0 10px rgba(125, 211, 192, 0.3)",
                  }}
                >
                  {product.title}
                </h2>
                {!isAvailable && (
                  <span
                    className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-400 rounded border border-amber-500/20"
                  >
                    In Vorbereitung
                  </span>
                )}
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 relative z-10">{product.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/5 text-slate-500 rounded border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {isAvailable && (
                <div className="mt-8 flex items-center relative z-10" style={{ color: isHovered ? "var(--accent-teal)" : "var(--accent-indigo)", fontWeight: 700, fontSize: "0.9rem", transition: "all 0.3s ease" }}>
                  <span>Mehr erfahren</span>
                  <span className="ml-2" style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s ease", display: "inline-block" }}>→</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}