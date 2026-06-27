import { motion } from "framer-motion";

export type MenuCardItem = {
  name: string;
  description: string;
  image?: string | null;
  price?: number | null;
  show_price?: boolean;
};

export function MenuCard({ item, index = 0 }: { item: MenuCardItem; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-gold/15 hover:border-gold/40 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-gold/10"
    >
      <div className="aspect-[4/3] overflow-hidden bg-forest-light">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gold/30 font-display text-5xl">
            ❦
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg text-gold tracking-wide">{item.name}</h3>
          {item.show_price && item.price != null && (
            <span className="font-display text-gold text-base whitespace-nowrap">
              ₹{Number(item.price).toFixed(0)}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}
