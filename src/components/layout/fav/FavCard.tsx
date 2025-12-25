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

interface FavCardProps {
  product: IProduct;
}

const FavCard = ({ product }: FavCardProps) => {
  const t = useTranslations("Favorites.card");
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
    if (isInCart) {
      dispatch(removeItem(product.id));
      toast.success(t("removedFromCart"));
    } else {
      dispatch(addItem({ ...product, quantity: 1 }));
      toast.success(t("addedToCart"));
    }
  };

  return (
    <div
      className={`${
        view === "grid" ? "flex-col" : "flex-row items-center gap-4 h-75 p-2"
      } flex shadow-md rounded-lg dark:bg-primary/10 bg-background/50 relative`}
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
        <h3 className="text-foreground text-md md:text-lg">
          {product.productName}
        </h3>
        {view === "horizontal" && (
          <>
            <p className="text-primary">{product.productSubtitle}</p>
          </>
        )}
        {/* <p className="text-primary">${product.price.toFixed(2)}</p> */}
        <div className="flex justify-evenly mt-4 gap-5">
          <button className="myBtnPrimary" onClick={handleAddToCart}>
            {isInCart ? t("removeFromCart") : t("addToCart")}
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
