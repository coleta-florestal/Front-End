import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  compress: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  output: 'standalone',
  reactCompiler: true,

  experimental: {
    agentUpgrade: 'security',
  },

  // O e-mail de recuperação do back aponta para /reset-password; o ?token= é repassado no redirect.
  async redirects() {
    return [{ source: '/reset-password', destination: '/redefinir-senha', permanent: false }];
  },
};

export default nextConfig;
