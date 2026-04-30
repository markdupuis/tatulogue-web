/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — no server/edge runtime needed for this site
  output: 'export',
  images: {
    // Required for static export (no built-in image optimizer)
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'framerusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
