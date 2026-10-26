import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.0.2"],
  async rewrites() {
    const apiUrl = process.env.CAPTAIN_API;

    if (!apiUrl) {
      throw new Error("CAPTAIN_API is required");
    }

    return [
      {
        source: "/backend/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
