/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable compression
    compress: true,

    // Production optimizations
    reactStrictMode: true,

    // Remove console logs in production
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Performance optimizations
    poweredByHeader: false,

    // Generate sitemap
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    },
                ],
            },
        ]
    },

    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'assets.aceternity.com',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
            },
            {
                protocol: 'https',
                hostname: 'fra.cloud.appwrite.io',
            },
        ],
    },

    // Experimental features for better performance
    experimental: {
        optimizePackageImports: ['lucide-react', '@clerk/nextjs'],
    },
};

export default nextConfig;

