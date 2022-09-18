/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["package-scanner-packages.s3.us-east-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
