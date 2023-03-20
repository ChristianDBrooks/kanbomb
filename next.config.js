/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withPWA = require('next-pwa')({
  disable: true,
  dest: 'public'
})

module.exports = withPWA({
  ...nextConfig
})
