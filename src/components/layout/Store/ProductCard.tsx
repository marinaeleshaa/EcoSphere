"use client";
import Image from "next/image";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/frontend/redux/store";
import {
  isInFavSelector,
  toggleFavoriteAsync,
} from "@/frontend/redux/Slice/FavSlice";
import { IoHeartCircleOutline, IoHeartCircleSharp } from "react-icons/io5";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/frontend/redux/hooks";
import {
  addItem,
  isInCartSelector,
  removeItem,
} from "@/frontend/redux/Slice/CartSlice";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IProduct } from "@/types/ProductType";
import Link from "next/link";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const t = useTranslations("Store.product");
  const {
    id,
    productName,
    productPrice,
    productSubtitle,
    productImg,
    restaurantId,
    sustainabilityScore,
    sustainabilityReason,
    availableOnline = false,
    shopName,
    shopSubtitle,
    category,
  } = product;

  // Fallbacks for data mismatch (handling raw IMenuItem structure)
  const safeName = productName || (product as any).title || "Unknown Product";
  const safePrice = productPrice ?? (product as any).price ?? 0;
  const safeSubtitle = productSubtitle || (product as any).subtitle || "";
  const safeImg =
    productImg || (product as any).avatar?.url || "/store img/2.jpg";
  const safeId = id || (product as any)._id;

  const router = useRouter();

  const dispatch = useAppDispatch();
  const isFav = useSelector((state: RootState) =>
    isInFavSelector(state, safeId)
  );
  const isInCart = useSelector((state: RootState) =>
    isInCartSelector(state, safeId)
  );

  const handleFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Use partial object logic or ensure FavSlice handles it
    dispatch(toggleFavoriteAsync({ ...product, id: safeId } as IProduct));
    if (isFav) {
      toast.success(t("removedFromFavorites"));
    } else {
      toast.success(t("addedToFavorites"));
    }
  };

  const handleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isInCart) {
      dispatch(removeItem(safeId));
      toast.success(t("removedFromCart"));
    } else {
      dispatch(
        addItem({
          id: safeId,
          productName: safeName,
          productPrice: safePrice,
          productSubtitle: safeSubtitle,
          productImg: safeImg,
          restaurantId: restaurantId || "",
          shopName: "",
          shopSubtitle: "", // Not passed currently
          productDescription: "",
          quantity: 1,
          maxQuantity: product.quantity || 1,
          inStock: product.inStock !== undefined ? product.inStock : true,
          availableOnline: product.availableOnline || false,
          sustainabilityScore,
          sustainabilityReason,
        })
      );
      toast.success(t("addedToCart"));
    }
  };

  // Determine badge color
  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500 text-white";
    if (score >= 5) return "bg-yellow-500 text-black";
    return "bg-red-500/60 text-white";
  };

  return (
    <div
      className="rounded-tr-[80px] rounded-bl-[80px] shadow-2xl h-110 flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-primary/10 cursor-pointer relative group p-4 space-y-2"
      onClick={() => router.push(`/store/${safeId}`)}
    >
      {/* header - fixed height */}
      <div className="flex justify-between items-center  ">
        <div className="flex gap-3 items-center flex-1 min-w-0">
          <Image
            width={100}
            height={100}
            src={safeImg}
            alt={`${safeName} avatar`}
            className="w-10 h-10 rounded-full shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 font-medium text-sm leading-tight">
              {shopName}
            </p>
            <p className="text-xs text-secondary-foreground line-clamp-1">
              {shopSubtitle}
            </p>
          </div>
        </div>
        {/* Removed blue dot since badge is better indicator, or keep it if it means 'active' */}
        <div
          className={`rounded-full w-3 h-3 bg-primary shrink-0 mr-5 ${
            availableOnline ? "bg-green-500" : "bg-red-500/60"
          }`}
        ></div>
      </div>

      {/* product img - fixed height */}
      <div className="w-full  relative  h-42.5 shrink-0">
        <Image
          width={1000}
          height={1000}
          src={safeImg}
          alt={safeName || "Product Image"}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleFav}
          className="cursor-pointer absolute top-3 right-0 hover:scale-130 transition text-primary duration-300 text-4xl"
        >
          {isFav ? <IoHeartCircleSharp /> : <IoHeartCircleOutline />}
        </button>
      </div>
      {/* badges */}
      <div className=" flex  items-center gap-2 ">
        <div className="w-fit px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md cursor-help bg-primary text-primary-foreground">
          {product.category || "Other"}
        </div>
        {/* Sustainability Badge with Shadcn Tooltip */}
        {sustainabilityScore !== undefined && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className={` w-fit px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md cursor-help ${getScoreColor(
                    sustainabilityScore
                  )}`}
                >
                  <span>🌿</span>
                  <span>{sustainabilityScore}/10</span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-50 text-xs z-50 bg-primary text-primary-foreground border-none"
              >
                <p>{sustainabilityReason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {/* product details - flexible but controlled */}
      <div className=" flex flex-col flex-1 min-h-0">
        <div className="text-lg flex justify-between font-semibold line-clamp-1 mb-1">
          <span className="line-clamp-1">{safeName}</span>
          <p className="text-lg text-primary font-semibold ">
            {typeof safePrice === "number" ? safePrice.toFixed(2) : "0.00"}
            <span className="text-primary ml-1">€</span>
          </p>
        </div>
        <div className="grow ">
          <p className="text-sm   text-secondary-foreground/90 line-clamp-1   ">
            {safeSubtitle}
          </p>
          {/* Dynamic Stock Display */}
          {product.quantity !== undefined &&
            product.quantity > 0 &&
            product.quantity <= 10 && (
              <p>
                <span className="text-sm capitalize text-red-400 line-clamp-1">
                  {t("lowStock", { count: product.quantity })}
                </span>
              </p>
            )}
          {(!product.quantity || product.quantity <= 0) && (
            <p>
              <span className="text-sm capitalize text-red-500 font-semibold line-clamp-1">
                {t("outOfStock")}
              </span>
            </p>
          )}
        </div>

        <div className=" flex gap-3 text-2xl ">
          <button
            className={`myBtnPrimary rounded-tl-none! rounded-br-none! w-full  mx-auto ${
              !availableOnline || !product.quantity || product.quantity <= 0
                ? "cursor-not-allowed! opacity-50"
                : ""
            }`}
            onClick={handleCart}
            disabled={
              !availableOnline || !product.quantity || product.quantity <= 0
            }
          >
            {!availableOnline || !product.quantity || product.quantity <= 0 ? (
              <div className="flex gap-2 justify-evenly text-nowrap items-center">
                <RiShoppingCartLine />
                <span className="mr-2">{t("outOfStock")}</span>
              </div>
            ) : isInCart ? (
              <div className="flex gap-2 justify-evenly text-nowrap items-center">
                <RiShoppingCartFill />
                <span className="mr-2">{t("removedFromCart")}</span>
              </div>
            ) : (
              <div className="flex justify-evenly gap-2 items-center">
                <RiShoppingCartLine />
                <span className="mr-2">{t("addedToCart")}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
