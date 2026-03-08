import { useState } from 'react';

export const WebsiteAnalyzer = ({ onScan, isScanning }) => {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isScanning) {
      // Füge https:// hinzu wenn nicht vorhanden
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      onScan(normalizedUrl);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={`analyzer-container glass ${isFocused ? 'focused' : ''}`}>
      <form onSubmit={handleSubmit} className="analyzer-form">
        <div className="input-wrapper">
          <span className="url-prefix">https://</span>
          <input
            type="text"
            value={url.replace(/^https?:\/\//, '')}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="example.com"
            className="url-input"
            disabled={isScanning}
          />
        </div>
        
        <button 
          type="submit" 
          className={`scan-button ${isScanning ? 'scanning' : ''}`}
          disabled={isScanning || !url.trim()}
        >
          {isScanning ? (
            <>
              <span className="spinner"></span>
              <span>Analysiere...</span>
            </>
          ) : (
            <>
              <span className="scan-icon">🔍</span>
              <span>Analysieren</span>
            </>
          )}
        </button>
      </form>

      {isScanning && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-steps">
            <span className="step active">SSL Check</span>
            <span className="step">DNS Lookup</span>
            <span className="step">Headers</span>
            <span className="step">Cookies</span>
            <span className="step">Ports</span>
          </div>
        </div>
      )}
    </div>
  );
};
