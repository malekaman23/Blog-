import { getSettings } from "../../lib/settings";

export const metadata = {
  title: "Terms of Use",
};

export default async function TermsOfUse() {
  const settings = await getSettings();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl text-ink900 mb-2">Terms of Use</h1>
      <p className="text-sm text-muted mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-8 text-[0.97rem] leading-relaxed text-ink900">
        <section>
          <h2 className="font-display text-xl mb-3">Acceptance of terms</h2>
          <p>
            By accessing and using {settings.site_name}, you accept and agree to be bound by these
            Terms of Use. If you do not agree, please do not use this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Use of content</h2>
          <p>
            All articles, graphics, and other material on this site are provided for informational
            and educational purposes only. You may read, share, and link to our content, but you
            may not republish, redistribute, or reproduce our articles in full without our prior
            written permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Not financial or professional advice</h2>
          <p>
            Content published on {settings.site_name}, including anything related to personal
            finance, investing, or markets, is for general informational purposes only and does
            not constitute financial, investment, legal, or professional advice. Always do your
            own research or consult a qualified professional before making financial decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Accuracy of information</h2>
          <p>
            We make reasonable efforts to keep our content accurate and up to date, but we make no
            warranties about the completeness, reliability, or accuracy of this information. Any
            action you take based on information on this site is strictly at your own risk.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">User comments</h2>
          <p>
            When you submit a comment, you agree not to post content that is unlawful, abusive,
            defamatory, spam, or that infringes on someone else's rights. We reserve the right to
            remove any comment at our discretion.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Third-party links and advertising</h2>
          <p>
            Our site may contain links to third-party websites and may display advertisements
            served by third parties, including Google AdSense. We are not responsible for the
            content, accuracy, or practices of any linked third-party site or advertiser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Limitation of liability</h2>
          <p>
            {settings.site_name} and its authors shall not be held liable for any direct, indirect,
            incidental, or consequential damages arising from your use of this site or reliance on
            its content.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Changes to these terms</h2>
          <p>
            We may revise these Terms of Use at any time. Continued use of the site after changes
            are posted constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Contact us</h2>
          <p>
            Questions about these Terms can be sent via our{" "}
            <a href="/contact" className="text-accent underline">Contact page</a>.
          </p>
        </section>
      </div>
    </article>
  );
}
