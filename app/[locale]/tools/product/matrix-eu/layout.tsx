import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "Matrix EU - Sichere Team-Kommunikation",
  description: "Matrix EU: Sichere Chat- und Video-Kommunikation für Teams ohne Big-Tech-Abhängigkeit. DSGVO-konform und EU-gehostet.",
  canonical: "/tools/product/matrix-eu",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
