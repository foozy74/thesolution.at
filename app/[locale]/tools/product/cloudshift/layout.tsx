import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "CloudShift — VMware to OLVM, Hyper-V & Proxmox Migration | thesolution.at",
  description:
    "CloudShift automates live VM migration from VMware to Oracle OLVM, Hyper-V, Proxmox VE, and OpenStack. Supporting reverse migrations with transparent per-VM pricing from €8. Zero downtime cutover.",
  canonical: "/tools/product/cloudshift",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
