import { generateMetadata } from "@/components/MetaTags";

export const metadata = generateMetadata({
  title: "Impressum - thesolution.at | Legal Notice",
  description: "Offizielle Impressum und rechtliche Informationen für thesolution.at - IT Consulting für Datacenter, Virtualisierung & AI",
  canonical: "https://thesolution.at/impressum",
});

export default function ImpressumPage() {
  return (
    <section className="container" style={{ paddingTop: "8rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
        Legal <span className="gradient-text">Notice</span>
      </h1>
      <div className="grid grid-2">
        <article className="glass" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Company Information</h3>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
            <strong>The Solution Virtualization Consolidation Company e.U.</strong><br />
            Owner: Jürgen Müller<br />
            Commercial Court: Handelsgericht Wien<br />
            Commercial Register Number: 309198d<br />
            GLN: 9110017283110
          </p>
          <h3 style={{ marginBottom: "1.5rem" }}>Contact Address</h3>
          <address style={{ color: "var(--text-secondary)", fontStyle: "normal" }}>
            Hertha-Firnberg-Straße 9/3/307<br />
            1100 Wien<br />
            Austria
          </address>
        </article>
        <div className="glass" style={{ overflow: "hidden", minHeight: "400px", border: "none" }}>
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
}
