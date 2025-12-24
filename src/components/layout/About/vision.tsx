import Reveal from "@/components/ui/reveal";
import { Eye } from "lucide-react";
import Image from "next/image";
import BasicAnimatedSpanWrapper from "../common/BasicAnimatiedSpanWrapper";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { getTranslations } from "next-intl/server";

export default async function Vision() {
  const t = await getTranslations("About.vision");

  return (
    <section className="relative w-full text-foreground py-16 md:py-24 overflow-hidden">
      <div className="mx-auto w-[80%] px-4 md:px-6 relative z-10">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* LEFT COLUMN: Content */}
            <div className="flex flex-col space-y-8 order-2 lg:order-2">
              <div className="space-y-4">
                <span className="text-xl font-bold tracking-widest text-accent-foreground uppercase flex items-center gap-2">
                  <BasicAnimatedSpanWrapper className="inline-flex items-center">
                    <Eye className="w-6 h-6" />
                  </BasicAnimatedSpanWrapper>
                  {t("label")}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  {t("title")}
                  <span className="text-accent-foreground">
                    {t("titleHighlight")}
                  </span>
                </h2>
              </div>

              <div className="space-y-6 text-foreground text-lg leading-relaxed">
                <p>
                  {t("description")}{" "}
                  <strong>{t("descriptionHighlight")}</strong>
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Image & Decor */}
            <div className="relative order-1 lg:order-1 ltr:pl-4 rtl:pr-4 md:ltr:pl-8 md:rtl:pr-8">
              {/* Primary color decorative sidebar line */}
              <div className="absolute ltr:left-0 rtl:right-0 top-10 bottom-10 w-1.5 rounded-full hidden md:block bg-primary" />
              <div className="absolute -top-6 ltr:-right-6 rtl:-left-6 z-0 opacity-10"></div>

              {/* Main Image Container */}
              <BasicAnimatedWrapper className="relative z-10 overflow-hidden rounded-xl p-4  shadow-lg transform transition-transform hover:scale-[1.02] duration-500 ring-2 ring-primary/40 dark:ring-primary/60 dark:shadow-primary/30">
                <div className="relative w-full h-full min-h-80 md:min-h-105">
                  <Image
                    src="/vision.png"
                    alt="Global Sustainable Vision"
                    fill
                    className="object-contain"
                  />
                </div>
              </BasicAnimatedWrapper>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
