"use client";
import { IShop } from "@/data/shops";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ShopTextComponent = ({ shop }: { shop: IShop }) => {
  // Get top 3 reviews sorted by rating (highest first)
  const topReviews = shop.reviews
    ? [...shop.reviews]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
    : [];

  return (
    <section className="my-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-5 capitalize text-foreground text-lg md:text-xl border-b-2 p-5 border-primary">
          <h2 className="text-primary font-semibold">Reviews</h2>
        </div>
        <div className="my-5">
          {topReviews.length > 0 ? (
            <div className="space-y-6">
              {topReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-b border-border pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-semibold text-lg">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {review.userName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-primary text-primary"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-secondary-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No reviews yet. Be the first to review this shop!
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default ShopTextComponent;
