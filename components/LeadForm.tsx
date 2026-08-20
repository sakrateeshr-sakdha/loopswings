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
    <form className="form" onSubmit={onSubmit}>
      <input name="name" required placeholder="Your name" />
      <input name="agency" required placeholder="Travel agency name" />
      <input name="email" type="email" required placeholder="Email address" />
      <input name="phone" type="tel" required placeholder="WhatsApp number" />
      <input name="city" required placeholder="City / location" />
      <select name="adsStatus" defaultValue="">
        <option value="">Current Meta Ads status</option>
        {AD_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        placeholder="What are you currently advertising, and what kind of enquiries do you want?"
      />
      <button className="btn gold wide" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "SENDING…" : "GET MORE QUALITY LEADS →"}
      </button>
      {state === "sent" && (
        <div className="form-note">
          Thanks — your details have been received. I&rsquo;ll get back to you shortly.
        </div>
      )}
      {state === "error" && <div className="form-note error">{error}</div>}
    </form>
  );
}
