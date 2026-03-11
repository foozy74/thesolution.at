"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasAcknowledged = localStorage.getItem("cookie-acknowledged");
    if (!hasAcknowledged) {
      setShowBanner(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem("cookie-acknowledged", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "600px",
        zIndex: 9999,
        animation: "slideInUp 0.3s ease-out",
      }}
      className="glass"
    >
      <div
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🍪</span>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Cookie-Information</h3>
        </div>

        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: "500px",
          }}
        >
          Diese Website verwendet <strong>keine Cookies</strong> und kein Tracking. Wir speichern keine personenbezogenen Daten auf Ihrem Gerät.
          Diese Website ist rein statisch und benötigt keine Cookie-Einwilligung.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="/datenschutz"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              background: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-primary)",
              border: "1px solid var(--glass-border)",
              transition: "all 0.3s ease",
            }}
            className="hover:bg-white/10"
          >
            Mehr erfahren
          </a>
          <button onClick={handleAcknowledge} className="btn btn-primary" style={{ padding: "0.6rem 2rem", fontSize: "0.9rem", fontWeight: 700 }}>
            Verstanden
          </button>
        </div>

        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            marginTop: "0.5rem",
            opacity: 0.7,
          }}
        >
          Diese Information wird lokal in Ihrem Browser gespeichert.
        </p>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
