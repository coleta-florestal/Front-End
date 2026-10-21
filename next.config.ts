import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  compress: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  output: 'standalone',
  reactCompiler: true,
};

export default nextConfig;
