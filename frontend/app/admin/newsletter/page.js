"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "../../../components/RequireAdmin";
import { authFetch } from "../../../lib/auth";

function SubscribersManager() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/newsletter/subscribers")
      .then((res) => (res.ok ? res.json() : []))
      .then(setSubs)
      .finally(() => setLoading(false));
  }, []);

  function downloadCsv() {
    const rows = ["email,subscribed_at", ...subs.map((s) => `${s.email},${s.created_at}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted">{subs.length} subscriber{subs.length === 1 ? "" : "s"}</p>
        {subs.length > 0 && (
          <button
            onClick={downloadCsv}
            className="text-sm font-semibold px-3 py-1.5 rounded border border-line"
          >
            Export CSV
          </button>
        )}
      </div>

      {subs.length === 0 ? (
        <p className="text-muted">
          No subscribers yet. This fills up as people sign up on the homepage or the{" "}
          <code>/resources</code> free-download page.
        </p>
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white">
          {subs.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3">
              <p className="text-sm text-ink900">{s.email}</p>
              <p className="text-xs text-muted">{new Date(s.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        This is your own list, stored in your database — nothing is sent automatically yet.
        Export the CSV and import it into a tool like Mailchimp or Brevo (both have free tiers)
        whenever you're ready to actually send a weekly email.
      </p>
    </div>
  );
}

export default function AdminNewsletter() {
  return (
    <RequireAdmin>
      <section className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-1">Admin</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">Newsletter subscribers</h1>
        <SubscribersManager />
      </section>
    </RequireAdmin>
  );
}
