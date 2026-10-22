import Script from "next/script";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";
import { getSettings } from "../lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function resolveUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

// Settings come from our own backend, which can be slow to wake up (free
// hosting tiers spin down when idle) or briefly unreachable. Never let that
// block a page load or a build — give it a few seconds, then fall back to
// defaults instead of hanging.
function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), ms)),
  ]).catch(() => null);
}

// Pages here pull live data from our backend (settings, posts, categories),
// so they're rendered per-request rather than baked in at build time — that
// also means a deploy never has to wait on the backend being reachable.
export const dynamic = "force-dynamic";

// Dynamic so the admin-uploaded logo (Settings page) becomes the browser tab
// favicon everywhere, without needing a code change/redeploy.
export async function generateMetadata() {
  const settings = await withTimeout(getSettings());
  const logoUrl = resolveUrl(settings?.logo_url);

  return {
    title: `${settings?.site_name || "Compound & Compile"} — Finance you can model. Tech you can rebuild.`,
    description:
      "Explainers broken down to the actual mechanics, plus the build logs from shipping small finance and ML projects that came out of asking \"how does this really work.\"",
    icons: logoUrl
      ? { icon: logoUrl, shortcut: logoUrl, apple: logoUrl }
      : undefined,
  };
}

// Only set this AFTER your AdSense account is approved (ca-pub-XXXXXXXXXXXXXXXX).
// Until then this stays empty and no ad script is loaded at all.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
