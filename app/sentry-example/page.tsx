"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

export default function SentryExamplePage() {
  const handleTestError = () => {
    Sentry.captureMessage("Test message from thesolution.at");
    throw new Error("This is a Sentry test error - you can delete this page");
  };

  const handleTestBreadcrumb = () => {
    Sentry.addBreadcrumb({
      category: "ui",
      message: "User clicked test button",
      level: "info",
    });
    alert("Breadcrumb added! Check Sentry console.");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      <section className="container" style={{ paddingTop: "8rem" }}>
        <div className="glass p-8 max-w-2xl mx-auto rounded-xl">
          <h1 className="text-3xl font-bold mb-4 gradient-text">Sentry Test Page</h1>
          <p className="text-slate-400 mb-6">
            This page is for testing Sentry error monitoring. Click the buttons below to send test events to Sentry.
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleTestError}
              className="btn bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
            >
              🚨 Trigger Test Error
            </button>
            <button
              onClick={handleTestBreadcrumb}
              className="btn bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
            >
              📝 Add Breadcrumb
            </button>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold mb-2">✅ Sentry Setup Checklist:</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>✓ @sentry/nextjs installed</li>
              <li>✓ instrumentation.ts created</li>
              <li>✓ instrumentation-client.ts created</li>
              <li>✓ sentry.server.config.ts created</li>
              <li>✓ sentry.edge.config.ts created</li>
              <li>✓ global-error.tsx created</li>
              <li>✓ next.config.ts wrapped with withSentryConfig</li>
            </ul>
          </div>

          <Link href="/" className="btn glass mt-6 inline-block">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
