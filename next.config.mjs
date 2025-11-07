/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // 👈 ensures middleware works properly with /src/app/
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.dominos.com.pk",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
