import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 0, // disable default in-memory caching

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100MB',
    },
  },
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'localhost',
      //   port: '',
      //   pathname: '/**',
      // },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
