"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set (post-approval),
 * so the site stays ad-free while you're still applying.
 *
 * Usage: <AdUnit slot="1234567890" />
 * Get the slot id from AdSense → Ads → By ad unit, after you create one there.
 */
export default function AdUnit({ slot, format = "auto", className = "" }) {
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle script not loaded yet (e.g. ad blocker) — fail silently
    }
  }, []);

  if (!ADSENSE_CLIENT) return null;

  return (
    <div ref={ref} className={`my-8 overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
