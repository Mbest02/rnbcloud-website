export type PageImage = { src: string; width: number; height: number; alt: string };
export const pageImages = {
  home: { src: '/images/home/home-hero-main.webp', width: 768, height: 158, alt: 'Louisville skyline with an illustrated cloud and connected technology links' },
  contact: { src: '/images/contact/contact-consultation-image.webp', width: 547, height: 164, alt: 'Illustrative consultation workspace with a notebook, laptop, and RnB Cloud mug' },
  industries: { src: '/images/industries/industries-overview.webp', width: 581, height: 164, alt: 'Louisville skyline with symbols representing business, healthcare, education, and community organizations' },
} satisfies Record<string, PageImage>;
export const serviceImages: Record<string, PageImage> = {
  'managed-it': { src: '/images/services/managed-it/managed-it-main.webp', width: 764, height: 158, alt: 'Illustration of IT professionals collaborating around a business technology display' },
  cybersecurity: { src: '/images/services/cybersecurity/cybersecurity-main.webp', width: 768, height: 136, alt: 'Illustrative security monitoring dashboard representing layered threat protection' },
  'cloud-microsoft-365': { src: '/images/services/cloud-collaboration/cloud-collaboration-main.webp', width: 764, height: 136, alt: 'Illustrative laptop displaying Microsoft 365 and Google Workspace collaboration tools' },
  'ai-automation': { src: '/images/services/ai-automation/ai-automation-main.webp', width: 768, height: 140, alt: 'Illustrated AI interface connecting documents, workflows, and business tasks' },
  'backup-disaster-recovery': { src: '/images/services/backup-disaster-recovery/backup-dr-main.webp', width: 764, height: 140, alt: 'Server racks with an illustrated cloud recovery symbol' },
  'network-infrastructure': { src: '/images/services/network-infrastructure/network-infrastructure-main.webp', width: 768, height: 141, alt: 'Network equipment and connected cabling representing business infrastructure' },
  'it-consulting': { src: '/images/services/it-projects-consulting/it-projects-main.webp', width: 764, height: 141, alt: 'Illustration of a technology consultant presenting an implementation plan to a team' },
};
