"use client";
import { IProduct } from "@/types/ProductType";
import Image from "next/image";
import { useState } from "react";
import { Heart, Star, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { RootState } from "@/frontend/redux/store";
import {
  isInFavSelector,
  toggleFavoriteAsync,
} from "@/frontend/redux/Slice/FavSlice";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import {
  addItem,
  isInCartSelector,
  removeItem,
} from "@/frontend/redux/Slice/CartSlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ProductDetailsCard = ({ product }: { product: IProduct }) => {
  const t = useTranslations("ProductDetails.card");
  const {
    id,
    shopName,
    shopSubtitle,
    productName, // Added
    productImg,
    productPrice,
    availableOnline,
  } = product;

  // Defensive fallbacks
  const safeName = productName || (product as any).title || "Unknown Product";
  const safePrice = productPrice ?? (product as any).price ?? 0;
  const safeImg =
    productImg ||
    (product as any).avatar?.url ||
    "/store img/product-placeholder.png";
  const safeDescription =
    product.productDescription || (product as any).description || shopSubtitle;
  const safeId = id || (product as any)._id;

  const [count, setCount] = useState(1);
  const isFav = useAppSelector((state: RootState) =>
    isInFavSelector(state, safeId)
  );
  const isInCart = useAppSelector((state: RootState) =>
    isInCartSelector(state, product.id)
  );
  const dispatch = useAppDispatch();

  const handleCartToggle = () => {
    if (!product.inStock) {
      toast.error(t("outOfStock")); // Added toast for out of stock
      return; // Don't allow cart actions for out-of-stock items
    }

    if (isInCart) {
      dispatch(removeItem(product.id));
      toast.success(t("removedFromCart")); // Added toast here
    } else {
      dispatch(
        addItem({
          ...product,
          quantity: count, // Use the selected count from quantity selector
          maxQuantity: product.quantity, // Set available stock as max
        })
      );
      toast.success(t("addedToCart")); // Added toast here
    }
  };

  const handleFav = () => {
    dispatch(toggleFavoriteAsync({ ...product, id: safeId } as IProduct));
    if (isFav) {
      toast.success(t("removedFromFavorites"));
    } else {
      toast.success(t("addedToFavorites"));
    }
  };

  const handleIncrement = () => {
    const maxAllowed = product.quantity || 999; // Use product quantity as max
    if (count < maxAllowed) {
      setCount((prev) => prev + 1);
    } else {
      toast.error(`Only ${maxAllowed} available in stock`);
    }
  };
  const handleDecrement = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };

  return (
    <section className="">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center items-center md:flex-row gap-10 my-30 "
      >
        {/* product image */}
        <div className="relative shadow-lg rounded-lg  ">
          <Image
            width={600}
            height={400}
            src={safeImg}
            alt={safeName}
            className="w-125 rounded-lg "
          />
          {/* top right decorative SVG */}
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

          {/* bottom left decorative SVG */}
          <div className="max-w-[50%] max-h-[30%] absolute -bottom-[3%] -left-[5%] rounded-full bg-background p-4 drop-shadow-lg ">
            {/* shop data */}
            <div className="bg-primary rounded-full px-4 py-2 w-full text-center flex items-center  gap-4">
              <Image
                src="/store img/avatar.jpg"
                alt="shop icon"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="hidden sm:block">
                <h2 className="text-base font-bold text-primary-foreground ">
                  {shopName}
                </h2>
                <p className="text-primary-foreground/80 text-sm">
                  {availableOnline
                    ? t("availableOnline")
                    : t("notAvailableOnline")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* product details */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Product name and subtitle */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {safeName}
            </h1>
            <p className="text-lg text-muted-foreground">{shopSubtitle}</p>
          </div>

          {/* Rating */}
          {/* <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-primary text-primary"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(5.0)</span>
          </div> */}

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {typeof safePrice === "number" ? safePrice.toFixed(2) : "0.00"} EGP
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("availability")}:
            </span>
            {product.quantity !== undefined && product.quantity > 0 ? (
              <span className="text-sm font-semibold text-green-600">
                {t("inStock", { count: product.quantity })}
              </span>
            ) : (
              <span className="text-sm font-semibold text-red-600">
                {t("outOfStock")}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {safeDescription}
            </p>
          </div>

          {/* Quantity selector */}
          {product.quantity !== undefined && product.quantity > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{t("quantity")}</span>
              <div className="flex items-center rounded-full text-primary border border-primary p-2">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 cursor-pointer text-foreground flex items-center justify-center rounded hover:bg-muted transition duration-400"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" strokeWidth={3} />
                </button>
                <motion.div
                  key={count}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.2 }}
                  className="border-x"
                >
                  <span className="w-12 px-4 text-center font-semibold">
                    {count}
                  </span>
                </motion.div>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 cursor-pointer flex items-center justify-center rounded hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleCartToggle}
              disabled={!product.inStock}
              className={cn(
                "w-full h-full myBtnPrimary",
                isInCart && "bg-red-500 hover:bg-red-600"
              )}
            >
              {!product.inStock
                ? t("outOfStock")
                : isInCart
                ? t("removeFromCart")
                : t("addToCart")}
            </Button>
            <button
              onClick={handleFav}
              className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                isFav
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-primary text-primary hover:bg-primary/10 "
              }`}
              aria-label="Add to favorites"
            >
              <Heart className={`w-6 h-6 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProductDetailsCard;
