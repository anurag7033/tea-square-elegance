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
