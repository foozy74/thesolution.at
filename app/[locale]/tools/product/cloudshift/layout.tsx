import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "CloudShift — VMware to OLVM / Hyper-V Migration | thesolution.at",
  description:
    "CloudShift automates live VM migration from VMware vSphere to Oracle OLVM, Microsoft Hyper-V, and OpenStack. Transparent per-VM pricing from €8. Zero downtime cutover.",
  canonical: "/tools/product/cloudshift",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
