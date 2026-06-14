import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "Databricks IaC - Terraform & Asset Bundles",
  description: "Infrastructure-as-Code für Databricks Workspaces, Cluster, Jobs und ML-Modelle. Automatisierung mit Terraform und Databricks Asset Bundles auf AWS.",
  canonical: "/tools/solution/databricks-iac",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
