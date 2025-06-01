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
      {
        protocol: "https",
        hostname: "example-bucket.s3.amazonaws.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**", // Allows any hostname over HTTPS. WARNING: Use with caution due to security risks.
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**", // Allows any hostname over HTTP. WARNING: Use with caution due to security risks.
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};
const nextConfig: NextConfig = {};

export default nextConfig;
