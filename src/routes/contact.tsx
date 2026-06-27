import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram, Star, ExternalLink } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tea Square Cafe" },
      { name: "description", content: "Get in touch with Tea Square Cafe — call, email, follow on Instagram or visit us." },
      { property: "og:title", content: "Contact — Tea Square Cafe" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const items = [
  { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Instagram, label: "Instagram", value: "@tea_square_cafe", href: SITE.instagram },
  { icon: MapPin, label: "Find Us", value: "Open in Google Maps", href: SITE.maps },
];

function Contact() {
  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Get In Touch"
          title="Visit Tea Square Cafe"
          subtitle="We'd love to brew you something special. Drop by, call ahead, or say hi on Instagram."
        />

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Info card */}
          <div className="space-y-4">
            {items.map((it) => (
              <a
                key={it.label}
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl border border-gold/20 bg-card hover:border-gold/50 hover:bg-card/80 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 grid place-items-center text-gold group-hover:bg-gold group-hover:text-primary-foreground transition shrink-0">
                  <it.icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{it.label}</div>
                  <div className="text-foreground truncate">{it.value}</div>
                </div>
                <ExternalLink size={16} className="text-gold/60 group-hover:text-gold transition shrink-0" />
              </a>
            ))}

            <a
              href={SITE.review}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full"
            >
              <Star size={16} /> Review Us on Google
            </a>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gold/20 bg-card shadow-2xl shadow-gold/5 h-[460px]">
            <iframe
              title="Tea Square Cafe location"
              src="https://www.google.com/maps?q=Tea+Square+Cafe&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "saturate(0.85)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
