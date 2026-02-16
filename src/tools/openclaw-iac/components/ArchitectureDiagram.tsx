export function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px] p-6">
        <svg viewBox="0 0 900 520" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {/* Background */}
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--bg-color)" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="publicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="privateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="dbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* VCN Boundary */}
          <rect x="130" y="30" width="740" height="470" rx="16" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="8,4" />
          <text x="150" y="55" fill="#64748b" fontSize="13" fontFamily="monospace" fontWeight="bold">VCN 10.0.0.0/16</text>

          {/* Internet */}
          <g transform="translate(30, 200)">
            <circle cx="30" cy="30" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" filter="url(#glow)" />
            <text x="30" y="26" textAnchor="middle" fill="#38bdf8" fontSize="20">🌐</text>
            <text x="30" y="42" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">Internet</text>
          </g>

          {/* WAF */}
          <g transform="translate(115, 115)">
            <rect x="0" y="0" width="60" height="40" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="30" y="18" textAnchor="middle" fill="#f43f5e" fontSize="14">🛡️</text>
            <text x="30" y="32" textAnchor="middle" fill="#f43f5e" fontSize="8" fontFamily="monospace">WAF</text>
          </g>

          {/* Arrow: Internet → WAF */}
          <line x1="88" y1="220" x2="145" y2="155" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#arrowBlue)" opacity="0.7" />

          {/* Public Subnet */}
          <rect x="150" y="90" width="200" height="160" rx="12" fill="url(#publicGrad)" stroke="#059669" strokeWidth="1.5" />
          <text x="165" y="112" fill="#059669" fontSize="11" fontFamily="monospace" fontWeight="bold">Public Subnet (DMZ)</text>
          <text x="165" y="126" fill="#059669" fontSize="9" fontFamily="monospace" opacity="0.7">10.0.1.0/24</text>

          {/* Load Balancer */}
          <g transform="translate(190, 155)">
            <rect x="0" y="0" width="120" height="55" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <text x="60" y="22" textAnchor="middle" fill="#10b981" fontSize="16">⚖️</text>
            <text x="60" y="37" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">Load Balancer</text>
            <text x="60" y="48" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" opacity="0.7">TLS 1.2+ / HSTS</text>
          </g>

          {/* Private App Subnet */}
          <rect x="390" y="70" width="240" height="230" rx="12" fill="url(#privateGrad)" stroke="#6366f1" strokeWidth="1.5" />
          <text x="405" y="92" fill="#818cf8" fontSize="11" fontFamily="monospace" fontWeight="bold">Private Subnet (App Tier)</text>
          <text x="405" y="106" fill="#818cf8" fontSize="9" fontFamily="monospace" opacity="0.7">10.0.10.0/24</text>

          {/* OKE Cluster */}
          <g transform="translate(410, 120)">
            <rect x="0" y="0" width="200" height="155" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
            <text x="100" y="22" textAnchor="middle" fill="#818cf8" fontSize="10" fontFamily="monospace" fontWeight="bold">OKE Kubernetes Cluster</text>

            {/* Pods */}
            <g transform="translate(15, 35)">
              <rect x="0" y="0" width="55" height="45" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <text x="28" y="18" textAnchor="middle" fill="#a5b4fc" fontSize="12">📦</text>
              <text x="28" y="32" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontFamily="monospace">Pod 1</text>
            </g>
            <g transform="translate(75, 35)">
              <rect x="0" y="0" width="55" height="45" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <text x="28" y="18" textAnchor="middle" fill="#a5b4fc" fontSize="12">📦</text>
              <text x="28" y="32" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontFamily="monospace">Pod 2</text>
            </g>
            <g transform="translate(135, 35)">
              <rect x="0" y="0" width="55" height="45" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <text x="28" y="18" textAnchor="middle" fill="#a5b4fc" fontSize="12">📦</text>
              <text x="28" y="32" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontFamily="monospace">Pod 3</text>
            </g>

            {/* Security features */}
            <g transform="translate(15, 95)">
              <rect x="0" y="0" width="170" height="45" rx="6" fill="#0c0a09" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
              <text x="85" y="17" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">🔒 Non-Root | ReadOnly FS</text>
              <text x="85" y="30" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">🛡️ NetworkPolicy | SecComp</text>
              <text x="85" y="40" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.6">Pod Security: restricted</text>
            </g>
          </g>

          {/* Arrow: LB → OKE */}
          <line x1="310" y1="185" x2="410" y2="185" stroke="#10b981" strokeWidth="2" opacity="0.7" />
          <polygon points="408,181 416,185 408,189" fill="#10b981" opacity="0.7" />
          <text x="360" y="178" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">:8080</text>

          {/* Private DB Subnet */}
          <rect x="390" y="330" width="240" height="150" rx="12" fill="url(#dbGrad)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="405" y="352" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">Private DB Subnet</text>
          <text x="405" y="366" fill="#fbbf24" fontSize="9" fontFamily="monospace" opacity="0.7">10.0.20.0/24</text>

          {/* Database */}
          <g transform="translate(420, 380)">
            <rect x="0" y="0" width="180" height="75" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="90" y="22" textAnchor="middle" fill="#fbbf24" fontSize="16">🐘</text>
            <text x="90" y="38" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">Autonomous Database</text>
            <text x="90" y="50" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.7">PostgreSQL | mTLS | Encrypted</text>
            <text x="90" y="62" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.7">Auto-Backup 30d Retention</text>
          </g>

          {/* Arrow: OKE → DB */}
          <line x1="510" y1="275" x2="510" y2="380" stroke="#818cf8" strokeWidth="2" opacity="0.7" />
          <polygon points="506,378 510,386 514,378" fill="#818cf8" opacity="0.7" />
          <text x="530" y="330" fill="#64748b" fontSize="7" fontFamily="monospace">:5432</text>

          {/* Vault & KMS */}
          <g transform="translate(680, 90)">
            <rect x="0" y="0" width="160" height="85" rx="10" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" />
            <text x="80" y="24" textAnchor="middle" fill="#f472b6" fontSize="16">🔐</text>
            <text x="80" y="40" textAnchor="middle" fill="#f472b6" fontSize="9" fontFamily="monospace" fontWeight="bold">OCI Vault & KMS</text>
            <text x="80" y="53" textAnchor="middle" fill="#f472b6" fontSize="7" fontFamily="monospace" opacity="0.7">HSM-backed Keys</text>
            <text x="80" y="65" textAnchor="middle" fill="#f472b6" fontSize="7" fontFamily="monospace" opacity="0.7">Auto-Rotation 90 days</text>
            <text x="80" y="75" textAnchor="middle" fill="#f472b6" fontSize="7" fontFamily="monospace" opacity="0.7">Secrets Management</text>
          </g>

          {/* Arrow: OKE → Vault */}
          <line x1="610" y1="155" x2="680" y2="135" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />

          {/* Monitoring */}
          <g transform="translate(680, 210)">
            <rect x="0" y="0" width="160" height="85" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="80" y="24" textAnchor="middle" fill="#22d3ee" fontSize="16">📊</text>
            <text x="80" y="40" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">Monitoring & Logging</text>
            <text x="80" y="53" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace" opacity="0.7">VCN Flow Logs</text>
            <text x="80" y="65" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace" opacity="0.7">Audit Logs (365d)</text>
            <text x="80" y="75" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace" opacity="0.7">Security Alarms</text>
          </g>

          {/* IAM */}
          <g transform="translate(680, 370)">
            <rect x="0" y="0" width="160" height="85" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
            <text x="80" y="24" textAnchor="middle" fill="#c084fc" fontSize="16">👤</text>
            <text x="80" y="40" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold">IAM & Policies</text>
            <text x="80" y="53" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="monospace" opacity="0.7">Least Privilege</text>
            <text x="80" y="65" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="monospace" opacity="0.7">Workload Identity</text>
            <text x="80" y="75" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="monospace" opacity="0.7">MFA enforced</text>
          </g>

          {/* NAT & Service Gateway */}
          <g transform="translate(165, 270)">
            <rect x="0" y="0" width="80" height="35" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <text x="40" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">NAT GW</text>
            <text x="40" y="27" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace" opacity="0.6">Outbound</text>
          </g>
          <g transform="translate(165, 320)">
            <rect x="0" y="0" width="80" height="35" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <text x="40" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Service GW</text>
            <text x="40" y="27" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace" opacity="0.6">OCI internal</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
