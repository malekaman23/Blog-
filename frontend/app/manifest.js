import { getSettings } from "../lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function resolveUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

// Dynamic so the admin-uploaded logo (Settings page) is also used as the
// app icon if someone installs the site (e.g. pinned to a taskbar/home screen).
export default async function manifest() {
  const settings = await getSettings().catch(() => null);
  const logoUrl = resolveUrl(settings?.logo_url) || "/icon.png";
  const siteName = settings?.site_name || "Compound & Compile";

  return {
    name: siteName,
    short_name: siteName.length > 12 ? siteName.slice(0, 12) : siteName,
    description: settings?.tagline || "Finance you can model. Tech you can rebuild.",
    start_url: "/",
    display: "standalone",
    background_color: "#141A27",
    theme_color: "#141A27",
    icons: [
      {
        src: logoUrl,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: logoUrl,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
