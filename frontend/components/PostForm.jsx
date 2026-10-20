"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authFetch, getToken } from "../lib/auth";
import { getCategories } from "../lib/categories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)$/i;

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

export default function PostForm({ initialPost = null }) {
  const router = useRouter();
  const isEdit = !!initialPost;
  const [form, setForm] = useState(
    initialPost || {
      slug: "",
      title: "",
      category: "finance",
      excerpt: "",
      pullQuote: "",
      content: "",
      imageUrl: "",
      readTime: 5,
      sourceName: "",
      sourceUrl: "",
      resourcePdfUrl: "",
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaProgress, setMediaProgress] = useState("");
  const [categories, setCategories] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        setCategories(cats);
        // If the form's current category doesn't actually exist (e.g. it's
        // still the "finance" default but you've only created a "Data
        // Science" category), snap it to the first real category instead of
        // silently saving a category that was never really selected.
        if (cats.length > 0) {
          setForm((f) =>
            cats.some((c) => c.slug === f.category) ? f : { ...f, category: cats[0].slug }
          );
        }
      })
      .catch(() => setCategories([]));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Cover media — shown on homepage cards and at the top of the article, like a thumbnail
  async function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    setError("");
    try {
      const data = await uploadFile(file);
      update("imageUrl", data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setCoverUploading(false);
      e.target.value = "";
    }
  }

  // Per-post PDF — a cheat-sheet or extended version of THIS article, gated
  // behind the email-subscribe form that shows at the bottom of the post.
  async function handlePdfChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfUploading(true);
    setError("");
    try {
      const data = await uploadFile(file);
      update("resourcePdfUrl", data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setPdfUploading(false);
      e.target.value = "";
    }
  }

  // Multiple photos/videos to drop inline into the article content
  async function handleMediaFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setMediaUploading(true);
    setError("");

    const textarea = contentRef.current;
    let cursor = textarea ? textarea.selectionStart ?? form.content.length : form.content.length;
    let insertedBlock = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setMediaProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
      try {
        const data = await uploadFile(file);
        const url = resolveUrl(data.url);
        const isVideo = VIDEO_EXT.test(url) || file.type.startsWith("video/");
        const altText = file.name.replace(/\.[^/.]+$/, "");
        insertedBlock += `\n\n![${isVideo ? "video: " : ""}${altText}](${data.url})\n\n`;
      } catch (err) {
        setError(`"${file.name}" failed: ${err.message}`);
      }
    }

    setForm((f) => {
      const before = f.content.slice(0, cursor);
      const after = f.content.slice(cursor);
      return { ...f, content: before + insertedBlock + after };
    });

    setMediaUploading(false);
    setMediaProgress("");
    e.target.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await authFetch(
        isEdit ? `/api/posts/${initialPost.slug}` : "/api/posts",
        {
          method: isEdit ? "PUT" : "POST",
          body: JSON.stringify({ ...form, readTime: Number(form.readTime) }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Something went wrong");
      }
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const coverUrl = resolveUrl(form.imageUrl);
  const coverIsVideo = coverUrl && VIDEO_EXT.test(coverUrl);
  const busy = saving || coverUploading || mediaUploading || pdfUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {!isEdit && (
        <div>
          <label className="block text-sm text-ink mb-2" htmlFor="slug">
            URL slug (e.g. best-savings-accounts-2026)
          </label>
          <input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => update("slug", e.target.value.trim().toLowerCase().replace(/\s+/g, "-"))}
            className="w-full border border-line bg-transparent px-4 py-3 text-slate focus-ring"
          />
        </div>
      )}
      <div>
        <label className="block text-sm text-ink mb-2" htmlFor="title">Title</label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-slate focus-ring"
        />
      </div>
      <div>
        <label className="block text-sm text-ink mb-2" htmlFor="category">Category</label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full border border-line bg-parchment px-4 py-3 text-slate focus-ring"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Cover thumbnail — this is what shows on homepage cards + top of the article */}
      <div>
        <label className="block text-sm text-ink mb-2" htmlFor="cover">
          Cover photo or video (thumbnail)
        </label>
        <p className="text-xs text-slate-soft mb-3">
          This is what appears on your homepage, the blog listing, and at the top of the article —
          like a YouTube thumbnail. Supports images or a short video.
        </p>
        {coverUrl && (
          <div className="mb-3 aspect-[16/9] w-full max-w-xs overflow-hidden bg-line border border-line">
            {coverIsVideo ? (
              <video src={coverUrl} controls muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
            )}
          </div>
        )}
        <input
          id="cover"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif, video/mp4, video/webm, video/quicktime"
          onChange={handleCoverChange}
          disabled={coverUploading}
          className="w-full border border-line bg-transparent px-4 py-3 text-slate text-sm focus-ring disabled:opacity-60"
        />
        {coverUploading && <p className="mt-2 text-xs text-slate-soft">Uploading cover…</p>}
        {coverUrl && !coverUploading && (
          <button
            type="button"
            onClick={() => update("imageUrl", "")}
            className="mt-2 text-xs text-red-700 border-b border-red-700"
          >
            Remove cover
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm text-ink mb-2" htmlFor="excerpt">Excerpt (short summary)</label>
        <textarea
          id="excerpt"
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-slate focus-ring"
        />
      </div>
      <div>
        <label className="block text-sm text-ink mb-2" htmlFor="pullQuote">Pull quote (short, memorable line)</label>
        <input
          id="pullQuote"
          required
          value={form.pullQuote}
          onChange={(e) => update("pullQuote", e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-slate focus-ring"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm text-ink" htmlFor="content">
            Full article content (Markdown — ## for headings, ```code``` for code blocks)
          </label>
        </div>

        {/* Multi-file uploader for photos/videos INSIDE the article */}
        <div className="mb-3 border border-dashed border-line p-3">
          <label className="block text-xs text-ink mb-2" htmlFor="media">
            Add photos or videos into the article — select one or many at once. Each one is
            uploaded and automatically inserted into the content box below at your cursor.
          </label>
          <input
            id="media"
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp, image/gif, video/mp4, video/webm, video/quicktime"
            onChange={handleMediaFiles}
            disabled={mediaUploading}
            className="w-full border border-line bg-transparent px-3 py-2 text-slate text-sm focus-ring disabled:opacity-60"
          />
          {mediaUploading && (
            <p className="mt-2 text-xs text-slate-soft">{mediaProgress || "Uploading…"}</p>
          )}
        </div>

        <textarea
          id="content"
          ref={contentRef}
          required
          rows={14}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          className="w-full border border-line bg-transparent px-4 py-3 text-slate focus-ring font-mono text-sm"
        />
      </div>

      <div className="border border-line p-4">
        <p className="text-sm text-ink mb-1">Publisher / Source link (optional)</p>
        <p className="text-xs text-slate-soft mb-3">
          Use this for an affiliate link or to credit an external source/tool. It shows as a
          small box at the end of the article — e.g. "Mentioned: Coursera". Leave both blank to
          skip it.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Publisher / source name (e.g. Coursera)"
            value={form.sourceName || ""}
            onChange={(e) => update("sourceName", e.target.value)}
            className="w-full border border-line bg-transparent px-4 py-2.5 text-sm text-slate focus-ring"
          />
          <input
            placeholder="https://... (affiliate or source URL)"
            value={form.sourceUrl || ""}
            onChange={(e) => update("sourceUrl", e.target.value)}
            className="w-full border border-line bg-transparent px-4 py-2.5 text-sm text-slate focus-ring"
          />
        </div>
      </div>

      <div className="border border-line p-4">
        <p className="text-sm text-ink mb-1">Free PDF for this article (optional)</p>
        <p className="text-xs text-slate-soft mb-3">
          Upload a cheat-sheet, checklist, or extended version of THIS article. Readers unlock it
          by entering their email at the bottom of the post — great for building your newsletter list.
        </p>
        {form.resourcePdfUrl && (
          <p className="text-xs text-ink900 mb-2 break-all">
            Current file: <span className="text-accent">{form.resourcePdfUrl}</span>
          </p>
        )}
        <input
          id="resourcePdf"
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          disabled={pdfUploading}
          className="w-full border border-line bg-transparent px-4 py-3 text-slate text-sm focus-ring disabled:opacity-60"
        />
        {pdfUploading && <p className="mt-2 text-xs text-slate-soft">Uploading PDF…</p>}
        {form.resourcePdfUrl && !pdfUploading && (
          <button
            type="button"
            onClick={() => update("resourcePdfUrl", "")}
            className="mt-2 text-xs text-red-700 border-b border-red-700"
          >
            Remove PDF
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm text-ink mb-2" htmlFor="readTime">Read time (minutes)</label>
        <input
          id="readTime"
          type="number"
          min="1"
          value={form.readTime}
          onChange={(e) => update("readTime", e.target.value)}
          className="w-32 border border-line bg-transparent px-4 py-3 text-slate focus-ring"
        />
      </div>

      {error && (
        <p className="text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center rounded-none px-5 py-3 text-sm font-medium transition-colors focus-ring disabled:opacity-60"
        style={{ backgroundColor: "#0F1B2B", color: "#F7F5F0" }}
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Publish article"}
      </button>
    </form>
  );
}
