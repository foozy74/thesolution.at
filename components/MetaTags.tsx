import { Metadata } from "next";

const SITE_URL = "https://thesolution.at";

interface MetaTagsProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  type?: "website" | "article";
}

export function buildMetadata({
  title,
  description,
  canonical,
  ogImage = "/logo.jpeg",
  ogImageWidth = 1008,
  ogImageHeight = 1008,
  type = "website",
}: MetaTagsProps): Metadata {
  const ogUrl = canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical}`;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  return {
    title,
    description,
    alternates: {
      canonical: ogUrl,
    },
    icons: {
      icon: "/favicon.jpeg",
      shortcut: "/favicon.jpeg",
      apple: "/favicon.jpeg",
    },
    openGraph: {
      type,
      url: ogUrl,
      title,
      description,
      siteName: "thesolution.at",
      locale: "de_AT",
      images: [
        {
          url: fullOgImage,
          width: ogImageWidth,
          height: ogImageHeight,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullOgImage],
    },
  };
}
