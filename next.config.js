/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the project root so a stray lockfile in a parent folder isn't picked up
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
