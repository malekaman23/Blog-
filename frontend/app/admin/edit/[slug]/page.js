"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "../../../../components/RequireAdmin";
import PostForm from "../../../../components/PostForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function EditPostInner({ slug }) {
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setPost)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <p className="text-muted">Article not found.</p>;
  if (!post) return <p className="text-muted">Loading…</p>;

  return <PostForm initialPost={post} />;
}

export default function EditPost({ params }) {
  return (
    <RequireAdmin>
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-1">Admin</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">Edit article</h1>
        <EditPostInner slug={params.slug} />
      </section>
    </RequireAdmin>
  );
}
