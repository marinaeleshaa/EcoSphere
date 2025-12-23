"use client";

import { IReview } from "@/types/ShopTypes";
import { Star, MessageSquareCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import BasicAnimatedWrapper from "@/components/layout/common/BasicAnimatedWrapper";
import { toast } from "sonner";

interface ProductReviewsProps {
  reviews: IReview[];
  productId: string;
}

const ProductReviews = ({ reviews, productId }: ProductReviewsProps) => {
  const t = useTranslations("ShopDetails.reviews");
  const [localReviews, setLocalReviews] = useState<IReview[]>(reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validReviews = localReviews.filter(
    (r): r is IReview =>
      r && typeof r.rate === "number" && typeof r.review === "string",
  );

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          review: reviewText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      // The API returns the new review object directly based on my implementation
      const newReview: IReview = data.data || data;

      // ✅ update local state immediately
      setLocalReviews((prev) => [newReview, ...prev]);

      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      setShowReviewForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-10 w-full">
      <BasicAnimatedWrapper>
        {/* Header */}
        <div className="flex items-center justify-between gap-5 capitalize text-foreground text-lg md:text-xl border-b-2 p-5 border-primary">
          <div className="flex items-center gap-2">
            <MessageSquareCode className="text-primary" />
            <h2 className="text-primary font-semibold">{t("title")}</h2>
          </div>

          {/*<button
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Add review
          </button>*/}
        </div>

        {/* Review Form */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showReviewForm ? "max-h-150 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showReviewForm && (
            <div className="m-5 p-6 bg-muted/50 rounded-lg border border-border">
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full rounded-lg border border-border p-3 bg-background"
                />

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setRating(0);
                      setReviewText("");
                    }}
                    className="px-6 py-2 bg-muted rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="my-5 max-h-65 overflow-y-auto">
          {validReviews.length > 0 ? (
            <div className="space-y-6">
              {validReviews.map((review, index) => (
                <BasicAnimatedWrapper key={index} index={index}>
                  <div className="border-b border-border pb-6 px-5">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rate
                                ? "fill-primary text-primary"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      {/* Can add date or user name here if available */}
                    </div>
                    <p className="text-foreground">{review.review}</p>
                  </div>
                </BasicAnimatedWrapper>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {t("noReviews")}
            </div>
          )}
        </div>
      </BasicAnimatedWrapper>
    </section>
  );
};

export default ProductReviews;
