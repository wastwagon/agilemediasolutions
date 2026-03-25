/** @type {import('next').NextConfig} */
const rawBackendOrigin = process.env.BACKEND_INTERNAL_URL || "";
const backendOrigin =
  rawBackendOrigin.startsWith("http://backend:")
    ? rawBackendOrigin
    : "http://backend:4000";

const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
