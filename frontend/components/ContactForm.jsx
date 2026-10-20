"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-accent bg-accent-soft border border-accent-soft rounded-lg p-4">
        Message sent. We'll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="name">Name</label>
        <input
          id="name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-line rounded px-4 py-2.5 text-ink900 focus-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">Email</label>
        <input
          id="email" type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-line rounded px-4 py-2.5 text-ink900 focus-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="message">Message</label>
        <textarea
          id="message" required rows={5} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-line rounded px-4 py-2.5 text-ink900 focus-ring"
        />
      </div>
      <button
        type="submit" disabled={status === "sending"}
        className="inline-flex items-center rounded bg-accent text-white px-5 py-2.5 text-sm font-semibold hover:brightness-90 transition-colors focus-ring disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-700">Something went wrong — make sure the backend server is running.</p>
      )}
    </form>
  );
}
