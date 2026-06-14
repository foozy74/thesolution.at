import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  const siteUrl = "https://thesolution.at";
  const canonical = locale === "de" ? `${siteUrl}/impressum` : `${siteUrl}/${locale}/impressum`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical },
  };
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="container" style={{ paddingTop: "8rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
        {t("title")}
      </h1>
      <div className="grid grid-2">
        <article className="glass" style={{ padding: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>{t("company")}</h2>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
            <strong>The Solution Virtualization Consolidation Company e.U.</strong><br />
            {t("owner")}: Jürgen Müller<br />
            {t("court")}: Handelsgericht Wien<br />
            {t("register")}: 309198d<br />
            {t("gln")}: 9110017283110
          </p>
          <h2 style={{ marginBottom: "1.5rem" }}>{t("address")}</h2>
          <address style={{ color: "var(--text-secondary)", fontStyle: "normal" }}>
            Hertha-Firnberg-Straße 9/3/307<br />
            1100 Wien<br />
            Austria
          </address>
          <h2 style={{ marginBottom: "1.5rem", marginTop: "2rem" }}>{t("about")}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{t("aboutText")}</p>
          <h2 style={{ marginBottom: "1.5rem", marginTop: "2rem" }}>{t("responsible")}</h2>
          <p style={{ color: "var(--text-secondary)" }}>{t("responsibleText")}</p>
        </article>
        <div className="glass" style={{ overflow: "hidden", minHeight: "400px", border: "none" }}>
          <iframe
            title="Google Maps Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.16832367!2d16.3768853!3d48.1652755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476da9ef07d2062b%3A0xc3f6050519965d83!2sHertha-Firnberg-Stra%C3%9Fe%209%2C%201100%20Wien%2C%20Austria!5e0!3m2!1sen!2sat!4v1707999999999!5m2!1sen!2sat"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
