import Link from "next/link";
import { getSettings } from "../lib/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function resolveUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export default async function Footer() {
  const settings = await getSettings();
  const logoUrl = resolveUrl(settings.logo_url);

  return (
    <footer className="border-t border-line bg-parchment mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-14 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 md:gap-10 text-sm">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-display text-lg md:text-xl text-ink">
            {logoUrl && (
              <img
                src={logoUrl}
                alt={`${settings.site_name} logo`}
                className="h-6 w-6 md:h-7 md:w-7 object-contain shrink-0"
              />
            )}
            {settings.site_name}
          </Link>
          <p className="mt-2 text-xs md:text-sm text-slate-soft max-w-[26ch] md:max-w-xs">
            {settings.tagline}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-soft mb-2 md:mb-3">
            Site
          </p>
          <ul className="space-y-1.5 md:space-y-2">
            <li>
              <Link href="/about" className="text-slate-soft hover:text-ink transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-slate-soft hover:text-ink transition-colors">
                All articles
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-soft hover:text-ink transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-soft mb-2 md:mb-3">
            Legal
          </p>
          <ul className="space-y-1.5 md:space-y-2">
            <li>
              <Link href="/privacy" className="text-slate-soft hover:text-ink transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-slate-soft hover:text-ink transition-colors">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-3 md:py-4 text-xs text-slate-soft">
          © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
