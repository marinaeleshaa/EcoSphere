"use client";
import { IShop } from "@/types/ShopTypes";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

const ShopTextComponent = ({ shop }: { shop: IShop }) => {
  const t = useTranslations("ShopDetails.reviews");
  // Get top 3 reviews sorted by rating (highest first)
  const topReviews = shop.restaurantRating
    ? [...shop.restaurantRating].sort((a, b) => b.rate - a.rate).slice(0, 3)
    : [];

  return (
    <section className="my-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-5 capitalize text-foreground text-lg md:text-xl border-b-2 p-5 border-primary">
          <h2 className="text-primary font-semibold">{t("title")}</h2>
        </div>
        <div className="my-5">
          {topReviews.length > 0 ? (
            <div className="space-y-6">
              {topReviews.map((review, index) => (
                <motion.div
                  key={review.userId}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="border-b border-border pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-semibold text-lg">
                        {review.review.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {review.review}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rate
                                  ? "fill-primary text-primary"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {t("noReviews")}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default ShopTextComponent;
