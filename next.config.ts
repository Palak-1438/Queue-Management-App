import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react', '@prisma/client', '@prisma/adapter-pg'],
};

export default nextConfig;
