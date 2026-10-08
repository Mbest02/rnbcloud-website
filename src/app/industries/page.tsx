import type { Metadata } from 'next';
import { SupportingImage } from '@/components/supporting-image';
import { pageImages } from '@/lib/page-images';
import Link from 'next/link';
import { services } from '@/lib/content';
import { industries } from '@/lib/content';
import { CTA, PageHero } from '@/components/ui';
export const metadata: Metadata = { title: 'Organizations We Help', description: 'Practical IT support for Louisville professional services, nonprofits, healthcare, education, and multi-site organizations.', alternates: { canonical: '/industries' } };
export default function Industries() {
  return <><PageHero eyebrow="TECHNOLOGY WITH BUSINESS CONTEXT" title="Support that understands how your organization operates." description="Your workflows, priorities, and budget shape what you need from IT. We adapt our approach to your environment, whether you need ongoing management or help with a specific project." /><div className="wrap industry-image-wrap"><SupportingImage image={pageImages.industries} className="industries-overview-image" /></div><section className="section"><div className="wrap industry-grid">{industries.map(i => <article className="industry-card" key={i.name}><h2>{i.name}</h2><p>{i.description}</p><a className="text-link" href="/contact">Discuss your environment</a><div className="industry-service-links">{(i.name === 'Education & community' ? services.filter(service => ['cloud-microsoft-365', 'network-infrastructure'].includes(service.id)) : services.filter(service => ['managed-it', 'cybersecurity'].includes(service.id))).map(service => <Link key={service.id} href={`/services/${service.slug}`}>{service.name}</Link>)}</div></article>)}</div></section><CTA /></>;
}
