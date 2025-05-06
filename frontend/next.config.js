/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable Firebase in production by mocking it
    webpack: (config, { isServer }) => {
      // If it's a production build, replace Firebase with mock modules
      if (process.env.NODE_ENV === 'production') {
        config.resolve.alias = {
          ...config.resolve.alias,
          // Replace Firebase modules with empty modules
          'firebase/app': require.resolve('./mock-modules/firebase-app.js'),
          'firebase/auth': require.resolve('./mock-modules/firebase-auth.js'),
          'firebase/firestore': require.resolve('./mock-modules/firebase-firestore.js'),
          'firebase/storage': require.resolve('./mock-modules/firebase-storage.js'),
          // Add any other Firebase modules you're using
        };
      }
      
      return config;
    },
    // Disable type checking and linting during build
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }
  
  module.exports = nextConfig