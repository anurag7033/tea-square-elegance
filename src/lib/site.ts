export const LOGO_URL = "https://res.cloudinary.com/daiev9gkn/image/upload/v1782622893/WhatsApp_Image_2026-06-24_at_1.11.28_PM_t9vyuj.jpg";

export const SITE = {
  name: "Tea Square Cafe",
  tagline: "Sip • Relax • Repeat",
  phone: "+91 6307559329",
  phoneRaw: "6307559329",
  email: "Teasquarecafe04@gmail.com",
  instagram: "https://www.instagram.com/tea_square_cafe?utm_source=qr",
  maps: "https://maps.app.goo.gl/MpuEtytRoV7x1Ady5?g_st=iw",
  review: "https://maps.app.goo.gl/MpuEtytRoV7x1Ady5?g_st=iw",
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export const CAFE_IMAGES = [
  "https://res.cloudinary.com/daiev9gkn/image/upload/v1782532847/WhatsApp_Image_2026-06-26_at_11.18.43_PM_c3mtnf.jpg",
  "https://res.cloudinary.com/daiev9gkn/image/upload/v1782532778/1_vdt0ji.png",
  "https://res.cloudinary.com/daiev9gkn/image/upload/v1782532778/3_2_gswkti.png",
  "https://res.cloudinary.com/daiev9gkn/image/upload/v1782532778/2_oylovr.png",
];

// Unsplash food photography for menu items (free to use)
const img = (q: string) => `https://source.unsplash.com/600x600/?${encodeURIComponent(q)}`;

export const MENU_CATEGORIES = [
  "All", "Chai", "Cold Drinks", "Coffee", "Snacks", "Main Course",
] as const;

export type MenuItem = {
  name: string;
  category: typeof MENU_CATEGORIES[number];
  description: string;
  image: string;
  featured?: boolean;
};

export const MENU: MenuItem[] = [
  { name: "Chai", category: "Chai", description: "Aromatic Indian masala chai brewed to perfection.", image: img("masala,chai,tea,cup"), featured: true },
  { name: "Bun Makkhan", category: "Snacks", description: "Soft bun toasted golden with rich butter.", image: img("bun,butter,bread") },
  { name: "Maggi", category: "Snacks", description: "Classic spicy masala noodles, the comfort favourite.", image: img("maggi,noodles,bowl") },
  { name: "Cold Drink", category: "Cold Drinks", description: "Chilled refreshing soft drinks on the rocks.", image: img("cold,drink,soda,glass") },
  { name: "Patties", category: "Snacks", description: "Flaky golden veg puff patties, fresh from the oven.", image: img("veg,patties,puff,pastry") },
  { name: "Sandwich", category: "Snacks", description: "Grilled sandwich layered with veggies and cheese.", image: img("grilled,sandwich,cheese") },
  { name: "Cold Coffee", category: "Cold Coffee" as any, description: "Frothy iced coffee blended with cream.", image: img("cold,coffee,glass,ice") },
  { name: "Momos", category: "Snacks", description: "Steamed dumplings served with spicy red chutney.", image: img("momos,dumplings,steamed"), featured: true },
  { name: "Pani Puri", category: "Snacks", description: "Crisp puris bursting with tangy spiced water.", image: img("pani,puri,gol,gappa") },
  { name: "Spring Roll", category: "Snacks", description: "Crunchy golden rolls with savoury veggie filling.", image: img("spring,roll,crispy"), featured: true },
  { name: "Chilli Potato", category: "Snacks", description: "Crispy potatoes tossed in sweet-spicy sauce.", image: img("chilli,potato,indo,chinese") },
  { name: "Burger", category: "Main Course", description: "Juicy veg burger with melted cheese and sauces.", image: img("veg,burger,bun"), featured: true },
  { name: "Chhola Chawal", category: "Main Course", description: "Spiced chickpeas with fragrant steamed rice.", image: img("chole,chawal,chickpea,rice") },
  { name: "Rajma Chawal", category: "Main Course", description: "Slow cooked kidney beans with basmati rice.", image: img("rajma,chawal,kidney,bean,rice") },
  { name: "Veg Biryani", category: "Main Course", description: "Aromatic basmati layered with veggies and spices.", image: img("veg,biryani,rice") },
  { name: "Pav Bhaji", category: "Main Course", description: "Buttery bhaji with toasted pav and onions.", image: img("pav,bhaji,indian") },
];
