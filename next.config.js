/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable server-side rendering for pages that use authentication
  experimental: {
    // Disable static generation for pages that use authentication
    appDir: true,
  },
  staticPageGenerationTimeout: 120,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
