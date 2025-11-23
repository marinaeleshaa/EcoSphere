"use client";
import { toggleFavView } from "@/Redux/fav/FavSlice";
import { AppDispatch, RootState } from "@/Redux/Store";
import { CiGrid2H, CiGrid2V } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";

const CardsView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { view } = useSelector((state: RootState) => state.fav);
  const handleView = () => {
    dispatch(toggleFavView());
  };
  return (
    <div className="flex items-center text-3xl  text-primary">
      <button
        className="cursor-pointer hover:scale-102 p-2 hover:bg-primary/10 rounded-tl-2xl  rounded-br-2xl transition-all duration-200"
        onClick={handleView}
      >
        {view === "grid" ? <CiGrid2V /> : <CiGrid2H />}
      </button>
    </div>
  );
};

export default CardsView;
