/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: true,
  },
  env: {
    PROD_URL: process.env.PROD_URL,
  },
};

module.exports = nextConfig;
