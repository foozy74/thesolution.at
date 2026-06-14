import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "Products - thesolution.at | AI & SaaS Lösungen",
  description: "SaaS-Produkte für Teams: Prediction Engine, Matrix Messenger und Analyse Stock Agent. KI-gestützte Anwendungen aus Europa mit höchstem Datenschutz.",
  canonical: "/tools/product",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
