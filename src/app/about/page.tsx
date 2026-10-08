import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Button, CTA, Eyebrow, PageHero } from '@/components/ui';
import { company } from '@/lib/content';
import { martin } from '@/lib/leadership';

export const metadata: Metadata = {
  title: 'About RnB Cloud',
  description: 'Meet Martin Bester and your Louisville technology partner. Experienced technical leadership, direct accountability, and practical service for your organization.',
  alternates: { canonical: '/about' },
};

export default function About() {
  const person = {
    '@context': 'https://schema.org', '@type': 'Person', '@id': 'https://rnbcloud.com/about#martin-bester',
    name: martin.name, jobTitle: 'Managing Partner', url: 'https://rnbcloud.com/about',
    image: `https://rnbcloud.com${martin.image}`,
    worksFor: { '@type': 'Organization', name: 'RnB Cloud', legalName: 'Apex IT Solutions LLC d/b/a RnB Cloud', url: 'https://rnbcloud.com' },
  };
  return <>
    <PageHero eyebrow="LOCAL EXPERTISE. PERSONAL ACCOUNTABILITY." title="A better relationship with your technology partner." description="RnB Cloud helps organizations manage, secure, and modernize their technology with experienced technical leadership and clear, practical guidance." />
    <section className="section">
      <div className="wrap content-grid">
        <div><Eyebrow>WHY RNB CLOUD</Eyebrow><h2>Understand the business.<br />Then build the solution.</h2></div>
        <div className="prose">
          <p>Good IT starts with the people who depend on it. We take time to understand your operations, priorities, and challenges before recommending a path forward.</p>
          <p>Based in Louisville, RnB Cloud brings managed IT, cybersecurity, Microsoft 365, Google Workspace, cloud, networking, and practical AI guidance into one relationship. We support organizations that need a full technology partner and teams that need experienced help alongside their internal IT staff.</p>
          <p>Our approach is straightforward: assess, document, secure, support, and continually improve. You should understand what we recommend, why it matters, and what comes next.</p>
        </div>
      </div>
    </section>
    <section className="section problem-section">
      <div className="wrap"><Eyebrow>WHAT YOU CAN EXPECT</Eyebrow><div className="value-grid">
        {[
          ['Security as part of IT', 'Protection belongs in everyday operations, from account access and patching to network design and recovery planning.'],
          ['Recommendations that make sense', 'We explain options in business terms and help you plan around real needs, risks, and budgets.'],
          ['An accountable relationship', 'Work directly with experienced leadership and a partner who understands your environment.'],
        ].map(([title, copy]) => <div key={title}><h3>{title}</h3><p>{copy}</p></div>)}
      </div></div>
    </section>
    <section className="section" aria-labelledby="leadership-heading" id="martin-bester">
      <div className="wrap leadership-grid">
        <div className="leadership-profile">
          <div className="leadership-photo-frame"><Image className="leadership-photo" src={martin.image} alt={martin.imageAlt} width={martin.imageWidth} height={martin.imageHeight} style={{ objectPosition: martin.imagePosition }} sizes="(max-width: 640px) calc(100vw - 80px), (max-width: 900px) 280px, 340px" /></div>
          <h3>{martin.name}</h3>
          <p className="leadership-title">{martin.title}</p>
          <p className="leadership-location"><MapPin size={15} aria-hidden="true" />Louisville, Kentucky</p>
        </div>
        <div className="leadership-content">
          <Eyebrow>DIRECT ACCESS TO LEADERSHIP</Eyebrow>
          <h2 id="leadership-heading">Experienced Technology Leadership</h2>
          <p className="leadership-intro">Direct access to experienced technical leadership without the layers of a large IT provider.</p>
          <div className="prose leadership-biography">{martin.biography.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <div className="expertise-section"><h3>Areas of Expertise</h3><ul className="expertise-tags">{martin.expertise.map(area => <li key={area}>{area}</li>)}</ul></div>
          <div className="leadership-contact"><h3>Want to talk directly about your technology?</h3><p>RnB Cloud works closely with clients to understand their environment, challenges, and long-term goals before recommending a solution.</p><div className="actions"><Button href="/contact">Book a Consultation</Button><Button href={company.phoneHref} variant="secondary">Call {company.phone}</Button></div></div>
        </div>
      </div>
    </section>
    <section className="section process-section">
      <div className="wrap"><div className="section-heading"><div><Eyebrow>HOW WE WORK WITH CLIENTS</Eyebrow><h2>A clear plan.<br />A relationship that keeps improving.</h2></div><p>We connect technical decisions to your priorities and keep you involved along the way.</p></div>
        <div className="process-grid">{[
          ['Listen', 'Understand your workflows, challenges, and long-term goals.'],
          ['Assess', 'Review your environment and identify the gaps that matter.'],
          ['Plan & implement', 'Explain the options and coordinate practical improvements.'],
          ['Support & improve', 'Maintain, review, and adapt as your organization changes.'],
        ].map(([title, copy], i) => <div className="process-step" key={title}><span className="step-index">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </div>
    </section>
    <section className="section"><div className="wrap content-grid"><div><Eyebrow>ROOTED IN LOUISVILLE</Eyebrow><h2>Local relationships.<br />Lasting accountability.</h2></div><div className="prose"><p>{company.area}</p><p>Whether you need ongoing IT ownership or experienced support for a specific project, we start with a conversation about your business.</p></div></div></section>
    <CTA title="Let’s build a better IT experience." />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} />
  </>;
}
