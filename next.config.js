/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public'
})

module.exports = withPWA({
  nextConfig
})
