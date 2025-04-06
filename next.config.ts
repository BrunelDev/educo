import type { NextConfig } from "next";

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mongodb.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "mailtrap.io",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "cse-impact.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};
const nextConfig: NextConfig = {
};

export default nextConfig;
