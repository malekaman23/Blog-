import Link from "next/link";
import { getSettings } from "../lib/settings";
import { getCategories } from "../lib/categories";
import SearchBar from "./SearchBar";
import MobileNav from "./MobileNav";
import AccountMenu from "./AccountMenu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function resolveUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export default async function Navbar() {
  const settings = await getSettings();
  const categories = await getCategories();
  const logoUrl = resolveUrl(settings.logo_url);

  return (
    <header className="border-b border-line bg-parchment/95 backdrop-blur relative z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl sm:text-2xl tracking-tight text-ink focus-ring"
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${settings.site_name} logo`}
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0"
            />
          )}
          {settings.site_name}
        </Link>
        <nav className="hidden md:flex items-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?cat=${cat.slug}`}
              className="text-sm text-slate-soft hover:text-ink transition-colors focus-ring whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/about" className="text-sm text-slate-soft hover:text-ink transition-colors focus-ring whitespace-nowrap">
            About
          </Link>
          <Link href="/contact" className="text-sm text-slate-soft hover:text-ink transition-colors focus-ring whitespace-nowrap">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <SearchBar />
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center rounded-none border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-[#0F1B2B] hover:text-[#F7F5F0] transition-colors focus-ring"
          >
            Read the blog
          </Link>
          <AccountMenu />
          <MobileNav categories={categories} />
        </div>
      </div>
    </header>
  );
}
