"use client";

import { RootState } from "@/Redux/Store";
import { useSelector } from "react-redux";

const GetFavCount = () => {
  const { favProducts } = useSelector((state: RootState) => state.fav);
  return favProducts.length;
};

export default GetFavCount;
