import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  images: {
  domains: ["techbuilders-backend.onrender.com", "localhost"],
    remotePatterns: [
      { protocol: 'https', hostname: 'techbuilders-backend.onrender.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
