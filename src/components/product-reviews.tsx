"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { getAllReviews, getAverageRating, useUserReviews, type Review } from "@/lib/reviews";

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= Math.round(rating) ? "fill-gold text-gold" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { reviews: userReviews, add } = useUserReviews();
  const reviews = getAllReviews(productId, userReviews);
  const average = getAverageRating(reviews);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = () => {
    if (!name.trim() || !comment.trim()) {
      toast.error("Naam aur review dono likhein");
      return;
    }
    const review: Review = {
      id: `${productId}-user-${Date.now()}`,
      productId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      verified: false,
    };
    add(review);
    toast.success("Review submit ho gaya, shukriya!");
    setName("");
    setComment("");
    setRating(5);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Stars rating={average} size="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {average.toFixed(1)} out of 5 ({reviews.length} reviews)
          </span>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs uppercase tracking-widest underline underline-offset-4 hover:text-gold"
        >
          {showForm ? "Cancel" : "Write a review"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 border border-border p-5 space-y-4 anim-fade-up">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Your rating</label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`Rate ${n} stars`}>
                  <Star className={`h-6 w-6 ${n <= rating ? "fill-gold text-gold" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm"
              placeholder="Aapka naam"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Your review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm"
              placeholder="Product ke baare mein bataein..."
            />
          </div>
          <button
            onClick={submit}
            className="bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            Submit review
          </button>
        </div>
      )}

      <div className="mt-8 divide-y divide-border">
        {reviews.map((r) => (
          <div key={r.id} className="py-5 first:pt-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{r.name}</span>
                {r.verified && (
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-1.5 py-0.5">
                    Verified buyer
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="mt-2">
              <Stars rating={r.rating} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}