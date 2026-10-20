import Link from "next/link";
import { getPosts } from "../lib/posts";
import { getSettings } from "../lib/settings";
import { getCategories } from "../lib/categories";
import ArticleCard from "../components/ArticleCard";
import NewsletterForm from "../components/NewsletterForm";
import AdSlot from "../components/AdSlot";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)$/i;

function resolveImageUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function categoryName(categories, slug) {
  const found = categories.find((c) => c.slug === slug);
  return found ? found.name : slug;
}

export default async function Home() {
  const posts = await getPosts();
  const settings = await getSettings();
  const categories = await getCategories();

  const featured = posts[0];
  const lead = posts[1] || posts[0];
  const gridPosts = posts.slice(2, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-[#EDE9DC] overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-10 items-center">
          <div>
            <p className="text-accent2 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              How money and machines actually work
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.12] md:leading-[1.07] mt-4 whitespace-pre-line">
              {settings.hero_heading}
            </h1>
            <p className="mt-4 text-base md:text-lg text-[#AEB4C2] max-w-[46ch] leading-relaxed">
              {settings.hero_subtext}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/blog" className="inline-flex items-center rounded-md bg-accent2 text-[#1A1206] px-5 py-3 text-sm font-bold hover:brightness-95 transition">
                Start reading
              </Link>
              <Link href="/blog" className="inline-flex items-center rounded-md border border-ink3 text-[#EDE9DC] px-5 py-3 text-sm font-semibold hover:bg-ink2 transition">
                Browse topics
              </Link>
            </div>
          </div>

          {featured && (() => {
            const featuredMedia = resolveImageUrl(featured.imageUrl);
            return (
              <Link href={`/blog/${featured.slug}`} className="group block focus-ring">
                <div
                  className="rounded-xl overflow-hidden relative shadow-2xl"
                  style={{
                    aspectRatio: "4/3",
                    background: featuredMedia
                      ? "#141A27"
                      : "radial-gradient(circle at 25% 20%, #3A4766 0%, transparent 45%), radial-gradient(circle at 80% 75%, #5C2A20 0%, transparent 50%), linear-gradient(160deg,#232E44,#141A27 70%)",
                  }}
                >
                  {featuredMedia && (
                    VIDEO_EXT.test(featuredMedia) ? (
                      <video muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover">
                        <source src={featuredMedia} />
                      </video>
                    ) : (
                      <img src={featuredMedia} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 bg-accent2 text-[#1A1206] text-[0.7rem] font-bold px-3 py-1.5 rounded">
                    {categoryName(categories, featured.category)}
                  </span>
                  <div className="absolute left-5 right-5 bottom-5">
                    <h3 className="text-white text-lg sm:text-xl font-display font-medium leading-snug group-hover:underline">
                      {featured.title}
                    </h3>
                    <span className="text-[#C6CAD4] text-sm block mt-2">{featured.readTime} min read</span>
                  </div>
                </div>
              </Link>
            );
          })()}
        </div>
      </section>

      {/* Ornamental divider */}
      <div className="bg-ink flex items-center justify-center gap-3.5 py-5">
        <span className="h-px w-16 bg-ink3" />
        <span className="w-1.5 h-1.5 bg-accent2 rotate-45" />
        <span className="h-px w-16 bg-ink3" />
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-11 grid md:grid-cols-[1fr_300px] gap-8 md:gap-11 items-start">
        <main>
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="font-display text-xl sm:text-2xl font-medium text-ink900">Latest</h2>
            <Link href="/blog" className="text-sm font-bold text-accent">View all →</Link>
          </div>

          {lead && (() => {
            const leadMedia = resolveImageUrl(lead.imageUrl);
            return (
            <Link href={`/blog/${lead.slug}`} className="group block mb-7 focus-ring">
              <article className="grid md:grid-cols-[1.1fr_1fr] gap-0 bg-card border border-line rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="min-h-[160px] md:min-h-[230px] bg-gradient-to-br from-accent2-soft to-paper2 relative">
                  {leadMedia ? (
                    VIDEO_EXT.test(leadMedia) ? (
                      <video muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover">
                        <source src={leadMedia} />
                      </video>
                    ) : (
                      <img src={leadMedia} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )
                  ) : (
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{ backgroundImage: "repeating-linear-gradient(115deg, rgba(168,49,31,.06) 0 2px, transparent 2px 9px)" }}
                    />
                  )}
                </div>
                <div className="p-5 sm:p-6 md:py-6 md:pr-7 flex flex-col justify-center">
                  <span className="inline-flex self-start text-[0.68rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded bg-accent2-soft text-accent2">
                    {categoryName(categories, lead.category)}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-medium leading-snug mt-2.5 text-ink900 group-hover:text-accent transition-colors">
                    {lead.title}
                  </h3>
                  <p className="text-muted text-[0.95rem] leading-relaxed mt-2.5">{lead.excerpt}</p>
                  <p className="text-[0.76rem] text-muted mt-3">{lead.readTime} min read</p>
                </div>
              </article>
            </Link>
            );
          })()}

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {gridPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} categoryLabel={categoryName(categories, post.category)} />
            ))}
          </div>
        </main>

        <aside>
          <div className="bg-card border border-line rounded-lg p-5 mb-5">
            <h4 className="font-display text-base font-semibold mb-4">Most read</h4>
            {posts.slice(0, 4).map((p, i) => (
              <div key={p.slug} className={`flex gap-3.5 items-start py-3 ${i > 0 ? "border-t border-line" : ""}`}>
                <span className="font-display text-xl font-semibold leading-none w-7 shrink-0 text-line">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <Link href={`/blog/${p.slug}`} className="text-[0.86rem] font-semibold leading-snug block hover:text-accent">
                    {p.title}
                  </Link>
                  <span className="text-[0.74rem] text-muted">{categoryName(categories, p.category)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-line rounded-lg p-5 mb-5">
            <h4 className="font-display text-base font-semibold mb-4">Browse by topic</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog?cat=${cat.slug}`}
                  className="text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-full bg-paper2 border border-line hover:border-accent2 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-ink to-ink2 text-[#EDE9DC] rounded-lg p-6">
            <h4 className="font-display text-lg font-medium text-white">One sharp read a week</h4>
            <p className="text-[0.83rem] text-[#AEB4C2] mt-2 mb-4 leading-relaxed">
              No noise, no "10 tips" listicles. Just the explainer and the build log, every Sunday.
            </p>
            <NewsletterForm />
          </div>

          <AdSlot slot="0000000002" />
        </aside>
      </div>
    </>
  );
}
