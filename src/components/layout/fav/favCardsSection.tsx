"use client";

import { RootState } from "@/frontend/redux/store";
import { useSelector } from "react-redux";
import FavCard from "./FavCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const FavCardsSection = () => {
  const t = useTranslations('Favorites.emptyState');
  const { view, favProducts } = useSelector((state: RootState) => state.fav);

  return (
    <section>
      {favProducts.length === 0 && (
        <div className="flex items-center justify-center p-20 bg-primary/10 rounded-xl mt-10 my-20">
          <div className="text-center max-w-md px-6">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 ">
              <Heart className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t('title')}
            </h2>

            <p className="text-secondary-foreground mb-6">
              {t('description')}
            </p>

            <Link href="/store" className="bg-primary text-primary-foreground px-10 py-3 rounded-full transition duration-400 hover:scale-102 text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4">
              {t('browseButton')}
            </Link>
          </div>
        </div>
      )}
      {favProducts.length > 0 && (
        <div
          className={`${view === "grid"
              ? "grid grid-cols-4 gap-15 mb-10"
              : "flex flex-col gap-5 mb-10 w-[90%] mx-auto"
            } my-10 p-10 bg-primary/10 rounded-xl `}
        >
          {favProducts.map((product) => (
            <FavCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FavCardsSection;
