import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable in-memory caching
  // cacheMaxMemorySize: 0,
  cacheMaxMemorySize: 0, // disable default in-memory caching

  // TypeScript settings
  typescript: {
    ignoreBuildErrors: true, // Skip type-checking during builds
  },

  // ESLint settings
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint checks during builds
  },

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '100MB', // Increase body size limit for server actions
    },
  },

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '13.48.70.174',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname:
          'z-p3-scontent.fblz1-1.fna.fbcdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Other potential customizations (uncomment if needed)
  // reactStrictMode: true,
  // outputFileTracing: false,
};

export default nextConfig;
