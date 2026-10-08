import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots { if (process.env.VERCEL_ENV === 'preview') return { rules: { userAgent: '*', disallow: '/' } }; return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', ...(process.env.PRIVACY_POLICY_APPROVED === 'true' ? [] : ['/privacy'])] }, sitemap: 'https://rnbcloud.com/sitemap.xml' }; }
