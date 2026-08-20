/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Dev writes to .next, production builds write to .next-build (set by
  // scripts/next-prod.mjs), so the two can never overwrite each other.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  webpack: (config, { dev }) => {
    if (dev) {
      // The CMS writes to data/ and public/uploads/ on every save. Neither is
      // part of the module graph, so watching them only causes pointless dev
      // recompiles on content edits.
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/data/**",
          "**/public/uploads/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
