import CardsView from "@/components/layout/fav/CardsView";
import FavHero from "@/components/layout/fav/FavHero";
import { FavCardsClient } from "@/components/layout/fav/FavCardsClient";

export default function Fav() {
  return (
    <div>
      <FavHero />
      <div className="w-[80%] mx-auto mt-10">
        <CardsView />
        <FavCardsClient />
      </div>

    </div>
  );
}
