import { motion } from "framer-motion";

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`${align === "center" ? "text-center mx-auto" : "text-left"} max-w-2xl mb-12`}
    >
      {eyebrow && (
        <p className="text-gold text-xs tracking-[0.4em] mb-3 uppercase">{eyebrow}</p>
      )}
      <h2 className="text-3xl md:text-5xl font-display text-foreground">{title}</h2>
      <div className={`mt-4 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-10 bg-gold/50" />
        <span className="text-gold text-xs">❦</span>
        <span className="h-px w-10 bg-gold/50" />
      </div>
      {subtitle && (
        <p className="mt-5 text-muted-foreground leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}
