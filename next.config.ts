import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "purple-manatee-256891.hostingersite.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
