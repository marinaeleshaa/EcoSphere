import { RootState } from "@/frontend/redux/store";
import { IProduct } from "@/types/ProductType";
import { Star } from "lucide-react";
import Image from "next/image";
import { HiMiniTrash } from "react-icons/hi2";
import { toggleFavoriteAsync } from "@/frontend/redux/Slice/FavSlice";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import {
  addItem,
  isInCartSelector,
  removeItem,
} from "@/frontend/redux/Slice/CartSlice";
import { useRouter } from "next/navigation";

interface FavCardProps {
  product: IProduct;
}

const FavCard = ({ product }: FavCardProps) => {
  const t = useTranslations("Favorites.card");
  const router = useRouter();
  const { view } = useAppSelector((state: RootState) => state.fav);
  const isInCart = useAppSelector((state: RootState) =>
    isInCartSelector(state, product.id),
  );
  const dispatch = useAppDispatch();
  const handleRemoveFromFav = () => {
    dispatch(toggleFavoriteAsync(product));
    toast.success(t("removedFromFavorites"));
  };

  const handleAddToCart = () => {
    if (!product.quantity) return;
    if (isInCart) {
      dispatch(removeItem(product.id));
      toast.success(t("removedFromCart"));
    } else {
      dispatch(
        addItem({
          ...product,
          quantity: 1,
          maxQuantity: product.quantity || 999,
        }),
      );
      toast.success(t("addedToCart"));
    }
  };

  return (
    <div
      onClick={() => router.push(`/store/${product.id}`)}
      className={`${
        view === "grid" ? "flex-col" : "flex-row items-center gap-4 h-75 p-2"
      } flex cursor-pointer shadow-md rounded-lg dark:bg-primary/10 bg-background/50 relative`}
    >
      {/* img */}
      <div className={`${view === "grid" ? "w-full h-62.5" : "w-1/3 h-full"}`}>
        <Image
          src={product.productImg || "/store img/2.png"}
          alt={product.productName}
          width={300}
          height={300}
          className="w-full h-full rounded-lg object-cover"
        />
      </div>
      <div className="p-3 capitalize flex-1 flex flex-col justify-between gap-2">
        <div className="flex justify-between text-foreground text-md md:text-lg">
          <span>{product.productName}</span>
          <span>{product.productPrice} EGP</span>
        </div>
        {view === "horizontal" && (
          <p className="text-primary">{product.productSubtitle}</p>
        )}
        <div className="flex justify-evenly gap-5">
          <button
            className={`myBtnPrimary ${
              !product.quantity ? "cursor-not-allowed! opacity-50" : ""
            }`}
            onClick={handleAddToCart}
            disabled={!product.quantity}
          >
            {product.quantity
              ? isInCart
                ? t("removeFromCart")
                : t("addToCart")
              : t("outOfStock")}
          </button>
        </div>
      </div>
      <button
        className="absolute top-[5%] right-[5%] hover:scale-120 transition duration-300 capitalize text-3xl  cursor-pointer  text-primary  rounded-full "
        onClick={handleRemoveFromFav}
      >
        <HiMiniTrash />
      </button>
    </div>
  );
};

export default FavCard;
