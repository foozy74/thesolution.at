"use client";

import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
        <span className="gradient-text">Datenschutz</span>
      </h2>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>1. Verantwortlicher</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
          Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) und des österreichischen Telekommunikationsgesetzes (TKG 2021) ist:
        </p>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            padding: "1.5rem",
            borderRadius: "12px",
            borderLeft: "3px solid var(--accent-teal)",
            marginTop: "1rem",
          }}
        >
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>The Solution Virtualization Consolidation Company e.U.</strong>
          </p>
          <p style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
            Inhaber: Jürgen Müller<br />
            Hertha-Firnberg-Straße 9/3/307<br />
            1100 Wien, Österreich
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            E-Mail:{" "}
            <a href="mailto:contact@thesolution.at" style={{ color: "var(--accent-teal)", textDecoration: "none" }}>
              contact@thesolution.at
            </a>
            <br />
            Handelsgericht Wien, FN 309198d<br />
            GLN: 9110017283110
          </p>
        </div>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>2. Hosting</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Diese Website wird auf einem Server von <strong>Oracle Cloud Infrastructure (OCI)</strong> gehostet, der über Coolify verwaltet wird.
          Die Serverstandorte befinden sich in der Europäischen Union (EU). Alle Daten werden ausschließlich in EU-Rechenzentren verarbeitet und gespeichert.
        </p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>3. Keine Cookie-Verwendung</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
          Diese Website verwendet <strong>keine Cookies</strong> und setzt auch kein Tracking ein.
          Es werden keine personenbezogenen Daten auf Ihrem Endgerät gespeichert.
        </p>
        <div
          style={{
            background: "rgba(125, 211, 192, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid rgba(125, 211, 192, 0.2)",
          }}
        >
          <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            <strong style={{ color: "var(--accent-teal)" }}>Wichtig:</strong> Diese Website ist rein statisch und benötigt daher keine Cookie-Einwilligung.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Der lokale Speicher (localStorage) wird ausschließlich verwendet, um Ihre Entscheidung bezüglich des Cookie-Hinweis-Banners zu speichern.
          </p>
        </div>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>4. Server-Log-Dateien</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
          Der Hosting-Provider erhebt automatisch technische Informationen, die Ihr Browser beim Aufruf dieser Website übermittelt.
          Diese Daten sind für uns nicht personenbezogen zuordenbar und umfassen:
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            color: "var(--text-secondary)",
            lineHeight: 2,
          }}
        >
          <li>• Browsertyp und Browserversion</li>
          <li>• Verwendetes Betriebssystem</li>
          <li>• Referrer URL (die zuvor besuchte Seite)</li>
          <li>• Hostname des zugreifenden Rechners (IP-Adresse in anonymisierter Form)</li>
          <li>• Uhrzeit der Serveranfrage</li>
        </ul>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginTop: "1rem" }}>
          Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und dienen ausschließlich der technischen Funktionsfähigkeit
          und der Sicherheit unserer Website. Die Speicherung erfolgt ausschließlich auf unseren Servern und wird regelmäßig automatisch gelöscht.
        </p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>5. SSL/TLS-Verschlüsselung</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Diese Website verwendet aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine
          SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des
          Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
          Wenn die SSL-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
        </p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>6. Lokale Schriftarten</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Diese Website verwendet lokal gehostete Schriftarten (Inter und Outfit).
          Die Schriftarten werden von unserem Server geladen und es erfolgt <strong>keine Verbindung zu externen Servern</strong>
          (wie z.B. Google Fonts). Dadurch wird sichergestellt, dass keine Daten an Drittanbieter übertragen werden.
        </p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>7. Eingebettete Inhalte</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
          Auf unserer Website sind Google Maps-Karten eingebettet. Wenn Sie diese Seite aufrufen, wird eine Verbindung
          zu Google-Servern hergestellt. Dabei können Daten an Google übertragen werden.
        </p>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            padding: "1rem",
            borderRadius: "8px",
            borderLeft: "2px solid var(--accent-purple)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
            <strong>Hinweis:</strong> Wenn Sie nicht möchten, dass Google Ihre Daten sammelt, können Sie auf der Impressum-Seite
            die Karte nicht laden lassen oder einen Ad-Blocker verwenden.
          </p>
        </div>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>8. Ihre Rechte</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
          Gemäß der Datenschutz-Grundverordnung (DSGVO) stehen Ihnen folgende Rechte zu:
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            color: "var(--text-secondary)",
            lineHeight: 2,
          }}
        >
          <li>• <strong>Auskunftsrecht:</strong> Sie haben das Recht auf Auskunft über die Sie betreffenden personenbezogenen Daten.</li>
          <li>• <strong>Recht auf Berichtigung:</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
          <li>• <strong>Recht auf Löschung:</strong> Sie können die Löschung Ihrer Daten verlangen, sofern gesetzliche Aufbewahrungspflichten nicht entgegenstehen.</li>
          <li>• <strong>Recht auf Einschränkung:</strong> Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.</li>
          <li>• <strong>Widerspruchsrecht:</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten Widerspruch einzulegen.</li>
          <li>• <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</li>
          <li>• <strong>Beschwerderecht:</strong> Sie haben das Recht, sich bei der Datenschutzbehörde zu beschweren.</li>
        </ul>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginTop: "1rem" }}>
          <strong>Datenschutzbehörde Österreich:</strong><br />
          Barichgasse 40-42, 1030 Wien<br />
          E-Mail:{" "}
          <a href="mailto:dsb@dsb.gv.at" style={{ color: "var(--accent-teal)", textDecoration: "none" }}>
            dsb@dsb.gv.at
          </a>
        </p>
      </div>

      <div className="glass" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>9. Kontakt</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Für datenschutzrechtliche Anfragen können Sie uns jederzeit unter folgender E-Mail-Adresse kontaktieren:
        </p>
        <a
          href="mailto:contact@thesolution.at"
          className="btn btn-primary"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: 700,
          }}
        >
          contact@thesolution.at
        </a>
      </div>

      <div className="glass" style={{ padding: "3rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-teal)" }}>10. Aktualisierung dieser Datenschutzerklärung</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Diese Datenschutzerklärung wurde zuletzt aktualisiert am <strong>10. März 2026</strong>.
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht.
        </p>
      </div>

      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/impressum"
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            background: "rgba(255, 255, 255, 0.05)",
            color: "var(--text-primary)",
            border: "1px solid var(--glass-border)",
            transition: "all 0.3s ease",
          }}
          className="hover:bg-white/10"
        >
          ← Zum Impressum
        </Link>
        <Link
          href="/"
          className="btn btn-primary"
          style={{
            padding: "0.75rem 2rem",
            fontSize: "0.95rem",
            fontWeight: 700,
          }}
        >
          Zurück zur Startseite
        </Link>
      </div>
    </section>
  );
}
