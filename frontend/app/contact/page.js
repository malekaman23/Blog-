import ContactForm from "../../components/ContactForm";
import { getSettings } from "../../lib/settings";

export async function generateMetadata() {
  const settings = await getSettings();
  return { title: `Contact — ${settings.site_name}` };
}

export default async function Contact() {
  const settings = await getSettings();
  return (
    <section className="max-w-xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl font-semibold text-ink mb-3">Get in touch</h1>
      <p className="text-muted mb-1">
        Questions, corrections, or a topic you want covered — send it over.
      </p>
      <p className="text-muted mb-8 text-sm">
        Or email directly: {settings.contact_email}
      </p>
      <ContactForm />
    </section>
  );
}
