import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVE the experimental turbo and webpack fs:false sections
  // They are the reason Tailwind is reporting 'missing content'.

  // Keep your headers if needed, but ensure style-src allows inline styles
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' *; font-src 'self' data:;"
          },
        ],
      },
    ];
  },
};

export default nextConfig;