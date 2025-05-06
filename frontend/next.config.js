/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    env: {
      SKIP_FIREBASE: 'true'
    }
  }
  
  module.exports = nextConfig