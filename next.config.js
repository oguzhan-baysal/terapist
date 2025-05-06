/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  experimental: {
    missingSuspenseWithCSRError: false,
  },
}

module.exports = nextConfig 