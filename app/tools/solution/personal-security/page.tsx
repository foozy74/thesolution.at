"use client";

import { useState, useEffect } from "react";

interface SecurityCategory {
  title: string;
  slug: string;
  description: string;
  icon: string;
  intro: string;
  checklist: SecurityItem[];
}

interface SecurityItem {
  point: string;
  priority: "Essential" | "Optional" | "Advanced" | "Recommended";
  details: string;
}

const securityCategories: SecurityCategory[] = [
  {
    title: "Authentifizierung",
    slug: "authentication",
    description: "Sicherung Ihrer Online-Account-Login-Daten",
    icon: "🔐",
    intro: "Die meisten gemeldeten Datenschutzverletzungen werden durch schwache, Standard- oder gestohlene Passwörter verursacht.",
    checklist: [
      { point: "Verwenden Sie ein starkes Passwort", priority: "Essential", details: "Mindestens 12 Zeichen, keine Wörterbuchwörter." },
      { point: "Passwörter nicht wiederverwenden", priority: "Essential", details: "Bei einem Leak könnten sonst alle Accounts kompromittiert werden." },
      { point: "Nutzen Sie einen Passwort-Manager", priority: "Essential", details: "Bitwarden oder andere empfohlene Manager." },
      { point: "2-Faktor-Authentifizierung aktivieren", priority: "Essential", details: "Schützt auch bei gestohlenen Passwörtern." },
      { point: "Backup-Codes sicher aufbewahren", priority: "Essential", details: "Offline speichern. Nicht im Passwort-Manager!" },
    ],
  },
  {
    title: "Web-Browsing",
    slug: "web-browsing",
    description: "Tracking, Zensur und Datensammlung vermeiden",
    icon: "🌐",
    intro: "Browser sind eine der Hauptschnittstellen zum Internet und können viele Daten preisgeben.",
    checklist: [
      { point: "Browser aktuell halten", priority: "Essential", details: "Automatische Updates aktivieren." },
      { point: "Privacy-Browser verwenden", priority: "Essential", details: "Firefox mit Privacy-Erweiterungen." },
      { point: "Werbeblocker installieren", priority: "Essential", details: "uBlock Origin blockiert Tracker." },
      { point: "HTTPS erzwingen", priority: "Essential", details: "HTTPS Everywhere verwenden." },
    ],
  },
  {
    title: "E-Mail",
    slug: "email",
    description: "Schutz des Zugangs zu Ihren Online-Konten",
    icon: "✉️",
    intro: "E-Mails sind standardmäßig unverschlüsselt. Sensible Daten sollten verschlüsselt werden.",
    checklist: [
      { point: "End-to-End-Verschlüsselung", priority: "Essential", details: "PGP/GPG für E-Mails." },
      { point: "Sicheren E-Mail-Anbieter wählen", priority: "Essential", details: "ProtonMail, Tutanota." },
      { point: "E-Mail-Aliase verwenden", priority: "Recommended", details: "SimpleLogin oder AnonAddy." },
    ],
  },
  {
    title: "Messaging",
    slug: "messaging",
    description: "Private und verschlüsselte Kommunikation",
    icon: "💬",
    intro: "Die meisten Messaging-Dienste sind nicht sicher.",
    checklist: [
      { point: "Signal verwenden", priority: "Essential", details: "End-to-End-verschlüsselt." },
      { point: "Verschlüsselung aktivieren", priority: "Essential", details: "Chat-Verschlüsselung prüfen." },
    ],
  },
  {
    title: "Soziale Medien",
    slug: "social-media",
    description: "Minimierung der Risiken bei sozialen Netzwerken",
    icon: "👥",
    intro: "Soziale Medien sammeln umfangreiche Daten.",
    checklist: [
      { point: "Privatsphäre-Einstellungen prüfen", priority: "Essential", details: "Posts nur für Freunde." },
      { point: "Minimale Informationen teilen", priority: "Essential", details: "Keine persönlichen Details." },
      { point: "Standortdaten deaktivieren", priority: "Essential", details: "Geotagging ausschalten." },
    ],
  },
  {
    title: "Netzwerke",
    slug: "networks",
    description: "Sicherung Ihres Netzwerkverkehrs",
    icon: "📡",
    intro: "Unsichere Netzwerke ermöglichen Angreifern den Datenverkehr mitzulesen.",
    checklist: [
      { point: "VPN verwenden", priority: "Essential", details: "Mullvad oder ProtonVPN." },
      { point: "Öffentliches WiFi meiden", priority: "Essential", details: "VPN obligatorisch." },
      { point: "Router-Sicherheit", priority: "Recommended", details: "WPA3, starkes Passwort." },
    ],
  },
  {
    title: "Mobile Geräte",
    slug: "mobile-devices",
    description: "Invasives Tracking reduzieren",
    icon: "📱",
    intro: "Mobile Geräte enthalten viele sensible Daten.",
    checklist: [
      { point: "Bildschirmsperre aktivieren", priority: "Essential", details: "Lange PIN oder Passwort." },
      { point: "Gerät aktuell halten", priority: "Essential", details: "Automatische Updates." },
      { point: "App-Berechtigungen prüfen", priority: "Essential", details: "Minimalistische Berechtigungen." },
    ],
  },
  {
    title: "Personal Computer",
    slug: "personal-computers",
    description: "Sicherung von Betriebssystem und Daten",
    icon: "💻",
    intro: "Computer enthalten sensible Daten.",
    checklist: [
      { point: "Festplattenverschlüsselung", priority: "Essential", details: "BitLocker, FileVault, LUKS." },
      { point: "Automatische Updates", priority: "Essential", details: "OS aktuell halten." },
      { point: "Firewall aktivieren", priority: "Essential", details: "Systemeigene Firewall." },
      { point: "Regelmäßige Backups", priority: "Essential", details: "3-2-1 Regel." },
    ],
  },
  {
    title: "Smart Home",
    slug: "smart-home",
    description: "IoT ohne Kompromisse bei der Privatsphäre",
    icon: "🏠",
    intro: "Smart-Home-Geräte sammeln oft Daten.",
    checklist: [
      { point: "Standardpasswörter ändern", priority: "Essential", details: "Sofort nach Inbetriebnahme." },
      { point: "Firmware aktuell halten", priority: "Essential", details: "Automatische Updates." },
      { point: "Gastnetzwerk für IoT", priority: "Recommended", details: "Trennung vom Hauptnetzwerk." },
    ],
  },
  {
    title: "Personal Finance",
    slug: "personal-finance",
    description: "Schutz Ihrer Finanzkonten",
    icon: "💰",
    intro: "Finanzdaten sind besonders sensibel.",
    checklist: [
      { point: "Zwei-Faktor-Authentifizierung", priority: "Essential", details: "Für alle Bankkonten." },
      { point: "Kontoauszüge prüfen", priority: "Essential", details: "Regelmäßig kontrollieren." },
    ],
  },
  {
    title: "Human Aspect",
    slug: "human-aspect",
    description: "Vermeidung von Social Engineering",
    icon: "🎭",
    intro: "Menschen sind oft das schwächste Glied.",
    checklist: [
      { point: "Phishing erkennen", priority: "Essential", details: "Absender prüfen." },
      { point: "Identität verifizieren", priority: "Essential", details: "Rückruf über bekannte Nummer." },
    ],
  },
  {
    title: "Physische Sicherheit",
    slug: "physical-security",
    description: "Verhinderung von IRL-Sicherheitsvorfällen",
    icon: "🔒",
    intro: "Digitale Sicherheit nützt wenig ohne physische Sicherheit.",
    checklist: [
      { point: "Geräte sichern", priority: "Essential", details: "Nie unbeaufsichtigt lassen." },
      { point: "Kabelschlösser", priority: "Recommended", details: "Für Laptops öffentlich." },
    ],
  },
];

type ItemStatus = "pending" | "yes" | "no";

export default function PersonalSecurityPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>({});
  const [activeFilter, setActiveFilter] = useState<"all" | "Essential" | "Optional" | "Advanced">("all");
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleItem = (slug: string, index: number) => {
    const key = `${slug}-${index}`;
    setItemStatuses(prev => {
      const current = prev[key] || "pending";
      const next: ItemStatus = current === "pending" ? "yes" : current === "yes" ? "no" : "pending";
      return { ...prev, [key]: next };
    });
  };

  const getProgress = (category: SecurityCategory) => {
    const categoryItems = category.checklist.map((_, i) => `${category.slug}-${i}`);
    const completed = categoryItems.filter(key => itemStatuses[key] === "yes").length;
    return Math.round((completed / category.checklist.length) * 100);
  };

  const getTotalProgress = () => {
    const total = securityCategories.reduce((acc, cat) => acc + cat.checklist.length, 0);
    const completed = Object.values(itemStatuses).filter(status => status === "yes").length;
    return Math.round((completed / total) * 100);
  };

  const getCategoryCounts = () => {
    const counts = { Essential: 0, Optional: 0, Advanced: 0, Recommended: 0 };
    securityCategories.forEach(cat => {
      cat.checklist.forEach(item => {
        counts[item.priority]++;
      });
    });
    return counts;
  };

  const _counts = getCategoryCounts();
  const totalItems = securityCategories.reduce((acc, cat) => acc + cat.checklist.length, 0);

  // Radar Chart
  const categoryProgress = securityCategories.map(cat => getProgress(cat));
  const maxCategories = securityCategories.length;
  const centerX = 150;
  const centerY = 150;
  const radius = 80;

  const getPointOnCircle = (angle: number, r: number) => ({
    x: centerX + r * Math.cos(angle - Math.PI / 2),
    y: centerY + r * Math.sin(angle - Math.PI / 2),
  });

  const createPolygon = (values: number[], r: number) => {
    const points = values.map((value, i) => {
      const angle = (2 * Math.PI * i) / values.length;
      const point = getPointOnCircle(angle, (value / 100) * r);
      return `${point.x},${point.y}`;
    });
    return points.join(" ");
  };

  const getStatusIcon = (status: ItemStatus) => {
    if (status === "yes") return "✓";
    if (status === "no") return "✗";
    return "○";
  };

  const getStatusColor = (status: ItemStatus) => {
    if (status === "yes") return "var(--accent-teal)";
    if (status === "no") return "#ef4444";
    return "var(--text-secondary)";
  };

  const getStatusBg = (status: ItemStatus) => {
    if (status === "yes") return "rgba(125, 211, 192, 0.2)";
    if (status === "no") return "rgba(239, 68, 68, 0.2)";
    return "transparent";
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      {/* Hero */}
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-4xl" style={{ filter: "drop-shadow(0 0 8px rgba(125, 211, 192, 0.3))" }}>🛡️</span>
          </div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem", fontWeight: 800 }}>
            Personal Security <span className="gradient-text">Checklist</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            Ihr Leitfaden für digitale Sicherheit und Privatsphäre
          </p>
        </div>

        {/* Radar Chart */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="glass p-8 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Sicherheits-Profil</h3>
            
            {mounted && (
              <div className="relative" style={{ maxWidth: "280px", margin: "0 auto" }}>
                <svg viewBox="0 0 300 300" className="w-full h-auto">
                  {[20, 40, 60, 80, 100].map((percent) => (
                    <polygon key={percent} points={createPolygon(Array(12).fill(percent), radius)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  ))}
                  {securityCategories.map((_, i) => {
                    const angle = (2 * Math.PI * i) / maxCategories;
                    const point = getPointOnCircle(angle, radius);
                    return <line key={i} x1={centerX} y1={centerY} x2={point.x} y2={point.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
                  })}
                  <polygon points={createPolygon(categoryProgress, radius)} fill="rgba(125, 211, 192, 0.25)" stroke="var(--accent-teal)" strokeWidth="2.5" style={{ transition: "all 0.5s ease" }} />
                  {securityCategories.map((cat, i) => {
                    const angle = (2 * Math.PI * i) / maxCategories;
                    const labelPoint = getPointOnCircle(angle, radius + 28);
                    return (
                      <g key={cat.slug}>
                        <circle cx={labelPoint.x} cy={labelPoint.y} r="14" fill="var(--glass-bg)" stroke="var(--accent-teal)" strokeWidth="1.5" />
                        <text key={cat.slug} x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="central" fill="var(--accent-teal)" fontSize="12">{cat.icon}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-20 mb-16">
          <div className="grid grid-4 gap-6">
            {/* Gesamtfortschritt */}
            <div
              onMouseEnter={() => setHoveredStat("total")}
              onMouseLeave={() => setHoveredStat(null)}
              className="glass p-6 rounded-xl text-center transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                boxShadow: hoveredStat === "total" ? "0 0 30px rgba(125, 211, 192, 0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
                background: hoveredStat === "total" ? "rgba(255, 255, 255, 0.08)" : "var(--glass-bg)",
                transform: hoveredStat === "total" ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 transition-all duration-300 pointer-events-none" style={{ background: hoveredStat === "total" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent" }} />
              <div className="relative z-10">
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--accent-teal)", marginBottom: "0.5rem", transition: "all 0.3s ease", textShadow: hoveredStat === "total" ? "0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.6)" : "none" }}>{getTotalProgress()}%</div>
                <div className="text-xs text-slate-400 font-semibold">Gesamtfortschritt</div>
                <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginTop: "0.75rem", overflow: "hidden" }}>
                  <div style={{ width: `${getTotalProgress()}%`, height: "100%", background: "var(--accent-teal)", transition: "width 0.3s ease" }} />
                </div>
              </div>
            </div>
            
            {/* Ja */}
            <div
              onMouseEnter={() => setHoveredStat("yes")}
              onMouseLeave={() => setHoveredStat(null)}
              className="glass p-6 rounded-xl text-center transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                boxShadow: hoveredStat === "yes" ? "0 0 30px rgba(125, 211, 192, 0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
                background: hoveredStat === "yes" ? "rgba(255, 255, 255, 0.08)" : "var(--glass-bg)",
                transform: hoveredStat === "yes" ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 transition-all duration-300 pointer-events-none" style={{ background: hoveredStat === "yes" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent" }} />
              <div className="relative z-10">
                <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "var(--accent-teal)", marginBottom: "0.5rem", transition: "all 0.3s ease", textShadow: hoveredStat === "yes" ? "0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.6)" : "none" }}>{Object.values(itemStatuses).filter(s => s === "yes").length}</div>
                <div className="text-xs text-slate-400 font-semibold">✓ Ja</div>
              </div>
            </div>
            
            {/* Nein */}
            <div
              onMouseEnter={() => setHoveredStat("no")}
              onMouseLeave={() => setHoveredStat(null)}
              className="glass p-6 rounded-xl text-center transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                boxShadow: hoveredStat === "no" ? "0 0 30px rgba(239, 68, 68, 0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
                background: hoveredStat === "no" ? "rgba(255, 255, 255, 0.08)" : "var(--glass-bg)",
                transform: hoveredStat === "no" ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 transition-all duration-300 pointer-events-none" style={{ background: hoveredStat === "no" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent" }} />
              <div className="relative z-10">
                <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem", transition: "all 0.3s ease", textShadow: hoveredStat === "no" ? "0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6)" : "none" }}>{Object.values(itemStatuses).filter(s => s === "no").length}</div>
                <div className="text-xs text-slate-400 font-semibold">✗ Nein</div>
              </div>
            </div>
            
            {/* Offen */}
            <div
              onMouseEnter={() => setHoveredStat("pending")}
              onMouseLeave={() => setHoveredStat(null)}
              className="glass p-6 rounded-xl text-center transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                boxShadow: hoveredStat === "pending" ? "0 0 30px rgba(136, 153, 166, 0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
                background: hoveredStat === "pending" ? "rgba(255, 255, 255, 0.08)" : "var(--glass-bg)",
                transform: hoveredStat === "pending" ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 transition-all duration-300 pointer-events-none" style={{ background: hoveredStat === "pending" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent" }} />
              <div className="relative z-10">
                <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem", transition: "all 0.3s ease", textShadow: hoveredStat === "pending" ? "0 0 20px rgba(136, 153, 166, 0.8), 0 0 30px rgba(136, 153, 166, 0.6)" : "none" }}>{totalItems - Object.keys(itemStatuses).length}</div>
                <div className="text-xs text-slate-400 font-semibold">○ Offen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="container pb-12">
        <div className="grid grid-2 lg:grid-3 gap-8">
          {securityCategories.map((category) => {
            const progress = getProgress(category);
            const isHovered = hoveredCard === category.slug;
            
            return (
              <div
                key={category.slug}
                onMouseEnter={() => setHoveredCard(category.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  setExpandedCategory(expandedCategory === category.slug ? null : category.slug);
                  document.getElementById(`checklist-${category.slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="glass p-6 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                style={{
                  boxShadow: isHovered ? "0 0 30px rgba(125, 211, 192, 0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
                  background: isHovered ? "rgba(255, 255, 255, 0.08)" : "var(--glass-bg)",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 transition-all duration-300 pointer-events-none" style={{ background: isHovered ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent" }} />
                <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 pointer-events-none" style={{ opacity: isHovered ? 1 : 0 }}>
                  <span style={{ fontSize: "1.25rem", color: "var(--accent-teal)" }}>→</span>
                </div>
                <div className="flex items-start justify-between mb-4 relative">
                  <span style={{ fontSize: "3rem" }}>{category.icon}</span>
                  <div className="px-3 py-1 rounded-full text-xs font-bold relative z-10" style={{ background: progress === 100 ? "rgba(125, 211, 192, 0.2)" : "rgba(255,255,255,0.05)", color: progress === 100 ? "var(--accent-teal)" : "var(--text-secondary)" }}>
                    {progress === 100 ? "✓ Abgeschlossen" : `${progress}% erledigt`}
                  </div>
                </div>
                <h3
                  className="text-xl font-bold mb-2 relative z-10 transition-all duration-300"
                  style={{
                    color: isHovered ? "var(--accent-teal)" : "var(--text-primary)",
                    textShadow: isHovered
                      ? "0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.6), 0 0 40px rgba(125, 211, 192, 0.4)"
                      : "0 0 10px rgba(125, 211, 192, 0.3)",
                  }}
                >
                  {category.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 relative z-10">{category.description}</p>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-xs text-slate-500">{category.checklist.length} Items</span>
                  <div style={{ width: "60%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "var(--accent-teal)", borderRadius: "2px", transition: "width 0.3s ease" }} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0 }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Expanded Checklists */}
      <section className="container pb-20">
        <div className="space-y-8">
          {securityCategories.map((category) => (
            <div key={category.slug} id={`checklist-${category.slug}`} className="glass overflow-hidden rounded-xl">
              <button onClick={() => setExpandedCategory(expandedCategory === category.slug ? null : category.slug)} className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: "2.5rem" }}>{category.icon}</span>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    <p className="text-sm text-slate-400">{category.checklist.length} Punkte • {getProgress(category)}% abgeschlossen</p>
                  </div>
                </div>
                <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)", transition: "transform 0.3s", transform: expandedCategory === category.slug ? "rotate(180deg)" : "rotate(0deg)" }}>▼</div>
              </button>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}>
                <div style={{ width: `${getProgress(category)}%`, height: "100%", background: "var(--accent-teal)", transition: "width 0.3s ease" }} />
              </div>
              {expandedCategory === category.slug && (
                <div className="p-6 border-t border-white/10">
                  <p className="text-slate-300 mb-6" style={{ lineHeight: 1.7 }}>{category.intro}</p>
                  <div className="px-6 py-3 border-b border-white/10 flex gap-2 overflow-x-auto mb-6">
                    {(["all", "Essential", "Optional", "Advanced"] as const).map((filter) => (
                      <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeFilter === filter ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>
                        {filter === "all" ? `Alle (${category.checklist.length})` : `${filter} (${category.checklist.filter(i => i.priority === filter).length})`}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {category.checklist.filter(item => activeFilter === "all" || item.priority === activeFilter).map((item, index) => {
                      const key = `${category.slug}-${index}`;
                      const status = itemStatuses[key] || "pending";
                      
                      return (
                        <div
                          key={index}
                          onClick={() => toggleItem(category.slug, index)}
                          className="p-4 rounded-lg border transition-all cursor-pointer relative overflow-hidden"
                          style={{
                            background: getStatusBg(status),
                            borderColor: status === "yes" ? "rgba(125, 211, 192, 0.3)" : status === "no" ? "rgba(239, 68, 68, 0.3)" : "rgba(255,255,255,0.1)",
                            boxShadow: status !== "pending" ? `0 0 15px ${status === "yes" ? "rgba(125, 211, 192, 0.2)" : "rgba(239, 68, 68, 0.2)"}` : "none",
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                border: `2px solid ${getStatusColor(status)}`,
                                background: status !== "pending" ? getStatusColor(status) : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: "2px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <span style={{ color: status === "pending" ? "var(--text-secondary)" : "white", fontSize: "14px", fontWeight: 700 }}>
                                {getStatusIcon(status)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-white">{item.point}</h4>
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold"
                                  style={{
                                    background: `${getPriorityColor(item.priority)}20`,
                                    color: getPriorityColor(item.priority),
                                    border: `1px solid ${getPriorityColor(item.priority)}40`,
                                  }}
                                >
                                  {item.priority}
                                </span>
                              </div>
                              <p className="text-sm" style={{ color: status === "no" ? "rgba(239, 68, 68, 0.7)" : "var(--text-secondary)", lineHeight: 1.6 }}>{item.details}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Essential": return "var(--accent-teal)";
    case "Recommended": return "var(--accent-blue)";
    case "Optional": return "var(--accent-purple)";
    case "Advanced": return "#f59e0b";
    default: return "var(--text-secondary)";
  }
}
