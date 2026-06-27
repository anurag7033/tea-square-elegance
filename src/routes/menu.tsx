import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { MenuCard } from "@/components/MenuCard";
import { useMenuItems } from "@/lib/dataHooks";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Tea Square Cafe" },
      { name: "description", content: "Explore the full Tea Square Cafe menu — chai, coffee, snacks and hearty mains." },
      { property: "og:title", content: "Menu — Tea Square Cafe" },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { items, loading } = useMenuItems();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((m) => {
      const matchCat = cat === "All" || m.category === cat;
      const matchQuery = m.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [query, cat, items]);

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Our Menu"
          title="Crafted With Love"
          subtitle="A handpicked selection of chai, bites and comfort meals — made fresh, served warm."
        />

        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-10">
          <div className="relative md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/70" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu..."
              className="w-full bg-card border border-gold/20 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold transition placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase border transition ${
                  cat === c
                    ? "bg-gold text-primary-foreground border-gold"
                    : "border-gold/25 text-foreground/70 hover:border-gold hover:text-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-20">Loading menu…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No items match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
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
        )}
      </div>
    </div>
  );
}
