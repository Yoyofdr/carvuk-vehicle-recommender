/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Only use 'export' for production builds (GitHub Pages)
  // In development, use default output to allow API routes
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/carvuk-vehicle-recommender' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/carvuk-vehicle-recommender' : '',
}

module.exports = nextConfig