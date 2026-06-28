/** @type {import('next').NextConfig} */
const nextConfig = {
     /* config options here */
  reactStrictMode: true,
  images: {
     remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/static/uploads/product/**",
      },
    ],
  },
  experimental: {

    staleTimes: {
      dynamic: 30
    },

  }
}

export default nextConfig
