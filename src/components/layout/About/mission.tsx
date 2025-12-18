import Reveal from "@/components/ui/reveal";
import { Target } from "lucide-react";
import Image from "next/image";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { getTranslations } from "next-intl/server";

export default async function Mission() {
  const t = await getTranslations("About.mission");

  return (
    <section className="relative w-full text-foreground py-16 md:py-24 overflow-hidden">
      <div className="mx-auto w-[80%] px-4 md:px-6">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* LEFT COLUMN: Content */}
            <div className="flex flex-col space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-xl font-bold tracking-widest text-accent-foreground uppercase flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  {t("label")}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-wrap text-foreground leading-tight">
                  {t("title")}
                  <span className="text-primary">{t("titleHighlight")}</span>
                </h2>
              </div>

              {/* Summarized Text */}
              <div className="space-y-6 text-foreground text-lg leading-relaxed">
                <p>{t("description")}</p>
                <div className="ltr:pl-6 rtl:pr-6 ltr:border-l-4 rtl:border-r-4 border-primary space-y-4">
                  <div>
                    <strong className="block text-foreground">
                      {t("forConsumers.title")}
                    </strong>
                    <span className="text-sm">
                      {t("forConsumers.description")}
                    </span>
                  </div>
                  <div>
                    <strong className="block text-foreground">
                      {t("forBusinesses.title")}
                    </strong>
                    <span className="text-sm">
                      {t("forBusinesses.description")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Image & Decor */}
            <div className="relative order-1 lg:order-2 ltr:pl-4 rtl:pr-4 md:ltr:pl-8 md:rtl:pr-8">
              {/* Primary color decorative sidebar line similar to first component */}
              <div className="absolute ltr:left-0 rtl:right-0 top-10 bottom-10 w-1.5 rounded-full hidden md:block bg-primary" />

              {/* Main Image Container */}
              <BasicAnimatedWrapper className="relative z-10 overflow-hidden rounded-xl p-4 shadow-lg transform transition-transform hover:scale-[1.02] duration-500 ring-2 ring-primary/40 dark:ring-primary/60 dark:shadow-primary/30">
                <div className="relative w-full h-full min-h-80 md:min-h-125">
                  <Image
                    src="/Mission.png"
                    alt="EcoSphere Mission"
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
