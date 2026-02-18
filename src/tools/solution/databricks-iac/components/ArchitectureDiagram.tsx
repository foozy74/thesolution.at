export function ArchitectureDiagram() {
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
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="workspaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="catalogGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Databricks Boundary */}
            <rect x="130" y="30" width="740" height="470" rx="16" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="8,4" />
            <text x="150" y="55" fill="#64748b" fontSize="13" fontFamily="monospace" fontWeight="bold">DATABRICS WORKSPACE</text>

            {/* Cloud Provider */}
            <g transform="translate(30, 200)">
              <circle cx="30" cy="30" r="28" fill="#1e293b" stroke="#f97316" strokeWidth="2" filter="url(#glow)" />
              <text x="30" y="26" textAnchor="middle" fill="#f97316" fontSize="20">☁️</text>
              <text x="30" y="42" textAnchor="middle" fill="#f97316" fontSize="8" fontFamily="monospace">Cloud</text>
            </g>

            {/* Arrow: Cloud → Workspace */}
            <line x1="88" y1="220" x2="145" y2="220" stroke="#f97316" strokeWidth="1.5" opacity="0.7" />
            <polygon points="143,216 151,220 143,224" fill="#f97316" opacity="0.7" />

            {/* Workspace Subnet */}
            <rect x="150" y="90" width="200" height="400" rx="12" fill="url(#workspaceGrad)" stroke="#6366f1" strokeWidth="1.5" />
            <text x="165" y="112" fill="#818cf8" fontSize="11" fontFamily="monospace" fontWeight="bold">Workspace</text>
            <text x="165" y="126" fill="#818cf8" fontSize="9" fontFamily="monospace" opacity="0.7">databricks.cloud</text>

            {/* Clusters */}
            <g transform="translate(170, 145)">
              <rect x="0" y="0" width="160" height="100" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
              <text x="80" y="22" textAnchor="middle" fill="#818cf8" fontSize="10" fontFamily="monospace" fontWeight="bold">Compute Clusters</text>
              
              <g transform="translate(15, 35)">
                <rect x="0" y="0" width="60" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                <text x="30" y="18" textAnchor="middle" fill="#a5b4fc" fontSize="12">⚙️</text>
                <text x="30" y="32" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontFamily="monospace">Shared</text>
              </g>
              <g transform="translate(85, 35)">
                <rect x="0" y="0" width="60" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                <text x="30" y="18" textAnchor="middle" fill="#a5b4fc" fontSize="12">🚀</text>
                <text x="30" y="32" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontFamily="monospace">Job</text>
              </g>
              
              <text x="80" y="85" textAnchor="middle" fill="#818cf8" fontSize="7" fontFamily="monospace">Auto-scale | Auto-terminate</text>
            </g>

            {/* Jobs */}
            <g transform="translate(170, 265)">
              <rect x="0" y="0" width="160" height="80" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
              <text x="80" y="22" textAnchor="middle" fill="#818cf8" fontSize="10" fontFamily="monospace" fontWeight="bold">Jobs & Pipelines</text>
              <text x="80" y="42" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="monospace">Scheduled ETL</text>
              <text x="80" y="55" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="monospace">Task Dependencies</text>
              <text x="80" y="68" textAnchor="middle" fill="#818cf8" fontSize="7" fontFamily="monospace" opacity="0.7">Cron: */15min</text>
            </g>

            {/* SQL Warehouse */}
            <g transform="translate(170, 365)">
              <rect x="0" y="0" width="160" height="70" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
              <text x="80" y="22" textAnchor="middle" fill="#818cf8" fontSize="10" fontFamily="monospace" fontWeight="bold">SQL Warehouse</text>
              <text x="80" y="40" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="monospace">Serverless Pro</text>
              <text x="80" y="53" textAnchor="middle" fill="#818cf8" fontSize="7" fontFamily="monospace" opacity="0.7">Photon Enabled</text>
            </g>

            {/* Unity Catalog */}
            <g transform="translate(390, 90)">
              <rect x="0" y="0" width="220" height="130" rx="12" fill="url(#catalogGrad)" stroke="#ec4899" strokeWidth="1.5" />
              <text x="110" y="22" textAnchor="middle" fill="#f472b6" fontSize="10" fontFamily="monospace" fontWeight="bold">Unity Catalog</text>

              {/* Metastores */}
              <g transform="translate(15, 35)">
                <rect x="0" y="0" width="60" height="35" rx="6" fill="#0f172a" stroke="#ec4899" strokeWidth="1" />
                <text x="30" y="18" textAnchor="middle" fill="#f472b6" fontSize="8" fontFamily="monospace">Metastore</text>
                <text x="30" y="30" textAnchor="middle" fill="#f472b6" fontSize="6" fontFamily="monospace">Catalog</text>
              </g>
              
              {/* Catalogs */}
              <g transform="translate(80, 35)">
                <rect x="0" y="0" width="60" height="35" rx="6" fill="#0f172a" stroke="#ec4899" strokeWidth="1" />
                <text x="30" y="18" textAnchor="middle" fill="#f472b6" fontSize="8" fontFamily="monospace">Bronze</text>
                <text x="30" y="30" textAnchor="middle" fill="#f472b6" fontSize="6" fontFamily="monospace">Raw</text>
              </g>
              
              <g transform="translate(145, 35)">
                <rect x="0" y="0" width="60" height="35" rx="6" fill="#0f172a" stroke="#c0c0c0" strokeWidth="1" />
                <text x="30" y="18" textAnchor="middle" fill="#e5e7eb" fontSize="8" fontFamily="monospace">Silver</text>
                <text x="30" y="30" textAnchor="middle" fill="#e5e7eb" fontSize="6" fontFamily="monospace">Clean</text>
              </g>

              <g transform="translate(80, 75)">
                <rect x="0" y="0" width="60" height="35" rx="6" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
                <text x="30" y="18" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">Gold</text>
                <text x="30" y="30" textAnchor="middle" fill="#fbbf24" fontSize="6" fontFamily="monospace">Agg</text>
              </g>
            </g>

            {/* Delta Lake */}
            <g transform="translate(390, 240)">
              <rect x="0" y="0" width="220" height="80" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="110" y="22" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">Delta Lake</text>
              <text x="110" y="42" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">ACID Transactions</text>
              <text x="110" y="55" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">Time Travel</text>
              <text x="110" y="68" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" opacity="0.7">Schema Enforcement</text>
            </g>

            {/* Notebooks & Repo */}
            <g transform="translate(390, 340)">
              <rect x="0" y="0" width="220" height="80" rx="12" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" />
              <text x="110" y="22" textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">Notebooks & Repo</text>
              <text x="110" y="42" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">Python | SQL | Scala</text>
              <text x="110" y="55" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">Git Integration</text>
              <text x="110" y="68" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace" opacity="0.7">IDE Support</text>
            </g>

            {/* CI/CD */}
            <g transform="translate(390, 440)">
              <rect x="0" y="0" width="220" height="50" rx="12" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="110" y="18" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold">CI/CD: GitHub Actions</text>
              <text x="110" y="35" textAnchor="middle" fill="#a78bfa" fontSize="7" fontFamily="monospace">databricks bundle validate | deploy</text>
            </g>

            {/* External Services */}
            <g transform="translate(650, 90)">
              <rect x="0" y="0" width="180" height="85" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="90" y="24" textAnchor="middle" fill="#fbbf24" fontSize="16">📊</text>
              <text x="90" y="40" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">Data Sources</text>
              <text x="90" y="53" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.7">InfluxDB</text>
              <text x="90" y="65" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.7">Object Storage</text>
              <text x="90" y="75" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace" opacity="0.7">REST APIs</text>
            </g>

            {/* Arrow: Sources → Workspace */}
            <line x1="650" y1="175" x2="350" y2="175" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
            <polygon points="352,171 344,179 360,179" fill="#f59e0b" opacity="0.7" />

            {/* Consumers */}
            <g transform="translate(650, 200)">
              <rect x="0" y="0" width="180" height="140" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="90" y="24" textAnchor="middle" fill="#22d3ee" fontSize="16">👥</text>
              <text x="90" y="40" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">Consumers</text>
              
              <g transform="translate(15, 55)">
                <rect x="0" y="0" width="70" height="30" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <text x="35" y="18" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">Grafana</text>
              </g>
              <g transform="translate(95, 55)">
                <rect x="0" y="0" width="70" height="30" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <text x="35" y="18" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">Power BI</text>
              </g>
              <g transform="translate(15, 90)">
                <rect x="0" y="0" width="70" height="30" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <text x="35" y="18" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">Databricks</text>
              </g>
              <g transform="translate(95, 90)">
                <rect x="0" y="0" width="70" height="30" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                <text x="35" y="18" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace">Alerts</text>
              </g>
            </g>

            {/* Arrow: Workspace → Consumers */}
            <line x1="350" y1="270" x2="650" y2="270" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7" />
            <polygon points="648,266 656,274 640,274" fill="#06b6d4" opacity="0.7" />

            {/* Security */}
            <g transform="translate(650, 370)">
              <rect x="0" y="0" width="180" height="85" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="90" y="24" textAnchor="middle" fill="#f43f5e" fontSize="16">🔐</text>
              <text x="90" y="40" textAnchor="middle" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">Security</text>
              <text x="90" y="53" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace" opacity="0.7">Secret Scopes</text>
              <text x="90" y="65" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace" opacity="0.7">Token Management</text>
              <text x="90" y="77" textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace" opacity="0.7">IP Access Lists</text>
            </g>

            {/* Terraform/IaC */}
            <g transform="translate(680, 475)">
              <rect x="0" y="0" width="120" height="35" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
              <text x="60" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">☁️ Terraform</text>
              <text x="60" y="27" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace" opacity="0.6">databricks provider</text>
            </g>

            {/* Legend */}
            <g transform="translate(50, 470)">
              <rect x="0" y="0" width="80" height="35" rx="6" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4,2" />
              <text x="40" y="15" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Flow: →</text>
              <text x="40" y="28" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace">IaC: terraform</text>
            </g>

          </svg>
        </div>
      </div>
    </div>
  );
}
