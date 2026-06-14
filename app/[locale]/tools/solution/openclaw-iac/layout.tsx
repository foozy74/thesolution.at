import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "OpenClaw IaC - Enterprise Terraform for OCI",
  description: "Production-ready Infrastructure-as-Code für Oracle Cloud: VCN, Compartments, Compute, Kubernetes und Security mit Terraform.",
  canonical: "/tools/solution/openclaw-iac",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
