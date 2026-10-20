"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav({ categories }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="p-2 text-[#0F1B2B] relative z-[60]"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-x-0 top-16 sm:top-20 z-50 flex flex-col gap-1 px-6 py-4 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
          style={{
            backgroundColor: "#F7F5F0",
            borderBottom: "1px solid #DAD5C8",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?cat=${cat.slug}`}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm transition-colors"
              style={{ color: "#5B6472", borderBottom: "1px solid rgba(218,213,200,0.6)" }}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="py-2.5 text-sm transition-colors"
            style={{ color: "#5B6472", borderBottom: "1px solid rgba(218,213,200,0.6)" }}
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="py-2.5 text-sm transition-colors"
            style={{ color: "#5B6472" }}
          >
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}
