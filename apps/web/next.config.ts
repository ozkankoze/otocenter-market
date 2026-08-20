import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // packages/db workspace'i Next tarafından derlenir
  transpilePackages: ['@ocm/db'],

  experimental: {
    // Prisma client'ı server bundle'ında dışarıda tut
    optimizePackageImports: ['lucide-react'],
  },
  serverExternalPackages: ['@prisma/client', '.prisma/client'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default nextConfig
