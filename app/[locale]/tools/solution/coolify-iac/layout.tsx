import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "Coolify on OCI - Self-hosted PaaS",
  description: "Self-hosted Coolify PaaS auf Oracle Cloud mit Terraform und LVM. Vollständig automatisiertes Deployment auf Ubuntu mit Docker und cloud-init.",
  canonical: "/tools/solution/coolify-iac",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
