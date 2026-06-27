import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Star } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-gold/15">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm tracking-wide transition-colors relative ${
                  active ? "text-gold" : "text-foreground/80 hover:text-gold"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <a
          href={SITE.review}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex btn-gold !py-2.5 !px-4 !text-[11px]"
        >
          <Star size={14} /> Review Us
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-gold p-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gold/15 bg-background/95 backdrop-blur">
          <nav className="flex flex-col px-6 py-4 gap-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`py-2 text-sm tracking-wide ${
                  pathname === l.to ? "text-gold" : "text-foreground/80"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={SITE.review}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-2 self-start"
            >
              <Star size={14} /> Review Us on Google
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
