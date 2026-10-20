// Reader-facing auth — completely separate from the admin login (lib/auth.js).
// Stored under its own localStorage key so a reader session and an admin
// session in the same browser never collide. Used only for commenting;
// reading articles never requires this.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const READER_TOKEN_KEY = "reader_token";

export function getReaderToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(READER_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setReaderToken(token) {
  try {
    localStorage.setItem(READER_TOKEN_KEY, token);
  } catch {}
}

export function readerLogout() {
  try {
    localStorage.removeItem(READER_TOKEN_KEY);
  } catch {}
}

export async function readerSignup({ email, password, name }) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Could not create account");
  setReaderToken(data.access_token);
  return data;
}

export async function readerLogin({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Incorrect email or password");
  setReaderToken(data.access_token);
  return data;
}

// "Continue with Google" — credential is the ID token Google's own script
// hands back in the browser. The backend verifies it and returns a normal
// token, same as readerLogin/readerSignup.
export async function readerGoogleLogin(credential) {
  const res = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Google sign-in failed");
  setReaderToken(data.access_token);
  return data;
}

// Fetches the logged-in reader's profile (email, name). Returns null if not
// logged in or the token is no longer valid.
export async function getReaderUser() {
  const token = getReaderToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 401) readerLogout();
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

// Authenticated fetch helper for reader-only actions (posting a comment).
export async function readerFetch(path, options = {}) {
  const token = getReaderToken();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}
