import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // Don't show locale for default (en), show for others (ar, fr)
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
