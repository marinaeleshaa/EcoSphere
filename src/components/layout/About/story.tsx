import { Globe } from "lucide-react";
import Image from "next/image";
import BasicAnimatedSpanWrapper from "../common/BasicAnimatiedSpanWrapper";
import { getTranslations } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("About.story");

  return (
    <section className="relative w-full text-foreground py-16 md:py-24 overflow-hidden">
      <div className="mx-auto w-[80%] px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* LEFT COLUMN: Images & Decorative Elements */}
          <div className="relative">
            <div className="absolute ltr:-left-4 rtl:-right-4 top-10 bottom-10 w-1.5 rounded-full hidden md:block bg-primary" />

            <div className="relative ltr:pl-4 rtl:pr-4 md:ltr:pl-8 md:rtl:pr-8">
              <div className="relative z-10 overflow-hidden rounded-xl p-4 shadow-lg transform transition-transform hover:scale-[1.02] duration-500 ring-2 ring-primary/40 dark:ring-primary/60 dark:shadow-primary/30">
                <div className="relative w-full h-full min-h-80 md:min-h-87.5">
                  <Image
                    src="/story.png"
                    alt={t("title")}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <div className="absolute ring-2 ring-primary/40 dark:ring-primary/60 -bottom-6 ltr:-right-4 rtl:-left-4 z-20 md:-bottom-10 md:ltr:-right-10 md:rtl:-left-10 w-48 md:w-64 bg-background p-3 rounded-xl shadow-2xl  ">
              <div className="relative w-full h-32 md:h-40">
                <Image
                  src="/story1.png"
                  alt={t("title")}
                  fill
                  className="rounded-lg object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Content */}
          <div className="flex flex-col space-y-6 lg:ltr:pl-8 lg:rtl:pr-8">
            <div className="space-y-2">
              <span className="text-xl font-bold tracking-widest text-accent-foreground uppercase mb-5">
                {t("label")}
              </span>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                  <BasicAnimatedSpanWrapper className="inline-block ltr:mr-3 rtl:ml-3">
                    <Globe size={28} />
                  </BasicAnimatedSpanWrapper>
                  {t("title")}
                </h2>
              </div>
              <p className="text-foreground leading-relaxed">
                {t("description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
