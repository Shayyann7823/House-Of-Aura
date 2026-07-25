"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
  verified?: boolean;
};

// Deterministic seed from a string so SSR + client always render the same mock reviews (no hydration mismatch).
function seedFromString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const REVIEW_POOL: { name: string; comment: string }[] = [
  { name: "Ayesha K.", comment: "Fabric quality bilkul expectations se bhi zyada acha tha. Stitching neat hai." },
  { name: "Bilal R.", comment: "Fit perfect aya, delivery bhi time pe. Highly recommended." },
  { name: "Sana M.", comment: "Colour exactly wahi tha jo pics mein dikh raha tha. Very happy with this purchase." },
  { name: "Hassan A.", comment: "Packaging premium thi, product bhi utna hi acha nikla. Will order again." },
  { name: "Fatima Z.", comment: "True to size raha, comfortable fabric. Ek dam luxury feel deta hai." },
  { name: "Usman T.", comment: "Detailing aur finishing bohot fine hai, price ke hisab se worth it." },
  { name: "Mariam S.", comment: "Order karne se pehle thoda hesitant thi lekin bilkul satisfied hoon." },
  { name: "Ahmed N.", comment: "Second time order kiya hai is brand se, quality consistent hai." },
  { name: "Zara I.", comment: "Design pictures se bhi zyada khoobsurat lag raha hai in person." },
  { name: "Danish K.", comment: "Fast shipping aur product bhi as-described. No complaints." },
  { name: "Nimra F.", comment: "Ye piece compliments bohot mil rahe hain, bohot khush hoon." },
  { name: "Omar J.", comment: "Material thoda expect se heavier tha, par overall achi quality hai." },
];

function getMockReviews(productId: string): Review[] {
  const seed = seedFromString(productId);
  const count = 3 + (seed % 4); // 3 to 6 reviews
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const entry = REVIEW_POOL[(seed + i * 7) % REVIEW_POOL.length];
    const rating = (seed + i) % 5 === 0 ? 4 : 5; // mostly 5-star, occasional 4-star
    const daysAgo = 3 + ((seed + i * 13) % 60);
    const date = new Date(Date.UTC(2026, 5, 20)); // fixed reference date, deterministic
    date.setUTCDate(date.getUTCDate() - daysAgo);
    reviews.push({
      id: `${productId}-mock-${i}`,
      productId,
      name: entry.name,
      rating,
      comment: entry.comment,
      date: date.toISOString(),
      verified: (seed + i) % 3 !== 0,
    });
  }
  return reviews;
}

type UserReviewsState = {
  reviews: Review[];
  add: (review: Review) => void;
};

/** Reviews the user submits on this device — persisted to localStorage, merged with mock reviews for display. */
export const useUserReviews = create<UserReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],
      add: (review) => set({ reviews: [review, ...get().reviews] }),
    }),
    { name: "House of Aura-user-reviews" }
  )
);

/** Combined list: this device's submitted reviews first, then mock/demo reviews. */
export function getAllReviews(productId: string, userReviews: Review[]): Review[] {
  return [...userReviews.filter((r) => r.productId === productId), ...getMockReviews(productId)];
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}