/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer, dev }) => {
      // Ensures that source maps are enabled in development mode
      if (dev) {
        config.devtool = 'source-map';
      }
  
      // Your existing configuration to disable fs module polyfilling on the client side
      if (!isServer) {
        config.resolve.fallback.fs = false;
      }
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  