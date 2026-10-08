import Link from 'next/link';
import { company } from '@/lib/content';
import { Monitor, ShieldCheck, Cloud, Sparkles, DatabaseBackup, Network, Compass, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
export function ServiceIcon({ name, size = 25 }: { name: string; size?: number }) {
  const icons = { monitor: Monitor, shield: ShieldCheck, cloud: Cloud, sparkles: Sparkles, database: DatabaseBackup, network: Network, compass: Compass };
  const Icon = icons[name as keyof typeof icons] ?? Monitor;
  return <Icon size={size} strokeWidth={1.65} aria-hidden="true" />;
}
export function Button({ href, children, variant = 'primary', className = '' }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'light'; className?: string }) {
  return <Link href={href} className={`button button-${variant} ${className}`}>{children}</Link>;
}
export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span aria-hidden="true" />{children}</p>;
}
export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-hero"><div className="wrap"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p className="lead">{description}</p></div></section>;
}
export function CTA({ title = 'Let’s make technology work better for your business.' }: { title?: string }) {
  return <section className="cta-section"><div className="wrap cta-inner"><div><Eyebrow light>YOUR NEXT STEP</Eyebrow><h2>{title}</h2><p>Start with a conversation. We’ll help you find a practical path forward.</p></div><Button href="/contact" variant="light">Book a Consultation</Button></div></section>;
}
export function LocationLine() { return <span className="location-line"><MapPin size={15} aria-hidden="true" />{company.areaLabel}</span>; }
