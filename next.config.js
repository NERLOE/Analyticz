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
};

module.exports = withSuperjson()(nextConfig);
