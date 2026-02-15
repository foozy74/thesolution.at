import React from 'react';
import './index.css';

const Navbar = () => (
  <nav className="glass" style={{
    position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
    width: '90%', maxWidth: '1200px', padding: '1rem 2rem', zIndex: 1000,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  }}>
    <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px' }} className="gradient-text">thesolution.at</div>
    <div style={{ display: 'flex', gap: '2rem' }}>
      <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Services</a>
      <a href="#ai" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>AI & ML</a>
      <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Contact</a>
    </div>
  </nav>
);

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
    {/* Background Glows */}
    <div style={{
      position: 'absolute', top: '20%', right: '-10%', width: '500px', height: '500px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
      filter: 'blur(50px)', z_index: 1
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

const App = () => {
  return (
    <div className="app">
      <Navbar />
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
            <div className="glass" style={{ border: 'none', overflow: 'hidden', position: 'relative', minHeight: '300px' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(45deg, var(--accent-blue), var(--accent-purple))',
                opacity: 0.1, zIndex: 0
              }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <code style={{ color: 'var(--accent-teal)', fontSize: '1.25rem' }}>
                  // AI Implementation<br />
                  const solution = await AI.optimize(business);<br />
                  console.log("Efficiency Increased");
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

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

          <div style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            © 2026 thesolution.at - Specialized IT Consulting & AI Solutions
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
