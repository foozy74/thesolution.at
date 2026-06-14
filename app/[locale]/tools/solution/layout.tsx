import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "IT Solutions - thesolution.at | Cloud & IaC Tools",
  description: "Infrastructure-as-Code, Cloud-Architektur, Databricks & Coolify. Spezialisierte IT-Lösungen für Ihr Business in Österreich.",
  canonical: "/tools/solution",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
