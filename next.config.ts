import type { NextConfig } from "next";

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gktyodytvqurbcbyvnrj.supabase.co",
        pathname: "/storage/v1/object/public/**",
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
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // Allow media from S3 and images from any source to match the images config
            value:
              "default-src 'self'; media-src 'self' https://cse-impact.s3.eu-north-1.amazonaws.com; img-src 'self' data: http: https:;",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
