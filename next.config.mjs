/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "as1.ftcdn.net"
    ]
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;
