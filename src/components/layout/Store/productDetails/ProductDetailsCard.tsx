"use client";
import { IProduct } from "@/types/ProductType";
import Image from "next/image";
import React, { useState } from "react";
import { Heart, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/frontend/redux/store";
import { isInFavSelector, toggleFav } from "@/frontend/redux/Slice/FavSlice";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';

const ProductDetailsCard = ({ product }: { product: IProduct }) => {
  const t = useTranslations('ProductDetails.card');
  const {
    id,
    shopName,
    shopSubtitle,
    productImg,
    productName,
    productPrice,
    productSubtitle,
    productDescription,
  } = product;

  const [count, setCount] = useState(1);
  const isFav = useSelector((state: RootState) => isInFavSelector(state, id));
  const dispatch = useDispatch<AppDispatch>()
  const handleFav = () => {
    dispatch(toggleFav(product));
    if (isFav) {
      toast.success(t('removedFromFavorites'));
    } else {
      toast.success(t('addedToFavorites'));
    }
  }

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };

  return (
    <section className="">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center items-center md:flex-row gap-10 my-30 ">
        {/* product image */}
        <div className="relative shadow-lg rounded-lg  ">
          <Image
            width={600}
            height={400}
            src={productImg}
            alt={productName}
            className="w-[500px] rounded-lg "
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
                  {shopSubtitle}
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
              {productName}
            </h1>
            <p className="text-lg text-muted-foreground">{productSubtitle}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-primary text-primary"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(5.0)</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            ${productPrice.toFixed(2)}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('description')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {productDescription}
            </p>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{t('quantity')}</span>
            <div className="flex items-center gap-3 border rounded-lg p-2">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 cursor-pointer flex items-center justify-center rounded hover:bg-muted transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold">{count}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 cursor-pointer flex items-center justify-center rounded hover:bg-muted transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer">
              <ShoppingCart className="w-5 h-5" />
              {t('addToCart')}
            </button>
            <button
              onClick={handleFav}
              className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${isFav
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-primary text-primary hover:bg-primary/10 "
                }`}
              aria-label="Add to favorites"
            >
              <Heart
                className={`w-6 h-6 ${isFav ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProductDetailsCard;
