import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock, LogOut, Plus, Trash2, Upload, Image as ImageIcon, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Tea Square Cafe" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const MENU_BUCKET = "menu-images";
const GALLERY_BUCKET = "gallery-images";
const SIGNED_EXPIRY = 60 * 60 * 24 * 365 * 10; // 10 years

type MenuRow = {
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

type GalleryRow = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-gold">Loading…</div>;
  }

  if (!session) return <LoginForm />;
  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center text-gold">Checking access…</div>;
  }
  if (!isAdmin) return <NotAdminScreen email={session.user.email ?? ""} />;

  return <Dashboard />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-background text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-gold/25 bg-card/80 backdrop-blur p-8 shadow-2xl shadow-gold/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <Lock size={18} />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/70">Tea Square Cafe</p>
            <h1 className="font-display text-2xl text-foreground">Admin Access</h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs tracking-wider uppercase text-foreground/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-forest-light/60 border border-gold/60 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-foreground/70">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-forest-light/60 border border-gold/60 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
            />
          </div>
          {err && (
            <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">{err}</p>
          )}
          <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
            {busy ? "Please wait…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function NotAdminScreen({ email }: { email: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-md text-center rounded-2xl border border-gold/25 bg-card/80 p-8">
        <h1 className="font-display text-2xl text-gold">Access Denied</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Signed in as <span className="text-foreground">{email}</span> — this account does not have admin
          permission. Ask an existing admin to grant you access.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="btn-outline-gold mt-6">
          Sign Out
        </button>
      </div>
    </div>
  );
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

async function uploadAndGetUrl(bucket: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Use JPG, PNG, or WEBP.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Max 5MB.");
  }
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message || "Upload failed");
  const { data, error: sErr } = await supabase.storage.from(bucket).createSignedUrl(path, SIGNED_EXPIRY);
  if (sErr || !data) throw new Error(sErr?.message || "Could not create signed URL");
  return data.signedUrl;
}


function Dashboard() {
  const [tab, setTab] = useState<"menu" | "gallery">("menu");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminStyles />

      <header className="border-b border-gold/20 bg-forest/60 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/70">Tea Square Cafe</p>
            <h1 className="font-display text-xl text-gold">Admin Dashboard</h1>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="btn-outline-gold !py-2 !px-4">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
        <div className="mx-auto max-w-7xl px-6 flex gap-2">
          {(["menu", "gallery"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs tracking-[0.2em] uppercase border-b-2 transition ${
                tab === t ? "border-gold text-gold" : "border-transparent text-foreground/60 hover:text-gold"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {tab === "menu" ? <MenuAdmin /> : <GalleryAdmin />}
      </main>
    </div>
  );
}

/* -------------------- MENU ADMIN -------------------- */

const DEFAULT_CATEGORIES = [
  "Chai",
  "Coffee",
  "Cold Coffee",
  "Cold Drinks",
  "Snacks",
  "Main Course",
];

function MenuAdmin() {
  const [items, setItems] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MenuRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("sort_order")
      .order("created_at");
    setItems((data ?? []) as MenuRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    load();
  }

  const categories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...items.map((i) => i.category)]),
  );

  const grouped = categories
    .map((c) => ({ cat: c, items: items.filter((i) => i.category === c) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-gold">Menu Items</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-gold !py-2 !px-4"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-card/60 p-10 text-center text-muted-foreground">
          No menu items yet. Click <span className="text-gold">Add Item</span> to begin.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ cat, items }) => (
            <div key={cat}>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">{cat}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-xl border border-gold/15 bg-card/60 p-4 flex gap-3"
                  >
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-forest-light flex-shrink-0">
                      {it.image_url ? (
                        <img src={it.image_url} alt={it.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gold/30">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-display text-gold truncate">{it.name}</p>
                        {it.price != null && (
                          <span className="text-xs text-foreground/70">
                            ₹{Number(it.price).toFixed(0)} {it.show_price ? "" : "(hidden)"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{it.description}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            setEditing(it);
                            setShowForm(true);
                          }}
                          className="text-xs text-gold/80 hover:text-gold inline-flex items-center gap-1"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => remove(it.id)}
                          className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <MenuForm
          initial={editing}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function MenuForm({
  initial,
  categories,
  onClose,
  onSaved,
}: {
  initial: MenuRow | null;
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? "Chai");
  const [newCat, setNewCat] = useState("");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(initial?.price?.toString() ?? "");
  const [showPrice, setShowPrice] = useState(initial?.show_price ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setErr(null);
    try {
      const url = await uploadAndGetUrl(MENU_BUCKET, file);
      setImageUrl(url);
    } catch (e: any) {
      setErr(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const finalCategory = newCat.trim() || category;
    const payload = {
      name: name.trim(),
      category: finalCategory,
      description: description.trim(),
      price: price ? Number(price) : null,
      show_price: showPrice,
      featured,
      image_url: imageUrl,
    };
    try {
      if (initial) {
        const { error } = await supabase.from("menu_items").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_items").insert(payload);
        if (error) throw error;
      }
      onSaved();
    } catch (e: any) {
      setErr(e.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={save}
        className="w-full max-w-lg rounded-2xl border border-gold/25 bg-card p-6 my-8 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-gold">{initial ? "Edit Item" : "Add Item"}</h3>
          <button type="button" onClick={onClose} className="text-foreground/60 hover:text-gold">
            <X size={20} />
          </button>
        </div>

        <Field label="Name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="…or type a new category"
            className="input mt-2"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
            />
          </Field>
          <div className="flex flex-col gap-2 justify-end pb-1">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showPrice}
                onChange={(e) => setShowPrice(e.target.checked)}
                className="input"
              />
              Show price on site
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="input"
              />
              Featured on home
            </label>
          </div>
        </div>

        <Field label="Image">
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 rounded-lg overflow-hidden bg-forest-light border border-gold/20 flex items-center justify-center text-gold/30">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon size={20} />
              )}
            </div>
            <label className="btn-outline-gold !py-2 !px-3 cursor-pointer">
              <Upload size={14} />
              {uploading ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="text-xs text-red-300 hover:text-red-200"
              >
                Remove
              </button>
            )}
          </div>
        </Field>

        {err && (
          <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">{err}</p>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-outline-gold !py-2 !px-4">
            Cancel
          </button>
          <button type="submit" disabled={busy || uploading} className="btn-gold !py-2 !px-4 disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs tracking-wider uppercase text-foreground/70 block mb-1">{label}</label>
      {children}
    </div>
  );
}

/* -------------------- GALLERY ADMIN -------------------- */

function GalleryAdmin() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    setItems((data ?? []) as GalleryRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleFiles(files: FileList) {
    setUploading(true);
    setErr(null);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadAndGetUrl(GALLERY_BUCKET, file);
        const { error } = await supabase
          .from("gallery_images")
          .insert({ image_url: url, caption: null });
        if (error) throw error;
      }
      load();
    } catch (e: any) {
      setErr(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h2 className="font-display text-2xl text-gold">Gallery</h2>
        <label className="btn-gold !py-2 !px-4 cursor-pointer">
          <Upload size={14} />
          {uploading ? "Uploading…" : "Upload Images"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>

      {err && (
        <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 mb-4">
          {err}
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-card/60 p-10 text-center text-muted-foreground">
          No images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((g) => (
            <div
              key={g.id}
              className="relative group rounded-xl overflow-hidden border border-gold/15 bg-card"
            >
              <img src={g.image_url} alt={g.caption ?? "Gallery"} className="w-full h-48 object-cover" />
              <button
                onClick={() => remove(g.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-red-300 hover:text-red-200 opacity-0 group-hover:opacity-100 transition"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

function AdminStyles() {
  return (
    <style>{`
      .input {
        width: 100%;
        background: #0B2A1E;
        border: 1px solid #C8A24D;
        border-radius: 0.5rem;
        padding: 0.55rem 0.75rem;
        font-size: 0.875rem;
        color: #ffffff;
        outline: none;
        transition: box-shadow 0.2s, border-color 0.2s;
      }
      .input::placeholder { color: #B8B8B8; }
      .input:hover { border-color: #E0BE5E; }
      .input:focus {
        border-color: #E0BE5E;
        box-shadow: 0 0 0 3px rgba(200, 162, 77, 0.25);
      }
      select.input {
        background-color: #0B2A1E;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23C8A24D' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
        -webkit-appearance: none;
        appearance: none;
        color: #ffffff;
      }
      select.input option {
        background-color: #0B2A1E;
        color: #ffffff;
      }
      select.input option:checked,
      select.input option:hover {
        background: linear-gradient(#C8A24D, #C8A24D);
        color: #0B2A1E;
      }
      .input[type="checkbox"] {
        appearance: none;
        width: 1rem;
        height: 1rem;
        border: 1px solid #C8A24D;
        border-radius: 0.25rem;
        background: #0B2A1E;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        padding: 0;
        position: relative;
        flex-shrink: 0;
      }
      .input[type="checkbox"]:checked {
        background: #C8A24D;
        border-color: #C8A24D;
      }
      .input[type="checkbox"]:checked::after {
        content: "";
        position: absolute;
        left: 3px;
        top: 0px;
        width: 5px;
        height: 9px;
        border: solid #0B2A1E;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    `}</style>
  );
}

