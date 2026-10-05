"use client";

import { useState } from "react";

const LEAD_PROBLEM_OPTIONS = [
  "Too many irrelevant enquiries",
  "Budget is too low",
  "Just asking for price",
  "No clear travel dates",
  "Stop responding",
  "Not enough qualified leads",
  "Other",
];

interface LeadFormProps {
  whatsappUrl?: string;
}

export default function LeadForm({ whatsappUrl = "https://wa.me/8574859685" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [phone, setPhone] = useState("");
  const [advertisingPackage, setAdvertisingPackage] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");

  const [submittedAgency, setSubmittedAgency] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function toggleProblem(option: string) {
    setSelectedProblems((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    // Prepare problems array
    const compiledProblems = selectedProblems.map((prob) => {
      if (prob === "Other" && otherText.trim()) {
        return `Other: ${otherText.trim()}`;
      }
      return prob;
    });

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          agency: agency.trim(),
          phone: phone.trim(),
          advertisingPackage: advertisingPackage.trim(),
          leadProblems: compiledProblems,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setSubmittedAgency(agency.trim());
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    // Build direct WhatsApp link with prefilled context
    const cleanWaUrl = whatsappUrl.split("?")[0];
    const greeting = submittedAgency
      ? `Hi Vishu, I just submitted my travel lead quality audit request for ${submittedAgency}.`
      : "Hi Vishu, I just submitted my travel lead quality audit request.";
    const waLink = `${cleanWaUrl}?text=${encodeURIComponent(greeting)}`;

    return (
      <div className="lead-success-card">
        <div className="lead-success-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="34"
            height="34"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h3 className="lead-success-title">Your audit request is submitted.</h3>

        <p className="lead-success-desc">
          I&rsquo;ll review your campaign and identify the biggest lead-quality issue I&rsquo;d
          investigate first.
        </p>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="lead-success-wa-btn"
          aria-label="Continue on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M12 2a9.9 9.9 0 00-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.9c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.5.1-.6.8-.7 1-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A3 3 0 006 9.6c0 1.8 1.3 3.5 1.5 3.7a10 10 0 003.8 3.4c1.4.6 2 .6 2.7.5a2.5 2.5 0 001.6-1.2 2 2 0 00.1-1.1z" />
          </svg>
          <span>Continue on WhatsApp &rarr;</span>
        </a>

        <button
          type="button"
          className="lead-reset-btn"
          onClick={() => {
            setName("");
            setAgency("");
            setPhone("");
            setAdvertisingPackage("");
            setSelectedProblems([]);
            setOtherText("");
            setState("idle");
          }}
        >
          Submit another audit request
        </button>
      </div>
    );
  }

  return (
    <form className="lead-form-grid" onSubmit={onSubmit}>
      {/* 1. Your Name* */}
      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="1. Your Name*"
          aria-label="Your Name"
          className="lead-input"
        />
      </div>

      {/* 2. Travel Agency Name* */}
      <div className="lead-field">
        <span className="lead-field-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
        <input
          name="agency"
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
          required
          placeholder="2. Travel Agency Name*"
          aria-label="Travel Agency Name"
          className="lead-input"
        />
      </div>

      {/* 3. WhatsApp Number* */}
      <div className="lead-field lead-field-full">
        <span className="lead-field-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </span>
        <input
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="3. WhatsApp Number*"
          aria-label="WhatsApp Number"
          className="lead-input"
        />
      </div>

      {/* 4. What package / trip are you currently advertising?* */}
      <div className="lead-field lead-field-full">
        <span className="lead-field-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </span>
        <input
          name="advertisingPackage"
          value={advertisingPackage}
          onChange={(e) => setAdvertisingPackage(e.target.value)}
          required
          placeholder="4. What package / trip are you currently advertising?*"
          aria-label="What package / trip are you currently advertising"
          className="lead-input"
        />
      </div>

      {/* 5. What's the biggest problem you're seeing with your leads? */}
      <div className="lead-field-full lead-problem-group">
        <label className="lead-problem-title">
          5. What&rsquo;s the biggest problem you&rsquo;re seeing with your leads?
        </label>

        <div className="lead-problem-options">
          {LEAD_PROBLEM_OPTIONS.map((opt) => {
            const isChecked = selectedProblems.includes(opt);
            return (
              <label
                key={opt}
                className={`lead-problem-item ${isChecked ? "active" : ""}`}
              >
                <input
                  type="checkbox"
                  className="lead-checkbox-hidden"
                  checked={isChecked}
                  onChange={() => toggleProblem(opt)}
                />
                <span className="lead-problem-box" aria-hidden="true">
                  {isChecked && (
                    <svg
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="lead-problem-text">{opt}</span>
              </label>
            );
          })}
        </div>

        {selectedProblems.includes("Other") && (
          <div className="lead-other-wrap">
            <input
              type="text"
              className="lead-input lead-other-input"
              placeholder="Please specify other problem..."
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Submit CTA & Trust Row */}
      <div className="lead-field-full">
        <button className="lead-submit-btn" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "SUBMITTING…" : "Get My FREE Lead Quality Audit →"}
        </button>

        <p className="lead-capacity-note">
          For Indian travel agencies · Limited client capacity
        </p>

        <div className="lead-trust-row">
          <div className="lead-trust-badge">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
              className="lead-trust-green"
            >
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z" />
            </svg>
            <span>No obligation</span>
          </div>

          <div className="lead-trust-badge">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
              className="lead-trust-green"
            >
              <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
            <span>Quick assessment</span>
          </div>

          <div className="lead-trust-badge">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
              className="lead-trust-green"
            >
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <span>Confidential</span>
          </div>
        </div>

        {error && <div className="form-note error" style={{ marginTop: 12 }}>{error}</div>}
      </div>
    </form>
  );
}
