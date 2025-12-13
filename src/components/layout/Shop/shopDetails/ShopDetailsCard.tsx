"use client";

import { useState } from "react";
import { Star, Clock, Phone, MapPin, MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { IShop, IReview } from "@/types/ShopTypes";
import { toast } from "sonner";
import Image from "next/image";
import dynamic from "next/dynamic";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";

const BranchMap = dynamic(() => import("./ShopMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-border flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

interface ShopDetailsCardProps {
  shop: IShop;
  liveAverageRating: number;
  onReviewAdded: (newReview: IReview) => void;
}

const ShopDetailsCard = ({
  shop,
  onReviewAdded,
  liveAverageRating,
}: ShopDetailsCardProps) => {
  const t = useTranslations("ShopDetails.card");
  const { data: session } = useSession();
  const [showMap, setShowMap] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/shops/${shop._id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          review: reviewText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");

        const newReview: IReview = data.review;
        onReviewAdded(newReview);

        setRating(0);
        setReviewText("");
        setShowReviewForm(false);
      } else {
        toast.error(
          `Failed to submit review: ${data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="">
      <BasicAnimatedWrapper className="flex flex-col gap-10 my-30 w-full">
        <div className="flex flex-col justify-center items-center md:flex-row gap-10 w-full">
          <div className="relative shadow-lg rounded-lg  ">
            <Image
              width={600}
              height={400}
              src={shop.avatar?.url ?? "/shop-img.jpg"}
              alt={shop.name}
              className="w-[500px] rounded-lg "
            />
            <div className="w-[30%] h-[30%] absolute -top-[6%] -right-[6%]  ">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1 1"
                xmlns="http://www.w3.org/2000/svg"
                className="text-background drop-shadow-lg "
              >
                <path
                  d="M0 0H0.479167C0.766667 0 1 0.233333 1 0.520833V1H0.520833C0.233333 1 0 0.766667 0 0.479167V0Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="w-[20%] h-[20%] absolute top-0 right-0 ">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1 1"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary "
              >
                <path
                  d="M0 0H0.479167C0.766667 0 1 0.233333 1 0.520833V1H0.520833C0.233333 1 0 0.766667 0 0.479167V0Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="max-w-[50%] max-h-[30%] absolute -bottom-[3%] -left-[5%] rounded-full bg-background p-4 drop-shadow-lg ">
              <div className="bg-primary rounded-full px-4 py-2 w-full text-center flex items-center  gap-4">
                <Image
                  src="/store img/avatar.jpg"
                  alt="shop icon"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    {shop.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {shop.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(liveAverageRating)
                        ? "fill-primary text-primary"
                        : "fill-none text-primary"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({liveAverageRating.toFixed(1)})
              </span>
            </div>

            <div className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {t("workingHours")}
              </span>
              <span className="text-muted-foreground">{shop.workingHours}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("about")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {shop.description}
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setShowMap(!showMap);
                  setShowContact(false);
                  setShowReviewForm(false);
                }}
                className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer"
              >
                <MapPin className="w-5 h-5" />
                {t("visitShop")}
              </button>
              <button
                onClick={() => {
                  setShowContact(!showContact);
                  setShowMap(false);
                  setShowReviewForm(false);
                }}
                className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer"
                aria-label="Contact shop"
              >
                <Phone className="w-5 h-5" />
                {t("contact")}
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  setShowMap(false);
                  setShowContact(false);
                }}
                className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer"
                aria-label="Add Review"
              >
                <MessageSquarePlus className="w-5 h-5" />
                Add Review
              </button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
            showContact ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showContact && (
            <div className="w-full p-6 bg-muted/50 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[100px]">
                    Phone:
                  </span>
                  <a
                    href={`tel:${shop.phoneNumber}`}
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    {shop.phoneNumber}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Review Form */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
            showReviewForm ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showReviewForm && (
            <div className="w-full p-6 bg-muted/50 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-primary" />
                Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-none text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {rating} star{rating > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reviewText"
                    className="block text-sm font-semibold mb-2"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this shop..."
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setRating(0);
                      setReviewText("");
                    }}
                    className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Map */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
            showMap ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showMap && (
            <BranchMap shopName={shop.name} location={shop.location} />
          )}
        </div>
      </BasicAnimatedWrapper>
    </section>
  );
};

export default ShopDetailsCard;
