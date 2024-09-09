/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/trpc/:path*",
        destination:
          "https://sticker-maker-studio-ekjb2tv5n-leebrowns-projects.vercel.app/api/trpc/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false, // Change this to true if you want a permanent redirect
      },
    ];
  },
};

export default nextConfig;
