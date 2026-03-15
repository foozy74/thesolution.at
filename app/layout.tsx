import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "thesolution.at - IT Consulting für Datacenter, Virtualisierung & AI",
  description: "Spezialisiertes IT Consulting für Datacenter-Virtualisierung, AWS Multicloud, VMware und KI-Lösungen. Expertise in Kubernetes, Machine Learning und Infrastructure-as-Code.",
  keywords: "IT Consulting, VMware, AWS, Kubernetes, AI, Machine Learning, Datacenter, Virtualisierung, Terraform, OCI, Databricks",
  authors: [{ name: "Jürgen Müller, thesolution.at" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://thesolution.at/",
    title: "thesolution.at - IT Consulting für Datacenter, Virtualisierung & AI",
    description: "Spezialisiertes IT Consulting für Datacenter-Virtualisierung, AWS Multicloud, VMware und KI-Lösungen.",
    images: [{ url: "https://thesolution.at/logo.jpeg", width: 150, height: 150 }],
    locale: "de_AT",
  },
  twitter: {
    card: "summary_large_image",
    title: "thesolution.at - IT Consulting für Datacenter, Virtualisierung & AI",
    description: "Spezialisiertes IT Consulting für Datacenter-Virtualisierung, AWS Multicloud, VMware und KI-Lösungen.",
    images: ["https://thesolution.at/logo.jpeg"],
  },
  icons: {
    icon: "/favicon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={cn("font-sans", geist.variable)}>
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
