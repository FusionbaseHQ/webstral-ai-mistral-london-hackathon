/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SERVER_API_URL: process.env.SERVER_API_URL,
  }
}

module.exports = nextConfig