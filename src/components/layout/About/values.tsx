import Reveal from "@/components/ui/reveal";
import { Leaf, Handshake, Globe, Users } from "lucide-react";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { getTranslations } from "next-intl/server";

export default async function Values() {
  const t = await getTranslations("About.values");

  const values = [
    {
      key: "planetFirst",
      icon: <Leaf className="w-8 h-8 text-accent-foreground" />,
    },
    {
      key: "integrity",
      icon: <Handshake className="w-8 h-8 text-accent-foreground" />,
    },
    {
      key: "accessibility",
      icon: <Globe className="w-8 h-8 text-accent-foreground" />,
    },
    {
      key: "community",
      icon: <Users className="w-8 h-8 text-accent-foreground" />,
    },
  ];

  return (
    <section className="relative py-20 text-foreground overflow-hidden">
      <div className="mx-auto w-[80%] px-4 relative z-10">
        <Reveal>
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xl font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
              {t("label")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {t("title")}
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {values.map((value, i) => (
              <BasicAnimatedWrapper
                key={i}
                index={i}
                whileHover={{ translateY: -4 }}
                className="rounded-2xl p-8 text-center shadow-lg duration-300 group border border-transparent hover:border-theme transform hover:scale-[1.02] ring-2 ring-primary/30 dark:ring-primary/60 dark:shadow-primary/30"
              >
                <div className="mx-auto w-20 h-20 bg-primary/0.08 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="font-bold text-xl text-accent-foreground mb-4">
                  {t(`cards.${value.key}.title`)}
                </h3>

                <p className="text-sm text-foreground leading-relaxed">
                  {t(`cards.${value.key}.text`)}
                </p>
              </BasicAnimatedWrapper>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
