import { getSettings } from "../../lib/settings";

export const metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPolicy() {
  const settings = await getSettings();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl text-ink900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-8 text-[0.97rem] leading-relaxed text-ink900">
        <section>
          <h2 className="font-display text-xl mb-3">Who we are</h2>
          <p>
            {settings.site_name} publishes articles on finance and technology.
            This page explains what information we collect from visitors, how we use it, and the
            choices you have.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Information we collect</h2>
          <p className="mb-3">We collect information in a few limited ways:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Information you give us directly</strong> — such as your name and email
              address when you submit a comment, use our contact form, or subscribe to updates.
            </li>
            <li>
              <strong>Automatically collected information</strong> — standard technical data such
              as your browser type, device type, pages visited, and time spent on the site,
              typically gathered through cookies and similar technologies.
            </li>
            <li>
              <strong>Advertising data</strong> — if this site displays ads, our advertising
              partners (such as Google AdSense) may use cookies to serve ads based on your prior
              visits to this and other websites.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">How we use cookies</h2>
          <p>
            Cookies help us understand how visitors use the site and allow third-party vendors,
            including Google, to show ads based on your visits here and elsewhere on the internet.
            You can opt out of personalized advertising by visiting{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              Google's Ads Settings
            </a>{" "}
            or{" "}
            <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              optout.aboutads.info
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Third-party advertising</h2>
          <p>
            We may use third-party advertising companies, including Google AdSense, to serve ads
            when you visit this site. These companies may use information about your visits to
            this and other websites to provide advertisements about goods and services of
            interest to you. Google's use of advertising cookies enables it and its partners to
            serve ads based on your visit to this site and/or other sites on the Internet.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">How we use your information</h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respond to comments, messages, and contact form submissions</li>
            <li>Understand how our content is used, so we can improve it</li>
            <li>Detect and prevent spam or abuse</li>
            <li>Display relevant advertising, where applicable</li>
          </ul>
          <p className="mt-3">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Data retention</h2>
          <p>
            We retain comment and contact form submissions for as long as necessary to respond to
            your inquiry or maintain the discussion on the relevant article, unless you ask us to
            delete it sooner.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of any personal information we
            hold about you by reaching out through our{" "}
            <a href="/contact" className="text-accent underline">Contact page</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Children's privacy</h2>
          <p>
            This site is not directed at children under 13, and we do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3">Contact us</h2>
          <p>
            If you have questions about this Privacy Policy, reach out via our{" "}
            <a href="/contact" className="text-accent underline">Contact page</a>.
          </p>
        </section>
      </div>
    </article>
  );
}
