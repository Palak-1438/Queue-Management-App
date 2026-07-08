import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react', '@prisma/client', '@prisma/adapter-pg'],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "psychic-potato-r4gv7567j4pgf5vqx-3000.app.github.dev"],
    },
  },
};

export default nextConfig;
