/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  // Increase API route body size limit
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export default nextConfig
