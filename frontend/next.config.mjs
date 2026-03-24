/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:4000/api/:path*"
      },
      {
        source: "/uploads/:path*",
        destination: "http://backend:4000/uploads/:path*"
      }
    ];
  }
};

export default nextConfig;
