"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { readerLogin } from "../../lib/readerAuth";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await readerLogin(form);
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
      <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink900">Log in</h1>
      <p className="mt-2 text-sm text-muted">Log in to leave comments on articles.</p>

      <div className="mt-8">
        <GoogleSignInButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-ink900 mb-1.5" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-line rounded px-4 py-2.5 text-sm text-ink900 focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-ink900 mb-1.5" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
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
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Don't have an account?{" "}
        <Link href="/signup" className="font-semibold text-accent">Sign up</Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
