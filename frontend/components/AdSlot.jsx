"use client";

import { useEffect, useRef } from "react";

// AdSense client ID, e.g. "ca-pub-1234567890123456" — set this in .env.local
// AFTER your AdSense account is approved. Until it's set, this component
// renders nothing, so there's no broken/empty ad box on the live site.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

/**
 * Drop-in AdSense ad unit. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT_ID
 * is set AND you've created a matching ad slot in your AdSense dashboard.
 *
 * Usage: <AdSlot slot="1234567890" />
 * (the `slot` id comes from AdSense > Ads > By ad unit, after approval)
 */
export default function AdSlot({ slot, format = "auto", className = "" }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not loaded yet / blocked by an ad blocker — fail silently.
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <p className="text-[10px] uppercase tracking-wide text-slate-soft mb-1">Advertisement</p>
      <ins
        ref={insRef}
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
