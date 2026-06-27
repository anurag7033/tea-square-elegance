import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-forest/40 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo size={48} />
          <p className="text-sm text-muted-foreground max-w-xs">
            Your cozy retreat where every sip brings comfort and every moment becomes a memory.
          </p>
          <p className="font-script text-gold text-xl">{SITE.tagline}</p>
        </div>

        <div>
          <h4 className="text-gold text-sm tracking-[0.25em] mb-4">QUICK LINKS</h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-foreground/70 hover:text-gold transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-gold text-sm tracking-[0.25em] mb-4">CONTACT</h4>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <Phone size={14} className="text-gold mt-1 shrink-0" />
              <a href={`tel:${SITE.phoneRaw}`} className="hover:text-gold">{SITE.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="text-gold mt-1 shrink-0" />
              <a href={`mailto:${SITE.email}`} className="hover:text-gold break-all">{SITE.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-gold mt-1 shrink-0" />
              <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Find us on Google Maps
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold text-sm tracking-[0.25em] mb-4">FOLLOW</h4>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-gold transition"
          >
            <Instagram size={18} className="text-gold" /> @tea_square_cafe
          </a>
        </div>
      </div>

      <div className="border-t border-gold/10 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
