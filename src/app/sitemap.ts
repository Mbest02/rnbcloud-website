import type { MetadataRoute } from 'next';
import { services } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/services', '/about', '/contact', '/industries', ...(process.env.PRIVACY_POLICY_APPROVED === 'true' ? ['/privacy'] : []), ...services.map(service => `/services/${service.slug}`)].map(path => ({ url: `https://rnbcloud.com${path}`, changeFrequency: 'monthly', priority: path === '' ? 1 : .7 })); }
