"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "../../../components/RequireAdmin";
import { authFetch } from "../../../lib/auth";

function CommentsManager() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadComments() {
    setLoading(true);
    const res = await authFetch("/api/comments/all");
    if (res.ok) setComments(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, []);

  async function handleApprove(id) {
    const res = await authFetch(`/api/comments/${id}/approve`, { method: "PUT" });
    if (res.ok) {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, approved: true } : c)));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this comment permanently?")) return;
    const res = await authFetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>;
  if (comments.length === 0) return <p className="text-muted">No comments yet.</p>;

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  const renderComment = (c) => (
    <div key={c.id} className="flex items-start justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-ink">
          {c.name} <span className="text-xs text-muted font-normal">on /{c.post_slug}</span>
        </p>
        <p className="text-xs text-muted">{c.email}</p>
        <p className="text-xs text-muted mb-2">{new Date(c.created_at).toLocaleString()}</p>
        <p className="text-sm text-ink900">{c.content}</p>
      </div>
      <div className="flex gap-3 text-sm font-semibold shrink-0">
        {!c.approved && (
          <button onClick={() => handleApprove(c.id)} className="text-accent">
            Approve
          </button>
        )}
        <button onClick={() => handleDelete(c.id)} className="text-red-700">
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {pending.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-3">
            Pending approval ({pending.length})
          </p>
          <div className="border border-line rounded-lg divide-y divide-line bg-white">
            {pending.map(renderComment)}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-3">
          Approved ({approved.length})
        </p>
        <div className="border border-line rounded-lg divide-y divide-line bg-white">
          {approved.map(renderComment)}
        </div>
      </div>
    </div>
  );
}

export default function AdminComments() {
  return (
    <RequireAdmin>
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-1">Admin</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">Comments</h1>
        <CommentsManager />
      </section>
    </RequireAdmin>
  );
}
