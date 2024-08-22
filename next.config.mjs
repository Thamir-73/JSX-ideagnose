/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ideagnose.com',
        },
        {
          protocol: 'https',
          hostname: 'www.ideagnose.com',
        },
      ],
    },
    swcMinify: true,
    reactStrictMode: true,
    poweredByHeader: false,
  };
  
  export default nextConfig;