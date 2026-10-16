"use client";

import { useState, useRef, useEffect } from "react";

const ADS_RUNNING_OPTIONS = [
  "Meta Ads",
  "Google Ads",
  "Both",
  "Not running ads yet",
];

const LEAD_PROBLEM_OPTIONS = [
  "Too many irrelevant enquiries",
  "Leads don't have the budget",
  "Mostly asking for price",
  "Low buying intent",
  "Stop responding",
  "Not enough qualified leads",
  "Other",
];

interface LeadFormProps {
  whatsappUrl?: string;
}

export default function LeadForm({ whatsappUrl = "https://wa.me/8574859685" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [productService, setProductService] = useState("");
  const [adsRunning, setAdsRunning] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [submittedBusiness, setSubmittedBusiness] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [dropdownOpen]);

  function toggleProblem(option: string) {
    setSelectedProblems((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    if (!adsRunning) {
      setError("Please select where you are currently running ads.");
      setState("error");
      return;
    }

    // Compile problems array
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
          agency: businessName.trim(),
          phone: phone.trim(),
          advertisingPackage: productService.trim(),
          adsStatus: adsRunning.trim(),
          leadProblems: compiledProblems,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setSubmittedBusiness(businessName.trim());
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    const cleanWaUrl = whatsappUrl.split("?")[0];
    const greeting = submittedBusiness
      ? `Hi Vishu, I just submitted my lead quality audit request for ${submittedBusiness}.`
      : "Hi Vishu, I just submitted my lead quality audit request.";
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

        <h3 className="lead-success-title">Your audit request has been submitted.</h3>

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
            setBusinessName("");
            setPhone("");
            setProductService("");
            setAdsRunning("");
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

  // Format multi-select dropdown display text
  const renderMultiSelectTriggerText = () => {
    if (selectedProblems.length === 0) {
      return (
        <span className="lead-multiselect-value placeholder">
          6. What&rsquo;s the biggest problem you&rsquo;re seeing with your leads?
        </span>
      );
    }
    if (selectedProblems.length === 1) {
      return (
        <span className="lead-multiselect-value">
          <span className="lead-multiselect-badge">1</span>
          {selectedProblems[0]}
        </span>
      );
    }
    return (
      <span className="lead-multiselect-value">
        <span className="lead-multiselect-badge">{selectedProblems.length}</span>
        {selectedProblems.join(", ")}
      </span>
    );
  };

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

      {/* 2. Business Name* */}
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
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          placeholder="2. Business Name*"
          aria-label="Business Name"
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

      {/* 4. What product or service are you currently advertising?* */}
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
          value={productService}
          onChange={(e) => setProductService(e.target.value)}
          required
          placeholder="4. What product or service are you currently advertising?*"
          aria-label="What product or service are you currently advertising"
          className="lead-input"
        />
      </div>

      {/* 5. Where are you currently running ads?* */}
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
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </span>
        <select
          name="adsStatus"
          value={adsRunning}
          onChange={(e) => setAdsRunning(e.target.value)}
          required
          className="lead-input lead-select"
          aria-label="Where are you currently running ads"
        >
          <option value="">5. Where are you currently running ads?*</option>
          {ADS_RUNNING_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* 6. What's the biggest problem you're seeing with your leads? (Multi-select Dropdown) */}
      <div className="lead-field lead-field-full" ref={dropdownRef}>
        <div className={`lead-multiselect-wrap ${dropdownOpen ? "open" : ""}`}>
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
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>

          <button
            type="button"
            className="lead-multiselect-trigger"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            {renderMultiSelectTriggerText()}
            <span className="lead-multiselect-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

          {dropdownOpen && (
            <div className="lead-multiselect-dropdown" role="listbox">
              {LEAD_PROBLEM_OPTIONS.map((option) => {
                const isSelected = selectedProblems.includes(option);
                return (
                  <div
                    key={option}
                    className={`lead-multiselect-option ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleProblem(option)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="lead-multiselect-check" aria-hidden="true">
                      {isSelected && (
                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
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
                    <span>{option}</span>
                  </div>
                );
              })}

              <div className="lead-multiselect-footer">
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {selectedProblems.length} selected
                </span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {selectedProblems.length > 0 && (
                    <button
                      type="button"
                      className="lead-multiselect-clear-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProblems([]);
                        setOtherText("");
                      }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="lead-multiselect-done-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other text field if "Other" is checked */}
        {selectedProblems.includes("Other") && (
          <div className="lead-other-wrap" style={{ marginTop: 8 }}>
            <input
              type="text"
              className="lead-input lead-other-input"
              placeholder="Please specify your biggest lead problem..."
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
          For businesses &amp; agencies · Limited client capacity
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
