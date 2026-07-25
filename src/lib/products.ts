export type Category =
  | "women-eastern"
  | "women-western"
  | "men-eastern"
  | "men-western"
  | "kids"
  | "accessories"
  | "perfumes"
  | "jewellery";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  images?: string[];
  sizes?: string[];
  description: string;
  tag?: string;
  kidsGender?: "boy" | "girl";
  /** Optional gender restriction — mainly for accessories/jewellery. Omitted = suitable for everyone. */
  suitableFor?: ("men" | "women")[];
};

export const CATEGORIES: { slug: Category; label: string; blurb: string; image: string }[] = [
  { slug: "women-eastern", label: "Women · Eastern", blurb: "Lawn, chiffon & luxury pret", image: "/forbanner/femaleeastern.png" },
  { slug: "women-western", label: "Women · Western", blurb: "Modern western fits", image: "/forbanner/femalewestern.png" },
  { slug: "men-eastern", label: "Men · Eastern", blurb: "Kurta shalwar & waistcoats", image: "/forbanner/maleeastern.png" },
  { slug: "men-western", label: "Men · Western", blurb: "Modern western fits", image: "/forbanner/malewestern.png" },
  { slug: "kids", label: "Kids", blurb: "Little icons in the making", image: "/forbanner/kids.png" },
  { slug: "accessories", label: "Accessories", blurb: "Bags, dupattas & more", image: "/forbanner/accesories.png" },
  { slug: "perfumes", label: "Perfumes", blurb: "Modern scents", image: "/forbanner/perfume.png" },
  { slug: "jewellery", label: "Jewellery", blurb: "Gold-plated heritage", image: "/forbanner/jewelry.png" },
];

export const PRODUCTS: Product[] = [
  // ---------------- WOMEN · EASTERN (7) ----------------
  { id: "we-1", name: "Rania Embroidered Suit", price: 8900, category: "women-eastern", tag: "New",
    image: "/femaleeastern/Woman_in_Pakistani_suit_seated_202607212142.jpeg",
    description: "Hand-embroidered 3-piece suit, seated in soft studio light." },
  { id: "we-2", name: "Zainab Formal Ensemble", price: 15500, category: "women-eastern", tag: "Bestseller",
    image: "/femaleeastern/Woman_in_Pakistani_suit_standing_202607212142.jpeg",
    description: "Occasion-ready formal ensemble with rich detailing." },
  { id: "we-3", name: "Meherma Chiffon Suit", price: 13200, category: "women-eastern",
    image: "/femaleeastern/Woman_walking_in_Pakistani_suit_202607212142.jpeg",
    description: "Flowing chiffon suit with tilla-work dupatta." },
  { id: "we-4", name: "Anaya Festive Suit", price: 16800, category: "women-eastern", tag: "New",
    image: "/femaleeastern/Woman_walking_in_Pakistani_suit_202607212145.jpeg",
    description: "Festive silhouette designed for evening celebrations." },
  { id: "we-5", name: "Noorani Summer Lawn", price: 6900, category: "women-eastern",
    image: "/femaleeastern/Woman_walking_in_summer_suit_202607212142.jpeg",
    description: "Lightweight summer lawn suit, breathable and breezy." },
  { id: "we-6", name: "Sana Printed Lawn Suit", price: 7400, category: "women-eastern",
    image: "/femaleeastern/Woman_wearing_Pakistani_lawn_suit_202607212142.jpeg",
    description: "Digital-printed lawn 3-piece for everyday elegance." },
  { id: "we-7", name: "Bano Luxury Pret Suit", price: 12400, category: "women-eastern", tag: "Bestseller",
    image: "/femaleeastern/Woman_wearing_Pakistani_suit_smi…_202607212142 (1).jpeg",
    description: "Luxury pret suit finished with a radiant smile-ready drape." },

  // ---------------- WOMEN · WESTERN (7) ----------------
  { id: "ww-1", name: "Casual Denim Ensemble", price: 5900, category: "women-western",
    image: "/femalewestern/Woman_in_jeans_and_shirt_202607212144.jpeg",
    description: "Relaxed jeans-and-shirt combo for everyday wear." },
  { id: "ww-2", name: "Charcoal Tailored Set", price: 8200, category: "women-western", tag: "New",
    image: "/femalewestern/Woman_in_white_blouse_charcoal_202607212144.jpeg",
    description: "Crisp white blouse paired with charcoal tailoring." },
  { id: "ww-3", name: "Light Denim Jacket Set", price: 4500, category: "women-western",
    image: "/femalewestern/Woman_leaning_against_wall_202607212144.jpeg",
    description: "Soft ivory wrap top with a clean, modern fit." },
  { id: "ww-4", name: "Classic Linen Set", price: 6700, category: "women-western",
    image: "/femalewestern/Woman_touching_hair_window_202607212144.jpeg",
    description: "Easy linen dress for slow Sunday mornings." },
  { id: "ww-5", name: "Cream Knit Lounge Set", price: 7800, category: "women-western", tag: "New",
    image: "/femalewestern/Woman_walking_in_apartment_202607212144.jpeg",
    description: "Cozy knit sweater dress for cooler days indoors." },
  { id: "ww-6", name: "Downtown Trench Coat", price: 12900, category: "women-western", tag: "Bestseller",
    image: "/femalewestern/Woman_walking_in_city_street_202607212144.jpeg",
    description: "Classic trench coat styled for city streets." },
  { id: "ww-7", name: "Executive Beige Suit Set", price: 14500, category: "women-western",
    image: "/femalewestern/Woman_walking_in_office_lobby_202607212144.jpeg",
    description: "Sharp, tailored pantsuit for the office and beyond." },

  // ---------------- MEN · EASTERN (7) ----------------
  { id: "me-1", name: "Emerald Green Kurta Shalwar", price: 7200, category: "men-eastern", tag: "New",
    image: "/maleeastern/Man_adjusting_cuff_smiling_202607212151.jpeg",
    description: "Fine embroidered green kurta shalwar with a tailored cuff finish." },
  { id: "me-2", name: "Maroon Festive Kurta", price: 8500, category: "men-eastern", tag: "Bestseller",
    image: "/maleeastern/Man_in_festive_kurta_standing_202607212150.jpeg",
    description: "Deep maroon festive kurta crafted for Eid and special occasions." },
  { id: "me-3", name: "Charcoal Grey Waistcoat Set", price: 10800, category: "men-eastern",
    image: "/maleeastern/Man_in_kurta_pajama_waistcoat_202607212150.jpeg",
    description: "Kurta pajama paired with a charcoal grey heritage waistcoat." },
  { id: "me-4", name: "Ivory Kurta Shalwar", price: 6800, category: "men-eastern",
    image: "/maleeastern/Man_in_kurta_shalwar_standing_202607212151.jpeg",
    description: "Classic ivory kurta shalwar in breathable cotton." },
  { id: "me-5", name: "Navy Blue Kurta Shalwar", price: 6200, category: "men-eastern",
    image: "/maleeastern/Man_in_kurta_shalwar_studio_202607212150.jpeg",
    description: "Everyday navy blue cotton kurta shalwar, studio-finished tailoring." },
  { id: "me-6", name: "Ivory Waistcoat Kurta", price: 7900, category: "men-eastern", tag: "New",
    image: "/maleeastern/Man_walking_in_garden_202607212150.jpeg",
    description: "Soft ivory-tone kurta and waistcoat set styled for outdoor gatherings." },
  { id: "me-7", name: "Midnight Black Kurta", price: 23500, category: "men-eastern", tag: "Bestseller",
    image: "/maleeastern/Man_walking_in_hotel_lobby_202607212151.jpeg",
    description: "Statement midnight black kurta with a fine embroidered finish." },

  // ---------------- ACCESSORIES (4) ----------------
 { id: "a-1", name: "Signature Silk Dupatta", price: 3400, category: "accessories", tag: "New", suitableFor: ["women"],
    image: "/accessories/Luxury_dupatta_draped_on_pedestal_202607212244.jpeg",
    description: "Pure silk dupatta with a hand-rolled edge." },
  { id: "a-2", name: "Heritage Leather Belt", price: 3100, category: "accessories",
    image: "/accessories/Women's_leather_belt_on_pedestal_202607212244.jpeg",
    description: "Full-grain leather belt with a polished buckle." },
  { id: "a-3", name: "Marble Edition Sunglasses", price: 4600, category: "accessories", tag: "Bestseller",
    image: "/accessories/Women's_luxury_sunglasses_on_marble_202607212244.jpeg",
    description: "Statement sunglasses with a luxury marble-inspired finish." },
  { id: "a-4", name: "Signature Tote Bag", price: 5200, category: "accessories", suitableFor: ["women"],
    image: "/accessories/Women's_tote_bag_on_table_202607212243.jpeg",
    description: "Everyday tote bag crafted from premium materials." },

  // ---------------- PERFUMES (4) ----------------
  { id: "p-1", name: "Aurora Champagne", price: 7200, category: "perfumes", tag: "New",
    image: "/perfumes/Crystal_perfume_bottle_champagne…_202607212212.jpeg",
    description: "Delicate floral perfume in a crystal-cut bottle." },
  { id: "p-2", name: "Aura Ambre D'Or", price: 8500, category: "perfumes", tag: "Bestseller",
    image: "/perfumes/Luxury_perfume_bottle_on_marble_202607212212.jpeg",
    description: "Warm oud fragrance layered with rose and amber." },
  { id: "p-3", name: "Aurore Boutique Ambre Doré", price: 6500, category: "perfumes",
    image: "/perfumes/Perfume_bottle_on_marble_surface_202607212212 (1).jpeg",
    description: "Fresh musk fragrance for everyday wear." },
  { id: "p-4", name: "Aurora Rose Blush", price: 7900, category: "perfumes",
    image: "/perfumes/Perfume_bottle_on_marble_surface_202607212212 (2).jpeg",
    description: "Rich amber eau de parfum with a lingering finish." },

  // ---------------- JEWELLERY (4) ----------------
  { id: "j-1", name: "Heritage Gold Bangles", price: 5400, category: "jewellery", tag: "New",
    image: "/jewellry/Pakistani_gold_bangles_on_marble_202607212212.jpeg",
    description: "Traditional gold-plated bangles set on marble display." },
  { id: "j-2", name: "Pearl Drop Jhumkay", price: 4200, category: "jewellery",
    image: "/jewellry/Pakistani_gold_jhumkay_pearl_acc…_202607212211.jpeg",
    description: "Statement jhumkay earrings finished with pearl accents." },
  { id: "j-3", name: "Heritage Gold Necklace", price: 9800, category: "jewellery", tag: "Bestseller",
    image: "/jewellry/Pakistani_gold_necklace_pendant_202607212212.jpeg",
    description: "Gold-plated pendant necklace with heritage detailing." },
  { id: "j-4", name: "Floral Kundan Ring", price: 3500, category: "jewellery",
    image: "/jewellry/Pakistani_gold_ring_floral_design_202607212211.jpeg",
    description: "Handset kundan ring with a floral motif." },

  // ---------------- MEN · WESTERN (6) ----------------
  { id: "mw-1", name: "Everyday Oxford Shirt", price: 4200, category: "men-western",
    image: "/malewestern/Man_in_white_shirt_jeans_202607221208.jpeg",
    description: "Poplin oxford in classic white." },
  { id: "mw-2", name: "Tapered Chinos", price: 5400, category: "men-western",
    image: "/malewestern/Man_in_sweater_and_trousers_202607221208.jpeg",
    description: "Cotton-stretch tapered chinos." },
  { id: "mw-3", name: "Merino Crew Sweater", price: 8900, category: "men-western", tag: "New",
    image: "/malewestern/Man_in_polo_shirt_grey_202607221208.jpeg",
    description: "Fine-gauge merino in charcoal." },
  { id: "mw-4", name: "Weekend Overshirt", price: 6200, category: "men-western",
    image: "/malewestern/Man_leaning_against_wall_202607221208.jpeg",
    description: "Relaxed overshirt for off-duty days." },
  { id: "mw-5", name: "Office Blazer", price: 11500, category: "men-western", tag: "Bestseller",
    image: "/malewestern/Man_walking_in_office_lobby_202607221208.jpeg",
    description: "Sharp tailored blazer for the workday." },
  { id: "mw-6", name: "City Denim Jacket", price: 9200, category: "men-western",
    image: "/malewestern/Man_walking_toward_camera_202607221208.jpeg",
    description: "Versatile denim jacket for city days." },

  // ---------------- KIDS (4) ----------------
  { id: "k-1", name: "Little Prince Navy Kurta", price: 3800, category: "kids", tag: "New", kidsGender: "boy",
    image: "/kids/kids-boy-eastern.png.jpeg",
    description: "Classic navy kurta shalwar tailored for little ones." },
  { id: "k-2", name: "Little Begum Ivory Suit", price: 4200, category: "kids", kidsGender: "girl",
    image: "/kids/kids-girl-eastern.png.jpeg",
    description: "Delicate ivory eastern suit for festive occasions." },
  { id: "k-3", name: "Twirl Tulle Party Dress", price: 4500, category: "kids", tag: "Bestseller", kidsGender: "girl",
    image: "/kids/kids-girl-western.png.jpeg",
    description: "Pastel tulle party dress with a satin sash, made for twirling." },
  { id: "k-4", name: "Weekend Denim Overall", price: 3200, category: "kids", kidsGender: "boy",
    image: "/kids/kids-boy-western.png.jpeg",
    description: "Comfy denim overall for playful everyday adventures." },
];

export const formatPKR = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getByCategory = (c: Category) => PRODUCTS.filter((p) => p.category === c);
export const getCategory = (c: Category) => CATEGORIES.find((x) => x.slug === c);

// ---------------- NEW: sizes, gallery images, related products ----------------

const CLOTHING_SIZES = ["XS", "S", "M", "L"];
const KIDS_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];
const NO_SIZE_CATEGORIES: Category[] = ["accessories", "perfumes", "jewellery"];

/** Returns the size list to show for a product — explicit product.sizes wins, else a category default. */
export function getSizes(product: Product): string[] {
  if (product.sizes && product.sizes.length > 0) return product.sizes;
  if (NO_SIZE_CATEGORIES.includes(product.category)) return [];
  if (product.category === "kids") return KIDS_SIZES;
  return CLOTHING_SIZES;
}

/** Returns the gallery images for a product — falls back to the single `image` if no `images[]` given. */
export function getImages(product: Product): string[] {
  return product.images && product.images.length > 0 ? product.images : [product.image];
}

/** Related products — same category, excluding the current product. */
export function getRelated(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}