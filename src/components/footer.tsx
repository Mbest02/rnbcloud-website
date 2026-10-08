import Image from 'next/image';
import Link from 'next/link';
import { company, services } from '@/lib/content';
import { BrandIcon } from './brand-icon';
export function Footer() {
  return <footer className="site-footer"><div className="wrap footer-grid"><div className="footer-brand"><Link href="/" className="brand" aria-label="RnB Cloud home"><BrandIcon width={42} white /><Image src="/brand/wordmark-white.webp" alt="RnB Cloud" width={165} height={30} /></Link><p>Practical technology.<br />Personal accountability.</p><span>Louisville, Kentucky</span></div><div><h2>Services</h2>{services.map(s => <Link href={`/services/${s.slug}`} key={s.id}>{s.name}</Link>)}</div><div><h2>Company</h2><Link href="/about">About RnB Cloud</Link><Link href="/industries">Who we help</Link><Link href="/contact">Book a consultation</Link><a href={company.support}>Client Support</a></div><div><h2>Let’s connect</h2><a href={company.phoneHref}>{company.phone}</a><a href={company.textHref}>Text {company.text}</a><a href={`mailto:${company.email}`}>{company.email}</a><p className="footer-area">{company.areaLabel}</p></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Apex IT Solutions LLC d/b/a RnB Cloud</span><Link href="/privacy">Privacy Policy</Link></div></footer>;
}
