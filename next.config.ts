import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001", 
        "psychic-potato-r4gv7567j4pgf5vqx-3000.app.github.dev",
        "*.vercel.app"
      ],
    },
  },
};

export default nextConfig;
