import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "Personal Security Checklist - 100+ Sicherheits-Tipps",
  description: "Umfassende Checkliste für digitale Sicherheit und Privatsphäre. Über 100 Punkte in 12 Kategorien für mehr Online-Schutz.",
  canonical: "/tools/solution/personal-security",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
