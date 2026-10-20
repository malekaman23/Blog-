"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireAdmin from "../../components/RequireAdmin";
import { authFetch, clearToken } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function Dashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/posts`);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(slug) {
    if (!confirm(`Delete "${slug}"? This can't be undone.`)) return;
    const res = await authFetch(`/api/posts/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      alert("Couldn't delete — please try again.");
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/admin/login");
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-1">Admin</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Manage articles</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/comments"
            className="inline-flex items-center rounded border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors focus-ring"
          >
            Comments
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center rounded border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors focus-ring"
          >
            Categories
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center rounded border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors focus-ring"
          >
            Site settings
          </Link>
          <Link
            href="/admin/new"
            className="inline-flex items-center rounded bg-accent text-white px-4 py-2 text-sm font-semibold hover:brightness-90 transition-colors focus-ring"
          >
            + New article
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center rounded border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink transition-colors focus-ring"
          >
            Log out
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-muted">No articles yet — create your first one.</p>
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white">
          {posts.map((post) => (
            <div key={post.slug} className="flex items-center justify-between px-5 py-4">
              <div>
                <span className="inline-flex items-center rounded bg-accent-soft text-accent text-xs font-semibold px-2 py-0.5 mb-1">
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </span>
                <p className="font-display text-base font-semibold text-ink">{post.title}</p>
                <p className="text-xs text-muted">/{post.slug}</p>
              </div>
              <div className="flex gap-4 text-sm font-semibold shrink-0">
                <Link href={`/admin/edit/${post.slug}`} className="text-accent">
                  Edit
                </Link>
                <button onClick={() => handleDelete(post.slug)} className="text-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminPage() {
  return (
    <RequireAdmin>
      <Dashboard />
    </RequireAdmin>
  );
}
