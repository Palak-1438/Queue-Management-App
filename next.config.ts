import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react'], // Ensure common packages are transpiled if needed
};

export default nextConfig;
