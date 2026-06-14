import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "Web Check - Website Sicherheits-Scanner",
  description: "Tool zur Überprüfung der Sicherheit und Konfiguration von Websites. DNS, SSL, Headers und mehr.",
  canonical: "/tools/solution/web-check",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
