/** @type {import('next').NextConfig} */

const { withSuperjson } = require("next-superjson");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: true,
  },
  env: {
    SITE_URL: process.env.SITE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/js/analyticz.js",
        destination: "https://analyticz.marcusnerloe.dk/js/analyticz.js",
      },
      {
        source: "/api/event",
        destination: "https://analyticz.marcusnerloe.dk/api/event",
      },
    ];
  },
};

module.exports = withSuperjson()(nextConfig);
