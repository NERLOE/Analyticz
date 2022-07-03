/** @type {import('next').NextConfig} */

const { withSuperjson } = require("next-superjson");
const { withAnalyticzProxy } = require("./AnalyticzProvider");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: true,
  },
  env: {
    SITE_URL: process.env.SITE_URL,
  },
};

module.exports = withAnalyticzProxy({
  customDomain: "https://analyticz.marcusnerloe.dk",
})(withSuperjson()(nextConfig));
