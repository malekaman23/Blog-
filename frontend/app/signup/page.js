"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { readerSignup } from "../../lib/readerAuth";
import GoogleSignInButton from "../../components/GoogleSignInButton";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await readerSignup(form);
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-sm mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink900">Create an account</h1>
      <p className="mt-2 text-sm text-muted">
        Only needed to leave comments — reading every article is always free, no account required.
      </p>

      <div className="mt-8">
        <GoogleSignInButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-ink900 mb-1.5" htmlFor="name">Display name</label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Shown on your comments"
            className="w-full border border-line rounded px-4 py-2.5 text-sm text-ink900 focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-ink900 mb-1.5" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Never shown publicly"
            className="w-full border border-line rounded px-4 py-2.5 text-sm text-ink900 focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-ink900 mb-1.5" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-line rounded px-4 py-2.5 text-sm text-ink900 focus-ring"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded px-5 py-3 text-sm font-bold disabled:opacity-60"
          style={{ backgroundColor: "#0F1B2B", color: "#F7F5F0" }}
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent">Log in</Link>
      </p>
    </section>
  );
}
