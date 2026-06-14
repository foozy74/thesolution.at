import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { cn } from "@/lib/utils";
import "../globals.css";
import "../fonts.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const siteUrl = "https://thesolution.at";
  const canonical = locale === routing.defaultLocale ? `${siteUrl}/` : `${siteUrl}/${locale}/`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: {
        de: `${siteUrl}/`,
        en: `${siteUrl}/en/`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: tCommon("siteName"),
      locale: locale === "de" ? "de_AT" : "en_US",
      images: [{ url: `${siteUrl}/logo.jpeg`, width: 1008, height: 1008, alt: t("metaTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [`${siteUrl}/logo.jpeg`],
    },
    icons: {
      icon: "/favicon.jpeg",
      shortcut: "/favicon.jpeg",
      apple: "/favicon.jpeg",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main id="main-content">{children}</main>
          <Footer locale={locale} />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
