"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadsList({ initial }: { initial: Lead[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/leads");
    if (res.ok) setItems(await res.json());
    router.refresh();
  }

  async function toggleRead(lead: Lead) {
    setBusy(true);
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !lead.read }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(lead: Lead) {
    if (!confirm(`Delete the enquiry from ${lead.name}?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) {
    return <div className="adm-empty">No enquiries yet. Submissions from the site land here.</div>;
  }

  return (
    <>
      {items.map((lead) => (
        <div className="adm-card" key={lead.id}>
          <div className="adm-row">
            <div className="adm-row-main">
              <span className={`adm-pill ${lead.read ? "off" : "on"}`}>
                {lead.read ? "Read" : "New"}
              </span>
              <p className="adm-meta" style={{ marginTop: 8 }}>
                <strong style={{ fontSize: 16, color: "var(--ink)" }}>{lead.name}</strong>
                {" — "}
                {lead.agency}
                {lead.city ? ` · ${lead.city}` : ""}
              </p>
              {(lead.email || lead.phone) && (
                <p className="adm-meta">
                  {lead.email && <a href={`mailto:${lead.email}`}>{lead.email}</a>}
                  {lead.email && lead.phone ? " · " : ""}
                  {lead.phone && (
                    <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                      {lead.phone}
                    </a>
                  )}
                </p>
              )}
              <p className="adm-meta">
                {formatDate(lead.createdAt)}
                {lead.adsStatus ? ` · ${lead.adsStatus}` : ""}
              </p>
              {lead.message && (
                <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{lead.message}</p>
              )}
            </div>
            <div className="adm-actions">
              <button
                className="adm-btn"
                type="button"
                onClick={() => toggleRead(lead)}
                disabled={busy}
              >
                Mark as {lead.read ? "unread" : "read"}
              </button>
              <button
                className="adm-btn danger"
                type="button"
                onClick={() => remove(lead)}
                disabled={busy}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
