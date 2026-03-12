/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/products/quick-start-system", destination: "/products/digital-presence-starter", permanent: true },
      { source: "/products/content-whatsapp-funnel", destination: "/products/whatsapp-conversion-system", permanent: true },
      { source: "/products/qr-menu-mini-site", destination: "/products/restaurant-growth-system", permanent: true },
      { source: "/products/beauty-booking-flow", destination: "/products/real-estate-listing-system", permanent: true },
      { source: "/products/business-launch-setup", destination: "/products/business-launch-system", permanent: true },
      { source: "/solutions/quick-start-system", destination: "/products/digital-presence-starter", permanent: true },
      { source: "/solutions/content-whatsapp-funnel", destination: "/products/whatsapp-conversion-system", permanent: true },
      { source: "/solutions/qr-menu-mini-site", destination: "/products/restaurant-growth-system", permanent: true },
      { source: "/solutions/beauty-booking-flow", destination: "/products/real-estate-listing-system", permanent: true },
      { source: "/solutions/business-launch-setup", destination: "/products/business-launch-system", permanent: true },
    ];
  },
};

module.exports = nextConfig;
