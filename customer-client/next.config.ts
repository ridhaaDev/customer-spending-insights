import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server-rendered. `standalone` emits a self-contained Node server for the Docker/Lambda images.
  output: "standalone",
  images: {
    // No image optimisation service is needed for this app; keeps the Lambda image small.
    unoptimized: true,
  },
  experimental: {
    // Recently visited pages render instantly from the router cache; data freshness is TanStack's job.
    staleTimes: { dynamic: 30 },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
