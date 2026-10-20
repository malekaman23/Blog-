"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "../../../components/RequireAdmin";
import { authFetch, getToken } from "../../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function resolveUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

async function uploadFile(file) {
  const body = new FormData();
  body.append("file", file);
  const token = getToken();
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `Upload failed for "${file.name}"`);
  }
  return res.json();
}

const FIELDS = [
  { key: "site_name", label: "Site name", type: "input" },
  { key: "tagline", label: "Tagline", type: "input" },
  { key: "hero_heading", label: "Homepage hero heading", type: "textarea", rows: 2 },
  { key: "hero_subtext", label: "Homepage hero subtext", type: "textarea", rows: 3 },
  { key: "about_content", label: "About page — main description", type: "textarea", rows: 4 },
  { key: "author_name", label: "Author name (shown on About page)", type: "input" },
  { key: "author_bio", label: "Author bio (shown on About page)", type: "textarea", rows: 4 },
  { key: "contact_email", label: "Contact email", type: "input" },
  { key: "footer_tagline", label: "Footer tagline", type: "textarea", rows: 2 },
];

function SettingsManager() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((res) => res.json())
      .then(setForm)
      .catch(() => setError("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError("");
    try {
      const data = await uploadFile(file);
      update("logo_url", data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await authFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not save settings");
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>;
  if (!form) return <p className="text-red-700">{error || "Could not load settings"}</p>;

  const logoUrl = resolveUrl(form.logo_url);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="border border-line p-4">
        <p className="text-sm text-ink mb-1">Site logo</p>
        <p className="text-xs text-slate-soft mb-3">
          Shows in the navbar next to the site name, as the browser tab icon (favicon), and as the
          app icon if someone installs the site. A square image works best (PNG, transparent background).
        </p>
        {logoUrl && (
          <div className="mb-3 w-16 h-16 overflow-hidden border border-line bg-paper2 flex items-center justify-center">
            <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
          </div>
        )}
        <input
          id="logo"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml, image/x-icon"
          onChange={handleLogoChange}
          disabled={logoUploading}
          className="w-full border border-line bg-transparent px-4 py-3 text-slate text-sm focus-ring disabled:opacity-60"
        />
        {logoUploading && <p className="mt-2 text-xs text-slate-soft">Uploading logo…</p>}
        {logoUrl && !logoUploading && (
          <button
            type="button"
            onClick={() => update("logo_url", "")}
            className="mt-2 text-xs text-red-700 border-b border-red-700"
          >
            Remove logo
          </button>
        )}
      </div>

      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="block text-sm text-ink mb-2" htmlFor={f.key}>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              id={f.key}
              rows={f.rows || 3}
              value={form[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
              className="w-full border border-line bg-transparent px-4 py-3 text-slate focus-ring"
            />
          ) : (
            <input
              id={f.key}
              value={form[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
              className="w-full border border-line bg-transparent px-4 py-3 text-slate focus-ring"
            />
          )}
        </div>
      ))}

      {error && <p className="text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">{error}</p>}
      {saved && <p className="text-sm text-accent">Saved.</p>}

      <button
        type="submit"
        disabled={saving || logoUploading}
        className="inline-flex items-center rounded-none px-5 py-3 text-sm font-medium transition-colors focus-ring disabled:opacity-60"
        style={{ backgroundColor: "#0F1B2B", color: "#F7F5F0" }}
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

export default function AdminSettings() {
  return (
    <RequireAdmin>
      <section className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-1">Admin</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">Site settings</h1>
        <p className="text-sm text-muted mb-8">
          Controls the homepage hero text, footer, and the About page — including the author name
          and bio.
        </p>
        <SettingsManager />
      </section>
    </RequireAdmin>
  );
}
