import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';
import { OpenClawTool } from './tools/solution/openclaw-iac/OpenClawTool';
import { SolutionLanding } from './tools/solution/SolutionLanding';

// Scroll to top on navigation component
// Scroll to hash or top on navigation component
const ScrollToNavigation = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Close menu when route changes (optional, handled by onClick below too)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const NavLink = ({ to, children, className = "", mobile = false }) => {
    const isHash = to.startsWith('/#');
    const hashId = to.replace('/#', '');
    const isActive = pathname === '/' && window.location.hash === `#${hashId}`;

    const handleClick = (e) => {
      if (mobile) setIsOpen(false);

      // If we're already on home and it's a hash link, handle it smoothly
      if (pathname === '/' && isHash) {
        const element = document.getElementById(hashId);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${hashId}`);
        }
      }
    };

    return (
      <Link
        to={to}
        onClick={handleClick}
        className={className}
        style={{
          color: isActive || (to === '/tools/solution' && pathname.includes('/tools/solution')) ? 'var(--accent-teal)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: (isActive || to === '/tools/solution') ? 600 : 500,
          fontSize: mobile ? '1.125rem' : '0.9rem'
        }}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="glass" style={{
      position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
      width: '90%', maxWidth: '1200px', padding: pathname.includes('openclaw') ? '0.8rem 1.5rem' : '1rem 2rem', zIndex: 1000,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <Link to="/" onClick={() => setIsOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-1px', textDecoration: 'none' }} className="gradient-text">thesolution.at</Link>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop Menu */}
      <div className="hidden sm:flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
        <NavLink to="/#services">Services</NavLink>
        <NavLink to="/#ai">AI & ML</NavLink>
        <NavLink to="/tools/solution">Solution</NavLink>
        <NavLink to="/#contact" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.9rem', color: 'white' }}>Contact</NavLink>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 mt-2 glass p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          <NavLink to="/#services" mobile>Services</NavLink>
          <NavLink to="/#ai" mobile>AI & ML</NavLink>
          <NavLink to="/tools/solution" mobile>Solution</NavLink>
          <NavLink to="/#contact" className="btn btn-primary text-center" mobile>Contact</NavLink>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    position: 'relative', overflow: 'hidden'
  }}>
    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
        Elevating Infrastructure,<br />
        <span className="gradient-text">Mastering AI.</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}>
        Expert IT Consulting for Datacenter Virtualization, AWS Multicloud, and Cutting-edge AI Solutions.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="#contact" className="btn btn-primary">Start a Project</a>
        <a href="#services" className="btn glass" style={{ padding: '0.8rem 2rem' }}>Our Expertise</a>
      </div>
    </div>
    <div style={{
      position: 'absolute', top: '20%', right: '-10%', width: '500px', height: '500px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
      filter: 'blur(50px)', zIndex: 1
    }} />
  </section>
);

const ServiceCard = ({ icon, title, items }) => (
  <div className="glass" style={{ padding: '2.5rem', height: '100%' }}>
    <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent-teal)' }}>•</span> {item}
        </li>
      ))}
    </ul>
  </div>
);

const Home = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  return (
    <>
      <Hero />
      <section id="services" className="container">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Infrastructure <span className="gradient-text">Expertise</span></h2>
        <div className="grid grid-3">
          <ServiceCard
            icon="🏢"
            title="Datacenter & Virtualization"
            items={[
              "Server Virtualization (VMware, Hyper-V, KVM)",
              "Kubernetes, KubeVirt & Cilium",
              "Storage & Network Virtualization",
              "Infrastructure Optimization",
              "Backup & Disaster Recovery"
            ]}
          />
          <ServiceCard
            icon="☁️"
            title="AWS Multicloud Training"
            items={[
              "Strategic Workshops",
              "Hands-on Multicloud Mastery",
              "Integration & Migration",
              "Cloud Architecture Design"
            ]}
          />
          <ServiceCard
            icon="🛰️"
            title="VMware Specialist"
            items={[
              "Broadcom Era Consultation",
              "License Optimization",
              "VCF Implementation",
              "Legacy Migration"
            ]}
          />
        </div>
      </section>

      <section id="ai" style={{ background: 'rgba(59, 130, 246, 0.02)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Machine Learning & <span className="gradient-text">AI</span></h2>
          <div className="grid grid-2">
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Future-Proof Your Business</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Leverage the power of modern AI to automate workflows, analyze complex data, and build intelligent products.
              </p>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {[
                  "💬 NLP Solutions",
                  "🎨 Generative AI",
                  "🧠 Neural Networks",
                  "📊 Data Science",
                  "⚡ AI-Automation",
                  "👁️ Computer Vision"
                ].map((item, i) => (
                  <div key={i} className="glass" style={{ padding: '1rem', fontWeight: 600 }}>{item}</div>
                ))}
              </div>
            </div>
            <div className="glass" style={{ border: 'none', overflow: 'hidden', position: 'relative', minHeight: '500px' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(45deg, var(--accent-blue), var(--accent-purple))',
                opacity: 0.1, zIndex: 0
              }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Editor Header */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', opacity: 0.3 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                </div>

                {/* Source Code */}
                <div style={{ padding: '0 1rem 1.5rem 1rem' }}>
                  <div style={{ marginBottom: '1rem', opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-teal)' }}>AI_IMPLEMENTATION.js (Source)</div>
                  <code style={{ color: 'var(--accent-teal)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    // Step 1: Optimize business with AI<br />
                    const solution = await AI.optimize(business);<br />
                    // Step 2: Profit<br />
                    console.log("Efficiency Increased");
                  </code>
                </div>

                {/* Terminal Window */}
                <div style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '1.5rem',
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#666' }}>
                    <span style={{ color: 'var(--accent-teal)' }}>❯</span>
                    <span>npm start</span>
                  </div>

                  <div style={{ spaceY: '0.75rem' }}>
                    <div style={{ color: '#fff', marginBottom: '0.5rem' }}>
                      <span style={{ opacity: 0.5 }}>[info]</span> Initializing AI Reality Check...
                    </div>

                    <div style={{ color: '#fff', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--accent-teal)' }}>Processing:</span> "Wait for AI.optimize(business)..."
                    </div>

                    <div style={{ color: 'var(--accent-teal)', marginBottom: '1rem' }}>
                      <span style={{ color: 'var(--accent-teal)' }}>LOG:</span> "Efficiency Increased"
                    </div>

                    {!showDiagnostic ? (
                      <div
                        onClick={() => setShowDiagnostic(true)}
                        style={{
                          cursor: 'pointer',
                          color: 'var(--accent-blue)',
                          marginTop: '2rem',
                          padding: '0.5rem 0',
                          borderTop: '1px dashed rgba(255,255,255,0.1)',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span className="animate-pulse">❯</span> Run System Analysis_
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-top-4" style={{
                        marginTop: '2rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderLeft: '3px solid var(--accent-blue)',
                        padding: '1rem'
                      }}>
                        <div style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>System Diagnosis: Satire Detected</div>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                          This code parodies the naive notion that complex business problems can be magically solved by simply calling an <code>optimize()</code> function.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <li style={{ marginBottom: '0.25rem' }}>• Success is assumed here, not measured.</li>
                          <li style={{ marginBottom: '0.25rem' }}>• No true understanding of the problem required.</li>
                          <li style={{ marginBottom: '0.25rem' }}>• Real AI solutions require precision & depth.</li>
                        </ul>
                        <div
                          onClick={() => setShowDiagnostic(false)}
                          style={{ marginTop: '1rem', fontSize: '0.7rem', opacity: 0.5, cursor: 'pointer', textAlign: 'right' }}
                        >
                          [Close Diagnosis]
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Impressum = () => (
  <section className="container" style={{ paddingTop: '8rem' }}>
    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Legal <span className="gradient-text">Notice</span></h2>
    <div className="grid grid-2">
      <div className="glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Company Information</h3>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          <strong>The Solution Virtualization Consolidation Company e.U.</strong><br />
          Owner: Jürgen Müller<br />
          Commercial Court: Handelsgericht Wien<br />
          Commercial Register Number: 309198d<br />
          GLN: 9110017283110
        </p>
        <h3 style={{ marginBottom: '1.5rem' }}>Contact Address</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Hertha-Firnberg-Straße 9/3/307<br />
          1100 Wien<br />
          Austria
        </p>
      </div>
      <div className="glass" style={{ overflow: 'hidden', minHeight: '400px', border: 'none' }}>
        <iframe
          title="Google Maps Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.16832367!2d16.3768853!3d48.1652755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476da9ef07d2062b%3A0xc3f6050519965d83!2sHertha-Firnberg-Stra%C3%9Fe%209%2C%201100%20Wien%2C%20Austria!5e0!3m2!1sen!2sat!4v1707999999999!5m2!1sen!2sat"
        ></iframe>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" style={{ padding: '6rem 0', textAlign: 'center' }}>
    <div className="container">
      <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ready to find your <span className="gradient-text">Solution?</span></h2>
      <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '1rem' }}>Interested in working together? Let's connect!</p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Get in touch for specialized IT consulting and AI implementation.</p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
        <a href="mailto:contact@thesolution.at" className="btn btn-primary" style={{ fontSize: '1.25rem', width: 'fit-content' }}>
          Email: contact@thesolution.at
        </a>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="https://github.com/foozy74" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/jürgen-müller-b4792a57" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <span>© 2026 thesolution.at - Specialized IT Consulting & AI Solutions</span>
        <Link to="/impressum" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Legal Notice (Impressum)</Link>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <Router>
      <ScrollToNavigation />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/tools/solution" element={<SolutionLanding />} />
          <Route path="/tools/solution/openclaw-iac" element={<OpenClawTool />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
