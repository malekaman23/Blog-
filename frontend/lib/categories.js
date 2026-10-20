const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_CATEGORIES = [
  { slug: "personal-finance", name: "Personal Finance" },
  { slug: "machine-learning", name: "Machine Learning" },
  { slug: "market-analysis", name: "Market Analysis" },
  { slug: "build-logs", name: "Build Logs" },
  { slug: "data-science", name: "Data Science" },
];

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}
