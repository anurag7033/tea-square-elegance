import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MENU as STATIC_MENU, CAFE_IMAGES } from "@/lib/site";

export type DBMenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  show_price: boolean;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
};

export type DBGalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export function useMenuItems() {
  const [items, setItems] = useState<DBMenuItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!alive) return;
        if (data && data.length > 0) {
          setItems(data as DBMenuItem[]);
        } else {
          // Fall back to static seed
          setItems(
            STATIC_MENU.map((m, i) => ({
              id: `static-${i}`,
              name: m.name,
              category: m.category as string,
              description: m.description,
              price: null,
              show_price: false,
              image_url: m.image,
              featured: !!m.featured,
              sort_order: i,
            })),
          );
        }
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { items: items ?? [], loading };
}

export function useGalleryImages() {
  const [items, setItems] = useState<DBGalleryImage[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!alive) return;
        if (data && data.length > 0) {
          setItems(data as DBGalleryImage[]);
        } else {
          setItems(
            CAFE_IMAGES.map((src, i) => ({
              id: `static-${i}`,
              image_url: src,
              caption: null,
              sort_order: i,
            })),
          );
        }
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { items: items ?? [], loading };
}

export type DBSiteStat = {
  id: string;
  key: string;
  value: string;
  label: string;
  sort_order: number;
};

const FALLBACK_STATS: DBSiteStat[] = [
  { id: "s1", key: "premium_teas", value: "25+", label: "Premium Teas", sort_order: 1 },
  { id: "s2", key: "happy_customers", value: "10K+", label: "Happy Customers", sort_order: 2 },
  { id: "s3", key: "cups_served", value: "35K+", label: "Cups Served", sort_order: 3 },
  { id: "s4", key: "outlet_branches", value: "2", label: "Outlet Branches", sort_order: 4 },
];

export function useSiteStats() {
  const [items, setItems] = useState<DBSiteStat[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("site_stats" as any)
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }: any) => {
        if (!alive) return;
        setItems(data && data.length > 0 ? (data as DBSiteStat[]) : FALLBACK_STATS);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { items: items ?? FALLBACK_STATS, loading };
}
