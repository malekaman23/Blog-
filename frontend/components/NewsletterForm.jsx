"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Reusable email-capture form.
 *  - mode="newsletter" (default): plain subscribe box, shows a real
 *    subscriber count instead of a fake one.
 *  - mode="leadMagnet": same subscribe flow, but on success reveals a
 *    download button for `downloadUrl` instead of just a thank-you message.
 */
// localStorage flag so a browser that already subscribed once doesn't keep
// getting shown the subscribe form again on every page load/visit.
const SUBSCRIBED_KEY = "cc_newsletter_subscribed";

function alreadySubscribedLocally() {
  try {
    return localStorage.getItem(SUBSCRIBED_KEY) === "1";
  } catch {
    return false;
  }
}

function markSubscribedLocally() {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {}
}

export default function NewsletterForm({ mode = "newsletter", downloadUrl, buttonLabel }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Already subscribed from this browser before — skip straight to the
    // "done" state instead of showing the subscribe form again.
    if (alreadySubscribedLocally()) setStatus("done");

    if (mode !== "newsletter") return;
    fetch(`${API_URL}/api/newsletter/count`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setCount(data.count))
      .catch(() => {});
  }, [mode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      markSubscribedLocally();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    if (mode === "leadMagnet" && downloadUrl) {
      return (
        <div>
          <p className="text-sm" style={{ color: "#AEB4C2" }}>
            You're in — here's your download.
          </p>
          <a
            href={downloadUrl}
            download
            className="mt-3 inline-flex items-center rounded px-4 py-2.5 text-sm font-bold"
            style={{ backgroundColor: "#E7A23A", color: "#1A1206" }}
          >
            Download PDF
          </a>
        </div>
      );
    }
    return (
      <p className="text-sm" style={{ color: "#AEB4C2" }}>
        You're on the list — thanks for subscribing.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-ink3 bg-ink2 text-[#EDE9DC] placeholder:text-[#6E7585] rounded px-3 py-2.5 text-sm focus-ring"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-accent2 text-[#1A1206] rounded px-4 py-2.5 text-sm font-bold hover:brightness-95 transition disabled:opacity-60"
      >
        {status === "sending"
          ? "Joining…"
          : buttonLabel || (count !== null ? `Join ${count.toLocaleString()} readers` : "Subscribe")}
      </button>
      {status === "error" && <p className="text-xs text-red-400">Something went wrong — try again.</p>}
    </form>
  );
}
