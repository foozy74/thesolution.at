import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unser Team - thesolution.at",
  description: "Lernen Sie das Team hinter thesolution.at kennen - Experten für Datacenter, Cloud und AI.",
};

const teamMembers = [
  {
    name: "Jürgen Müller",
    role: "Founder & Senior Cloud Architect",
    bio: "25+ Jahre Erfahrung in Datacenter-Virtualisierung, AWS Multicloud und AI-Lösungen.",
    skills: ["VMware", "AWS", "Kubernetes", "Terraform", "AI/ML"],
    avatar: "https://ui-avatars.com/api/?name=Jürgen+Müller&background=5b9bd5&color=fff&size=256",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Moritz Müller",
    role: "Business Developer",
    bio: "Junges Business Developer-Talent mit psychologischem Hintergrund",
    skills: ["Reporting & KPI‑Tracking", "Präsentations- und Pitch-Fähigkeiten"],
    avatar: "https://ui-avatars.com/api/?name=Moritz+Müller&background=7dd3c0&color=fff&size=256",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Felix Müller",
    role: "AI/ML Engineer | Web Designer",
    bio: "Vereint KI‑Engineering mit kreativem Web‑Design; inspiriert positiv Community und Kunden.",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Data Engineering", "Web Design"],
    avatar: "https://ui-avatars.com/api/?name=Felix+Müller&background=9b8fb8&color=fff&size=256",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Werde Teil des Teams",
    role: "Open Position",
    bio: "Wir suchen talentierte Entwickler, Architekten und AI-Enthusiasten.",
    skills: ["Deine Skills hier"],
    isHiring: true,
  },
];

export default function TeamPage() {
  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", textAlign: "center" }}>
        Unser <span className="gradient-text">Team</span>
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", textAlign: "center", maxWidth: "600px", margin: "0 auto 4rem" }}>
        Lernen Sie die Experten hinter thesolution.at kennen
      </p>

      <div className="grid grid-2 gap-8" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {teamMembers.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: typeof teamMembers[0] }) {
  if (member.isHiring) {
    return (
      <div
        className="glass p-8 rounded-xl text-center transition-all duration-300 cursor-pointer relative overflow-hidden"
        style={{
          border: "2px dashed var(--glass-border)",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "5rem",
            marginBottom: "1.5rem",
            opacity: 0.5,
          }}
        >
          ❓
        </div>
        <h3
          className="gradient-text"
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            color: "var(--accent-teal)",
            fontWeight: 600,
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          {member.role}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          {member.bio}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem" }}>
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/5 text-slate-500 rounded border border-white/5"
            >
              {skill}
            </span>
          ))}
        </div>
        <Link href="/#contact" className="btn btn-primary" style={{ padding: "0.7rem 2rem" }}>
          Jetzt Bewerben
        </Link>
      </div>
    );
  }

  return (
    <div
      className="glass p-8 rounded-xl transition-all duration-300 relative overflow-hidden group"
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
          opacity: 0,
        }}
      />
      
      <img
        src={member.avatar}
        alt={member.name}
        className="rounded-full mb-6 relative z-10"
        style={{
          width: "128px",
          height: "128px",
          objectFit: "cover",
          border: "3px solid var(--glass-border)",
          boxShadow: "0 0 30px rgba(125, 211, 192, 0.3)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 40px rgba(125, 211, 192, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(125, 211, 192, 0.3)";
        }}
      />

      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "0.25rem",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {member.name}
      </h3>

      <p
        className="gradient-text"
        style={{
          fontWeight: 600,
          fontSize: "0.95rem",
          marginBottom: "1rem",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {member.role}
      </p>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.95rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          lineHeight: 1.6,
          position: "relative",
          zIndex: 10,
        }}
      >
        {member.bio}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        {member.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/5 text-slate-500 rounded border border-white/5"
            style={{ transition: "all 0.3s ease" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(125, 211, 192, 0.2)";
              e.currentTarget.style.borderColor = "var(--accent-teal)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        <a
          href={member.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--text-secondary)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--glass-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent-teal)";
            e.currentTarget.style.background = "rgba(125, 211, 192, 0.2)";
            e.currentTarget.style.borderColor = "var(--accent-teal)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "var(--glass-border)";
          }}
          aria-label={`${member.name} GitHub`}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--text-secondary)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--glass-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent-blue)";
            e.currentTarget.style.background = "rgba(91, 155, 213, 0.2)";
            e.currentTarget.style.borderColor = "var(--accent-blue)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "var(--glass-border)";
          }}
          aria-label={`${member.name} LinkedIn`}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
