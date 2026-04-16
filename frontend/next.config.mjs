/** @type {import('next').NextConfig} */
const rawBackendOrigin = process.env.BACKEND_INTERNAL_URL || "";
const backendOrigin =
  rawBackendOrigin.startsWith("http://backend:")
    ? rawBackendOrigin
    : "http://backend:4000";

function imageRemotePatterns() {
  /** @type {import('next/dist/shared/lib/image-config').RemotePattern[]} */
  const patterns = [
    { protocol: "http", hostname: "localhost", pathname: "/**" },
    { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
  ];
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      const u = new URL(site.includes("://") ? site : `https://${site}`);
      const protocol = u.protocol === "http:" ? "http" : "https";
      patterns.push({ protocol, hostname: u.hostname, pathname: "/**" });
    } catch {
      /* ignore */
    }
  }
  return patterns;
}

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: imageRemotePatterns(),
  },
  async headers() {
    // Reduce stale asset/page issues during Docker-based iteration.
    return [
      {
        source: "/newhomepage",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/newhomepage/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" }],
      },
    ];
  },
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
