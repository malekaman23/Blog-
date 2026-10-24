"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getReaderUser,
  getCachedReaderUser,
  getReaderToken,
  readerLogout,
  READER_AUTH_EVENT,
} from "../lib/readerAuth";

export default function AccountMenu() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function refresh() {
      if (!getReaderToken()) {
        setUser(null);
        return;
      }
      // Show the last known profile immediately, then confirm with the server.
      const cached = getCachedReaderUser();
      if (cached) setUser(cached);
      getReaderUser().then((u) => {
        // Keep the cached profile if the backend is just slow/unreachable.
        if (u || !getReaderToken()) setUser(u);
        else if (!cached) setUser(null);
      });
    }
    refresh();
    // The navbar stays mounted across page changes, so it must hear about
    // login/logout instead of only checking once on first load.
    window.addEventListener(READER_AUTH_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(READER_AUTH_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account"
        aria-expanded={open}
        className="p-2 text-[#0F1B2B] relative"
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.2 3.6-7.5 8-7.5s8 3.3 8 7.5" />
        </svg>
        {user && (
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#4C8C5A" }}
          />
        )}
      </button>

      {open && (
        <>
          {/* click-away layer */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-lg shadow-lg border z-50 overflow-hidden"
            style={{ backgroundColor: "#F7F5F0", borderColor: "#DAD5C8" }}
          >
            {user === undefined ? (
              <p className="px-4 py-3 text-sm" style={{ color: "#5B6472" }}>
                Checking…
              </p>
            ) : user ? (
              <div>
                <div className="px-4 py-3 border-b" style={{ borderColor: "#DAD5C8" }}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: "#5B6472" }}>
                    Signed in
                  </p>
                  {user.name && (
                    <p className="text-sm font-semibold truncate" style={{ color: "#0F1B2B" }}>
                      {user.name}
                    </p>
                  )}
                  <p className="text-xs truncate" style={{ color: "#5B6472" }}>
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    readerLogout();
                    setUser(null);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium"
                  style={{ color: "#A8311F" }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="py-1">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium"
                  style={{ color: "#0F1B2B" }}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium"
                  style={{ color: "#0F1B2B" }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
