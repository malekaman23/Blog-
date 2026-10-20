import { getPosts } from "../lib/posts";
import { getCategories } from "../lib/categories";

export default async function sitemap() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let posts = [];
  let categories = [];
  try {
    posts = await getPosts();
  } catch {
    posts = [];
  }
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.createdAt || post.created_at || undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((cat) => ({
    url: `${SITE_URL}/blog?cat=${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
