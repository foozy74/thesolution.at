import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const siteUrl = "https://thesolution.at";
  const canonical = locale === "de" ? `${siteUrl}/datenschutz` : `${siteUrl}/${locale}/datenschutz`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
        <span className="gradient-text">{t("title")}</span>
      </h1>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("responsible")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
          {t("responsibleText")}
        </p>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            padding: "1.5rem",
            borderRadius: "12px",
            borderLeft: "3px solid var(--accent-teal)",
            marginTop: "1rem",
          }}
        >
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>{t("company")}</strong>
          </p>
          <p style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
            {t("owner")}: Jürgen Müller<br />
            Hertha-Firnberg-Straße 9/3/307<br />
            1100 Wien, Österreich
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            {t("email")}:{" "}
            <a href="mailto:contact@thesolution.at" style={{ color: "var(--accent-teal)", textDecoration: "none" }}>
              contact@thesolution.at
            </a>
            <br />
            Handelsgericht Wien, FN 309198d<br />
            GLN: 9110017283110
          </p>
        </div>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("hosting")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("hostingText")}</p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("cookies")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>{t("cookiesText")}</p>
        <div
          style={{
            background: "rgba(125, 211, 192, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid rgba(125, 211, 192, 0.2)",
          }}
        >
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong style={{ color: "var(--accent-teal)" }}>{locale === "de" ? "Wichtig:" : "Important:"}</strong> {t("cookiesImportant")}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{t("cookiesStorage")}</p>
        </div>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("logs")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>{t("logsText1")}</p>
        <ul style={{ listStyle: "none", padding: 0, color: "var(--text-secondary)", lineHeight: 2 }}>
          {t.raw("logsList").map((item: string) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginTop: "1rem" }}>{t("logsText2")}</p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("ssl")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("sslText")}</p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("fonts")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("fontsText")}</p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("embeds")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>{t("embedsText")}</p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("rights")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>{t("rightsText")}</p>
        <ul style={{ listStyle: "none", padding: 0, color: "var(--text-secondary)", lineHeight: 2 }}>
          {t.raw("rightsList").map((item: string) => (
            <li key={item}>• <strong>{item.split(":")[0]}:</strong>{item.split(":")[1]}</li>
          ))}
        </ul>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("contact")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("contactText")}</p>
        <a
          href="mailto:contact@thesolution.at"
          className="btn btn-primary"
          style={{ display: "inline-block", marginTop: "1rem", padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 700 }}
        >
          contact@thesolution.at
        </a>
      </div>

      <div className="glass" style={{ padding: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>{t("update")}</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("updateText")}</p>
      </div>

      <div style={{ marginTop: "3rem", display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/impressum" style={{ padding: "0.75rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-primary)", border: "1px solid var(--glass-border)" }}>
          {t("backToImpressum")}
        </Link>
        <Link href="/" className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem", fontWeight: 700 }}>
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
