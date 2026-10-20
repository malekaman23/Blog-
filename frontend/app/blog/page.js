import { getPosts } from "../../lib/posts";
import { getCategories } from "../../lib/categories";
import ArticleCard from "../../components/ArticleCard";

export const metadata = { title: "All Articles" };

export default async function Blog({ searchParams }) {
  const posts = await getPosts();
  const categories = await getCategories();
  const cat = searchParams?.cat;
  const search = searchParams?.search?.toLowerCase();

  let filtered = posts;
  if (cat) filtered = filtered.filter((p) => p.category === cat);
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.excerpt.toLowerCase().includes(search)
    );
  }

  const activeCategory = categories.find((c) => c.slug === cat);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <p className="text-[0.7rem] uppercase tracking-[0.12em] font-bold text-accent mb-1">
        {search ? `Search: "${searchParams.search}"` : activeCategory ? activeCategory.name : "All articles"}
      </p>
      <h1 className="font-display text-3xl font-medium text-ink900 mb-8">
        {search
          ? `Results for "${searchParams.search}"`
          : activeCategory
          ? `${activeCategory.name}, explained plainly`
          : "Every article, in one place"}
      </h1>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* Sidebar */}
        <aside className="mb-8 lg:mb-0">
          <div className="border border-line rounded-lg bg-card p-4 sticky top-24">
            <p className="text-[0.7rem] uppercase tracking-[0.1em] font-bold text-accent mb-3">Topics</p>
            <nav className="space-y-1 text-sm">
              <a
                href="/blog"
                className={`block rounded px-3 py-2 font-medium transition-colors ${
                  !cat ? "bg-ink text-[#EDE9DC]" : "text-muted hover:bg-paper2"
                }`}
              >
                All articles
              </a>
              {categories.map((c) => (
                <a
                  key={c.slug}
                  href={`/blog?cat=${c.slug}`}
                  className={`block rounded px-3 py-2 font-medium transition-colors ${
                    cat === c.slug ? "bg-ink text-[#EDE9DC]" : "text-muted hover:bg-paper2"
                  }`}
                >
                  {c.name}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Article grid */}
        <div>
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((post) => (
              <ArticleCard key={post.slug} post={post} categoryLabel={categories.find((c) => c.slug === post.category)?.name} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-muted">No articles found — try a different topic or search.</p>
          )}
        </div>
      </div>
    </section>
  );
}
