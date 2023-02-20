/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      net: false,
      async_hooks: false,
    };

    return config;
  },
};

module.exports = nextConfig;