import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <section className="container" style={{ paddingTop: "8rem", paddingBottom: "4rem", textAlign: "center", minHeight: "80vh" }}>
      <h1 style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Diese Seite wurde nicht gefunden.
      </p>
      <Link href="/" className="btn btn-primary" style={{ padding: "0.75rem 2rem" }}>
        Zurück zur Startseite
      </Link>
    </section>
  );
}
