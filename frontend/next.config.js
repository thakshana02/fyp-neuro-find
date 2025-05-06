/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // project has type errors.
      ignoreBuildErrors: true,
    },
  }
  
  module.exports = nextConfig