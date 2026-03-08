import { useState } from 'react';

export const AnalysisResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!results) return null;

  const { summary, ssl, dns, headers, cookies, server, ports, url, timestamp } = results;

  // Erstelle checks Objekt für die Übersicht
  const checks = {
    ssl: { status: ssl?.status || 'info', message: ssl?.message || 'SSL-Informationen nicht verfügbar' },
    dns: { status: dns?.status || 'info', message: dns?.message || 'DNS-Informationen nicht verfügbar' },
    headers: { status: headers?.status || 'info', message: headers?.message || 'Header-Informationen nicht verfügbar' },
    cookies: { status: cookies?.status || 'info', message: cookies?.message || 'Cookie-Informationen nicht verfügbar' },
    server: { status: server?.status || 'info', message: server?.message || 'Server-Informationen nicht verfügbar' },
    ports: { status: ports?.status || 'info', message: ports?.message || 'Port-Informationen nicht verfügbar' },
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'var(--accent-teal)';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return 'var(--accent-blue)';
      default: return 'var(--text-secondary)';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: '📊' },
    { id: 'security', label: 'Sicherheit', icon: '🔒' },
    { id: 'dns', label: 'DNS', icon: '🌐' },
    { id: 'headers', label: 'Headers', icon: '📋' },
    { id: 'cookies', label: 'Cookies', icon: '🍪' },
  ];

  return (
    <div className="analysis-results">
      <div className="container">
        <div className="results-header">
          <div className="url-info">
            <h2 className="scanned-url">{url}</h2>
            <span className="scan-time">
              Gescannt am {new Date(timestamp).toLocaleString('de-DE')}
            </span>
          </div>
          
          <div className="score-cards">
            <ScoreCard 
              title="Sicherheit" 
              score={summary?.securityScore || 0} 
              color="var(--accent-teal)"
            />
            <ScoreCard 
              title="Performance" 
              score={summary?.performanceScore || 0} 
              color="var(--accent-blue)"
            />
            <ScoreCard 
              title="SEO" 
              score={summary?.seoScore || 0} 
              color="var(--accent-purple)"
            />
          </div>
        </div>

        <div className="results-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="results-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              {Object.entries(checks).map(([key, check]) => (
                <div key={key} className="check-card glass">
                  <div className="check-header">
                    <span 
                      className="status-icon"
                      style={{ color: getStatusColor(check.status) }}
                    >
                      {getStatusIcon(check.status)}
                    </span>
                    <span className="check-name">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  </div>
                  <p className="check-message">{check.message}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-section">
              <SecurityDetails ssl={ssl} headers={headers} />
            </div>
          )}

          {activeTab === 'dns' && (
            <div className="dns-section">
              <DnsDetails dns={dns} />
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="headers-section">
              <HeadersDetails headers={headers} />
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="cookies-section">
              <CookiesDetails cookies={cookies} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ title, score, color }) => (
  <div className="score-card glass">
    <div className="score-circle" style={{ '--score-color': color }}>
      <svg viewBox="0 0 36 36" className="score-svg">
        <path
          className="score-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <path
          className="score-progress"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
        />
      </svg>
      <span className="score-value" style={{ color }}>{score}</span>
    </div>
    <span className="score-title">{title}</span>
  </div>
);

const SecurityDetails = ({ ssl, headers }) => (
  <div className="security-grid">
    <div className="security-card glass">
      <h3>SSL/TLS Zertifikat</h3>
      <div className="security-status">
        <span className="status-badge" style={{ 
          background: ssl?.valid ? 'rgba(20, 184, 166, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: ssl?.valid ? 'var(--accent-teal)' : '#ef4444'
        }}>
          {ssl?.valid ? 'Sicher' : 'Unsicher'}
        </span>
      </div>
      <div className="ssl-details">
        <p><strong>Aussteller:</strong> {ssl?.issuer || 'N/A'}</p>
        <p><strong>Protokoll:</strong> {ssl?.protocol || 'N/A'}</p>
        <p><strong>Cipher:</strong> {ssl?.cipher || 'N/A'}</p>
        <p><strong>Gültig bis:</strong> {ssl?.validTo ? new Date(ssl.validTo).toLocaleDateString('de-DE') : 'N/A'}</p>
      </div>
    </div>
    
    <div className="security-card glass">
      <h3>Security Headers</h3>
      <div className="headers-list">
        {headers?.missing?.length > 0 && (
          <div className="missing-headers">
            <p className="warning-text">Fehlende Header:</p>
            {headers.missing.map(header => (
              <div key={header} className="header-item missing">
                <span className="header-name">{header}</span>
                <span className="header-status missing">✗</span>
              </div>
            ))}
          </div>
        )}
        {headers?.headers && Object.entries(headers.headers).map(([name]) => (
          <div key={name} className="header-item present">
            <span className="header-name">{name}</span>
            <span className="header-status present">✓</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DnsDetails = ({ dns }) => {
  if (!dns?.records || dns.records.length === 0) {
    return (
      <div className="dns-table-container glass">
        <p className="no-data">Keine DNS-Records gefunden</p>
      </div>
    );
  }

  return (
    <div className="dns-table-container glass">
      <table className="dns-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Value</th>
            <th>TTL</th>
          </tr>
        </thead>
        <tbody>
          {dns.records.map((record, idx) => (
            <tr key={idx}>
              <td><span className="dns-type">{record.type}</span></td>
              <td className="dns-value">{record.value}</td>
              <td>{record.ttl}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HeadersDetails = ({ headers }) => {
  if (!headers?.headers || Object.keys(headers.headers).length === 0) {
    return (
      <div className="headers-container glass">
        <p className="no-data">Keine Header-Informationen verfügbar</p>
      </div>
    );
  }

  return (
    <div className="headers-container glass">
      {Object.entries(headers.headers).map(([name, value]) => (
        <div key={name} className="header-row">
          <span className="header-name">{name}</span>
          <span className="header-value">{value}</span>
        </div>
      ))}
    </div>
  );
};

const CookiesDetails = ({ cookies }) => {
  if (!cookies?.cookies || cookies.cookies.length === 0) {
    return (
      <div className="cookies-container">
        <p className="no-data glass">Keine Cookies gefunden</p>
      </div>
    );
  }

  return (
    <div className="cookies-container">
      {cookies.cookies.map((cookie, idx) => (
        <div key={idx} className="cookie-card glass">
          <div className="cookie-name">{cookie.name}</div>
          <div className="cookie-flags">
            <span className={`flag ${cookie.secure ? 'secure' : 'insecure'}`}>
              Secure: {cookie.secure ? '✓' : '✗'}
            </span>
            <span className={`flag ${cookie.httpOnly ? 'secure' : 'insecure'}`}>
              HttpOnly: {cookie.httpOnly ? '✓' : '✗'}
            </span>
            <span className="flag">SameSite: {cookie.sameSite}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
