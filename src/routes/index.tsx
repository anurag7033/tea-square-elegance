import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Coffee, Leaf, Sparkles, Wifi, Users, Heart, Phone, Mail, MapPin, Instagram, Star, ExternalLink } from "lucide-react";
import heroImg from "@/assets/hero-tea.jpg";
import { SectionTitle } from "@/components/SectionTitle";
import { MenuCard } from "@/components/MenuCard";
import { CAFE_IMAGES, SITE } from "@/lib/site";
import { useMenuItems, useSiteStats } from "@/lib/dataHooks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tea Square Cafe — Sip · Relax · Repeat" },
      { name: "description", content: "Experience every cup like never before at Tea Square Cafe. Premium chai, coffee and comfort food in a luxe cozy setting." },
      { property: "og:title", content: "Tea Square Cafe" },
      { property: "og:description", content: "Experience every cup like never before." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const features = [
  { icon: Leaf, label: "Premium Tea Collection" },
  { icon: Coffee, label: "Cozy Ambience" },
  { icon: Sparkles, label: "Fresh & Hygienic" },
  { icon: Users, label: "Friendly Staff" },
  { icon: Heart, label: "Couple Friendly" },
  { icon: Wifi, label: "Free Wi-Fi & Music" },
];

function Home() {
  const { items } = useMenuItems();
  const { items: stats } = useSiteStats();
  const featured = items.filter((m) => m.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Steaming premium tea cup"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 min-h-[88vh] flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-2xl py-24"
          >
            <p className="font-script text-3xl md:text-4xl text-gold mb-4">
              Sip. Relax. Repeat.
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-foreground">
              Experience<br />
              <span className="gold-gradient-text">Every Cup</span><br />
              Like Never Before
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-14 bg-gold/60" />
              <span className="text-gold">❦</span>
              <span className="h-px w-14 bg-gold/60" />
            </div>
            <p className="mt-6 text-base md:text-lg text-foreground/75 max-w-md">
              A perfect blend of premium tea, cozy ambience and unforgettable moments.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/menu" className="btn-gold">
                Explore Menu <ArrowRight size={16} />
              </Link>
              <a href={SITE.review} target="_blank" rel="noopener noreferrer" className="btn-outline-gold">
                Review Us
              </a>
            </div>
          </motion.div>
        </div>

        {/* Feature strip */}
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8 -mt-10 pb-10 z-10">
          <div className="rounded-2xl border border-gold/25 bg-forest/80 backdrop-blur-md p-6 grid grid-cols-2 md:grid-cols-6 gap-4">
            {features.map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center gap-2">
                <f.icon className="text-gold" size={26} />
                <span className="text-[11px] tracking-[0.18em] text-foreground/80 uppercase font-medium">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="section-pad relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/5"
          >
            <img
              src={CAFE_IMAGES[0]}
              alt="Tea Square Cafe interior"
              loading="lazy"
              className="w-full h-[460px] object-cover"
            />
          </motion.div>
          <div>
            <p className="text-gold text-xs tracking-[0.4em] mb-3 uppercase">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-display">
              More Than A Cafe,<br />
              <span className="gold-gradient-text">It's An Experience</span>
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold/50" />
              <span className="text-gold">❦</span>
            </div>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              At Tea Square Cafe, every cup is a celebration of flavour and connection.
              Whether it's a quiet morning or a laughter-filled evening, we are here to make
              it special — with handpicked teas, freshly crafted bites and a warm, golden glow.
            </p>
            <Link to="/about" className="btn-gold mt-8">
              Read More About Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Details */}
      <section className="section-pad relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle
            eyebrow="Discover"
            title="Our World"
          />

          {/* Masonry image grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
            {CAFE_IMAGES.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`overflow-hidden rounded-2xl border border-gold/15 ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={src}
                  alt={`Tea Square Cafe ambience ${i + 1}`}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
                    i === 0 ? "min-h-[400px]" : "h-56 md:h-64"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-display text-gold mb-4">Our Philosophy</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe a great cup of tea is more than a drink — it's a pause, a
                conversation, a memory. From the first leaf to the final sip, every
                detail is chosen with care so that you leave feeling a little warmer
                than when you arrived.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-display text-gold mb-4">The Experience</h3>
              <p className="text-muted-foreground leading-relaxed">
                Soft golden lighting, the gentle hum of music, and the aroma of freshly
                brewed chai — Tea Square Cafe is built to feel like home, only a little
                more magical. Come for the tea, stay for the moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="section-pad bg-forest/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle
            eyebrow="Our Specialties"
            title="Handpicked For You"
            subtitle="A curated taste of what our guests love most."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item, i) => (
              <MenuCard
                key={item.id}
                item={{
                  name: item.name,
                  description: item.description,
                  image: item.image_url,
                  price: item.price,
                  show_price: item.show_price,
                }}
                index={i}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/menu" className="btn-outline-gold">
              View Full Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/20 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-card/60">
            {[
              { n: "25+", l: "Premium Teas" },
              { n: "10K+", l: "Happy Customers" },
              { n: "35K+", l: "Cups Served" },
              { n: "2", l: "Outlet Branches" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-4xl gold-gradient-text">{s.n}</div>
                <div className="mt-1 text-xs tracking-[0.2em] uppercase text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-pad bg-forest/30">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <SectionTitle
            eyebrow="Get In Touch"
            title="Visit Tea Square Cafe"
            subtitle="We'd love to brew you something special. Drop by, call ahead, or say hi on Instagram."
          />

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Info cards */}
            <div className="space-y-4">
              {[
                { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
                { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
                { icon: Instagram, label: "Instagram", value: "@tea_square_cafe", href: SITE.instagram },
                { icon: MapPin, label: "Find Us", value: "Open in Google Maps", href: SITE.maps },
              ].map((it) => (
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
      </section>
    </>
  );
}
