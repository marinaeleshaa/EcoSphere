import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import GoBackButton from "@/components/layout/not-found/GoBackButton";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
      <div className="max-w-2xl mx-auto text-center space-y-5 w-full px-4 pb-2">
        {/* 404 Image */}
        <div className="relative max-w-sm mx-auto aspect-square">
          <Image
            src="/error.png"
            alt={t("imageAlt")}
            fill
            className="object-contain"
          />
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-xl animate-bounce md:text-5xl font-extrabold text-accent-foreground">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          {/* Client-side Go Back button */}
          <GoBackButton />

          {/* Server-side link to home */}
          
           <Link
            href="/"
            className="myBtnPrimary "
          >
            {t("goHome")}
          </Link>
          
        </div>

      </div>
  );
}
