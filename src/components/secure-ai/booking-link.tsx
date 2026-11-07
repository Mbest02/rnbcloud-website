import type { MouseEventHandler, ReactNode } from 'react';
import { SECURE_AI_BOOKING_URL, type BookingLocation } from '@/lib/secure-ai-booking';
export function AssessmentBookingLink({ location, children = 'Book your AI Security Assessment', className = 'button button-primary', onClick }: { location: BookingLocation; children?: ReactNode; className?: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return <a href={SECURE_AI_BOOKING_URL} target="_blank" rel="noopener" data-secure-ai-booking={location} className={className} onClick={onClick}>{children}</a>;
}
