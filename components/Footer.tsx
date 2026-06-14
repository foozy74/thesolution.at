"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer id="contact" style={{ padding: "6rem 0", textAlign: "center" }}>
      <div className="container">
        <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
          {t("heading").split("Solution?")[0]}
          <span className="gradient-text">Solution?</span>
        </h2>
        <p style={{ color: "var(--text-primary)", fontSize: "1.5rem", marginBottom: "1rem" }}>
          {t("subtitle")}
        </p>
        <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
          {t("description")}
        </p>

        <address style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", marginBottom: "4rem", fontStyle: "normal" }}>
          <a href="mailto:contact@thesolution.at" className="btn btn-primary" style={{ fontSize: "1.25rem", width: "fit-content" }}>
            {t("emailButton")}
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
                  <span>{t("github")}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/j%C3%BCrgen-m%C3%BCller-b4792a57"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <span>{t("linkedin")}</span>
                </a>
              </li>
            </ul>
          </nav>
        </address>

        <div style={{ marginTop: "4rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <span>{t("copyright")}</span>
          <nav aria-label="Legal links">
            <ul style={{ display: "flex", gap: "2rem", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href="/impressum" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                  {t("impressum")}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                  {t("datenschutz")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
