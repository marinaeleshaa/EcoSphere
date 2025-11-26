import CardsView from "@/components/layout/fav/CardsView";
import FavCardsSection from "@/components/layout/fav/favCardsSection";
import FavHero from "@/components/layout/fav/FavHero";
import React from "react";

export default function Fav() {
  return (
    <div>
      <FavHero />
      <div className="w-[80%] mx-auto mt-10">
        <CardsView />
        
      <FavCardsSection />
      </div>

    </div>
  );
}
