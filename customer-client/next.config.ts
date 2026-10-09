import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` writes plain HTML/JS/CSS to ./out for S3 + CloudFront.
  // Server-only features (server actions, API routes, dynamic SSR, middleware,
  // cacheComponents, partialPrefetching) are not available in this mode.
  output: "export",
  images: {
    // next/image optimisation needs a server; serve images as-is from S3.
    unoptimized: true,
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
