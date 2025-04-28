/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img-c.udemycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
    ],
  },
  // Ignore type checking and ESLint during build
  typescript: {
    // !! WARN !!
    // Ignoring TypeScript errors - use with caution
    ignoreBuildErrors: true,
  },
  // Ignore ESLint during builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ignore missing suspense boundaries
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

module.exports = nextConfig; 