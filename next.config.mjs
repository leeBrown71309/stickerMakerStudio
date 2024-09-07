/** @type {import('next').NextConfig} */
const nextConfig = {
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
