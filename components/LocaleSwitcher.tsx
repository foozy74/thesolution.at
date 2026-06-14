"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages } from "lucide-react";
import { useParams } from "next/navigation";

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const currentLocale = (params.locale as string) || "de";

  const nextLocale = currentLocale === "de" ? "en" : "de";
  const label = nextLocale === "de" ? "DE" : "EN";

  const onSelect = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={onSelect}
      disabled={isPending}
      aria-label={`Switch language to ${nextLocale.toUpperCase()}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.75rem",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid var(--glass-border)",
        borderRadius: "8px",
        color: "var(--text-primary)",
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: isPending ? "wait" : "pointer",
        transition: "all 0.2s ease",
        minHeight: "36px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(125, 211, 192, 0.15)";
        e.currentTarget.style.borderColor = "var(--accent-teal)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        e.currentTarget.style.borderColor = "var(--glass-border)";
      }}
    >
      <Languages size={16} strokeWidth={1.75} />
      <span>{label}</span>
    </button>
  );
}
