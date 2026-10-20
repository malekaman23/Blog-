"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cc_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      // localStorage unavailable (private mode etc.) — just show the banner
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {}
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[100] border-t"
      style={{ backgroundColor: "#141A27", borderColor: "#2A3448" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="text-sm flex-1" style={{ color: "#C6CAD4" }}>
          We use cookies to improve your experience and show relevant ads (via Google AdSense).
          By continuing to use this site, you agree to our{" "}
          <Link href="/privacy" className="underline" style={{ color: "#EDE9DC" }}>
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm font-medium rounded"
            style={{ backgroundColor: "transparent", color: "#C6CAD4", border: "1px solid #2A3448" }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-bold rounded"
            style={{ backgroundColor: "#E7A23A", color: "#1A1206" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
