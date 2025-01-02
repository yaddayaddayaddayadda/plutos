import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // URL path in the frontend
        destination: 'http://localhost:4000/api/:path*', // URL of the Rust backend
      },
    ];
  },
};


export default nextConfig;
