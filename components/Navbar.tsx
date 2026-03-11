"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className="glass"
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "1200px",
        padding: pathname.includes("openclaw") ? "0.8rem 1.5rem" : "1rem 2rem",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        onClick={() => setIsOpen(false)}
        className="group"
        style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
      >
        <img
          src="/logo.jpeg"
          alt="thesolution.at logo"
          style={{
            height: "45px",
            width: "45px",
            objectFit: "contain",
            filter: "drop-shadow(0 0 8px rgba(125, 211, 192, 0.8)) drop-shadow(0 0 15px rgba(91, 155, 213, 0.5))",
            animation: "clawPulse 3s ease-in-out infinite",
          }}
        />
        <span
          className="gradient-text"
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            letterSpacing: "-1px",
            transition: "text-shadow 0.3s ease",
            textShadow: "0 0 10px rgba(125, 211, 192, 0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textShadow = "0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.6), 0 0 40px rgba(125, 211, 192, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textShadow = "0 0 10px rgba(125, 211, 192, 0.5)";
          }}
        >
          thesolution.at
        </span>
      </Link>

      {/* Mobile Menu Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          padding: "0.5rem",
          background: "transparent",
          border: "none",
          color: "white",
          borderRadius: "0.5rem",
          cursor: "pointer",
          transition: "background-color 0.3s",
          zIndex: 1001,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        type="button"
        className="mobile-toggle"
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
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }} className="desktop-menu">
        <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}>
          <li>
            <NavLink href="/#services" pathname={pathname}>Services</NavLink>
          </li>
          <li>
            <NavLink href="/#ai" pathname={pathname}>AI & ML</NavLink>
          </li>
          <li>
            <NavLink href="/tools/solution" pathname={pathname}>Solution</NavLink>
          </li>
          <li>
            <ContactButton />
          </li>
          <li>
            <ContactButton />
          </li>
        </ul>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "0.5rem",
          zIndex: 1000,
          width: "min(300px, 90vw)",
          marginLeft: "auto",
        }}
        className={`mobile-menu glass p-4 animate-in fade-in slide-in-from-right-4 ${isOpen ? "mobile-menu-open" : ""}`}
        role="menu"
      >
        <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", listStyle: "none", margin: 0, padding: 0 }}>
          <li>
            <NavLink href="/#services" pathname={pathname} mobile>Services</NavLink>
          </li>
          <li>
            <NavLink href="/#ai" pathname={pathname} mobile>AI & ML</NavLink>
          </li>
          <li>
            <NavLink href="/tools/solution" pathname={pathname} mobile>Solution</NavLink>
          </li>
          <li>
            <ContactButton mobile />
          </li>
        </ul>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .mobile-toggle {
            display: block !important;
          }
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu {
            display: none;
          }
          .mobile-menu-open {
            display: block !important;
          }
        }
        @media (min-width: 640px) {
          .mobile-toggle {
            display: none !important;
          }
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ href, pathname, children, mobile = false }: { href: string; pathname: string; children: React.ReactNode; mobile?: boolean }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (href.startsWith("/#")) {
      const hashId = href.replace("/#", "");
      if (pathname === "/") {
        const checkHash = () => setIsActive(window.location.hash === `#${hashId}`);
        checkHash();
        window.addEventListener("hashchange", checkHash);
        return () => window.removeEventListener("hashchange", checkHash);
      }
    } else if (href === "/tools/solution" && pathname.includes("/tools/solution")) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname, href]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const hashId = href.replace("/#", "");
      const element = document.getElementById(hashId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${hashId}`);
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      style={{
        color: isActive ? "var(--accent-teal)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: isActive ? 600 : 500,
        fontSize: mobile ? "1.125rem" : "0.9rem",
        transition: "text-shadow 0.3s ease",
        textShadow: isActive ? "0 0 10px rgba(125, 211, 192, 0.5)" : "none",
      }}
      onMouseEnter={(e) => {
        if (isActive) {
          e.currentTarget.style.textShadow = "0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.6)";
        }
      }}
      onMouseLeave={(e) => {
        if (isActive) {
          e.currentTarget.style.textShadow = "0 0 10px rgba(125, 211, 192, 0.5)";
        }
      }}
    >
      {children}
    </Link>
  );
}

function ContactButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link
      href="/#contact"
      className="btn btn-primary"
      style={{
        padding: mobile ? "0.6rem 1.5rem" : "0.6rem 1.5rem",
        fontSize: mobile ? "0.95rem" : "0.95rem",
        fontWeight: 700,
      }}
    >
      Contact
    </Link>
  );
}
