import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
      bodySizeLimit: "100MB", // Increase body size limit for server actions
    },
  },

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "madzalo-s3.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "z-p3-scontent.fblz1-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "d2qzsd8jf2durk.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "madzalo-s3.s3.eu-north-1.amazonaws.com",
      },
    ],
  },

  // Other potential customizations (uncomment if needed)
  // reactStrictMode: true,
  // outputFileTracing: false,
}

export default nextConfig
