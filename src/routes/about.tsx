import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";
import { CAFE_IMAGES } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tea Square Cafe" },
      { name: "description", content: "Discover the story behind Tea Square Cafe — premium tea, cozy ambience and unforgettable moments." },
      { property: "og:title", content: "About Tea Square Cafe" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="section-pad">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Our Story"
          title="More Than A Cafe, It's An Experience"
          subtitle="A warm corner where premium tea meets cozy company. Every cup, every laugh, every moment — crafted to be remembered."
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
    </div>
  );
}
