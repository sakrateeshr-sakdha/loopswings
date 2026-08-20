"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

export default function ImageUpload({ label, value, onChange, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="adm-field wide">
      <label>{label}</label>
      <div className="adm-upload">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="adm-thumb" src={value} alt="" />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
          disabled={busy}
        />
        {value && (
          <button type="button" className="adm-btn danger" onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>
      {busy && <span className="adm-hint">Uploading…</span>}
      {error && <span className="adm-error">{error}</span>}
      {hint && !error && <span className="adm-hint">{hint}</span>}
    </div>
  );
}
