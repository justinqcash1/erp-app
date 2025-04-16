/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Remove the appDir line from here
  },
  staticPageGenerationTimeout: 120,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
