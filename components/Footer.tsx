"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" style={{ padding: "6rem 0", textAlign: "center" }}>
      <div className="container">
        <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
          Ready to find your <span className="gradient-text">Solution?</span>
        </h2>
        <p style={{ color: "var(--text-primary)", fontSize: "1.5rem", marginBottom: "1rem" }}>
          Interested in working together? Let&apos;s connect!
        </p>
        <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
          Get in touch for specialized IT consulting and AI implementation.
        </p>

        <address style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", marginBottom: "4rem", fontStyle: "normal" }}>
          <a href="mailto:contact@thesolution.at" className="btn btn-primary" style={{ fontSize: "1.25rem", width: "fit-content" }}>
            Email: contact@thesolution.at
          </a>
          <nav aria-label="Social media links">
            <ul style={{ display: "flex", gap: "2rem", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <a
                  href="https://github.com/foozy74"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/jürgen-müller-b4792a57"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </nav>
        </address>

        <div style={{ marginTop: "4rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <span>© 2026 thesolution.at - Specialized IT Consulting & AI Solutions</span>
          <nav aria-label="Legal links">
            <ul style={{ display: "flex", gap: "2rem", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href="/impressum" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                  Datenschutz
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
