import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)$/i;

function resolveImageUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export default function ArticleCard({ post }) {
  const imageUrl = resolveImageUrl(post.imageUrl);

  return (
    <Link href={`/blog/${post.slug}`} className="group block focus-ring">
      <article className="border-t border-line pt-5 tilt-3d">
        {imageUrl && (
          <div className="mb-4 aspect-[16/9] overflow-hidden bg-line">
            {VIDEO_EXT.test(imageUrl) ? (
              <video
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              >
                <source src={imageUrl} />
              </video>
            ) : (
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            )}
          </div>
        )}
        <span className="text-signal text-xs font-medium uppercase tracking-wide">
          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
        </span>
        <h3 className="font-display text-xl mt-2 text-ink group-hover:text-signal transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-slate-soft">{post.excerpt}</p>
        <p className="mt-3 text-xs text-slate-soft">{post.readTime} min read</p>
      </article>
    </Link>
  );
}
