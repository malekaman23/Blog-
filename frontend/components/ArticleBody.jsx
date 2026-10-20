"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)$/i;

function resolveUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export default function ArticleBody({ content }) {
  const contentRef = useRef(null);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(
      contentRef.current.querySelectorAll("h2, h3")
    ).map((el) => ({
      id: el.id,
      text: el.textContent,
      level: el.tagName === "H2" ? 2 : 3,
    }));
    setToc(headings);

    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [content]);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 items-start">
      <div
        ref={contentRef}
        className="prose-article max-w-none text-base leading-relaxed text-slate"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeHighlight]}
          components={{
            img: ({ src = "", alt }) => {
              const resolved = resolveUrl(src);
              if (VIDEO_EXT.test(resolved)) {
                return (
                  <video
                    controls
                    playsInline
                    className="w-full my-6 border border-line bg-black"
                  >
                    <source src={resolved} />
                    Your browser does not support video playback.
                  </video>
                );
              }
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolved} alt={alt || ""} className="w-full my-6 border border-line" />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {toc.length > 0 && (
        <aside className="hidden lg:block sticky top-28 self-start border-l border-line pl-6">
          <p className="text-xs uppercase tracking-wide text-slate-soft mb-3">
            On this page
          </p>
          <nav className="space-y-2 text-sm">
            {toc.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={`block transition-colors ${
                  h.level === 3 ? "pl-3" : ""
                } ${
                  activeId === h.id
                    ? "text-signal font-medium"
                    : "text-slate-soft hover:text-ink"
                }`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
