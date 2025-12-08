import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ar", "fr"],
  defaultLocale: "en",
  localePrefix: "always", // Show locale prefix for all languages (en, ar, fr)
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
