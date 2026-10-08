import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/services/cloud-microsoft-365', destination: '/services/cloud-collaboration', permanent: true }, { source: '/services/cloud-business-email', destination: '/services/cloud-collaboration', permanent: true }, { source: '/privacy.html', destination: '/privacy', permanent: true }, { source: '/support', destination: 'https://support.rnbcloud.com', permanent: false }];
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
    ] }];
  }
};
export default config;
