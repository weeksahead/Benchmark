/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static site generation for Vercel
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Ensures consistent URLs
}

export default nextConfig
