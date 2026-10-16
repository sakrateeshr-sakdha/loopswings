"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Sign in failed");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setBusy(false);
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login-box" onSubmit={onSubmit}>
        <div className="brand" style={{ marginBottom: 18, justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo-img" src="/images/vishuvabharathi.png" alt="Vishuvabharathi" style={{ height: 32, width: "auto" }} />
        </div>
        <h1 style={{ fontSize: 26 }}>Admin sign in</h1>
        <p className="adm-hint" style={{ margin: "8px 0 20px" }}>
          Manage testimonials, brands and enquiries.
        </p>
        <div className="adm-field wide">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <p className="adm-error" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}
        <button className="btn gold" type="submit" disabled={busy} style={{ marginTop: 20, width: "100%" }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
