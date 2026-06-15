import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ro", "it"],
  defaultLocale: "ro",
  localePrefix: "never",
  localeDetection: true,
});
