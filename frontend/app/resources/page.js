import NewsletterForm from "../../components/NewsletterForm";

export const metadata = {
  title: "Free Data Science Roadmap — Compound & Compile",
  description: "A realistic 16-week learning roadmap, free — enter your email to download.",
};

export default function ResourcesPage() {
  return (
    <section className="bg-ink text-[#EDE9DC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <p className="text-accent2 text-xs font-bold tracking-[0.14em] uppercase">Free download</p>
        <h1 className="font-display text-3xl sm:text-4xl font-medium mt-4 leading-tight">
          The Data Science Learning Roadmap
        </h1>
        <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto" style={{ color: "#AEB4C2" }}>
          A realistic 16-week path — what to learn, in what order, and what to actually build.
          No fluff, one page, free.
        </p>

        <div className="mt-10 max-w-xs mx-auto text-left">
          <NewsletterForm
            mode="leadMagnet"
            downloadUrl="/downloads/data-science-roadmap.pdf"
            buttonLabel="Get the free roadmap"
          />
        </div>

        <p className="mt-6 text-xs" style={{ color: "#6E7585" }}>
          No spam — just the weekly article. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
