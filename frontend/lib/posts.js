const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SAMPLE_POSTS = [
  {
    slug: "inside-a-neural-network",
    title: "Inside a Neural Network: What Actually Happens When You Hit Enter",
    category: "machine-learning",
    excerpt: "Tracing one prompt through tokens, weights and a softmax layer — with the matrix math laid out, not hand-waved.",
    pullQuote: "The model never sees your words. From the first layer onward, everything is a vector of numbers.",
    readTime: 11,
    mediaType: "image",
    content: "Every chat reply starts the same way: your sentence gets cut into small pieces, and from there it's matrix multiplication the whole way down.",
  },
  {
    slug: "sip-vs-lump-sum-data",
    title: "The SIP vs Lump Sum Debate, Settled With Data",
    category: "personal-finance",
    excerpt: "Fifteen years of Nifty 500 rolling returns, run through both strategies, to see which actually wins and by how much.",
    pullQuote: "You're not trying to predict the market. You're trying to outlast it.",
    readTime: 7,
    mediaType: "image",
    content: "A SIP is a habit wearing a financial product's clothes. Here's what fifteen years of rolling returns actually show.",
  },
  {
    slug: "first-ml-model-week-1",
    title: "Building My First ML Model: Week 1 of Actually Shipping Something",
    category: "build-logs",
    excerpt: "A diary-style log of cleaning a messy dataset, picking a model that wasn't overkill, and the three bugs that ate a whole evening.",
    pullQuote: "The bug wasn't in the model. It was in a column I never looked at twice.",
    readTime: 9,
    mediaType: "image",
    content: "This week was less about machine learning and more about actually finishing something.",
  },
];

export async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/api/posts`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Backend not available");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return SAMPLE_POSTS;
  } catch {
    return SAMPLE_POSTS;
  }
}

export async function getPostBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/api/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Not found on backend");
    return await res.json();
  } catch {
    return SAMPLE_POSTS.find((p) => p.slug === slug) || null;
  }
}
