import { buildMetadata } from "@/components/MetaTags";

export const metadata = buildMetadata({
  title: "Augentrainer - Dynamisches Seh- & Fokus-Training | thesolution.at",
  description: "Interaktives Multiple-Object-Tracking und Augentraining im Web. Stärke deine visuelle Wahrnehmung, Konzentration und Augenmuskulatur mit flüssigen Bewegungsübungen.",
  canonical: "/tools/solution/augentrainer",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
