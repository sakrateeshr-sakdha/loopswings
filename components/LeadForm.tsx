"use client";

import { useState } from "react";

const AD_STATUSES = [
  "Not running ads",
  "Running ads currently",
  "Ran ads previously",
];

export default function LeadForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          agency: data.get("agency"),
          email: data.get("email"),
          phone: data.get("phone"),
          city: data.get("city"),
          adsStatus: data.get("adsStatus"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <form className="lead-form-grid" onSubmit={onSubmit}>
      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <input name="name" required placeholder="Your name" className="lead-input" />
      </div>

      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <line x1="8" y1="6" x2="10" y2="6" />
            <line x1="14" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="10" y2="10" />
            <line x1="14" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="10" y2="14" />
            <line x1="14" y1="14" x2="16" y2="14" />
          </svg>
        </span>
        <input name="agency" required placeholder="Travel agency name" className="lead-input" />
      </div>

      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <polyline points="3 7 12 13 21 7" />
          </svg>
        </span>
        <input name="email" type="email" required placeholder="Email address" className="lead-input" />
      </div>

      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </span>
        <input name="phone" type="tel" required placeholder="WhatsApp number" className="lead-input" />
      </div>

      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
        <input name="city" required placeholder="City / location" className="lead-input" />
      </div>

      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </span>
        <select name="adsStatus" defaultValue="" className="lead-input lead-select">
          <option value="">Current Meta Ads status</option>
          {AD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="lead-field lead-field-full">
        <span className="lead-field-icon lead-field-icon-textarea" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="14" y2="13" />
          </svg>
        </span>
        <textarea
          name="message"
          placeholder="What are you currently advertising, and what kind of enquiries do you want?"
          className="lead-input lead-textarea"
        />
      </div>

      <div className="lead-field-full">
        <button className="lead-submit-btn" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "SENDING…" : "GET MORE QUALITY LEADS →"}
        </button>

        <p className="lead-capacity-note">
          For Indian travel agencies · Limited client capacity
        </p>

        <div className="lead-trust-row">
          <div className="lead-trust-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="lead-trust-green">
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z" />
            </svg>
            <span>No obligation</span>
          </div>

          <div className="lead-trust-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="lead-trust-green">
              <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
            <span>Quick assessment</span>
          </div>

          <div className="lead-trust-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="lead-trust-green">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <span>Confidential</span>
          </div>
        </div>

        {state === "sent" && (
          <div className="form-note">
            Thanks — your details have been received. I&rsquo;ll get back to you shortly.
          </div>
        )}
        {state === "error" && <div className="form-note error">{error}</div>}
      </div>
    </form>
  );
}
