import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { CAFE_IMAGES } from "@/lib/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Tea Square Cafe" },
      { name: "description", content: "A visual journey through Tea Square Cafe's warm corners, signature drinks and golden moments." },
      { property: "og:title", content: "Gallery — Tea Square Cafe" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const images = [...CAFE_IMAGES, ...CAFE_IMAGES]; // double up for a fuller grid

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Gallery"
          title="A Glimpse Inside"
          subtitle="Step into our world of warm lights, golden cups and quiet conversations."
        />

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {images.map((src, i) => (
            <motion.button
              key={`${src}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              onClick={() => setLightbox(src)}
              className="mb-4 block w-full overflow-hidden rounded-2xl border border-gold/15 hover:border-gold/40 transition group"
            >
              <img
                src={src}
                alt={`Tea Square Cafe ${i + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-gold p-2"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={lightbox}
              alt="Gallery preview"
              className="max-h-[90vh] max-w-[92vw] rounded-2xl border border-gold/30 shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
