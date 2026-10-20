import { getSettings } from "../../lib/settings";

export const metadata = {
  title: "About — Compound & Compile",
  description: "Who writes Compound & Compile and why it exists.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  const authorName = settings.author_name || "The Compound & Compile Team";
  const authorBio =
    settings.author_bio ||
    "I write explainers that go past the surface-level version of a topic — breaking down how compound interest, machine learning models, and the tools behind them actually work, mechanically, rather than repeating the same shallow summaries everyone else does.";

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-accent2 text-xs font-bold tracking-[0.14em] uppercase">About</p>
      <h1 className="font-display text-3xl sm:text-4xl font-medium mt-3 text-ink900 leading-tight">
        {settings.site_name || "Compound & Compile"}
      </h1>
      <p className="mt-5 text-lg text-muted leading-relaxed">
        {settings.tagline ||
          "Finance you can model. Tech you can rebuild. Explainers broken down to the actual mechanics — not the shallow version."}
      </p>

      <div className="mt-10 pt-10 border-t border-line">
        <h2 className="font-display text-xl font-medium text-ink900">Written by {authorName}</h2>
        <p className="mt-4 text-base text-muted leading-relaxed whitespace-pre-line">{authorBio}</p>
      </div>

      <div className="mt-10 pt-10 border-t border-line">
        <h2 className="font-display text-xl font-medium text-ink900">What this site is</h2>
        <p className="mt-4 text-base text-muted leading-relaxed">
          Most articles that explain finance or technology stop at the surface — they tell you
          what a term means without showing you how it actually works underneath. This site exists
          to close that gap: real explanations, worked examples, and build logs from actually
          implementing the thing being explained, not just describing it.
        </p>
      </div>

      <div className="mt-10 pt-10 border-t border-line">
        <h2 className="font-display text-xl font-medium text-ink900">Editorial standards</h2>
        <ul className="mt-4 space-y-2 text-base text-muted leading-relaxed list-disc pl-5">
          <li>Every article is written and reviewed before publishing — no auto-generated filler.</li>
          <li>Claims about how something works are checked against primary sources or working code, not just repeated from other articles.</li>
          <li>Corrections are made openly when something is found to be inaccurate or outdated.</li>
        </ul>
      </div>
    </article>
  );
}
