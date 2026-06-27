import { motion } from "framer-motion";
import type { MenuItem } from "@/lib/site";

export function MenuCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-gold/15 hover:border-gold/40 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-gold/10"
    >
      <div className="aspect-[4/3] overflow-hidden bg-forest-light">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-gold tracking-wide">{item.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
