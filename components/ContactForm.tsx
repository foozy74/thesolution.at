"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("footer.form");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS environment variables are missing.");
      setStatus("error");
      setErrorMessage(t("errorConfig"));
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          name: formData.name,
          reply_to: formData.email,
          user_email: formData.email,
          email: formData.email,
          subject: formData.subject || "Anfrage über thesolution.at",
          message: formData.message,
        },
        publicKey
      );

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      console.error("EmailJS Error:", err);
      setStatus("error");
      setErrorMessage(t("errorGeneric"));
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage(null);
  };

  return (
    <div
      className="glass"
      style={{
        padding: "2.5rem",
        borderRadius: "16px",
        maxWidth: "680px",
        margin: "0 auto 3rem auto",
        textAlign: "left",
      }}
    >
      <h3
        style={{
          fontSize: "1.75rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        {t("title")}
      </h3>

      {status === "success" ? (
        <div
          className="animate-in fade-in"
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <CheckCircle2
            size={56}
            style={{ color: "var(--accent-teal)", filter: "drop-shadow(0 0 15px rgba(125, 211, 192, 0.4))" }}
          />
          <h4 style={{ fontSize: "1.5rem" }}>{t("successTitle")}</h4>
          <p style={{ color: "var(--text-secondary)", maxWidth: "450px" }}>{t("successText")}</p>
          <button
            type="button"
            onClick={handleReset}
            className="btn glass"
            style={{ marginTop: "1rem", padding: "0.75rem 1.75rem", color: "var(--accent-teal)" }}
          >
            {t("sendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {status === "error" && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                padding: "1rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                color: "#fca5a5",
                fontSize: "0.9rem",
              }}
              role="alert"
            >
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>{t("errorTitle")}: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="contact-name" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {t("nameLabel")} <span style={{ color: "var(--accent-teal)" }}>*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t("namePlaceholder")}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "var(--transition)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-teal)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="contact-email" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {t("emailLabel")} <span style={{ color: "var(--accent-teal)" }}>*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t("emailPlaceholder")}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "var(--transition)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-teal)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="contact-subject" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {t("subjectLabel")}
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t("subjectPlaceholder")}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                outline: "none",
                transition: "var(--transition)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-teal)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="contact-message" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {t("messageLabel")} <span style={{ color: "var(--accent-teal)" }}>*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder={t("messagePlaceholder")}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                outline: "none",
                resize: "vertical",
                transition: "var(--transition)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-teal)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-primary"
            style={{
              marginTop: "0.5rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "1.05rem",
              opacity: status === "sending" ? 0.7 : 1,
              cursor: status === "sending" ? "not-allowed" : "pointer",
            }}
          >
            {status === "sending" ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{t("sending")}</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>{t("submit")}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
