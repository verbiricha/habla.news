/** @type {import('next').NextConfig} */


const isProduction = process.env.NODE_ENV === "production"

const withPWA = require('next-pwa')({
  dest: 'public',
  skipWaiting: true,
  register: isProduction,
  disable: !isProduction,
});

module.exports = withPWA({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "ja", "de", "ru", "uk", "fa", "it", "zh", "eo", "sw"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: "/.well-known/nostr.json",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/nostr.json",
        destination: "/api/nostr",
      },
    ];
  },
})
