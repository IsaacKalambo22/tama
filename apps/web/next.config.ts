import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone", // ✅ REQUIRED for Docker standalone builds

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
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
    ],
  },
}

export default nextConfig