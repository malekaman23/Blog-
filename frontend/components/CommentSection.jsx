"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReaderUser, readerFetch } from "../lib/readerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CommentSection({ slug }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("idle");
  const [user, setUser] = useState(undefined); // undefined = still checking, null = logged out

  async function loadComments() {
    const res = await fetch(`${API_URL}/api/comments?post_slug=${slug}`);
    if (res.ok) setComments(await res.json());
  }

  useEffect(() => {
    loadComments();
    getReaderUser().then(setUser);
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    // Not logged in — send them to log in instead of letting the post fail,
    // and bring them straight back to this article afterward.
    if (!user) {
      router.push(`/login?redirect=/blog/${slug}`);
      return;
    }
    setStatus("sending");
    try {
      const res = await readerFetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({ post_slug: slug, content }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setContent("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mt-14 border-t border-line pt-8">
      <h2 className="font-display text-xl font-bold text-ink mb-5">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {comments.length > 0 && (
        <div className="space-y-5 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="border border-line rounded-lg p-4 bg-paper2">
              <p className="text-sm font-semibold text-ink">{c.name}</p>
              <p className="text-xs text-muted mb-2">{new Date(c.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-ink900 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {status === "sent" ? (
        <p className="text-accent bg-accent-soft border border-accent-soft rounded-lg text-sm p-4">
          Thanks — your comment is awaiting approval and will appear once reviewed.
        </p>
      ) : user === undefined ? (
        <p className="text-sm text-muted">Checking login…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Your comment"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-line rounded px-4 py-2.5 text-sm text-ink900 focus-ring"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center rounded bg-accent text-white px-5 py-2.5 text-sm font-semibold hover:brightness-90 transition-colors focus-ring disabled:opacity-60"
          >
            {status === "sending" ? "Posting…" : "Post comment"}
          </button>
          {status === "error" && <p className="text-sm text-red-700">Something went wrong — try again.</p>}
        </form>
      )}
    </section>
  );
}
