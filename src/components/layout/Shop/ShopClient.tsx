import { useTranslations } from "next-intl";
import HeroSection from "../common/HeroSection";
import ShopHero from "./ShopHero";
import ShopSection from "./ShopSection";
import { IShop } from "@/types/ShopTypes";

function ShopClient({ shops }: { shops: IShop[] }) {
  const t = useTranslations("Shop.hero");
  return (
    <>
      <HeroSection
        title={t("title")}
        subTitle={t("subtitle")}
        imgUrl="/s.png"
      />
      <ShopHero />

      <ShopSection shops={shops} />
    </>
  );
}

export default ShopClient;
