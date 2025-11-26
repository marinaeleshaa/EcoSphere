"use client";
import { clearFav,toggleFavView } from "@/frontend/Redux/Slice/FavSlice";
import { RootState, AppDispatch } from "@/frontend/Redux/store";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import {  HiOutlineTrash } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

const CardsView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { view } = useSelector((state: RootState) => state.fav);
  const handleView = () => {
    dispatch(toggleFavView());
  };
  const removeAllFav = () => {
    dispatch(clearFav());
  }
  return (
    <div className="flex items-center text-3xl  text-primary">
      <button
        className="cursor-pointer hover:scale-102 p-2 hover:bg-primary/10 rounded-tl-2xl  rounded-br-2xl transition-all duration-200"
        onClick={handleView}
      >
        {view === "grid" ? <CiGrid41 /> : <CiGrid2H />}
      </button>
      <button
        className="cursor-pointer hover:scale-102 p-2 hover:bg-primary/10 rounded-tl-2xl  rounded-br-2xl transition-all duration-200"
        onClick={removeAllFav}
      >
<HiOutlineTrash />
      </button>
    </div>
  );
};

export default CardsView;
