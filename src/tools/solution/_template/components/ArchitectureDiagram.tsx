interface DiagramConfig {
  title: string;
  subtitle?: string;
  boundaryLabel?: string;
  zones: DiagramZone[];
  connections: Connection[];
}

interface DiagramZone {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  items: DiagramItem[];
}

interface DiagramItem {
  icon: string;
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  items?: string[];
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

export function ArchitectureDiagram(_props?: { config?: DiagramConfig }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-6 sm:hidden text-slate-500 text-[10px] uppercase tracking-wider animate-pulse">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <span>Scroll left/right to view diagram</span>
      </div>
      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[700px] p-6">
          <svg viewBox="0 0 900 520" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--bg-color)" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Default Template Structure - Customize for each solution */}
            {/* 
              Usage:
              1. Create custom ArchitectureDiagram.tsx in your solution/components/
              2. Copy this base and modify zones, items, and connections
              3. Or use the config prop for dynamic rendering
            */}

            {/* Boundary */}
            <rect x="130" y="30" width="740" height="470" rx="16" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="8,4" />
            <text x="150" y="55" fill="#64748b" fontSize="13" fontFamily="monospace" fontWeight="bold">SOLUTION BOUNDARY</text>

            {/* Placeholder Zones - Replace with actual solution diagram */}
            
            {/* Zone 1: Primary Component */}
            <rect x="170" y="80" width="200" height="180" rx="12" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" strokeWidth="1.5" />
            <text x="185" y="102" fill="#818cf8" fontSize="11" fontFamily="monospace" fontWeight="bold">ZONE 1</text>
            
            <g transform="translate(200, 130)">
              <rect x="0" y="0" width="140" height="100" rx="8" fill="#0f172a" stroke="#6366f1" strokeWidth="1" />
              <text x="70" y="30" textAnchor="middle" fill="#818cf8" fontSize="10" fontFamily="monospace" fontWeight="bold">Primary Component</text>
              <text x="70" y="50" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="monospace">Add your main</text>
              <text x="70" y="65" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="monospace">architecture here</text>
            </g>

            {/* Zone 2: Secondary Component */}
            <rect x="400" y="80" width="200" height="180" rx="12" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="1.5" />
            <text x="415" y="102" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">ZONE 2</text>

            <g transform="translate(430, 130)">
              <rect x="0" y="0" width="140" height="100" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x="70" y="30" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">Secondary</text>
              <text x="70" y="50" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace">Processing or</text>
              <text x="70" y="65" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace">storage layer</text>
            </g>

            {/* Zone 3: Integration */}
            <rect x="630" y="80" width="180" height="180" rx="12" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="645" y="102" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">ZONE 3</text>

            <g transform="translate(655, 130)">
              <rect x="0" y="0" width="130" height="100" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
              <text x="65" y="30" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">Integration</text>
              <text x="65" y="50" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">External APIs</text>
              <text x="65" y="65" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">or services</text>
            </g>

            {/* Bottom Section */}
            <rect x="170" y="290" width="640" height="180" rx="12" fill="rgba(71, 85, 105, 0.1)" stroke="#475569" strokeWidth="1" strokeDasharray="4,2" />
            <text x="185" y="312" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="bold">SUPPORTING SERVICES</text>

            {/* Security */}
            <g transform="translate(200, 335)">
              <rect x="0" y="0" width="140" height="70" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
              <text x="70" y="25" textAnchor="middle" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">🔐 Security</text>
              <text x="70" y="45" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace">Secrets, IAM, TLS</text>
            </g>

            {/* Monitoring */}
            <g transform="translate(360, 335)">
              <rect x="0" y="0" width="140" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
              <text x="70" y="25" textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">📊 Monitoring</text>
              <text x="70" y="45" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">Logs, Alerts, Metrics</text>
            </g>

            {/* CI/CD */}
            <g transform="translate(520, 335)">
              <rect x="0" y="0" width="140" height="70" rx="8" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1" />
              <text x="70" y="25" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold">🔄 CI/CD</text>
              <text x="70" y="45" textAnchor="middle" fill="#a78bfa" fontSize="7" fontFamily="monospace">GitHub Actions</text>
            </g>

            {/* Terraform */}
            <g transform="translate(680, 335)">
              <rect x="0" y="0" width="110" height="70" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
              <text x="55" y="25" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">☁️ IaC</text>
              <text x="55" y="45" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">Terraform</text>
            </g>

          </svg>
        </div>
      </div>
    </div>
  );
}
