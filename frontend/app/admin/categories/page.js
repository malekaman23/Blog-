"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "../../../components/RequireAdmin";
import { authFetch } from "../../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    const res = await fetch(`${API_URL}/api/categories`);
    setCategories(await res.json());
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    try {
      const res = await authFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ slug, name: name.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Couldn't add category");
      }
      setName("");
      loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug) {
    if (!confirm(`Delete category "${slug}"? Existing articles keep this category name, but it won't show as a filter anymore.`)) return;
    const res = await authFetch(`/api/categories/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
    } else {
      alert("Couldn't delete — please try again.");
    }
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Data Science"
          required
          className="flex-1 border border-line bg-white rounded px-4 py-2.5 text-ink900 focus-ring"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded bg-accent text-white px-5 py-2.5 text-sm font-semibold hover:brightness-90 transition-colors focus-ring disabled:opacity-60"
        >
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-700 mb-4">{error}</p>}
      <div className="border border-line rounded-lg divide-y divide-line bg-white">
        {categories.map((c) => (
          <div key={c.slug} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-ink font-medium">{c.name}</p>
              <p className="text-xs text-muted">/{c.slug}</p>
            </div>
            <button onClick={() => handleDelete(c.slug)} className="text-sm font-semibold text-red-700">
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-muted px-5 py-4">No categories yet.</p>
        )}
      </div>
    </div>
  );
}

export default function AdminCategories() {
  return (
    <RequireAdmin>
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-1">Admin</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">Categories</h1>
        <CategoriesManager />
      </section>
    </RequireAdmin>
  );
}
