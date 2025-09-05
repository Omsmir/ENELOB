import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com", // The domain of the image source
        port: "", // Leave empty if not using a specific port
        pathname: "/images/**", // Define the path pattern
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com", // Example for Firebase
      },
      {
        hostname: "picsum.photos",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: isProd
      ? "http://backend:8090"
      : "http://localhost:8090",
  },
};

export default nextConfig;
