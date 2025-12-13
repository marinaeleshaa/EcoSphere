"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/ProductType";
import { useSelector } from "react-redux";
import { RootState } from "@/frontend/redux/store";
import { isInFavSelector, toggleFavoriteAsync } from "@/frontend/redux/Slice/FavSlice";
import { IoHeartCircleOutline, IoHeartCircleSharp } from "react-icons/io5";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/frontend/redux/hooks";
import {
  addItem,
  isInCartSelector,
  removeItem,
} from "@/frontend/redux/Slice/CartSlice";

const ProductCard = (product: IProduct) => {
  const t = useTranslations("Store.product");
  const {
    _id,
    title,
    subtitle,
    price,
    avatar,
    availableOnline,
  } = product;

  const router = useRouter();

  const dispatch = useAppDispatch();
  const isFav = useSelector((state: RootState) =>
    isInFavSelector(state, _id)
  );
  const isInCart = useSelector((state: RootState) =>
    isInCartSelector(state, _id)
  );

  const handleFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(product));
    if (isFav) {
      toast.success(t("removedFromFavorites"));
    } else {
      toast.success(t("addedToFavorites"));
    }
  };

  const handleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isInCart) {
      dispatch(
        addItem({
          id: _id,
          price,
          quantity: 1,
          title,
          description: subtitle,
          image: avatar?.url || "/store img/2.jpg",
        })
      );
      toast.success("added to cart");
    } else {
      dispatch(removeItem(_id));
      toast.success("removed from cart");
    }
  };

  return (
    <motion.div
      className="rounded-tr-[80px] rounded-bl-[80px] shadow-2xl h-[440px] flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-primary/10 cursor-pointer"
      onClick={() => router.push(`/store/${_id}`)}
    >
      {/* header - fixed height */}
      <div className="flex justify-between items-center p-5 min-h-20">
        <div className="flex gap-3 items-center flex-1 min-w-0">
          <Image
            width={1000}
            height={1000}
            src={avatar?.url || "/store img/2.jpg"}
            alt={title}
            className="w-10 h-10 rounded-full shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 font-medium text-sm leading-tight">
              {title}
            </p>
            <p className="text-xs text-secondary-foreground line-clamp-1">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="rounded-full w-3 h-3 bg-primary shrink-0 mr-5"></div>
      </div>

      {/* product img - fixed height */}
      <div className="w-full h-[170px] shrink-0">
        <Image
          width={1000}
          height={1000}
          src={avatar?.url || "/store img/2.jpg"}
          alt="product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* product details - flexible but controlled */}
      <div className="p-5 flex flex-col flex-1 min-h-0">
        <p className="text-lg font-semibold line-clamp-1 mb-1">{title}</p>
        <div className="grow ">
          <p className="text-sm text-secondary-foreground/90 line-clamp-3 mb-3   ">
            {subtitle}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold mt-auto ml-10">
            {price.toFixed(2)}
            <span className="text-primary ml-1">EGP</span>
          </p>
          <div className=" flex gap-3 text-2xl">
            <button
              className="cursor-pointer hover:scale-130 transition duration-300"
              onClick={handleCart}
            >
              {isInCart ? <RiShoppingCartFill /> : <RiShoppingCartLine />}
            </button>
            <button
              onClick={handleFav}
              className="cursor-pointer hover:scale-130 transition duration-300 text-3xl"
            >
              {isFav ? <IoHeartCircleSharp /> : <IoHeartCircleOutline />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
