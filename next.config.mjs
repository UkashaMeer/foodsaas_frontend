/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    remotePatterns: [new URL('https://www.dominos.com.pk/**')],
  },
};

export default nextConfig;
