# Localization Documentation

## Overview
This project uses `next-intl` for internationalization (i18n). The supported locales are English (`en`), Arabic (`ar`), and French (`fr`), with English as the default.

## Structure
- **`src/i18n/`**: Contains configuration files.
    - `routing.ts`: Defines supported locales and navigation wrappers.
    - `request.ts`: Loads messages for the current locale.
- **`src/middleware.ts`**: Handles locale matching and redirection (e.g., `/` -> `/en`).
- **`src/messages/`**: Contains JSON files for translations (e.g., `en.json`, `ar.json`).
- **`src/app/[locale]/`**: All pages are moved here to capture the `locale` param.

## Adding Translations
1.  Add the key-value pair to `src/messages/en.json`.
2.  Use the `useTranslations` hook in your component.

```tsx
import {useTranslations} from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('MyComponent');
  return <h1>{t('title')}</h1>;
}
```

## Adding a New Language
1.  Add the locale code to `src/i18n/routing.ts`.
2.  Create a new JSON file in `src/messages/` (e.g., `es.json`).
3.  Update `src/middleware.ts` matcher if necessary (usually handled by routing config).
