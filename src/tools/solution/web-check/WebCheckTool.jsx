import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WebsiteAnalyzer } from './components/WebsiteAnalyzer';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeWebsite } from './api';
import './web-check.css';

export const WebCheckTool = () => {
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (url) => {
    setScanUrl(url);
    setIsScanning(true);
    setError(null);
    setScanResults(null);

    try {
      const results = await analyzeWebsite(url);
      setScanResults(results);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="web-check-container">
      <div className="web-check-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/tools/solution" className="breadcrumb-link">Solution</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Web-Check</span>
          </div>
          
          <h1 className="web-check-title">
            Website <span className="gradient-text">Analyse</span>
          </h1>
          <p className="web-check-subtitle">
            Umfassende Sicherheits- und Performance-Analyse für jede Website. 
            Prüfe SSL, DNS, Headers, Cookies und mehr.
          </p>

          <WebsiteAnalyzer 
            onScan={handleScan}
            isScanning={isScanning}
          />

          {error && (
            <div className="error-message glass">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>
      </div>

      {scanResults && (
        <AnalysisResults 
          results={scanResults}
          isLoading={isScanning}
        />
      )}

      <div className="web-check-features">
        <div className="container">
          <h2 className="section-title">
            Was wird <span className="gradient-text">analysiert?</span>
          </h2>
          
          <div className="features-grid">
            <FeatureCard 
              icon="🔒"
              title="SSL/TLS Zertifikat"
              description="Überprüft Gültigkeit, Ablaufdatum und Verschlüsselungsstärke des SSL-Zertifikats."
            />
            <FeatureCard 
              icon="🌐"
              title="DNS Einträge"
              description="Analysiert DNS-Konfiguration einschließlich A, AAAA, MX, TXT und NS Records."
            />
            <FeatureCard 
              icon="🛡️"
              title="Security Headers"
              description="Prüft wichtige HTTP Security Headers wie HSTS, CSP, X-Frame-Options und mehr."
            />
            <FeatureCard 
              icon="🍪"
              title="Cookie Analyse"
              description="Untersucht Cookie-Konfigurationen auf Sicherheitsparameter wie HttpOnly und Secure."
            />
            <FeatureCard 
              icon="📍"
              title="Server Location"
              description="Ermittelt geografische Lage des Servers und Hosting-Informationen."
            />
            <FeatureCard 
              icon="🔍"
              title="Offene Ports"
              description="Scannt häufig genutzte Ports und identifiziert laufende Services."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card glass">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);
