module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "ja", "de", "ru", "uk", "fa"],
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
};
