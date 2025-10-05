import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'hooks', 'lib'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
