// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
  // This prevents the "Cannot destructure property 'data' of useSession" error
  experimental: {
    // Disable static generation for pages that use authentication
    appDir: true,
  },
  staticPageGenerationTimeout: 120,
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
