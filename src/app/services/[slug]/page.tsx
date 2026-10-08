import type { Metadata } from 'next';
import { SupportingImage } from '@/components/supporting-image';
import { serviceImages } from '@/lib/page-images';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, ChevronDown, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button, Eyebrow, ServiceIcon } from '@/components/ui';
import { company, services } from '@/lib/content';
import { servicePages } from '@/lib/service-pages';

type Props = { params: Promise<{ slug: string }> };
function getService(slug: string) {
  const service = services.find(item => item.slug === slug);
  if (!service) notFound();
  return service;
}
export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  const page = servicePages[service.id];
  const title = `${service.name} in Louisville`;
  const url = `/services/${service.slug}`;
  return {
    title, description: page.seoDescription, alternates: { canonical: url },
    openGraph: { title: `${title} | RnB Cloud`, description: page.seoDescription, url, type: 'website', siteName: 'RnB Cloud', locale: 'en_US', images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: `${service.name} — RnB Cloud` }] },
    twitter: { card: 'summary_large_image', title: `${title} | RnB Cloud`, description: page.seoDescription, images: [`${url}/opengraph-image`] },
  };
}
export default async function ServiceLanding({ params }: Props) {
  const service = getService((await params).slug);
  const page = servicePages[service.id];
  const consultation = `/contact?interest=${service.id}`;
  const security = service.id === 'cybersecurity';
  const heroArtwork = ['managed-it', 'network-infrastructure'].includes(service.id);
  const contextArtwork = security || service.id === 'ai-automation';
  const imageClass = `service-feature-image service-image-${service.id}`;
  const related = page.related.map(id => services.find(item => item.id === id)!);
  const url = `https://rnbcloud.com/services/${service.slug}`;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Service', name: service.name, description: page.seoDescription, url, serviceType: service.name, provider: { '@type': 'Organization', name: company.name, url: 'https://rnbcloud.com' }, areaServed: ['Louisville, Kentucky', 'Elizabethtown, Kentucky', 'Southern Indiana'] },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rnbcloud.com' }, { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://rnbcloud.com/services' }, { '@type': 'ListItem', position: 3, name: service.name, item: url }] },
  ];
  return <>
    <section className="service-hero"><div className="wrap">
      <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">{service.name}</span></nav>
      <div className={`service-hero-grid ${heroArtwork ? 'service-hero-with-art' : ''}`}><div><Eyebrow>{service.name}</Eyebrow><h1>{page.heading}</h1><p className="lead">{page.intro}</p><div className="actions"><Button href={consultation}>Book a Consultation</Button><a href={company.textHref} className="button button-secondary"><MessageSquare size={17} aria-hidden="true" />Text RnB Cloud</a></div></div>
        <div className="service-hero-aside">{heroArtwork && <SupportingImage image={serviceImages[service.id]} className={imageClass} preload sizes="(max-width: 900px) calc(100vw - 64px), 530px" />}<aside className="service-hero-panel" aria-label={`${service.name} overview`}><div className="service-panel-top"><ServiceIcon name={service.icon} size={30} /><span>CONNECTED EXPERTISE</span></div><p className="service-panel-outcome">{service.short}</p><ul>{(security ? ['Understand exposure', 'Connect the layers', 'Prepare for recovery'] : service.id === 'managed-it' ? ['Full managed IT', 'Co-managed IT', 'A practical technology roadmap'] : service.items.slice(0, 3)).map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul><div className="service-panel-bottom">Clear scope. Direct accountability.</div></aside></div>
      </div>
      {!heroArtwork && !contextArtwork && <SupportingImage image={serviceImages[service.id]} className="service-primary-image" />}
    </div></section>
    <section className="section"><div className={`wrap ${contextArtwork ? `service-context-split ${security ? 'service-context-security' : ''}` : 'content-grid'}`}>
      {contextArtwork ? <><div className="service-context-copy"><Eyebrow>THE BUSINESS FIRST</Eyebrow><h2>{page.problemHeading}</h2><div className="prose"><p>{page.problem}</p><p>{page.approach}</p></div></div><SupportingImage image={serviceImages[service.id]} className={imageClass} sizes="(max-width: 900px) calc(100vw - 64px), 570px" /></> : <><div><Eyebrow>THE BUSINESS FIRST</Eyebrow><h2>{page.problemHeading}</h2></div><div className="prose"><p>{page.problem}</p><p>{page.approach}</p></div></>}
    </div></section>
    <section className={`section service-scope ${security ? 'security-scope' : ''}`} id="scope"><div className="wrap"><div className="section-heading"><div><Eyebrow>{security ? 'LAYERS THAT WORK TOGETHER' : 'A SCOPE BUILT AROUND YOU'}</Eyebrow><h2>What This Service Can Include</h2></div><p>These are possible areas of support. Your proposal defines the services, systems, responsibilities, and exclusions for your engagement.</p></div>
      {security && <div className="security-layer-intro"><ShieldCheck size={32} aria-hidden="true" /><p>Protect everyday work.<br /><strong>Prepare for what happens next.</strong></p></div>}
      <div className={security ? 'security-layers' : 'scope-grid'}>{page.scope.map(([title, description], i) => <article className={security ? 'security-layer' : 'scope-card'} key={title}><span className="scope-number">0{i + 1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
      <div className="service-experience"><h3>Technology experience, applied thoughtfully.</h3><p>{page.experience}</p></div>
    </div></section>
    <section className="section"><div className="wrap"><div className="section-heading"><div><Eyebrow>THE RIGHT FIT</Eyebrow><h2>{service.id === 'managed-it' ? 'Two ways to work together.' : 'Support that meets you where you are.'}</h2></div><p>{service.id === 'managed-it' ? 'Both models start with clear ownership, shared expectations, and a plan for improvement.' : 'Start with your goals. We’ll help determine the scope and kind of engagement that makes sense.'}</p></div><div className="service-fit-grid">{page.fit.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p><Link href={consultation} className="text-link">Discuss your needs <ArrowRight size={15} aria-hidden="true" /></Link></article>)}</div></div></section>
    <section className="section process-section"><div className="wrap"><div className="section-heading"><div><Eyebrow>{service.id === 'managed-it' ? 'A CONSIDERED HANDOVER' : 'HOW WE APPROACH THE WORK'}</Eyebrow><h2>{service.id === 'managed-it' ? 'A clear path into managed IT.' : 'From conversation to a practical plan.'}</h2></div><p>{service.id === 'managed-it' ? 'Discovery → Assessment → Transition → Onboarding → Ongoing Improvement. We coordinate each stage around your people and operations.' : 'Agree on the responsibilities and outcomes before work begins, then keep the next step clear.'}</p></div><ol className="service-process">{page.process.map(([title, description], i) => <li key={title}><span className="step-index">0{i + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol></div></section>
    <section className="section"><div className="wrap service-faq-grid"><div><Eyebrow>QUESTIONS, ANSWERED</Eyebrow><h2>A little more clarity.</h2><p className="section-intro">Have a question about your environment? We’ll talk through the details with you.</p><Link href={consultation} className="text-link">Start a conversation</Link></div><div className="service-faqs">{page.faqs.map(([question, answer], i) => <details key={question} id={`faq-${i + 1}`}><summary>{question}<ChevronDown size={19} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>
    <section className="service-local"><div className="wrap"><MapPin size={26} aria-hidden="true" /><div><h2>Local relationships. Practical expertise.</h2><p>{company.area} On-site work is coordinated according to the engagement.</p></div></div></section>
    <section className="section"><div className="wrap"><div className="section-heading"><div><Eyebrow>CONNECTED SERVICES</Eyebrow><h2>See how the pieces fit together.</h2></div><Link href="/services" className="text-link">All services</Link></div><div className="related-service-grid">{related.map(item => <Link key={item.id} href={`/services/${item.slug}`} className="pillar-card"><div className="card-top"><span className="icon-tile"><ServiceIcon name={item.icon} /></span><ArrowRight size={19} aria-hidden="true" /></div><h3>{item.name}</h3><p>{item.description}</p><span className="text-link">Explore this service</span></Link>)}</div></div></section>
    <section className="cta-section"><div className="wrap cta-inner"><div><Eyebrow light>YOUR NEXT STEP</Eyebrow><h2>Let’s talk about what you need.</h2><p>Tell us about your environment. We’ll help define a practical path forward.</p></div><div className="service-final-actions"><Button href={consultation} variant="light">Book a Consultation</Button><a href={company.textHref}><MessageSquare size={17} aria-hidden="true" />Text RnB Cloud</a></div></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  </>;
}
