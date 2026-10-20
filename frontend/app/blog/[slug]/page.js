import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPosts } from "../../../lib/posts";
import CommentSection from "../../../components/CommentSection";
import ArticleBody from "../../../components/ArticleBody";
import NewsletterForm from "../../../components/NewsletterForm";
import AdSlot from "../../../components/AdSlot";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)$/i;

function resolveImageUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const imageUrl = resolveImageUrl(post.imageUrl);
  return {
    title: `${post.title} — Compound & Compile`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();
  const imageUrl = resolveImageUrl(post.imageUrl);
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Automatic internal linking — same-category posts first, filling in with
  // the most recent others if there aren't 3 in the same category yet.
  const allPosts = await getPosts().catch(() => []);
  const sameCategory = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const related = [...sameCategory, ...others].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: post.createdAt || post.created_at || undefined,
    author: { "@type": "Organization", name: "Compound & Compile" },
    publisher: { "@type": "Organization", name: "Compound & Compile" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <article className="max-w-5xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-slate-soft border-b border-line">
        ← Back to all articles
      </Link>
      <p className="text-signal text-sm font-medium mt-8">
        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
      </p>
      <h1 className="font-display text-4xl mt-3 text-ink leading-tight max-w-3xl">
        {post.title}
      </h1>
      <p className="mt-4 text-sm text-slate-soft">{post.readTime} min read</p>
      {/* Cover photo is used for the homepage thumbnail + SEO/share preview only —
          it is intentionally NOT repeated here. Whatever photos/videos you add
          inside the article content itself show below, in place. */}
      <p className="mt-8 text-lg text-slate-soft border-l-2 border-gold pl-6 max-w-3xl">
        {post.pullQuote}
      </p>

      <ArticleBody content={post.content} />

      <div className="max-w-3xl mt-10">
        <AdSlot slot="0000000001" />
      </div>

      {post.sourceUrl && (
        <div className="max-w-3xl mt-10 border border-line rounded-lg p-4 bg-paper2">
          <p className="text-xs text-muted">
            Mentioned in this article:{" "}
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="font-semibold text-accent"
            >
              {post.sourceName || post.sourceUrl}
            </a>
            . This may be an affiliate link — it costs you nothing extra and can support this site.
          </p>
        </div>
      )}

      {post.resourcePdfUrl && (
        <div className="max-w-3xl mt-10 bg-gradient-to-br from-ink to-ink2 text-[#EDE9DC] rounded-lg p-6">
          <p className="font-display text-lg font-medium text-white">Get the free PDF for this article</p>
          <p className="text-[0.83rem] mt-2 mb-4 leading-relaxed" style={{ color: "#AEB4C2" }}>
            A cheat-sheet / extended version of this post — enter your email to unlock the download.
          </p>
          <div className="max-w-xs">
            <NewsletterForm
              mode="leadMagnet"
              downloadUrl={resolveImageUrl(post.resourcePdfUrl)}
              buttonLabel="Get the free PDF"
            />
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="max-w-3xl mt-14 pt-10 border-t border-line">
          <h2 className="font-display text-lg font-semibold text-ink900 mb-5">Related articles</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                <p className="text-xs font-bold uppercase tracking-wide text-accent2">{p.category}</p>
                <p className="text-sm font-semibold text-ink900 leading-snug mt-1.5 group-hover:text-accent transition-colors">
                  {p.title}
                </p>
                <p className="text-xs text-muted mt-1.5">{p.readTime} min read</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl">
        <CommentSection slug={post.slug} />
      </div>
    </article>
    </>
  );
}
