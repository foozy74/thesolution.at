import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const siteUrl = "https://thesolution.at";
  const canonical = locale === "de" ? `${siteUrl}/about` : `${siteUrl}/${locale}/about`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonical,
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "2rem", textAlign: "center" }}>
        {locale === "de" ? (
          <>Über <span className="gradient-text">thesolution.at</span></>
        ) : (
          <>About <span className="gradient-text">thesolution.at</span></>
        )}
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem", lineHeight: 1.7 }}>
        {t("intro")}
      </p>

      <div className="grid grid-2 gap-8" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <article className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("mission.title")}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("mission.text")}</p>
        </article>

        <article className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("expertise.title")}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("expertise.text")}</p>
        </article>

        <article className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("values.title")}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("values.text")}</p>
        </article>

        <article className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("location.title")}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{t("location.text")}</p>
        </article>
      </div>
    </section>
  );
}
