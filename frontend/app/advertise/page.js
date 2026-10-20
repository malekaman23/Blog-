import { getSettings } from "../../lib/settings";

export const metadata = {
  title: "Advertise / Sponsor — Compound & Compile",
  description: "Sponsor a post, place an affiliate link, or hire the author directly.",
};

export default async function AdvertisePage() {
  const settings = await getSettings();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-accent2 text-xs font-bold tracking-[0.14em] uppercase">Work with us</p>
      <h1 className="font-display text-3xl sm:text-4xl font-medium mt-3 text-ink900 leading-tight">
        Sponsor a post, or hire me directly
      </h1>
      <p className="mt-5 text-lg text-muted leading-relaxed">
        {settings.site_name || "Compound & Compile"} reaches readers who are actually trying to
        learn finance and data/ML concepts in depth — not skimming listicles. If that's your
        audience, here's how we can work together.
      </p>

      <div className="mt-10 grid sm:grid-cols-3 gap-6">
        <div className="border border-line rounded-lg p-5">
          <h2 className="font-display text-base font-semibold text-ink900">Sponsored post</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            A full article about your product or tool, written in the same explainer style as
            everything else here, clearly labeled as sponsored.
          </p>
        </div>
        <div className="border border-line rounded-lg p-5">
          <h2 className="font-display text-base font-semibold text-ink900">Affiliate / link placement</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            A relevant mention and link inside an existing or upcoming article that fits your
            product naturally — course platforms, tools, and books relevant to finance or data
            science are the best fit.
          </p>
        </div>
        <div className="border border-line rounded-lg p-5">
          <h2 className="font-display text-base font-semibold text-ink900">Consulting / freelance</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Need something built or explained — a small ML project, a data analysis, or technical
            writing? Reach out with what you need.
          </p>
        </div>
      </div>

      <div className="mt-10 pt-10 border-t border-line">
        <h2 className="font-display text-xl font-medium text-ink900">Get in touch</h2>
        <p className="mt-3 text-base text-muted leading-relaxed">
          Email{" "}
          <a href={`mailto:${settings.contact_email}`} className="font-semibold text-accent">
            {settings.contact_email}
          </a>{" "}
          with a short note on what you have in mind, and I'll get back to you.
        </p>
      </div>
    </article>
  );
}
