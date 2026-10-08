'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Headphones, Phone } from 'lucide-react';
import { company, services } from '@/lib/content';
import { ServiceIcon } from './ui';
import { BrandIcon } from './brand-icon';
export function Header() {
  const [mobile, setMobile] = useState(false);
  const [mega, setMega] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const servicesButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => { setMobile(false); setMega(false); }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { const wasMega = servicesButton.current?.getAttribute('aria-expanded') === 'true'; setMobile(false); setMega(false); if (wasMega) servicesButton.current?.focus(); else if (header.current?.contains(document.activeElement)) menuButton.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setMega(false); setMobile(false); } };
    document.addEventListener('keydown', close); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, []);
  return <header className="site-header" ref={header}>
    <div className="utility"><div className="wrap utility-inner"><span>Local expertise. A more connected business.</span><div><a href={company.phoneHref}><Phone size={13} aria-hidden="true" />{company.phone}</a><a href={company.support}><Headphones size={14} aria-hidden="true" />Client Support</a></div></div></div>
    <div className="wrap header-inner"><Link href="/" className="brand" aria-label="RnB Cloud home"><BrandIcon /><Image src="/brand/wordmark.webp" alt="RnB Cloud" width={169} height={31} priority /></Link>
      <nav aria-label="Main navigation" className="desktop-nav"><div className="services-nav"><button ref={servicesButton} aria-expanded={mega} aria-controls="services-menu" onClick={() => setMega(!mega)}>Services<ChevronDown size={14} className={mega ? 'rotated' : ''} /></button>{mega && <nav className="mega-menu wrap" id="services-menu" aria-label="Services"><div className="mega-intro"><p className="eyebrow">CONNECTED TECHNOLOGY</p><h2>One partner.<br />A clearer path forward.</h2><Link href="/services" onClick={() => setMega(false)}>Explore all services</Link></div><div className="mega-grid">{services.map(service => <Link href={`/services/${service.slug}`} key={service.id} onClick={() => setMega(false)}><ServiceIcon name={service.icon} size={21} /><span>{service.name}</span></Link>)}</div></nav>}</div>{[['/industries', 'Industries'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, name]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{name}</Link>)}</nav>
      <Link href="/contact" className="button button-primary header-cta">Book a Consultation</Link><button ref={menuButton} className="mobile-toggle" onClick={() => { setMobile(!mobile); setMega(false); }} aria-expanded={mobile} aria-controls="mobile-menu" aria-label={mobile ? 'Close navigation' : 'Open navigation'}>{mobile ? <X /> : <Menu />}</button>
    </div>

    {mobile && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">{[['/services', 'Services'], ['/industries', 'Industries'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, name]) => <Link key={href} href={href} onClick={() => setMobile(false)}>{name}</Link>)}<Link href="/contact" className="button button-primary" onClick={() => setMobile(false)}>Book a Consultation</Link><a href={company.support} className="mobile-support"><Headphones size={18} />Client Support</a></nav>}
  </header>;
}
