/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: process.env.NODE_ENV === "development",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    reloadOnPrerender: process.env.NODE_ENV === "development",
  },
};
