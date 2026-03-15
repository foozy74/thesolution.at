import { Metadata } from "next";

interface MetaTagsProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export function generateMetadata({ title, description, canonical }: MetaTagsProps): Metadata {
  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonical,
    },
  };
}
