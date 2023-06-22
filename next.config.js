/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env:{
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET
  },
  /* images: {
    domains: ['lh3.googleusercontent.com'],
  }, */
}

module.exports = nextConfig
