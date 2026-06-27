import { LOGO_URL, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img
        src={LOGO_URL}
        alt={`${SITE.name} logo`}
        width={size}
        height={size}
        className="rounded-md object-cover transition-transform group-hover:scale-105"
        style={{ width: size, height: size }}
      />
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="font-display text-sm tracking-[0.25em] text-gold">TEA SQUARE</span>
        <span className="font-display text-[10px] tracking-[0.4em] text-gold/70">— CAFE —</span>
      </div>
    </Link>
  );
}
