import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecosphere-iti-bucket.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:locale(en|ar|fr)',
        destination: '/',
      },
      {
        source: '/:locale(en|ar|fr)/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
