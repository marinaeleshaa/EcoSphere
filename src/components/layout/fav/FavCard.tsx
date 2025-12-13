import { AppDispatch, RootState } from "@/frontend/redux/store";
import { IProduct } from "@/types/ProductType";
import { Star } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniTrash } from "react-icons/hi2";
import { toggleFavoriteAsync } from "@/frontend/redux/Slice/FavSlice";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface FavCardProps {
  product: IProduct;
}
const FavCard = ({ product }: FavCardProps) => {
  const t = useTranslations("Favorites.card");
  const { view } = useSelector((state: RootState) => state.fav);
  const dispatch = useDispatch<AppDispatch>();
  const handleRemoveFromFav = () => {
    dispatch(toggleFavoriteAsync(product));
    toast.success(t("removedFromFavorites"));
  };
  return (
    <div
      className={`${
        view === "grid"
          ? "flex-col w-[250px] p-2"
          : "flex-row items-center gap-4 h-[300px] p-2"
      } flex shadow-md rounded-lg dark:bg-primary/10 bg-background/50 relative`}
    >
      {/* img */}
      <div
        className={`${view === "grid" ? "w-full h-[250px]" : "w-1/3 h-full"}`}
      >
        <Image
          src={product.avatar?.url || "/store img/2.png"}
          alt="product img"
          width={300}
          height={300}
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="p-3 capitalize flex-1 flex flex-col justify-between gap-2">
        <h3 className="text-foreground text-md md:text-lg">{product.title}</h3>
        {view === "horizontal" && (
          <>
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

            <p className="text-primary">{product.subtitle}</p>
          </>
        )}
        {/* <p className="text-primary">${product.price.toFixed(2)}</p> */}
        <div className="flex justify-evenly mt-4 gap-5">
          <button className="capitalize flex-1 cursor-pointer bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/80 ">
            {t("addToCart")}
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
