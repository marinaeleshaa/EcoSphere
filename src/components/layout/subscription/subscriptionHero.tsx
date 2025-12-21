import { getTranslations } from "next-intl/server";

const SubscriptionHero = async () => {
  const t = await getTranslations("subscribe");
  return (
    <div className="w-[80%] mx-auto my-10">
      <div className="flex flex-col justify-center items-center p-4 md:p-8">
        <h1 className="text-3xl md:text-6xl font-bold capitalize leading-tight max-w-3xl my-10 text-center">
          {t("titleFirst")}{" "}
          <span className="text-primary">{t("boldTitle")}</span>{" "}
          {t("titleLast")}
        </h1>
      </div>
    </div>
  );
};

export default SubscriptionHero;
