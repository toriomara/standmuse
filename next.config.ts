import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs", "@prisma/client"],
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
