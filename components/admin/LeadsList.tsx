"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastContext";
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
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  async function refresh() {
    try {
      const res = await fetch(`/api/leads?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) setItems(await res.json());
      router.refresh();
    } catch {
      router.refresh();
    }
  }

  async function toggleRead(lead: Lead) {
    setBusy(true);
    try {
      const nextRead = !lead.read;
      const res = await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: nextRead }),
      });
      if (!res.ok) throw new Error("Could not update status");
      toast.success(nextRead ? "Enquiry marked as read" : "Enquiry marked as unread");
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update enquiry";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function remove(lead: Lead) {
    if (!confirm(`Delete the enquiry from ${lead.name}?`)) return;
    setBusy(true);
    setError("");

    // Optimistically update list so the item is removed immediately
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== lead.id));

    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
        method: "DELETE",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not delete");
      }
      toast.success(`Enquiry from "${lead.name}" deleted successfully`);
      await refresh();
    } catch (err) {
      // Revert if delete failed
      setItems(prevItems);
      const msg = err instanceof Error ? err.message : "Could not delete";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  if (!items.length && !error) {
    return <div className="adm-empty">No enquiries yet. Submissions from the site land here.</div>;
  }

  return (
    <>
      {error && (
        <div className="adm-card" style={{ borderColor: "#b3261e", background: "#fff5f5", marginBottom: 20 }}>
          <p className="adm-error" style={{ margin: 0 }}>{error}</p>
        </div>
      )}
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
