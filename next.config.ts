import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "purple-manatee-256891.hostingersite.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "purple-manatee-256891.hostingersite.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.hostingersite.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.wordpress.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
