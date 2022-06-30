/** @type {import('next').NextConfig} */

const { withSuperjson } = require("next-superjson");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: true,
  },
  env: {
    PROD_URL: process.env.PROD_URL,
  },
};

module.exports = withSuperjson()(nextConfig);
