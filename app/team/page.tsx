import type { Metadata } from "next";
import TeamContent from "./TeamContent";

export const metadata: Metadata = {
  title: "Unser Team - thesolution.at",
  description: "Lernen Sie das Team hinter thesolution.at kennen - Experten für Datacenter, Cloud und AI.",
};

export default function TeamPage() {
  return <TeamContent />;
}
