"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Admin login</h1>
      <p className="text-sm text-muted mb-8">Sign in to manage articles.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line bg-white rounded px-4 py-2.5 text-ink900 focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line bg-white rounded px-4 py-2.5 text-ink900 focus-ring"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center bg-accent text-white rounded px-5 py-2.5 text-sm font-semibold hover:brightness-90 transition-colors focus-ring disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-xs text-muted">
        Default login: the email/password set by <code>ADMIN_EMAIL</code> / <code>ADMIN_PASSWORD</code> in the backend (see README).
      </p>
    </section>
  );
}
