"use client"

import { clearFav, toggleFavView } from "@/frontend/redux/Slice/FavSlice";
import { RootState, AppDispatch } from "@/frontend/redux/store";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { HiOutlineTrash } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

const CardsView = () => {
  const t = useTranslations("Favorites.view");
  const dispatch = useDispatch<AppDispatch>();
  const { view } = useSelector((state: RootState) => state.fav);
  const handleView = () => {
    dispatch(toggleFavView());
  };
  const removeAllFav = () => {
    dispatch(clearFav());
  };
  return (
    <div className="flex items-center text-3xl  text-primary">
      <button
        className="cursor-pointer hover:scale-102 p-2 hover:bg-primary/10 rounded-tl-2xl  rounded-br-2xl transition-all duration-200"
        onClick={handleView}
        aria-label={view === "grid" ? t("list") : t("grid")}
        title={view === "grid" ? t("list") : t("grid")}
      >
        {view === "grid" ? <CiGrid41 /> : <CiGrid2H />}
      </button>
      <button
        className="cursor-pointer hover:scale-102 p-2 hover:bg-primary/10 rounded-tl-2xl  rounded-br-2xl transition-all duration-200"
        onClick={removeAllFav}
        aria-label={t("clearAll")}
        title={t("clearAll")}
      >
        <HiOutlineTrash />
      </button>
    </div>
  );
};

export default CardsView;
