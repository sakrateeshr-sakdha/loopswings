"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { useToast } from "./ToastContext";
import type { Brand } from "@/lib/types";

type Draft = Omit<Brand, "id" | "createdAt">;

const BLANK: Draft = {
  name: "",
  location: "",
  logo: "",
  website: "",
  order: 0,
  published: true,
};

function toDraft(item: Brand): Draft {
  const { id: _id, createdAt: _createdAt, ...rest } = item;
  return rest;
}

export default function BrandsManager({ initial }: { initial: Brand[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  function startCreate() {
    setEditingId("new");
    setDraft({ ...BLANK, order: items.length + 1 });
    setError("");
  }

  function startEdit(item: Brand) {
    setEditingId(item.id);
    setDraft(toDraft(item));
    setError("");
  }

  function cancel() {
    setEditingId(null);
    setDraft(null);
    setError("");
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function refresh() {
    try {
      const res = await fetch(`/api/brands?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) setItems(await res.json());
      router.refresh();
    } catch {
      router.refresh();
    }
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      const creating = editingId === "new";
      const res = await fetch(creating ? "/api/brands" : `/api/brands/${editingId}`, {
        method: creating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not save");
      toast.success(creating ? "Agency added successfully" : "Agency updated successfully");
      await refresh();
      cancel();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: Brand) {
    if (!confirm(`Remove ${item.name} from the brand grid?`)) return;
    setBusy(true);
    setError("");

    // Optimistically update list so the item is removed immediately
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    try {
      const res = await fetch(`/api/brands/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not delete");
      }
      toast.success(`Agency "${item.name}" deleted successfully`);
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

  async function togglePublished(item: Brand) {
    setBusy(true);
    try {
      const nextPublished = !item.published;
      const res = await fetch(`/api/brands/${encodeURIComponent(item.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toDraft(item), published: nextPublished }),
      });
      if (!res.ok) throw new Error("Could not update status");
      toast.success(nextPublished ? "Agency published" : "Agency unpublished");
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update status";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  const editor = draft && (
    <div className="adm-card">
      <h2>{editingId === "new" ? "New agency" : "Edit agency"}</h2>
      <div className="adm-form" style={{ marginTop: 16 }}>
        <div className="adm-field">
          <label htmlFor="name">Agency name</label>
          <input
            id="name"
            type="text"
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="adm-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Kerala"
          />
        </div>
        <div className="adm-field">
          <label htmlFor="website">Website (optional)</label>
          <input
            id="website"
            type="url"
            value={draft.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div className="adm-field">
          <label htmlFor="order">Order</label>
          <input
            id="order"
            type="number"
            value={draft.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
          <span className="adm-hint">Lower numbers appear first.</span>
        </div>

        <ImageUpload
          label="Logo"
          value={draft.logo}
          onChange={(url) => set("logo", url)}
          hint="Transparent PNG or SVG works best. Without a logo, the agency name is shown as text."
        />

        <div className="adm-field wide">
          <label className="adm-check">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published
          </label>
        </div>

        {error && <p className="adm-error wide">{error}</p>}

        <div className="adm-actions wide">
          <button className="adm-btn primary" type="button" onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button className="adm-btn" type="button" onClick={cancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Brands</h1>
          <p>The travel agencies shown in the logo grid.</p>
        </div>
        <button className="adm-btn primary" type="button" onClick={startCreate}>
          + Add agency
        </button>
      </div>

      {error && !draft && (
        <div className="adm-card" style={{ borderColor: "#b3261e", background: "#fff5f5", marginBottom: 20 }}>
          <p className="adm-error" style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {editingId === "new" && editor}

      {items.length === 0 && !draft && (
        <div className="adm-empty">No agencies yet. Add your first one.</div>
      )}

      {items.map((item) =>
        editingId === item.id ? (
          <div key={item.id}>{editor}</div>
        ) : (
          <div className="adm-card" key={item.id}>
            <div className="adm-row">
              <div className="adm-row-main" style={{ display: "flex", gap: 14 }}>
                {item.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="adm-thumb" src={item.logo} alt="" />
                )}
                <div>
                  <span className={`adm-pill ${item.published ? "on" : "off"}`}>
                    {item.published ? "Published" : "Draft"}
                  </span>
                  <p className="adm-meta" style={{ marginTop: 8 }}>
                    <strong style={{ fontSize: 16, color: "var(--ink)" }}>{item.name}</strong>
                  </p>
                  <p className="adm-meta">
                    {[item.location, item.website].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </div>
              <div className="adm-actions">
                <button className="adm-btn" type="button" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button
                  className="adm-btn"
                  type="button"
                  onClick={() => togglePublished(item)}
                  disabled={busy}
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  className="adm-btn danger"
                  type="button"
                  onClick={() => remove(item)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ),
      )}
    </>
  );
}
