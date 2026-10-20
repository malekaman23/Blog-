"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { readerGoogleLogin } from "../lib/readerAuth";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return; // not configured yet — render nothing

    async function handleCredential(response) {
      try {
        await readerGoogleLogin(response.credential);
        const redirectTo = searchParams.get("redirect") || "/";
        router.push(redirectTo);
        router.refresh();
      } catch {
        // Silently ignore — the regular email/password form stays available.
      }
    }

    function init() {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
      });
    }

    if (window.google) {
      init();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.body.appendChild(script);

    return () => {
      // Leave the script in place — removing/re-adding it on every mount
      // (e.g. navigating between /login and /signup) can break the GSI
      // client; it's small and safe to keep loaded for the session.
    };
  }, [router, searchParams]);

  if (!CLIENT_ID) return null; // inert until GOOGLE_CLIENT_ID is configured

  return (
    <div className="flex flex-col items-center gap-3 mb-2">
      <div ref={buttonRef} />
      <div className="flex items-center gap-3 w-full">
        <span className="h-px flex-1" style={{ backgroundColor: "#DAD5C8" }} />
        <span className="text-xs" style={{ color: "#8A8F99" }}>or</span>
        <span className="h-px flex-1" style={{ backgroundColor: "#DAD5C8" }} />
      </div>
    </div>
  );
}
