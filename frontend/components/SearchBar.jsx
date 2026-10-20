"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/blog?search=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Search articles"
        className="text-[#B7BDCB] hover:text-white transition-colors focus-ring p-2 rounded-full hover:bg-ink2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        autoFocus
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => !query && setOpen(false)}
        placeholder="Search articles…"
        className="border border-ink3 bg-ink2 text-[#EDE9DC] placeholder:text-[#6E7585] rounded-full px-4 py-2 text-sm w-40 sm:w-56 focus-ring"
      />
    </form>
  );
}
