"use client"

import { useEffect } from "react";
import { useDispatch } from "react-redux"
import FavCardsSection from "./favCardsSection"
import { getFavorites } from "@/frontend/redux/Slice/FavSlice";
import { AppDispatch } from "@/frontend/redux/store";

export const FavCardsClient = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  return <FavCardsSection />
}