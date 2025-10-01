/** @type {import('next').NextConfig} */ const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dgz7qmo54/**",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },
};
module.exports = nextConfig;
