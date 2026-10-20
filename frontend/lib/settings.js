const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_SETTINGS = {
  site_name: "Compound & Compile",
  tagline: "Finance you can model. Tech you can rebuild.",
  hero_heading: "Finance you can model.\nTech you can rebuild.",
  hero_subtext:
    "Explainers broken down to the actual mechanics, plus the build logs from shipping the small finance and ML projects that came out of asking \"how does this really work.\"",
  about_content:
    "Compound & Compile writes about two things that compound the same way: money, and the systems that move it. Explainers on how markets and machine learning actually work, paired with build logs from shipping real, small projects.",
  contact_email: "hello@compoundandcompile.in",
  footer_tagline:
    "Finance and technology, explained from first principles — plus the build logs from actually shipping the projects.",
};

export async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return DEFAULT_SETTINGS;
  }
}
