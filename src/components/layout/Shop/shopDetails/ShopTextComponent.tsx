"use client";
import { IReview } from "@/types/ShopTypes";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";

interface ShopTextComponentProps {
  reviews: IReview[];
}

const ShopTextComponent = ({ reviews }: ShopTextComponentProps) => {
  const t = useTranslations("ShopDetails.reviews");

  const validReviews = reviews.filter(
    (r): r is IReview =>
      r && typeof r.rate === "number" && typeof r.review === "string"
  );

  const displayReviews = validReviews.slice();

  return (
    <section className="my-2 overflow-hidden">
      <BasicAnimatedWrapper>
        <div className="flex items-center justify-center gap-5 capitalize text-foreground text-lg md:text-xl border-b-2 p-5 border-primary">
          <h2 className="text-primary font-semibold">{t("title")}</h2>
        </div>

        <div className="my-5 max-h-[260px] overflow-y-auto">
          {displayReviews.length > 0 ? (
            <div className="space-y-6">
              {displayReviews.map((review, index) => (
                <BasicAnimatedWrapper
                  key={review.review}
                  index={index}
                  delay={0.1}
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

export default ShopTextComponent;
